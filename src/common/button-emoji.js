import React from 'react';
import {Popover} from 'antd';
import EmojiPicker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import {BiSolidSmile} from "react-icons/bi";
import ButtonWindowMessage from "./button-window-message";
import "./button-emoji.scss"
const ButtonEmoji = ({
                         onClickEmoji = (emoji) => {
                         }
                     }) => {
    return (
        <>
            <Popover
                content={
                    <EmojiPicker
                        data={data}
                        emojiButtonColors={[
                            '#DF7861',
                            '#FCBAD3',
                            '#AA96DA',
                            '#A8D8EA',
                            '#95E1D3',
                            '#EAFFD0',
                            '#FCE38A',
                            '#F38181',
                            '#FC5185',
                            '#3282B8',
                            '#BDD2B6',
                        ]}
                        emojiButtonRadius={'8px'}
                        emojiButtonSize={40}
                        maxFrequentRows={0}
                        navPosition={'bottom'}
                        perLine={8}
                        previewPosition={'none'}
                        skinTonePosition={'search'}
                        searchPosition={'none'}
                        onEmojiSelect={onClickEmoji}
                        locale={'vi'}
                        theme={"light"}
                    />
                }
                trigger={['click']}
                arrow={false}
                rootClassName={'btn--emoji'}
                overlayInnerStyle={{padding: 0}}
                autoAdjustOverflow={true}
                destroyTooltipOnHide={true}
            >
                <ButtonWindowMessage
                    className={"!h-7 !min-w-[28px] !w-7"}
                    // onClick={(e) => e.stopPropagation()}
                    icon={<BiSolidSmile size={24}/>}/>
            </Popover>
        </>
    );
};

ButtonEmoji.propTypes = {};

export default ButtonEmoji;
