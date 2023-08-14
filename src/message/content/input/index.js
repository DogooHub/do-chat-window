import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Input, Upload} from "antd";
import {HiPaperAirplane} from "react-icons/hi2";
import {IoImages} from "react-icons/io5";
import {debounce} from "lodash/function";
import ButtonWindowMessage from "../../../common/button-window-message";
import {useWindowMessageContext} from "../../index";
import ButtonEmoji from "../../../common/button-emoji";
import MessageInputFile from "./file";
import {uploadFile} from "../../../services/axios";

const WindowMessageContentInput = ({
                                       onSend,
                                       onTyping = () => {
                                       }
                                   }) => {
    const [value, setValue] = useState('');
    const [typing, setTyping] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);
    const {inputRef} = useWindowMessageContext();

    useEffect(() => {
        onTyping(typing);
    }, [typing]);

    const debouncedTyping = useCallback(
        debounce(() => {
            setTyping(false);
        }, 2000),
        [],
    );
    const onUpload = async (file) => {
        const fileRes = await uploadFile({file});
        await onSend({file, url: fileRes.data.data.URL}, 'file');
    };

    const chooseEmoji = ({native}) => {
        // const textArea = inputRef?.current.resizableTextArea.textArea;
        // const selectionStart = textArea.selectionStart;
        // const selectionEnd = textArea.selectionEnd;
        // const text = inputRef?.current.resizableTextArea.textArea.value;
        // onChangeValue(prevStates => strSplice(prevStates, selectionStart, selectionEnd - selectionStart, native));
        // inputRef?.current.resizableTextArea.textArea.setSelectionRange(selectionStart + native.length, selectionStart + native.length);
        // inputRef?.current.resizableTextArea.textArea.setRangeText(native, selectionStart, selectionEnd, "end");
        onChangeValue(prevStates => prevStates + native)
    };

    const onPressEnter = (e) => {
        e.preventDefault();
        if (value) {
            onSend(value.trim());
            setValue('');
        }
        setUploadFiles((prevState) => {
            prevState.forEach(onUpload);
            return [];
        });

    }

    const onChangeValue = (value) => {
        if (value && !typing) {
            setTyping(true);
        }

        debouncedTyping();
        setValue(value || '');
    }

    const onAddUploadFile = (file) => {
        setUploadFiles((prevState) => [...prevState, file]);
    };

    const onRemoveFile = (file) => {
        setUploadFiles((prevState) => prevState.filter((item) => item.uid !== file.uid));
    };

    const notSend = useMemo(() => {
        return !value && uploadFiles?.length === 0;
    }, [value, uploadFiles]);

    return (
        <div className={"w-full flex items-end py-2"}>
            <Upload
                showUploadList={false}
                multiple={true}
                beforeUpload={(file) => {
                    onAddUploadFile(file);
                    return false;
                }}
            >
                <ButtonWindowMessage
                    className={"!w-9 mx-1"}
                    icon={<IoImages size={20}/>}
                />
            </Upload>
            <div
                className={"w-full flex flex-col justify-center bg-gray-100 rounded-3xl overflow-hidden"}
            >
                <MessageInputFile
                    files={uploadFiles}
                    onRemoveFile={onRemoveFile}
                    onAddFile={onAddUploadFile}
                />
                <div className={"w-full flex items-end bg-gray-100 rounded-3xl overflow-hidden"}>
                    <div className={"w-full flex items-center min-h-[36px]"}>
                        <Input.TextArea
                            ref={inputRef}
                            bordered={false}
                            placeholder={"Aa"}
                            classNames={{textarea: "pl-3 pr-2"}}
                            onPressEnter={onPressEnter}
                            onChange={(e) => onChangeValue(e.target.value)}
                            value={value}
                            autoSize={{
                                minRows: 1,
                                maxRows: 5
                            }}
                        />
                    </div>
                    <div className={"h-9 flex justify-center items-center p-1"}>
                        <ButtonEmoji
                            onClickEmoji={chooseEmoji}/>
                    </div>
                </div>
            </div>
            <div>
                <ButtonWindowMessage
                    onClick={onPressEnter}
                    className={"!w-9 mx-1"}
                    icon={<HiPaperAirplane size={24}/>}
                    disabled={notSend}
                />
            </div>
        </div>
    );
};

WindowMessageContentInput.propTypes = {};

export default WindowMessageContentInput;
