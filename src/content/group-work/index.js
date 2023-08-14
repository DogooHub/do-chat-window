import React, {useEffect, useMemo, useState} from 'react';
import IMAvatar from "../../common/avatar";
import {Menu} from "antd";
import {useChatWindowContext} from "../../index";
import {GroupType, SessionType} from "open-im-sdk";
import {openIM} from "../../services/im";
import {parse} from "../../services/utils";

const WorkGroup = () => {
    const {onAddPopupMessage} = useChatWindowContext();
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        openIM.getJoinedGroupList().then((res) => {
            const data = JSON.parse(res.data);
            setGroups(
                data
                    .filter((group) => {
                        const ex = parse(group.ex);
                        return ex.refType === 'project';
                    })
                    .sort((group1, group2) => group2.createTime - group1.createTime),
            );
        });
    }, []);

    const mapGroup = (item) => {
        return {
            key: item.groupID,
            label: (
                <div className={`w-full h-full flex items-center`}>
                    <div className={'flex flex-col min-w-0 items-start justify-center'}>
                        <div
                            className={'min-w-0 w-full block text-base truncate font-semibold text-black'}
                        >{`${item.groupName}`}</div>
                        <div className={`w-full flex items-center text-base text-gray-500`}>
                            <span className={`truncate text-[13px]`}>
                                {item.memberCount} thành viên
                            </span>
                        </div>
                    </div>
                </div>
            ),
            icon: (
                <IMAvatar
                    size={48}
                    user={{...item}}
                    autoUpdateStatus={false}
                    showOnline={false}
                />
            ),
            className: '!flex items-center !h-[65px] gap-2 !px-2',
            onClick: () => {
                onAddPopupMessage({
                    groupID: item.groupID,
                    userID: "",
                    sessionType: item.groupType === GroupType.NomalGroup ? SessionType.Group : SessionType.SuperGroup
                })
            },
        };
    };

    const items = useMemo(() => {
        return groups.map(mapGroup);
    }, [groups]);

    return (
        <div className={'h-full overflow-auto rounded-b-2xl'}>
            <Menu
                style={{
                    border: 'none',
                }}
                className={'overflow-hidden menu--flex'}
                items={items}
                selectable={false}
            />
        </div>
    );
};

WorkGroup.propTypes = {};

export default WorkGroup;
