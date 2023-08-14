import React, {useMemo} from 'react';
import {UserOutlined} from '@ant-design/icons';
import {Avatar, Badge} from 'antd';
import {useChatWindowContext} from "../../index";
import {BASE_URL_IMAGE, getUsersOnline} from "../../services/axios";


export const STATUS = {
    Online: 'online',
    Offline: 'offline',
};
const IMAvatar = ({
                      user = {},
                      size = 48,
                      iconSize,
                      className = '',
                      showOnline = true,
                      badgeProps = {},
                      autoUpdateStatus = true,
                      show = true,
                      icon,
                  }) => {
    const {status, onChangeStatus} = useChatWindowContext();
    const src = useMemo(() => {
        if (user.portraitThumbnail || user.faceURL?.startsWith('/image/')) {
            const faceURL = user.portraitThumbnail || user.faceURL;
            return BASE_URL_IMAGE + faceURL;
        }

        return user?.faceURL || null;
    }, [user]);

    const isOnline = useMemo(() => {
        if (user.groupID) {
            return false;
        }
        if (autoUpdateStatus && user.userID && !status[user.userID]) {
            getUsersOnline([user.userID]).then((r) => {
                const data = r.data.data;
                onChangeStatus(data);
            });
        }

        return status[user.userID]?.status === STATUS.Online;
    }, [status, user]);

    return show ? (
        <Badge
            dot
            color={'green'}
            offset={[-5, 25]}
            count={showOnline && isOnline ? 1 : 0}
            {...badgeProps}
            className={`flex justify-center items-center text-inherit ${
                badgeProps.className || ''
            }`}
        >
            <Avatar
                size={size}
                icon={
                    icon || (
                        <UserOutlined
                            style={{color: 'white', fontSize: iconSize || Math.max(size / 2, 12)}}
                        />
                    )
                }
                shape={'circle'}
                className={`flex justify-center items-center cursor-pointer border-none select-none ${className}`}
                src={`${src}`}
            />
        </Badge>
    ) : (
        <div className={`flex`} style={{width: `${size}px`}}></div>
    );
};

IMAvatar.propTypes = {};

export default IMAvatar;
