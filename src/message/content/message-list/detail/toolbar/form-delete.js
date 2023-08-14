import React from 'react';
import {Button, Form, Radio} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import {openIM} from "../../../../../services/im";

const FormDeleteMessage = ({
                               message = {},
                               onCloseModal = () => {
                               }
                           }) => {
    const onFinish = ({type}) => {
        if (type === 'revoke') {
            openIM.revokeMessage(message).then(() => {
                onCloseModal();
            });

            return;
        }

        openIM.deleteMessageFromLocalStorage(JSON.stringify(message)).then(() => {
            onCloseModal();
        });
    };

    return (
        <Form id={'form-delete-message'} onFinish={onFinish} className={"p-4"}>
            <FormItem name={'type'} initialValue={'revoke'} className={'my-8'}>
                <Radio.Group>
                    <Radio value={'revoke'}>
                        <div className={'font-bold '}>Thu hồi với mọi người</div>
                    </Radio>
                    <div className={'text-xs text-gray-500 pl-[27px]'}>
                        Tin nhắn này sẽ bị thu hồi với mọi người trong đoạn chat. Những người khác
                        có thể đã xem hoặc chuyển tiếp tin nhắn đó.
                    </div>
                    <div className={'my-6'}></div>
                    <Radio value={'delete'}>
                        <div className={'font-bold '}>Gỡ ở phía bạn</div>
                    </Radio>
                    <div className={'text-xs text-gray-500 pl-[27px]'}>
                        Chúng tôi sẽ gỡ tin nhắn này ở phía bạn. Những người khác trong đoạn chat
                        vẫn có thể xem được.
                    </div>
                </Radio.Group>
            </FormItem>

            <FormItem className={'m-0'}>
                <div className={'flex gap-2'}>
                    <Button
                        className={'font-bold !text-base'}
                        block
                        size={'large'}
                        onClick={onCloseModal}
                    >
                        Hủy
                    </Button>
                    <Button
                        className={'font-bold !text-base'}
                        block
                        size={'large'}
                        type={'primary'}
                        htmlType={'submit'}
                    >
                        Xóa, gỡ bỏ
                    </Button>
                </div>
            </FormItem>
        </Form>
    );
};

FormDeleteMessage.propTypes = {};

export default FormDeleteMessage;
