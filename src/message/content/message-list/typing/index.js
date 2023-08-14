import React from 'react';
import MessageItem from '../detail/message-item';
import "./typing.scss"

const Typing = ({faceURL}) => {

    const item = {
        content: `<div class="typing flex justify-evenly items-center h-[20px]">
            <div class="typing__dot"></div>
            <div class="typing__dot"></div>
            <div class="typing__dot"></div>
        </div>`,
    };

    return <MessageItem item={item} faceURL={faceURL}/>;
};

Typing.propTypes = {};

export default Typing;
