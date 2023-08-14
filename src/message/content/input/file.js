import React from 'react';
import {BsFilePlus, BsFillFileEarmarkTextFill} from 'react-icons/bs';
import {IoClose} from 'react-icons/io5';
import {Upload} from 'antd';
import ButtonToolbar from "../../../common/button-toolbar";
import {isFileImage} from "../../../services/utils";

const MessageInputFile = ({
                              files = [],
                              onRemoveFile,
                              onAddFile,
                          }) => {
    const renderFile = (file) => {
        const isImage = isFileImage(file);
        if (isImage) {
            const imgUrl = URL.createObjectURL(file);

            return (
                <div key={file.uid} className={'flex relative'}>
                    <ButtonToolbar
                        extraClassName={'absolute right-0 top-0 -translate-y-1/3 translate-x-1/3'}
                        bgColor={'bg-white'}
                        onClick={() => {
                            URL.revokeObjectURL(imgUrl);
                            onRemoveFile(file);
                        }}
                        icon={<IoClose/>}
                    />
                    <img
                        src={imgUrl}
                        className={'object-contain aspect-square rounded-lg h-[48px]'}
                        alt={'image'}
                    />
                </div>
            );
        }

        return (
            <div key={file.uid} className={'flex relative rounded-lg pl-2 pr-4 bg-gray-200 max-w-[70%] h-12'}>
                <ButtonToolbar
                    extraClassName={'absolute right-0 top-0 -translate-y-1/3 translate-x-1/3'}
                    bgColor={'bg-white'}
                    onClick={() => onRemoveFile(file)}
                    icon={<IoClose/>}
                />
                <div className={'w-full flex gap-2 items-center'}>
                    <ButtonToolbar
                        icon={<BsFillFileEarmarkTextFill/>}
                        size={'default'}
                        bgColor={'!bg-white'}
                        extraClassName={'cursor-auto'}
                    />
                    <div className={'min-w-0 line-clamp-2'}>{file?.name}</div>
                </div>
            </div>
        );
    };

    return (
        <div className={`w-full overflow-hidden overflow-x-auto ${files.length > 0 ? 'px-4 pt-4' : ''}`}>
            {files.length > 0 && (
                <div className={'flex gap-3'}>
                    <Upload
                        showUploadList={false}
                        multiple={true}
                        beforeUpload={(file) => {
                            onAddFile(file);
                            return false;
                        }}
                    >
                        <div
                            className={
                                'h-[48px] rounded-lg bg-gray-200 aspect-square flex justify-center items-center cursor-pointer hover:bg-gray-300'
                            }
                        >
                            <BsFilePlus size={24}/>
                        </div>
                    </Upload>
                    {files.map(renderFile)}
                </div>
            )}
        </div>
    );
};

MessageInputFile.propTypes = {};

export default MessageInputFile;
