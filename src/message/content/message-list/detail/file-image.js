import React, { useMemo } from 'react';
import { Image } from 'antd';

const MessageItemContentImage = ({ content, border }) => {
    const image = useMemo(() => {
        return content.sourcePicture;
    }, [content]);
    return (
        <div className={'my-[1px]'}>
            <Image
                className={
                    'hover:cursor-pointer hover:brightness-95 border-solid border-[1px] border-gray-200 rounded-3xl ' +
                    border
                }
                style={{
                    maxHeight: 200,
                }}
                preview={{
                    mask: false,
                }}
                src={image.url}
            />
        </div>
    );
};

MessageItemContentImage.propTypes = {};

export default MessageItemContentImage;
