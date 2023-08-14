import React from 'react';
import {GroupRole} from 'open-im-sdk';
import ModalContainer from "../../../common/modal-container";
import {error_handle, openIM} from "../../../services/im";
import {getMe, parse} from "../../../services/utils";

const ModalExitGroup = ({conversation = {}}) => {
    const onConfirmDelete = async () => {
        const userRes = await openIM.getGroupMembersInfo({
            groupID: conversation.groupID,
            userIDList: [getMe().openImUserID]
        })

        const user = parse(userRes.data)[0] || {};

        if (user.roleLevel === GroupRole.Owner || user.roleLevel === GroupRole.Admin) {
            const isNeedAdmin = await openIM
                .getGroupMemberList({groupID: user.groupID, filter: 3, count: 2, offset: 0})
                .then((res) => {
                    return (
                        JSON.parse(res.data).filter((item) => item.userID !== user.userID)
                            .length === 0
                    );
                });
            if (isNeedAdmin) {
                const userGetAdmin = await openIM
                    .getGroupMemberListByJoinTimeFilter({
                        groupID: user.groupID,
                        offset: 0,
                        count: 20,
                        filterUserIDList: [],
                        joinTimeBegin: 0,
                        joinTimeEnd: 0,
                    })
                    .then((res) => {
                        return JSON.parse(res.data).find(
                            (item) =>
                                item.roleLevel === GroupRole.Nomal && item.userID !== user.userID,
                        );
                    });

                await openIM.setGroupMemberRoleLevel({
                    groupID: user.groupID,
                    roleLevel: GroupRole.Admin,
                    userID: userGetAdmin.userID,
                });
            }
        }

        return await openIM.quitGroup(user.groupID).then((res) => {
            console.log({res})
            return true;
        }).catch(error_handle);
    };
    return (
        <ModalContainer
            container={'Rời nhóm'}
            title={'Rời khỏi nhóm chat?'}
            modalProps={{okText: 'Rời nhóm', onOk: onConfirmDelete}}
        >
            <div className={'text-center text-sm px-4'}>
                Bạn sẽ không nhận được tin nhắn từ cuộc trò chuyện này nữa và mọi người sẽ thấy bạn
                rời nhóm.
            </div>
        </ModalContainer>
    );
};

ModalExitGroup.propTypes = {};

export default ModalExitGroup;
