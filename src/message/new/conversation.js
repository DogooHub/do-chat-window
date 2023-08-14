import React, {useEffect, useState} from "react";
import {SessionType} from "open-im-sdk";
import MessageList from "../content/message-list";
import WindowMessageContentInput from "../content/input";
import {useChatWindowContext} from "../../index";
import {error_handle, openIM, sendMessage} from "../../services/im";
import {parse} from "../../services/utils";

const NewMessageConversation = ({user}) => {
    const [conversation, setConversation] = useState({});
    const {replaceNewMessage} = useChatWindowContext();

    useEffect(() => {
        if (user) {
            openIM.getOneConversation({sourceID: user.openImUserID, sessionType: SessionType.Single}).then(res => {
                const data = parse(res.data);
                setConversation(data);
            }).catch(error_handle)
        }
    }, [user]);


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

        replaceNewMessage(conversation);
    };

    const onTyping = async (typing = false) => {
        const {userID, groupID} = conversation;
        if (userID || groupID) {
            await openIM.typingStatusUpdate({recvID: userID || groupID || '', msgTip: typing + ''});

        }
    };

    return (
        <div
            className={`h-full flex flex-col justify-between`}>
            <MessageList conversation={conversation} onSend={onSend}/>
            {!conversation.isNotInGroup && <WindowMessageContentInput onSend={onSend} onTyping={onTyping}/>}
        </div>
    );
}

NewMessageConversation.propTypes = {};

export default NewMessageConversation;
