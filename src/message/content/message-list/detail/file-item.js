import React from 'react';
import {Typography} from "antd";
import {BsFillFileEarmarkTextFill} from "react-icons/bs";
import ButtonToolbar from "../../../../common/button-toolbar";
import {formatBytes} from "../../../../services/utils";

const MessageItemContentFile = ({content, border}) => {
    const onClick = () => {
        window.open(content.sourceUrl, "_self");
    }

    return (
        <div onClick={onClick} className={`bg-gray-200 my-[1px] px-4 py-2 rounded-2xl ${border}`}>
            <div className={"flex justify-start items-center gap-2 hover:cursor-pointer"}>
                <ButtonToolbar icon={<BsFillFileEarmarkTextFill/>} size={"default"} extraClassName={"bg-gray-300"}/>
                <div className={"w-full flex flex-col"}>
                    <Typography.Text className={"break-all"}>{content.fileName}</Typography.Text>
                    <div className={"text-xs"}>{formatBytes(content.fileSize)}</div>
                </div>
            </div>
        </div>
    );
};

MessageItemContentFile.propTypes = {};

export default MessageItemContentFile;
