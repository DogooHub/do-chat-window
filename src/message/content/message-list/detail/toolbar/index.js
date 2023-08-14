import React from 'react';
import {Dropdown} from 'antd';
import {BsThreeDotsVertical} from 'react-icons/bs';
import FormDeleteMessage from './form-delete';
import ModalContainer from "../../../../../common/modal-container";
import ButtonToolbar from "../../../../../common/button-toolbar";

const MessageDetailToolBar = ({message = {}}) => {
    const menuItems = [
        {
            key: 'delete',
            label: (
                <ModalContainer
                    title={'Bạn muốn gỡ tin nhắn này ở phía ai?'}
                    modalProps={{
                        width: '35vw',
                        footer: null,
                    }}
                    container={'Xóa, gỡ bỏ'}
                >
                    <FormDeleteMessage message={message}/>
                </ModalContainer>
            ),
            value: 'delete',
        },
        {
            key: 'forward',
            label: 'Chuyển tiếp',
            value: 'forward',
        },
        {
            key: 'pin',
            label: 'Ghim',
            value: 'pin',
        },
    ];

    return (
        <div className={'flex flex-row message-toolbar'}>
            <Dropdown
                menu={{
                    items: menuItems,
                }}
                trigger={['click']}
                placement={'top'}
                className={'z-50'}
                rootClassName={'min-w-fit w-40 shadow-2xl'}
                arrow={true}
            >
                <div>
                    <ButtonToolbar
                        icon={<BsThreeDotsVertical/>}
                        bgColor={'bg-transparent'}
                        extraClassName={'text-gray-500'}
                    />
                </div>
            </Dropdown>
        </div>
    );
};

MessageDetailToolBar.propTypes = {};

export default MessageDetailToolBar;
