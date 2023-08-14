import React from 'react';
import {useWindowMessageContext} from "../message";
import {Button, theme} from "antd";

const ButtonWindowMessage = ({
                                 icon,
                                 className = "",
                                 buttonProps = {},
                                 onClick,
                                 disabled = false
                             }) => {
    const {isFocused} = useWindowMessageContext();
    const {token} = theme.useToken();
    return (
        <Button
            style={{
                color: isFocused && !disabled ? token.colorPrimary : "#ccc"
            }}
            className={`h-9 flex justify-center items-center text-gray-300 ${className}`}
            icon={icon}
            type={"text"}
            shape={"circle"}
            onClick={onClick}
            disabled={disabled}
            {...buttonProps}
        />
    );
};

ButtonWindowMessage.propTypes = {};

export default ButtonWindowMessage;
