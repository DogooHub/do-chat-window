import React, {useMemo} from 'react';
import {Divider} from "antd";
import QuickMessage from "./quick-message";
import IMAvatar, {STATUS} from "../avatar";
import {useChatWindowContext} from "../../index";
import {sendMessage} from "../../services/im";

const PopoverProfileContent = ({
                                   user
                               }) => {
    const {status} = useChatWindowContext();
    const onSendQuickMessage = async (value) => {
        return await sendMessage({value, userID: user.sendID})
    }

    const showQuickMessage = useMemo(() => {
        // const conversation = decodeConversation(getOpenImIDByPathname(window.location.pathname));
        // return conversation.sessionType === 2 ? true : conversation.sourceID !== user.sendID;
    }, [user]);

    const isOnline = useMemo(() => {
        return status[user.sendID]?.status === STATUS.Online;
    }, [user])

    return (
        <div>
            <div className={"flex flex-row justify-start gap-4 p-6 pb-3 "}>
                <IMAvatar
                    size={72}
                    user={{faceURL: user.senderFaceUrl, userID: user.sendID}}
                    badgeProps={{
                        offset: [-10, 58],
                        className: "badge__largest"
                    }}
                />
                <div className={"flex flex-col justify-center gap-2"}>
                    <span className={"font-bold"}>{user.senderNickname || user.sendID}</span>
                    <span className={"text-xs text-gray-500"}>{isOnline ? "Trực tuyến" : "Ngoại tuyến"}</span>
                </div>
            </div>
            <Divider/>
            <div>
                {showQuickMessage && <QuickMessage sendMessage={onSendQuickMessage}/>}
            </div>
        </div>
    );
};

PopoverProfileContent.propTypes = {};

export default PopoverProfileContent;
