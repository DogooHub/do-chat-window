import React, {useState} from 'react';
import {Button, Dropdown} from "antd";
import {BsThreeDots} from "react-icons/bs";
import {MdDelete} from "react-icons/md";
import ModalDeleteConversation from "./delete";
import ButtonToolbar from "../../../common/button-toolbar";

const ConversationMenu = ({conversation = {}}) => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        {
            key: "delete",
            label: <ModalDeleteConversation conversation={conversation}/>,
            icon: <ButtonToolbar icon={<MdDelete size={18}/>}/>,
            className: "gap-3 !px-2 !py-2.5"
        }
    ]

    const onClickMenuItem = ({domEvent}) => {
        domEvent.stopPropagation();
        setIsOpen(false);
    }

    return (
        <div className={`menu-conversation absolute right-8 hidden ${isOpen ? "block" : ""}`}>
            <Dropdown
                trigger={["click"]}
                menu={{
                    items: menuItems,
                    onClick: onClickMenuItem
                }}
                onOpenChange={(open) => {
                    setIsOpen(open)
                }}
                placement={"bottom"}
            >
                <Button
                    className={"flex justify-center items-center bg-white border-[1px] border-solid border-gray-300 hover:!bg-neutral-200 block"}
                    icon={<BsThreeDots/>}
                    shape={"circle"}
                    type={"text"}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                />
            </Dropdown>
        </div>
    );
};

ConversationMenu.propTypes = {};

export default ConversationMenu;
