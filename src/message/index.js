import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import WindowMessageHeader from "./header";
import WindowMessageContent from "./content";

const WindowMessageContext = createContext({});

export const useWindowMessageContext = () => useContext(WindowMessageContext);
const WindowMessage = ({conversation}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        onClick();
    }, [conversation]);

    const onClick = () => {
        inputRef.current?.focus();
    }

    return (
        <WindowMessageContext.Provider value={{
            isFocused,
            inputRef
        }}>
            <div
                id={conversation.userID || conversation.groupID}
                className={"window-chat flex flex-col rounded-t-lg bg-white shadow-sm shadow-gray-300"}
                // onClick={onClick}
                onFocus={() => {
                    setIsFocused(true)
                }}
                onBlur={() => {
                    setIsFocused(false)
                }}
            >
                <WindowMessageHeader conversation={conversation}/>
                <WindowMessageContent conversation={conversation}/>
            </div>
        </WindowMessageContext.Provider>
    );
};

WindowMessage.propTypes = {};

export default WindowMessage;
