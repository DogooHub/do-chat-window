import React, {useEffect, useState} from 'react';
import WindowMessageContentInput from "../content/input";
import IMAvatarGroup from "../../common/avatar/avatar-group";
import {Typography} from "antd";
import {useChatWindowContext} from "../../index";
import {GroupRole, SessionType} from "open-im-sdk";
import {error_handle, openIM, sendMessage} from "../../services/im";
import {parse} from "../../services/utils";

const NewMessageContent = ({users = []}) => {
    const [groupName, setGroupName] = useState("");
    const [edited, setEdited] = useState(false);
    const {replaceNewMessage} = useChatWindowContext();
    const onSend = async (
        value,
        type = 'text'
    ) => {

        const newGroupRes = await openIM.createGroup({
            groupBaseInfo: {
                groupName
            },
            memberList: users.map(user => ({userID: user.openImUserID, roleLevel: GroupRole.Nomal}))
        })

        const newGroupData = parse(newGroupRes.data);

        try {
            const [messageRes, conversationRes] = await Promise.all([
                sendMessage({
                    userID: "",
                    groupID: newGroupData.groupID,
                    value,
                    type,
                }),
                openIM.getOneConversation({sessionType: SessionType.Group, sourceID: newGroupData.groupID})
            ])
            if (messageRes.errCode === 0 && conversationRes.errCode === 0) {
                const conversationData = parse(conversationRes.data);

                replaceNewMessage(conversationData);
            }
        } catch (e) {
            error_handle(e);
        }
    };

    useEffect(() => {
        if (!edited) {
            setGroupName(users.map(user => user.fullname.split(" ").pop()).join(", "));
        }
    }, [users]);

    return (
        users.length > 0
            ? <div className={"h-full flex flex-col justify-between"}>
                <div
                    className={"flex flex-col items-center p-3 pt-5 gap-2 overflow-auto"}>
                    <IMAvatarGroup users={users}/>
                    <Typography.Title
                        className={"w-full text-center"}
                        level={4}
                        editable={{
                            maxLength: 255,
                            triggerType: ['text'],
                            onChange: (value) => {
                                if (!edited) {
                                    setEdited(true);
                                }
                                setGroupName(value);
                            }
                        }}
                    >{groupName}
                    </Typography.Title>
                </div>
                <WindowMessageContentInput onSend={onSend}/>
            </div>
            : <React.Fragment></React.Fragment>
    );
};

NewMessageContent.propTypes = {};

export default NewMessageContent;
