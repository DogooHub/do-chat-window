import React, {useEffect, useMemo, useRef, useState} from 'react';
import MessageSystem from "./detail/message-system";
import MessageItem from "./detail/message-item";
import {CbEvents} from "open-im-sdk";
import InfiniteScrollContainer from "../../../common/infinite-scroll";
import {useWindowMessageContext} from "../../index";
import Typing from "./typing";
import {markAsRead, openIM} from "../../../services/im";
import {isMessageHere, renderContentConversation} from "../../../services/im/utils";
import {getMe, isScrollable, parse, pushNotification} from "../../../services/utils";

const count = 20;
const MessageList = ({conversation = {}, onSend}) => {
    const [messages, setMessages] = useState([]);
    const [startClientMsgID, setStartClientMsgID] = useState("");
    const [userTyping, setUserTyping] = useState(false);
    const {isFocused} = useWindowMessageContext();

    const [hasMore, setHasMore] = useState(true);
    const messagesRef = useRef();
    useEffect(() => {
        const {groupID, userID} = conversation;
        if (groupID || userID) {
            loadMessages().then(res => {
                setMessages(prevState => {
                    markasread(prevState);
                    return prevState;
                })
                Scroll(true);
            });

            Scroll(true);
        }

        openIM.on(CbEvents.ONRECVNEWMESSAGES, (res) => {
            const data = JSON.parse(res.data);

            data.forEach((item) =>
                openIM.emit(CbEvents.ONRECVNEWMESSAGE, {data: JSON.stringify(item)}),
            );
        });

        openIM.on(CbEvents.ONRECVNEWMESSAGE, (res) => {

            const data = JSON.parse(res.data);

            if (data.contentType === 113) {
                setUserTyping(JSON.parse(data.content));
                return;
            }

            setUserTyping(false);

            if (isMessageHere(conversation, data)) {
                markasread([data]);
                appendMessage(data);

                if (!isFocused && data.sendID !== getMe().openImUserID) {
                    pushNotification({
                        tag: conversation.conversationID,
                        content: `${data.senderNickname || data.sendID}: ${renderContentConversation(
                            data,
                            false,
                        )}`,
                    });
                }
            }
        });

        if (groupID) {
            openIM.on(CbEvents.ONRECVGROUPREADRECEIPT, onRecvReadMessage);
        }

        if (userID) {
            openIM.on(CbEvents.ONRECVC2CREADRECEIPT, onRecvReadMessage);
        }

        openIM.on(CbEvents.ONRECVMESSAGEREVOKED, (res) => {
            console.log(res);
        });

        return unmount;
    }, [conversation]);

    const unmount = () => {
        openIM.off(CbEvents.ONRECVNEWMESSAGE, (r) => {
            console.log('off evt receive message', r);
        });
        openIM.off(CbEvents.ONRECVNEWMESSAGES, (r) => {
            console.log('off evt receive messages', r);
        });
        const {userID, groupID} = conversation;
        if (groupID) {
            openIM.off(CbEvents.ONRECVGROUPREADRECEIPT, () => {
                console.log('off ONRECVGROUPREADRECEIPT');
            });
        }
        if (userID) {
            openIM.off(CbEvents.ONRECVC2CREADRECEIPT, () => {
                console.log('off ONRECVC2CREADRECEIPT');
            });
        }
    };

    const onRecvReadMessage = (res) => {
        const data = JSON.parse(res.data);
        data.forEach((readMessage) => {
            if (isMessageHere(conversation, readMessage)) {
                setMessages((prevState) => {
                    return prevState.map((message) => {
                        if (readMessage.msgIDList.includes(message.clientMsgID)) {
                            message.isRead = true;
                        }

                        return message;
                    });
                });
            }
        });
    };


    const loadMessages = async (clientMsgID = startClientMsgID) => {
        const messageRes = await openIM.getHistoryMessageList({
            conversationID: conversation.conversationID,
            startClientMsgID: clientMsgID,
            count
        });
        const data = await parse(messageRes.data);
        await setMessages(prevState => [...data, ...prevState]);
        await setStartClientMsgID(data[0]?.clientMsgID || "");
        if (data.length < count) {
            await setHasMore(false);
        } else {
            await loadToScrollable(data[0]?.clientMsgID || "")
        }
    }

    const loadToScrollable = async (startClientMsgID) => {
        if (hasMore && !isScrollable("messagesScroll")) {
            await loadMessages(startClientMsgID);
        }
    }

    useEffect(() => {
        if (messages.length > 0) {
            Scroll();
        }
    }, [messages, userTyping]);

    const Scroll = (toBottom = false) => {
        const {clientHeight, scrollHeight, scrollTop} = messagesRef.current;
        if (toBottom || clientHeight + scrollTop > scrollHeight - 200) {
            messagesRef.current?.scrollTo(0, scrollHeight);
        }
    };

    const markasread = (data) => {
        const {userID, groupID} = conversation;

        const messagesUnRead = data
            .filter(
                (item) =>
                    item.msgFrom === 100 && !item.isRead && item.sendID !== getMe().openImUserID,
            )
            .map((item) => {
                return item.clientMsgID
            });


        openIM.markMessageAsReadByConID({conversationID: conversation.conversationID, msgIDList: []});

        if (messagesUnRead.length > 0) {
            markAsRead({userID, groupID, msgIDList: messagesUnRead}).catch(err => {
                console.log({err, messagesUnRead})
            });

        }


    };
    const appendMessage = (newMessageData) => {
        setMessages((prevState) => {

            const index = prevState.findIndex(item => item.clientMsgID === newMessageData.clientMsgID);

            if (index !== -1) {
                return prevState;
            }

            return [...prevState, newMessageData]
        });
    };

    const mapMessage = (item, index, list, isMessageReadFinal) => {
        switch (item.msgFrom) {
            case 0:
            case 200:
                return (
                    <MessageSystem
                        key={item.clientMsgID}
                        prevItem={list[index - 1]}
                        item={item}
                        nextItem={list[index + 1]}
                    />
                );
            default:
                return (
                    <MessageItem
                        faceURL={conversation.faceURL}
                        key={item.clientMsgID}
                        prevItem={list[index - 1]}
                        item={item}
                        nextItem={list[index + 1]}
                        sendMessage={onSend}
                        isMessageReadFinal={isMessageReadFinal}
                    />
                );
        }
    };

    const renderListMessage = useMemo(() => {
        const messageReadFinal = messages.find(
            (item) => item.sendID === getMe().openImUserID && item.isRead,
        )?.clientMsgID;
        return messages.map((item, index, list) =>
            mapMessage(item, index, list, messageReadFinal === item.clientMsgID),
        );
    }, [messages]);

    return (
        <InfiniteScrollContainer
            id={"messagesScroll"}
            elemRef={messagesRef}
            fetchData={loadMessages}
            loadFirst={false}
            revert={true}
            hasMore={hasMore}
            className={"px-1 overflow-x-hidden overflow-y-auto"}
        >
            {renderListMessage}
            {userTyping ? <Typing faceURL={conversation.faceURL}/> : <></>}
        </InfiniteScrollContainer>
    );
};

MessageList.propTypes = {};

export default MessageList;
