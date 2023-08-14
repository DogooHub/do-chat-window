import React from 'react';
import {Tabs, theme} from "antd";
import ConversationList from "./conversation";
import AccountList from "./account";
import WorkGroup from "./group-work";
import "./style.scss"
const WindowChatContent = () => {

    const {token: {colorPrimary, colorTextLightSolid}} = theme.useToken();


    const items = [
        {
            key: "conversation",
            label: "Trò chuyện",
            children: <ConversationList/>,
        },
        {
            key: "work",
            label: "Công việc",
            children: <WorkGroup/>
        },
        {
            key: "account",
            label: <div className={"flex items-center gap-1"}>
                <span>Mọi người</span></div>,
            children: <AccountList/>
        },
    ]

    const mapTabItem = (item, props) => {
        const onClickTab = (e) => {
            props.onTabClick(item.key, e);
        }

        return <div
            key={item.key}
            onClick={onClickTab}
            style={{
                color: item.key !== props.activeKey ? "rgb(107 114 128)" : "inherit"
            }}
            className={"flex justify-center items-center w-full py-3 font-bold cursor-pointer"}
        >{item.label}</div>;
    }

    const renderTabBar = (props) => {
        return <div
            style={{
                backgroundColor: colorPrimary,
                color: colorTextLightSolid
            }}
            className={"flex items-center gap-2"}>
            {items.map(item => mapTabItem(item, props))}
        </div>
    }

    return (
        <div>
            <Tabs
                items={items}
                renderTabBar={renderTabBar}
            />
        </div>
    );
};

WindowChatContent.propTypes = {};

export default WindowChatContent;
