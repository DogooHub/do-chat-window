import React from 'react';
import MessageList from "./message-list";
import WindowMessageContentInput from "./input";
import {CbEvents} from "open-im-sdk";
import {openIM, sendMessage} from "../../services/im";

const WindowMessageContent = ({conversation = {}}) => {

    const onSend = async (
        value,
        type = 'text',
        here = true,
        recvID = conversation.userID,
        groupRecvID = conversation.groupID,
    ) => {
        const messageRes = await sendMessage({
            userID: recvID,
            groupID: groupRecvID,
            value,
            type,
        });
        if (!messageRes || !here) {
            return;
        }

        openIM.emit(CbEvents.ONRECVNEWMESSAGE, messageRes);
    };

    const onTyping = async (typing = false) => {
        const {userID, groupID} = conversation;
        if (userID || groupID) {
            await openIM.typingStatusUpdate({recvID: userID || groupID || '', msgTip: typing + ''});

        }
    };

    return (
        <div
            className={`h-[calc(100%-58px)] flex flex-col justify-between`}>
            <MessageList conversation={conversation} onSend={onSend}/>
            {!conversation.isNotInGroup && <WindowMessageContentInput onSend={onSend} onTyping={onTyping}/>}
        </div>
    );
};

WindowMessageContent.propTypes = {};

export default WindowMessageContent;
