import React, {useMemo} from 'react';
import MinimumMessage from "./item";
import {Popover} from "antd";
import MinimumMessageHiddenList from "./hidden-list";
import "./style.scss"

const LIMIT_SHOW_MINIMUM_MESSAGE = 4;
const MinimumMessageList = ({minimumPopupMessages = []}) => {

    const showMinimumMessages = useMemo(() => {
        return minimumPopupMessages.slice(0, LIMIT_SHOW_MINIMUM_MESSAGE);
    }, [minimumPopupMessages]);

    const hideMinimumMessages = useMemo(() => {
        return minimumPopupMessages.slice(LIMIT_SHOW_MINIMUM_MESSAGE, minimumPopupMessages.length);
    }, [minimumPopupMessages]);


    return <>
        {showMinimumMessages.map((item =>
                <MinimumMessage key={item.conversationID} conversation={item}/>
        ))}
        {hideMinimumMessages.length > 0 && <Popover
            open={hideMinimumMessages.length > 1 ? undefined : false}
            trigger={"hover"}
            placement={"left"}
            rootClassName={"minimum-message-popover"}
            content={<MinimumMessageHiddenList data={hideMinimumMessages}/>}
        >
            <div className={"relative"}>
                <MinimumMessage
                    key={hideMinimumMessages[0]?.conversationID}
                    conversation={hideMinimumMessages[0]}
                    disable={hideMinimumMessages.length > 1}/>
                {hideMinimumMessages.length > 1 && < div
                    style={{
                        backgroundColor: "rgba(0,0,0,0.3)"
                    }}
                    className={"absolute w-full h-full top-0 flex justify-center items-center " +
                        "font-bold text-white rounded-[50%] cursor-pointer select-none text-base"}>
                    +{Math.min(hideMinimumMessages.length, 99)}
                </div>}
            </div>
        </Popover>}

    </>
};

MinimumMessageList.propTypes = {};

export default MinimumMessageList;
