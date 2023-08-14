import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Input, List, Spin} from 'antd';
import {debounce} from 'lodash/function';
import {IoSearch} from 'react-icons/io5';
import VirtualList from 'rc-virtual-list';
import {GrFormClose} from 'react-icons/gr';
import {CbEvents} from 'open-im-sdk';
import IMAvatar from "../../../common/avatar";
import {error_handle, openIM} from "../../../services/im";
import {getAllAccounts} from "../../../services/axios";
import {useChatWindowContext} from "../../../index";

const ContainerHeight = 400;
const pageSize = 20;
const FormAddMember = ({
                           conversation, onCloseModal = () => {
    }
                       }) => {
    const [search, setSearch] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState({list: false, submit: false});
    const {axios} = useChatWindowContext();
    const onClickAddMember = () => {
        setLoading((prevState) => ({list: prevState.list, submit: true}));
        openIM
            .inviteUserToGroup({
                groupID: conversation.groupID,
                reason: '',
                userIDList: selectedAccounts.map((item) => item.openImUserID),
            })
            .then((res) => {
                const data = JSON.parse(res.data)
                    .filter((item) => item.result === 0)
                    .map((item) => item.userID);

                openIM
                    .getGroupMembersInfo({groupID: conversation.groupID, userIDList: data})
                    .then((res) => {
                        openIM.emit(CbEvents.ONGROUPMEMBERADDED, res);
                    });
                onCloseModal();
            }).catch(error_handle).finally(() => {
            setLoading((prevState) => ({list: prevState.list, submit: false}));
        });
    };

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setAccounts([]);
        loadAccounts(search);
    }, [search]);

    function loadAccounts(searchValue) {
        setLoading((prevState) => ({list: true, submit: prevState.submit}));
        getAllAccounts(axios, "status eq 'approved'", page, pageSize, searchValue, null).then(
            (response) => {
                openIM
                    .getGroupMembersInfo({
                        groupID: conversation.groupID,
                        userIDList: response?.items.map((item) => item.openImUserID),
                    })
                    .then((res) => {
                        const data = JSON.parse(res.data).map((item) => item.userID);
                        setAccounts((prevState) => {
                            return [
                                ...prevState,
                                ...response?.items.filter(
                                    (item) =>
                                        item.openImUserID && !data.includes(item.openImUserID),
                                ),
                            ];
                        });
                        setLoading((prevState) => ({list: false, submit: prevState.submit}));
                    });

                setPage((prevState) => {
                    setHasMore(prevState < response?.lastPage);
                    return prevState + 1;
                });
            },
        );
    }

    const onScroll = (e) => {
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
            if (hasMore) {
                loadAccounts(search);
            }
        }
    };
    const onChangeSearch = debounce((e) => {
        const value = e.target.value;
        console.log({value, search});
        setSearch(value || '');
    }, 500);

    const onSelectAccount = (account) => {
        setSelectedAccounts((prevState) => {
            const index = selectedAccounts.findIndex(
                (selectedAccount) => account.id === selectedAccount.id,
            );
            if (index !== -1) {
                prevState.splice(index, 1);
                return [...prevState];
            }

            return [...prevState, account];
        });
    };

    const onRemoveAccount = (account) => {
        const index = selectedAccounts.findIndex(
            (selectedAccount) => account.id === selectedAccount.id,
        );
        if (index !== -1) {
            setSelectedAccounts((prevState) => {
                prevState.splice(index, 1);
                return [...prevState];
            });
        }
    };

    return (
        <div className={'px-4 pb-2'}>
            <div className={'flex flex-col'}>
                <Input
                    size={'large'}
                    rootClassName={'text-base'}
                    prefix={<IoSearch color={'grey'} size={20}/>}
                    placeholder={'Tìm kiếm'}
                    onChange={onChangeSearch}
                />
                <div className={'h-32 pt-6 flex overflow-x-auto gap-2 flex-grow-0'}>
                    {selectedAccounts.length === 0 ? (
                        <div
                            className={
                                'w-full h-full flex justify-center items-center text-xs text-gray-500'
                            }
                        >
                            Chưa chọn người dùng nào
                        </div>
                    ) : (
                        selectedAccounts.map((item) => (
                            <div
                                key={item.id}
                                className={'flex flex-col items-center !w-[78px] flex-shrink-0'}
                            >
                                <div className={'relative'}>
                                    <IMAvatar
                                        user={{faceURL: item.portraitPreview}}
                                        className={'cursor-default'}
                                    />
                                    <div
                                        onClick={() => {
                                            onRemoveAccount(item);
                                        }}
                                        className={
                                            'absolute top-0 right-0 w-[18px] h-[18px] flex justify-center items-center aspect-square bg-white rounded-xl border-solid border-gray-300 border-[1px] shadow-md cursor-pointer'
                                        }
                                    >
                                        <GrFormClose size={18}/>
                                    </div>
                                </div>
                                <span className={'text-xs text-line-2 text-center overflow-hidden'}>
                                    {item.fullname}
                                </span>
                            </div>
                        ))
                    )}
                </div>
                <List
                >
                    <Spin spinning={loading.list}>
                        <VirtualList
                            height={400}
                            data={accounts}
                            itemHeight={47}
                            itemKey='account'
                            className={'virtual-list'}
                            onScroll={onScroll}
                        >
                            {(item) => (
                                <List.Item
                                    key={item.id}
                                    className={'cursor-pointer'}
                                    onClick={() => {
                                        onSelectAccount(item);
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <IMAvatar
                                                className={'cursor-auto'}
                                                user={{
                                                    faceURL: item.portraitPreview,
                                                    // userID: item.openImUserID,
                                                }}
                                                // badgeProps={{
                                                //     offset: [-10, 40],
                                                // }}
                                            />
                                        }
                                        title={item.fullname}
                                        description={item.email}
                                    />
                                    <div>
                                        <Checkbox
                                            className={'checkbox-large'}
                                            checked={
                                                selectedAccounts.findIndex(
                                                    (account) => item.id === account.id,
                                                ) !== -1
                                            }
                                        />
                                    </div>
                                </List.Item>
                            )}
                        </VirtualList>
                    </Spin>
                </List>
                <Button
                    block
                    size={'large'}
                    type={'primary'}
                    disabled={selectedAccounts.length === 0}
                    className={'font-bold text-base mt-2'}
                    onClick={onClickAddMember}
                    loading={loading.submit}
                >
                    Thêm thành viên
                </Button>
            </div>
        </div>
    );
};

FormAddMember.propTypes = {};

export default FormAddMember;
