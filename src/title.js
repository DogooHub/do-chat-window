import React from 'react';
import {theme} from "antd";
import {FaMinus} from "react-icons/fa";
import {IoMdOpen} from "react-icons/io";
import {BiSolidMessageRoundedAdd} from "react-icons/bi";
import {FROM, useChatWindowContext} from "./index";

const urlChat = process.env.REACT_APP_SERVICE_CHAT;

const WindowChatTitle = ({hiddenWindow}) => {
    const {token} = theme.useToken();
    // const {customer} = useDashboardContext();
    const {onAddPopupMessage} = useChatWindowContext();
    const onOpenDoIM = () => {
        window.open(urlChat);
    }

    return (
        <div style={{
            backgroundColor: token.colorPrimary,
            color: token.colorTextLightSolid
        }}
             className={"flex justify-between items-center gap-2 py-3 px-5 text-xl uppercase rounded-t-lg"}>
            {/*<span className={"min-w-0 max-w-[60%] truncate"}>{customer?.name}</span>*/}
            <div className={"flex items-center gap-3 text-gray-500 select-none"}>
                <BiSolidMessageRoundedAdd className={"hover:text-white cursor-pointer"} onClick={() => {
                    onAddPopupMessage({}, FROM.NEW);
                }}/>
                <FaMinus className={"hover:text-white cursor-pointer"} onClick={hiddenWindow}/>
                <IoMdOpen className={"hover:text-white cursor-pointer"} onClick={onOpenDoIM}/>
            </div>
        </div>
    );
};

WindowChatTitle.propTypes = {};

export default WindowChatTitle;
