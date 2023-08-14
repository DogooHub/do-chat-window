import React, {useState} from 'react';
import {IoClose} from "react-icons/io5";
import ButtonWindowMessage from "../../common/button-window-message";
import {FROM, useChatWindowContext} from "../../index";
import DGSelectAccount from "./Account";
import NewMessageConversation from "./conversation";
import NewMessageContent from "./content";


const WindowNewMessage = ({initUsers = []}) => {
    const {onRemovePopupMessage} = useChatWindowContext();
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    return (
        <div className={"window-chat flex flex-col rounded-t-lg bg-white shadow-sm shadow-gray-300"}>
            <div className={"h-[58px] flex justify-between items-center p-1 pl-3"}>
                <div>Tin nhắn mới</div>
                <ButtonWindowMessage
                    className={"!w-9"}
                    icon={<IoClose size={28}/>}
                    onClick={() => {
                        onRemovePopupMessage({conversationID: FROM.NEW});
                    }}
                />
            </div>
            <div className={"h-[calc(100%-58px)] flex flex-col"}>
                <div
                    className={'bg-white h-fit pl-4 p-2 flex items-start justify-start border-0 border-b-[1px] border-gray-300 border-solid'}>
                    <span className={'leading-[28px]'}>Đến:</span>
                    <DGSelectAccount
                        selectedAccounts={selectedAccounts}
                        onChangeAccount={setSelectedAccounts}
                    />
                </div>
                <div className={"min-h-0 h-full"}>
                    {selectedAccounts.length === 1
                        ? <NewMessageConversation user={selectedAccounts[0]}/>
                        : <NewMessageContent users={selectedAccounts}/>
                    }
                </div>
            </div>
        </div>
    );
};

WindowNewMessage.propTypes = {};

export default WindowNewMessage;
