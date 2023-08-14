import React, {useMemo} from 'react';
import IMAvatar from "../common/avatar";
import "./item.scss"
import {FloatButton} from "antd";
import ButtonToolbar from "../common/button-toolbar";
import {IoClose} from "react-icons/io5";
import {FROM, useChatWindowContext} from "../index";
import {parse} from "../services/utils";
import {renderContentConversation} from "../services/im/utils";

const MinimumMessage = ({conversation={}, disable = false}) => {
    const {onAddPopupMessage, onRemoveMinimumPopupMessage} = useChatWindowContext();

    const tooltip = useMemo(() => {
        const latestMsg = parse(conversation.latestMsg);
        const isMine = latestMsg.sendID === getMe().openImUserID;

        return (
            <div className={"w-full"}>
                <div className={"min-w-0 truncate font-bold"}>{conversation.showName || conversation.userID}</div>
                <div className={"min-w-0 truncate text-xs"}>{renderContentConversation(latestMsg, isMine)}</div>
            </div>
        )
    }, [conversation]);

    return (
        <div className={"relative minimum-message-container"}>
            <FloatButton
                onClick={() => {
                    onAddPopupMessage(conversation, FROM.MINIMUM_POPUP_MESSAGE);
                    onRemoveMinimumPopupMessage(conversation)
                }}
                className={"minimum-message w-12 h-12 !m-0"}
                icon={<IMAvatar
                    size={48}
                    user={conversation}
                    badgeProps={{
                        className: "badge__large",
                        offset: [-8, 33]
                    }}
                    showOnline={!disable}
                />}
                tooltip={!disable && tooltip}
                badge={{
                    count: conversation?.unreadCount || 0,
                    offset: [-2, 8]
                }}
            />
            {!disable && <ButtonToolbar
                size={"small"}
                bgColor={"bg-white hover:!bg-gray-200"}
                extraClassName={"minimum-message-close absolute top-0 right-0"}
                icon={<IoClose size={18}/>}
                onClick={() => {
                    onRemoveMinimumPopupMessage(conversation);
                }}
            />}
        </div>
    );
};

MinimumMessage.propTypes = {};

export default MinimumMessage;
