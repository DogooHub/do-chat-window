import React from 'react';
import { Button } from 'antd';

const ButtonSiderToolbar = ({
    icon,
    title,
    size = 'small',
    onClick,
    bgColor = '',
    extraClassName = '',
    buttonProps = {},
}) => {
    return (
        <div className={'flex flex-col justify-center items-center'}>
            {icon && (
                <Button
                    type={'text'}
                    shape={'circle'}
                    size={size}
                    className={`flex justify-center items-center ${
                        bgColor || 'bg-[rgba(0,0,0,0.05)]'
                    } ${extraClassName}`}
                    icon={icon}
                    onClick={onClick}
                    {...buttonProps}
                />
            )}
            {title && <div className={'text-sm pt-1'}>{title}</div>}
        </div>
    );
};

ButtonSiderToolbar.propTypes = {};

export default ButtonSiderToolbar;
