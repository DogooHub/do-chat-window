import React, {useState} from 'react';
import {Button, Input} from "antd";
import {IoSendOutline} from "react-icons/io5";
import {FiCheck} from "react-icons/fi";

const QuickMessage = ({
                          sendMessage
                      }) => {
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);
    const onEnter = async () => {
        setLoading(true);
        const res = await sendMessage(value);
        if (res) {
            setSendSuccess(true);
            setTimeout(() => {
                setSendSuccess(false);
            }, 1000)
        }

        setValue("");
        setLoading(false);
    }

    return (
        <div className={"flex items-center gap-2 px-2"}>
            <Input
                onChange={(e) => setValue(e.target.value)}
                value={value}
                bordered={false}
                allowClear={true}
                rootClassName={"!bg-gray-200"}
                placeholder={"Gửi tin nhắn nhanh"}
                onPressEnter={onEnter}/>
            {sendSuccess ?
                <Button className={"flex items-center justify-center border-none"}
                        icon={<FiCheck className={"text-lg"}/>}/> :
                <Button
                    icon={<IoSendOutline/>}
                    loading={loading}
                    onClick={onEnter}

                />}
        </div>
    );
};

QuickMessage.propTypes = {};

export default QuickMessage;
