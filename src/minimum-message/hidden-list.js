import React, {useMemo} from 'react';
import {Menu} from "antd";
import ButtonToolbar from "../common/button-toolbar";
import {IoClose} from "react-icons/io5";
import {FROM, useChatWindowContext} from "../index";

const MinimumMessageHiddenList = ({data = []}) => {
    const {onAddPopupMessage, onRemoveMinimumPopupMessage} = useChatWindowContext();


    const mapMinimumMessageHidden = (item) => {
        return {
            key: item.conversationID,
            label: <div className={"w-[232px] flex justify-between items-center gap-4"}>
                <div className={"min-w-0 truncate"}>{item.showName || item.userID}</div>
                <ButtonToolbar
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemoveMinimumPopupMessage(item);
                    }}
                    bgColor={"bg-transparent"}
                    icon={<IoClose size={18}/>}
                    extraClassName={"menu-member"}
                />
            </div>,
            className: "!px-2",
            onClick: () => {
                onAddPopupMessage(item, FROM.MINIMUM_POPUP_MESSAGE);
                onRemoveMinimumPopupMessage(item);
            }
        }
    }

    const items = useMemo(() => {
        return data.map(mapMinimumMessageHidden);
    }, [data]);

    return (
        <Menu
            className={"!border-none max-h-44 overflow-auto rounded-2xl"}
            items={items}
            selectable={false}
        />
    );
};

MinimumMessageHiddenList.propTypes = {};

export default MinimumMessageHiddenList;
