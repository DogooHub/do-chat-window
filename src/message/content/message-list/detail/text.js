import React from 'react';
import HTMLReactParser from "html-react-parser";
import {theme} from "antd";

const MessageItemContentText = ({content, isMine, border}) => {
    const {token} = theme.useToken();

    return (
        <div
            style={{
                backgroundColor: isMine ? token.colorPrimary : token.colorFillSecondary,
                color: isMine ? token.colorTextLightSolid : token.colorText
            }}
            className={`ck ck-content ck-widget ck--message h-fit text-left py-2 px-3 my-[1px] rounded-2xl overflow-hidden break-words leading-5 ${border}`}
        >
            {HTMLReactParser(content)}
        </div>
    );
};

MessageItemContentText.propTypes = {};

export default MessageItemContentText;
