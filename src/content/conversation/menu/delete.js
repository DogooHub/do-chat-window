import React from 'react';
import ModalContainer from "../../../common/modal-container";
import {useChatWindowContext} from "../../../index";
import {openIM} from "../../../services/im";

const ModalDeleteConversation = ({conversation = {}}) => {
    const {onRemovePopupMessage, setDeleteConversation} = useChatWindowContext();

    const onConfirmDelete = () => {
        return openIM.deleteConversation(conversation.conversationID).then(() => {
            setDeleteConversation(conversation);
            onRemovePopupMessage(conversation);
            return true;
        });
    };
    return (
        <ModalContainer
            container={'Xóa đoạn chat'}
            title={'Xóa đoạn chat'}
            modalProps={{okText: 'Xóa đoạn chat', onOk: onConfirmDelete}}
            rootClassName={"w-full"}
        >
            <div className={'w-full text-center text-xs'}>
                Bạn không thể hoàn tác sau khi xóa bản sao của cuộc trò chuyện này.
            </div>
        </ModalContainer>
    );
};

ModalDeleteConversation.propTypes = {};

export default ModalDeleteConversation;
