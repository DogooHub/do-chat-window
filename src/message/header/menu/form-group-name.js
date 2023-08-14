import React, {useEffect, useRef} from 'react';
import {Button, Form, Input} from "antd";
import FormItem from "antd/es/form/FormItem";
import styled from "styled-components";
import {error_handle, openIM} from "../../../services/im";

const Note = styled.p`
  &:before {
    content: "*";
    color: red;
  }

  display: flex;
  align-items: center;
  gap: 4px;
`
const FormGroupName = ({
                           conversation = {},
                           onCloseModal = () => {
                           }
                       }) => {
    const [form] = Form.useForm();
    const inputRef = useRef();
    const name = Form.useWatch("name", form);
    useEffect(() => {
        form.setFieldsValue({name: conversation.showName});
    }, [conversation]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const onFinish = (values) => {
        openIM.setGroupInfo({
            groupID: conversation.groupID,
            groupInfo: {
                groupName: values.name
            }
        }).then(r => {
            onCloseModal();
        }).catch(error_handle)
    }


    return (
        <Form
            id={"form-group-name"}
            form={form}
            onFinish={onFinish}
            layout={"vertical"}
            rootClassName={"w-full px-4 py-2"}
        >
            <Note>Mọi người đều biết khi tên nhóm chat thay đổi.</Note>
            <FormItem
                name={"name"}
                label={"Tên đoạn chat"}
            >
                <Input name={"name"} size={"large"} ref={inputRef} showCount={true} maxLength={255}/>
            </FormItem>
            <div className={"flex gap-2"}>
                <Button
                    block
                    size={"large"}
                    onClick={() => {
                        onCloseModal();
                    }}>Hủy</Button>
                <Button
                    block
                    size={"large"}
                    type={"primary"}
                    htmlType={"submit"}
                    disabled={name === conversation.showName}
                >Lưu</Button>
            </div>
        </Form>
    );
};

FormGroupName.propTypes = {};

export default FormGroupName;
