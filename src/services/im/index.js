import {OpenIMSDK, Platform} from "open-im-sdk";
import jwtDecode from "jwt-decode";
import {message} from "antd";
import {getLocalAccessToken, getOpenImToken} from "../axios";
import {isFileImage} from "../utils";

const BASE_PATH_WSS = process.env.REACT_APP_OPEN_IM_CHAT_WSS;
export const openIM = new OpenIMSDK();

export const imConfigLogin = (userID, token) => ({
    userID,
    token,
    url: BASE_PATH_WSS,
    platformID: Platform.Web,
    operationID: `${new Date().getTime()}`,
    isBatch: true,
});

export const imLogin = () => {
    return openIM
        .getLoginStatus()
        .then((res) => {
            return res;
        })
        .catch((err) => {
            try {
                console.log({err});
                const accessToken = getLocalAccessToken();
                const openImToken = getOpenImToken();
                const {openImUserID} = jwtDecode(accessToken);
                const config = imConfigLogin(openImUserID, openImToken);

                return openIM
                    .login(config)
            } catch (err) {
                console.log('login err', {err});
            }
        });
};

export const markAsRead = ({userID = '', groupID = '', msgIDList = []}) => {
    if (userID) {
        return openIM.markC2CMessageAsRead({userID, msgIDList}).then(() => {
            openIM.markC2CMessageAsRead({userID, msgIDList: []});
        });
    }

    return openIM.markGroupMessageAsRead({groupID, msgIDList}).then(() => {
        openIM.markGroupMessageAsRead({groupID, msgIDList: []});
    });
};

export const sendMessage = async ({userID = '', groupID = '', value = '', type = 'text'}) => {
    if (!value) {
        return;
    }
    switch (type) {
        case 'text': {
            const textMessageRes = await openIM.createTextMessage(value);
            return await openIM.sendMessage({
                recvID: userID,
                message: textMessageRes.data,
                groupID,
            });
        }
        case 'file': {
            const {file, url} = value;
            let res = null;
            if (isFileImage(file)) {
                const baseInfo = {
                    uuid: file.uid,
                    type: file.type.split('/').pop(),
                    size: file.size,
                    width: 1080,
                    height: 720,
                    url,
                    name: file.name,
                };
                res = await openIM.createImageMessage({
                    bigPicture: baseInfo,
                    sourcePicture: baseInfo,
                    snapshotPicture: baseInfo,
                });
            } else {
                res = await openIM.createFileMessage({
                    uuid: file.uid,
                    fileName: file.name,
                    fileSize: file.size,
                    filePath: '',
                    sourceUrl: url,
                });
            }
            return await openIM.sendMessageNotOss({
                recvID: userID,
                message: res.data,
                groupID,
            });
        }
    }
};


export const error_handle = (err) => {
    switch (err.errCode) {
        case 809: {
            message.error({key: "change_group_name_error", content: "Không có quyền thực hiện tác vụ này"})
            break;
        }
        default: {
            console.log({err})
        }
    }

    return false;
}

