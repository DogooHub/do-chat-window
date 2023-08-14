import React from 'react';
import {Popover} from "antd";
import PopoverProfileContent from "./popover-content";

const PopoverProfile = ({
                            user,
                            children,
                            open,
                            sendMessage = () => {
                            }
                        }) => {
    return (
        <Popover
            destroyTooltipOnHide={true}
            trigger={["hover"]}
            placement={"bottomLeft"}
            arrow={false}
            open={open}
            content={<PopoverProfileContent user={user} sendMessage={sendMessage}/>}
            overlayInnerStyle={{
                padding: 0,
            }}
        >
            <div>
                {children}
            </div>
        </Popover>
    );
};

PopoverProfile.propTypes = {};

export default PopoverProfile;
