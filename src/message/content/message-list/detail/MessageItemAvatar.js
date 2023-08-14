import React, {useMemo} from 'react';
import {BsCheckCircleFill} from "react-icons/bs";
import {theme} from "antd";
import IMAvatar from "../../../../common/avatar";
import {MessageStatus} from "open-im-sdk";

const MessageItemAvatar = ({url, status, isMine, isRead, isMessageReadFinal, show = true}) => {
    const {token} = theme.useToken();

    const renderAvatar = useMemo(() => {
        if (isMessageReadFinal) {
            return <IMAvatar
                autoUpdateStatus={false}
                user={{faceURL: url}}
                size={15}
                showOnline={false}
            />
        }

        if (!isMine || isRead) {
            return <IMAvatar
                autoUpdateStatus={false}
                user={{faceURL: url}}
                size={isMine ? 15 : 32}
                showOnline={false}
                show={show}
            />
        }


        switch (status) {
            case MessageStatus.Succeed:
                return <IMAvatar
                    className={"bg-transparent"}
                    icon={<BsCheckCircleFill color={token.colorFill} fontSize={15}/>}
                    size={15}
                />;
            default:
                return <IMAvatar
                    autoUpdateStatus={false}
                    user={{faceURL: url}}
                    size={isMine ? 15 : "default"}
                    showOnline={false}
                    show={show}
                />
        }
    }, [url, status, isMine, show, isMessageReadFinal, isRead]);

    return (
        <div>
            {renderAvatar}
        </div>
    );
};

export default MessageItemAvatar;
