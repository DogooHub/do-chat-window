import React, {useMemo} from 'react';
import {Menu, Upload} from "antd";
import "./style.scss";
import {MdDelete} from "react-icons/md";
import ModalDeleteConversation from "../../../content/conversation/menu/delete";
import ModalContainer from "../../../common/modal-container";
import {HiPencil} from "react-icons/hi";
import {SessionType} from "open-im-sdk";
import {TiImage} from "react-icons/ti";
import FormGroupName from "./form-group-name";
import FormAddMember from "./form-member";
import {IoExitOutline} from "react-icons/io5";
import ModalExitGroup from "./modal-exit-group";
import {FaUserPlus} from "react-icons/fa";
import {uploadFile} from "../../../services/axios";
import {error_handle, openIM} from "../../../services/im";
import {BiSolidMessageRoundedDetail} from "react-icons/bi";

const BASE_URL_CHAT = process.env.REACT_APP_SERVICE_CHAT;
const inputURL = 'iframe/messages'

const WindowMessageHeaderMenu = ({conversation = {}}) => {


    const openDoIM = () => {
        const src = new URL(inputURL, BASE_URL_CHAT);

        src.searchParams.set("sessionType", conversation?.conversationType);
        src.searchParams.set("sourceID", conversation?.groupID || conversation.userID);

        window.open(src.href);
    }

    const items = useMemo(() => {

        const groupCustomize = conversation.conversationType === SessionType.Single
            ? []
            : [
                {
                    type: "divider"
                },
                {
                    key: 'customize-name',
                    label: (
                        <ModalContainer
                            title={'Đổi tên đoạn chat'}
                            container={'Đổi tên đoạn chat'}
                            formId={'form-group-name'}
                            modalProps={{footer: null}}
                        >
                            <FormGroupName conversation={conversation}/>
                        </ModalContainer>
                    ),
                    icon: <HiPencil size={24}/>
                },
                {
                    key: 'customize-image',
                    label: (
                        <Upload
                            name={'file'}
                            accept={'image/*'}
                            multiple={false}
                            className={'im--upload inline-block w-full'}
                            showUploadList={false}
                            customRequest={({file}) => {
                                uploadFile({file}).then(({data}) => {
                                    openIM.setGroupInfo({
                                        groupID: conversation.groupID,
                                        groupInfo: {
                                            faceURL: data.data.URL,
                                        },
                                    }).catch(error_handle);
                                });
                            }}
                        >
                            <div className={'w-full'}>Thay đổi ảnh</div>
                        </Upload>
                    ),
                    icon: <TiImage size={24}/>,
                },
            ];

        const groupMenu = conversation.conversationType === SessionType.Single
            ? []
            : [
                {
                    type: "divider"
                },
                {
                    key: 'add-member',
                    label: (
                        <ModalContainer
                            title={'Thêm thành viên'}
                            container={"Thêm người"}
                            modalProps={{
                                width: 'clamp(500px,30vw, 640px)',
                                style: {
                                    height: 700,
                                },
                                footer: null,
                            }}
                        >
                            <FormAddMember conversation={conversation}/>
                        </ModalContainer>
                    ),
                    icon: <FaUserPlus size={24}/>
                },
                {
                    key: 'exit-group',
                    label: <ModalExitGroup conversation={conversation}/>,
                    icon: <IoExitOutline size={24}/>
                },
            ]


        return [
            {
                key: "openDoIM",
                label: "Mở trong doIM",
                icon: <BiSolidMessageRoundedDetail size={24}/>,
                onClick: openDoIM
            },

            ...groupCustomize,
            ...groupMenu,
            {
                type: "divider"
            },
            {
                key: "delete",
                label: <ModalDeleteConversation conversation={conversation}/>,
                icon: <MdDelete size={24}/>
            },
        ];
    }, [conversation]);

    return (
        <Menu
            className={"!border-none max-h-80 min-w-[300px] overflow-auto rounded-2xl do-menu"}
            items={items}
            selectable={false}
        />
    );
};

WindowMessageHeaderMenu.propTypes = {};

export default WindowMessageHeaderMenu;
