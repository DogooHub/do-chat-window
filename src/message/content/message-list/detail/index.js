import React, { useMemo } from 'react';
import MessageItemContentFile from './file-item';
import MessageItemContentText from './text';
import MessageItemContentImage from './file-image';
import MessageDetailRevoke from './revoke';
import { MessageType } from 'open-im-sdk';

const MessageItemContent = ({ item = {}, border, isMine }) => {
    const renderContent = useMemo(() => {
        const { content, contentType } = item;
        switch (contentType) {
            case MessageType.TEXTMESSAGE:
                return <MessageItemContentText content={content} isMine={isMine} border={border} />;
            case MessageType.PICTUREMESSAGE: {
                const data = JSON.parse(content);
                return <MessageItemContentImage content={data} border={border} />;
            }
            case MessageType.FILEMESSAGE: {
                const data = JSON.parse(content);
                return <MessageItemContentFile content={data} border={border} />;
            }
            case MessageType.REVOKEMESSAGE: {
                return <MessageDetailRevoke isMine={isMine} item={item} border={border} />;
            }
            default:
                return <MessageItemContentText content={content} isMine={isMine} border={border} />;
        }
    }, [item, border]);

    return <React.Fragment>{renderContent}</React.Fragment>;
};

MessageItemContent.propTypes = {};

export default MessageItemContent;
