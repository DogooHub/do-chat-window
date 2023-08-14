import React, {useMemo} from 'react';

const MessageDetailRevoke = ({isMine, item = {}}) => {

    const user = useMemo(() => {
        return isMine ? "Bạn" : (item.senderNickname || item.sendID);
    }, [item]);

    return (
        <div
            className={`bg-transparent border-gray-300 border-solid text-gray-400 border-[1px] my-[1px] px-3 py-3 rounded-2xl`}>
            {`${user} đã thu hồi một tin nhắn`}
        </div>
    );
};

MessageDetailRevoke.propTypes = {};

export default MessageDetailRevoke;
