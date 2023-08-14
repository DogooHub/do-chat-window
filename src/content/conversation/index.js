import React, {useEffect, useMemo, useState} from 'react';
import {CbEvents, SessionType} from "open-im-sdk";
import {Menu, theme} from "antd";
import ConversationMenu from "./menu";
import dayjs from "dayjs";
import IMAvatar from "../../common/avatar";
import InfiniteScrollContainer from "../../common/infinite-scroll";
import {useChatWindowContext} from "../../index";
import {openIM} from "../../services/im";
import {getMe, isScrollable, parse} from "../../services/utils";
import {renderContentConversation} from "../../services/im/utils";

const count = 5;

const ConversationList = () => {
    const [conversations, setConversations] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const {token} = theme.useToken();
    const {onAddPopupMessage, deleteConversation, setDeleteConversation} = useChatWindowContext();

    useEffect(() => {
        openIM.on(CbEvents.ONNEWCONVERSATION, onConversationChange);

        openIM.on(CbEvents.ONCONVERSATIONCHANGED, onConversationChange);

        return () => {
            openIM.off(CbEvents.ONCONVERSATIONCHANGED, () => {
                console.log('off ONCONVERSATIONCHANGED');
            });
            openIM.off(CbEvents.ONNEWCONVERSATION, () => {
                console.log('off ONNEWCONVERSATION');
            });
        };
    }, []);

    useEffect(() => {
        if (deleteConversation) {
            onDeleteConversation(deleteConversation);
            setDeleteConversation(null);
        }
    }, [deleteConversation]);

    const loadConversations = async (offsetParams = offset) => {
        const conversationListRes = await openIM.getConversationListSplit({
            offset: offsetParams,
            count,
        });
        const conversationList = parse(conversationListRes.data);

        const filterConversationList = await filterConversation(conversationList);

        await setOffset(() => offsetParams + count);

        await setConversations((prevState) => {
            return [...prevState, ...filterConversationList];
        });

        if (conversationList.length < count) {
            setHasMore(false);
        } else {
            await loadToScrollable(offsetParams + count);
        }
    };

    const loadToScrollable = async (offset) => {
        if (hasMore && !isScrollable('conversationsScroll')) {
            await loadConversations(offset);
        }
    };

    const onDeleteConversation = (conversation) => {
        setConversations((prevState) => {
            const index = prevState.findIndex(
                (item) => item.conversationID === conversation.conversationID,
            );

            if (index !== -1) {
                prevState.splice(index, 1);
            }

            return [...prevState];
        });
    };

    const onConversationChange = async (res) => {
        const data = await JSON.parse(res.data);
        const newConversations = data || [];

        const filterConversationList = await filterConversation(newConversations);

        await setConversations((prevState) => {
            const newConversationsFilter = filterConversationList.filter((item) => {
                const index = prevState.findIndex(
                    (value) => item.conversationID === value.conversationID,
                );
                if (index === -1) {
                    return true;
                }

                if (item.latestMsgSendTime === prevState[index].latestMsgSendTime) {
                    prevState[index] = item;
                    return false;
                }

                prevState.splice(index, 1);

                return true;
            });

            return [...newConversationsFilter, ...prevState];
        });
    };


    const filterConversation = async (conversationList = []) => {
        const list = Object.assign([], conversationList);
        const groupConversationID = list
            .filter((item) => item.conversationType !== SessionType.Single)
            .map((item) => item.groupID);

        const groupListRes = await openIM.getGroupsInfo(groupConversationID);

        const groupList = JSON.parse(groupListRes.data);

        await groupList.forEach((group) => {
            const ex = parse(group.ex);

            if (ex.refType === 'project') {
                const index = list.findIndex((item) => item.groupID === group.groupID);
                if (index !== -1) {
                    list.splice(index, 1);
                }
            }
        });

        return list;
    };

    const mapConversation = (item) => {
        const latestMsg = JSON.parse(item.latestMsg);
        const isMine = latestMsg.sendID === getMe().openImUserID;
        const showAvt = isMine && latestMsg.isRead;
        const timeGap = dayjs(latestMsg.sendTime).fromNow(true);
        const content = renderContentConversation(latestMsg, isMine);

        return {
            key: `${item.conversationID}`,
            label: (
                <div
                    className={`w-full h-full flex items-center justify-between ${
                        item.unreadCount > 0 ? 'font-bold' : ''
                    }`}
                >
                    <ConversationMenu conversation={item}/>
                    <div className={'flex flex-col min-w-0 items-start justify-center'}>
                        <div className={'min-w-0 w-full block text-base truncate'}>{`${
                            item.showName || item.userID
                        }`}</div>
                        <div className={`w-full flex items-center text-base`}>
                            <span
                                className={`truncate text-[13px] ${
                                    item.unreadCount > 0 ? '' : 'text-[#65676B]'
                                }`}
                            >
                                {content.trim()}
                            </span>
                            <span className={'text-[12px] font-medium text-[#65676B]'}>
                                <span>&nbsp;</span>
                                <span>·</span>
                            </span>
                            <span className={'text-[12px] font-normal pl-0.5 text-[#65676B]'}>
                                {timeGap}
                            </span>
                        </div>
                    </div>
                    <div className={'w-[16px] h-full flex items-center justify-center'}>
                        {item.unreadCount > 0 ? (
                            <div
                                className={`w-2.5 aspect-square rounded-full`}
                                style={{backgroundColor: token.colorPrimary}}
                            />
                        ) : (
                            <IMAvatar
                                show={showAvt}
                                showOnline={false}
                                user={{faceURL: item.faceURL}}
                                size={16}
                                iconSize={14}
                            />
                        )}
                    </div>
                </div>
            ),
            icon: (
                <div className={'flex flex-shrink-0'}>
                    <IMAvatar
                        user={item}
                        badgeProps={{
                            offset: [-10, 40],
                            className: 'badge__large',
                        }}
                    />
                </div>
            ),
            className: `!h-[65px] w-full !flex items-center !px-2 conversation-item`,
            style: {
                color: `${token.colorText}`,
            },
            onClick: () => {
                onAddPopupMessage({sessionType: item.conversationType, groupID: item.groupID, userID: item.userID});
                if (item.unreadCount) {
                    openIM
                        .markMessageAsReadByConID({
                            conversationID: item.conversationID,
                            msgIDList: [],
                        })
                        .then((res) => {
                            console.log('markMessageAsReadByConID', {res});
                        });
                }
            },
        };
    };


    const items = useMemo(() => {
        return conversations.map(mapConversation);
    }, [conversations]);

    return (
        <InfiniteScrollContainer
            id={'conversationsScroll'}
            hasMore={hasMore}
            fetchData={loadConversations}
        >
            <Menu
                style={{
                    border: 'none',
                }}
                className={`menu--flex`}
                items={items}
                selectable={false}
            />
        </InfiniteScrollContainer>
    );
};

ConversationList.propTypes = {};

export default ConversationList;
