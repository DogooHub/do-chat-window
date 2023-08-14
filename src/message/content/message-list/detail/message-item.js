import React, {useCallback, useMemo} from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import MessageItemAvatar from "./MessageItemAvatar";
import MessageItemContent from "./index";
import PopoverProfile from "../../../../common/profile/popover-profile";
import {Tooltip} from "antd";
import MessageDetailToolBar from "./toolbar";
import "./message-item.scss"
import {getMe} from "../../../../services/utils";
import {getOrderMessage, MESSAGE_ORDER, MESSAGE_ORDER_BORDER} from "../../../../services/im/utils";

const MessageItem = ({
                         prevItem = {},
                         item = {},
                         nextItem = {},
                         sendMessage = () => {
                         },
                         isMessageReadFinal,
                         faceURL,
                     }) => {
    const isMine = useMemo(() => {
        const myID = getMe().openImUserID;

        return myID === item.sendID;
    }, [item]);

    const renderSendTime = useCallback(
        (onTooltip = false) => {
            const sendTime = dayjs(item.sendTime);

            if (sendTime.isToday()) {
                return sendTime.format('HH:mm');
            }

            const diffDay = dayjs().diff(sendTime, 'day');

            if (diffDay < 7) {
                return sendTime.format(onTooltip ? 'dddd HH:mm' : 'ddd HH:mm');
            }

            return sendTime.format('HH:mm, DD MMMM, YYYY');
        },
        [item],
    );

    const renderDividerTime = useMemo(() => {
        if (prevItem.msgFrom !== 100 || prevItem.contentType === 111) {
            return false;
        }

        const diffTime = Math.abs(item.sendTime - prevItem.sendTime);
        return diffTime > 1000 * 60 * 15;
    }, [prevItem, item]);

    const showAvatar = useMemo(() => {
        if (isMine && !isMessageReadFinal) {
            return false;
        }

        return !isGroup(item, nextItem);
    }, [item, nextItem, isMessageReadFinal]);

    const border = useMemo(() => {
        const order = getOrderMessage(prevItem, item, nextItem);
        if (order === MESSAGE_ORDER.NONE) {
            return '';
        }
        const name = order + (isMine ? '_MINE' : '');
        return MESSAGE_ORDER_BORDER[name];
    }, [prevItem, item, nextItem, isMine]);

    const showName = useMemo(() => {
        if (isMine || item.sessionType !== 2) {
            return <></>;
        }
        const order = getOrderMessage(prevItem, item, nextItem);

        if (order === MESSAGE_ORDER.TOP || order === MESSAGE_ORDER.NONE) {
            return (
                <div className={'w-full mt-3 px-2 text-xs text-gray-500'}>
                    {item.senderNickname || item.sendID}
                </div>
            );
        }

        return <></>;
    }, [item]);

    return (
        <div key={item.seq} className={'flex flex-col'}>
            {renderDividerTime && (
                <div className={'w-full text-center px-4 py-4'}>
                    <span className={'text-xs text-gray-500 capitalize'}>{renderSendTime()}</span>
                </div>
            )}
            <div className={`w-full flex flex-row items-end`}>
                <MessageItemAvatar
                    show={false}
                />
                {showName}
            </div>
            <div className={`message-item flex items-end ${isMine ? "flex-row-reverse" : "flex-row"} gap-1`}>
                <PopoverProfile
                    user={item}
                    open={isMine ? false : undefined}
                    sendMessage={sendMessage}
                >
                    <MessageItemAvatar
                        isMessageReadFinal={isMessageReadFinal}
                        isMine={isMine}
                        isRead={item.isRead}
                        status={item.status}
                        url={!isMine ? item.senderFaceUrl : faceURL}
                        show={showAvatar}
                    />
                </PopoverProfile>
                <div className={`min-w-0 flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-center gap-1`}>
                    <Tooltip
                        title={
                            <span className={'capitalize text-xs text-gray-100'}>
                                {renderSendTime(true)}
                            </span>
                        }
                        placement={isMine ? 'right' : 'left'}
                    >
                        <MessageItemContent isMine={isMine} item={item} border={border}/>
                    </Tooltip>
                    <MessageDetailToolBar message={item}/>
                </div>
            </div>
        </div>
    );
};

MessageItem.propTypes = {};

export default MessageItem;
