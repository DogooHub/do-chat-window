import React, {useEffect, useMemo, useState} from 'react';
import IMAvatar from "../../common/avatar";
import {Menu} from "antd";
import InfiniteScrollContainer from "../../common/infinite-scroll";
import {useChatWindowContext} from "../../index";
import {SessionType} from "open-im-sdk";
import {getAllAccounts, getUsersOnline} from "../../services/axios";
import {isScrollable} from "../../services/utils";

const pageSize = 10;
const AccountList = props => {
    const [accounts, setAccounts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const {onChangeStatus, onAddPopupMessage, axios} = useChatWindowContext();

    useEffect(() => {
        if (accounts.length > 0) {
            updateStatus(accounts);
            clearInterval(+sessionStorage.getItem('updateStatusInterval'));
            const updateStatusInterval = window.setInterval(() => {
                updateStatus(accounts);
            }, 1000 * 60);
            sessionStorage.setItem('updateStatusInterval', updateStatusInterval);
        }
    }, [accounts]);

    const updateStatus = (accounts) => {
        getUsersOnline(
            accounts.filter((item) => item.openImUserID).map((item) => item.openImUserID),
        ).then((res) => {
            const data = res.data.data || [];
            onChangeStatus(data);
        });
    };

    const loadAccounts = async (pageCount = page) => {
        const accountRes = await getAllAccounts(axios, null, pageCount, pageSize);
        await setPage((prevState) => prevState + 1);

        await setAccounts((prevState) => [...prevState, ...accountRes.items]);

        if (accountRes.lastPage === pageCount) {
            await setHasMore(false);
        } else {
            await loadToScrollable(pageCount + 1);
        }
    };

    const loadToScrollable = async (page) => {
        if (hasMore && !isScrollable('accountsScroll')) {
            await loadAccounts(page);
        }
    };

    const mapAccount = (item) => {
        return {
            key: item.openImUserID || item.accountId,
            label:
                <div className={"truncate"}>{item.fullname}</div>
            ,
            icon: (
                <IMAvatar
                    size={30}
                    user={{...item, userID: item.openImUserID}}
                    autoUpdateStatus={false}
                />
            ),
            disabled: !item.openImUserID,
            className: '!flex items-center !h-[50px] gap-2',
            onClick: () => {
                onAddPopupMessage({
                    groupID: "",
                    userID: item.openImUserID,
                    sessionType: SessionType.Single
                })
            },
        };
    };

    const items = useMemo(() => {
        return accounts.map(mapAccount)
    }, [accounts]);

    return (
        <InfiniteScrollContainer
            id={'accountsScroll'}
            hasMore={hasMore}
            fetchData={loadAccounts}
        >
            <Menu
                style={{
                    border: 'none',
                }}
                selectable={false}
                className={'menu--flex'}
                items={items}
            />
        </InfiniteScrollContainer>
    );
};

AccountList.propTypes = {};

export default AccountList;
