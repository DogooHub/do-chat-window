import React, {useEffect, useMemo, useState} from 'react';
import {Button, Popover, theme} from "antd";
import IMAvatar, {STATUS} from "../../common/avatar";
import {IoClose} from "react-icons/io5";
import {BiGroup} from "react-icons/bi";
import {CbEvents, SessionType} from "open-im-sdk";
import {useChatWindowContext} from "../../index";
import ButtonWindowMessage from "../../common/button-window-message";
import {FaMinus} from "react-icons/fa";
import WindowMessageHeaderMenu from "./menu";
import {MdKeyboardArrowDown} from "react-icons/md";
import {useWindowMessageContext} from "../index";
import {openIM} from "../../services/im";
import {parse} from "../../services/utils";

const WindowMessageHeader = ({conversation = {}}) => {
    const [groupInfo, setGroupInfo] = useState({});
    const {status, onRemovePopupMessage, onAddMinimumPopupMessage} = useChatWindowContext();
    const {isFocused} = useWindowMessageContext();
    const {token} = theme.useToken();

    useEffect(() => {
        if (conversation.conversationType !== SessionType.Single) {
            openIM.getGroupsInfo([conversation.groupID]).then((r) => {
                const data = JSON.parse(r.data)[0] || {};
                setGroupInfo(data);
            });

            openIM.on(CbEvents.ONGROUPINFOCHANGED, onGroupInfoChange);

            return () => {
                openIM.off(CbEvents.ONGROUPINFOCHANGED, console.log);
            }
        }
    }, [conversation]);

    const onGroupInfoChange = (res) => {
        const data = parse(res.data);

        setGroupInfo(prevStates => {
            if (prevStates.groupID === data.groupID) {
                return data;
            }

            return prevStates;
        })
    }

    const name = useMemo(() => {
        return groupInfo.groupName || conversation.showName || conversation.userID || '';
    }, [conversation, groupInfo]);

    const isOnline = useMemo(() => {
        if (conversation.groupID) {
            return false;
        }

        return status[conversation.userID]?.status === STATUS.Online;
    }, [status, conversation]);

    const description = useMemo(() => {
        if (conversation.conversationType === SessionType.Group || conversation.conversationType === SessionType.SuperGroup) {
            return (
                <>
                    <BiGroup size={16}/>
                    {groupInfo.memberCount || 0}
                </>
            );
        }

        return isOnline ? 'Trực tuyến' : 'Ngoại tuyến';
    }, [conversation, isOnline, groupInfo]);

    const user = useMemo(() => {
        if (conversation.conversationType === SessionType.Single) {
            return conversation;
        }

        return groupInfo;
    }, [conversation, groupInfo]);

    return (
        <div className={"p-1 flex justify-between items-center rounded-t-lg border-0 shadow-sm shadow-gray-300"}>
            <Popover
                trigger={"click"}
                placement={"leftTop"}
                content={<WindowMessageHeaderMenu conversation={conversation} groupInfo={groupInfo}/>}
                rootClassName={"minimum-message-popover"}
            >
                <Button
                    className={"flex items-center p-1 min-w-0"}
                    type={"text"}
                    shape={"default"}
                    icon={<IMAvatar
                        user={user}
                        size={32}
                        badgeProps={{
                            className: 'badge__large',
                            offset: [-8, 25],
                        }}
                    />}
                >
                    <div className={"w-full flex min-w-0 items-center gap-2"}>
                        <div className={'flex flex-col items-start min-w-0 truncate'}>
                            <div className={'w-full text-base font-semibold min-w-0 truncate'}>{name}</div>
                            <div className={'text-xs text-gray-500 flex'}>{description}</div>
                        </div>
                        <div className={"flex items-center"}>
                            <MdKeyboardArrowDown
                                style={{
                                    color: isFocused ? token.colorPrimary : "#ccc"
                                }}
                                size={18}
                                className={`text-gray-300`}/>
                        </div>
                    </div>
                </Button>
            </Popover>
            <div className={"h-full flex items-center"}>
                <ButtonWindowMessage
                    className={"!w-9"}
                    icon={<FaMinus size={18}/>}
                    onClick={() => {
                        onRemovePopupMessage(conversation);
                        onAddMinimumPopupMessage(conversation);
                    }}
                />
                <ButtonWindowMessage
                    className={"!w-9"}
                    icon={<IoClose size={28}/>}
                    onClick={() => {
                        onRemovePopupMessage(conversation);
                    }}
                />
            </div>
        </div>
    );
};

WindowMessageHeader.propTypes = {};

export default WindowMessageHeader;
