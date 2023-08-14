import React, {useMemo} from 'react';
import {MessageType} from 'open-im-sdk';
import {getMe, parse} from "../../../../services/utils";

const MessageSystem = ({item, prevItem = {}, nextItem = {}}) => {
    const myID = useMemo(() => {
        return getMe().openImUserID;
    }, [item]);

    const padding = useMemo(() => {
        const isPrevSystem = prevItem.msgFrom === 0 || prevItem.msgFrom === 200;
        const isNextSystem = nextItem.msgFrom === 0 || nextItem.msgFrom === 200;

        if (isPrevSystem && !isNextSystem) {
            return 'pb-4';
        }

        if (!isPrevSystem && isNextSystem) {
            return 'pt-4';
        }

        if (!isPrevSystem && !isNextSystem) {
            return 'py-4';
        }

        return '';
    }, [prevItem, item, nextItem]);
    const showName = (item, capitalize = true) => {
        return myID === item.userID
            ? `${capitalize ? 'Bạn' : 'bạn'}`
            : item.nickname || item.userID;
    };
    const messageContent = useMemo(() => {
        const content = parse(item.content);
        const contentDetail = parse(content?.jsonDetail);
        switch (item.contentType) {
            case MessageType.TEXTMESSAGE: {
                return item.content;
            }
            case MessageType.GROUPCREATED: {
                return `${showName(contentDetail.opUser)} đã tạo nhóm này`;
            }
            case MessageType.GROUPINFOUPDATED: {
                const detail = contentDetail.group.groupName
                    ? `đã đặt tên nhóm là ${contentDetail.group.groupName}`
                    : 'đã thay đổi ảnh nhóm';
                return `${showName(contentDetail.opUser)} ${detail}.`;
            }
            case MessageType.MEMBERQUIT: {
                return `${showName(contentDetail.quitUser)} đã rời nhóm.`;
            }
            case MessageType.MEMBERKICKED: {
                const userKicked = contentDetail.kickedUserList
                    ?.map((item) => showName(item, false))
                    .join(', ');
                if (!userKicked) {
                    return null;
                }
                const opUser = contentDetail.opUser;
                return `${showName(opUser)} đã xóa ${userKicked} khỏi nhóm.`;
            }
            case MessageType.GROUPOWNERTRANSFERRED: {
                const newGroupOwner = contentDetail.newGroupOwner;
                const opUser = contentDetail.opUser;
                return `${showName(opUser)} đã chỉ định ${showName(
                    newGroupOwner,
                    false,
                )} làm chủ nhóm.`;
            }
            case MessageType.MEMBERINVITED: {
                const inviteUser = contentDetail.invitedUserList
                    ?.map((item) => showName(item, false))
                    .join(', ');
                if (!inviteUser) {
                    return null;
                }
                return `${showName(contentDetail.opUser)} đã thêm ${inviteUser} vào nhóm.`;
            }
            default: {
                return <div onClick={() => {
                    console.log({content, contentDetail, contentType: item.contentType});
                }}>[Định dạng thông báo chưa được hỗ trợ]</div>;
            }
        }
    }, [item]);

    return (
        <div
            key={item.clientMsgID}
            className={`break-all flex justify-center items-center text-center text-xs text-gray-500 py-1 ${padding}`}
            style={{
                display: !messageContent && 'none',
            }}
        >
            <div className={`max-w-[70%]`}>{messageContent}</div>
        </div>
    );
};

MessageSystem.propTypes = {};

export default MessageSystem;
