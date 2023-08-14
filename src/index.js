import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {FloatButton} from "antd";
import "./style.scss"
import "./ckeditor5.scss"
import WindowChatTitle from "./title";
import dayjs from "dayjs";
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import {TbMessage} from "react-icons/tb";
import WindowChatContent from "./content";
import WindowMessage from "./message";
import {CbEvents, SessionType} from "open-im-sdk";
import MinimumMessageList from "./minimum-message";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import WindowNewMessage from "./message/new";
import {imLogin, openIM} from "./services/im";
import {parse, pushNotification} from "./services/utils";
import {renderContentConversation} from "./services/im/utils";

dayjs.locale('vi');
dayjs.extend(relativeTime);
dayjs.extend(isToday);

const ChatWindowContext = createContext({});
export const useChatWindowContext = () => useContext(ChatWindowContext);
export const FROM = {
  WINDOW_CHAT: "WINDOW_CHAT",
  MINIMUM_POPUP_MESSAGE: "MINIMUM_POPUP_MESSAGE",
  NEW: "NEW_MESSAGE"
}

export const ChatWindow = ({BASE_PATH}) => {
  const [open, setOpen] = useState(true);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState({});
  const [popupMessages, setPopupMessages] = useState([]);
  const [minimumPopupMessages, setMinimumPopupMessages] = useState([]);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const breakpoint = useBreakpoint();
  const [popupCount, setPopupCount] = useState(1);
  const [deleteConversation, setDeleteConversation] = useState(null);

  useEffect(() => {
    const {xxl, xl} = breakpoint;

    if (xxl) {
      setPopupCount(3);
      return;
    }

    if (xl) {
      setPopupCount(2);
      return;
    }

    setPopupCount(1);
  }, [breakpoint]);

  useEffect(() => {
    if (popupMessages.length > popupCount) {
      const minimumList = popupMessages.slice(popupCount, popupMessages.length);

      minimumList.reverse().forEach(item => {
        onRemovePopupMessage(item);
        onAddMinimumPopupMessage(item);
      })
    }
  }, [popupCount]);

  useEffect(() => {
    if (connected) {
      openIM.getTotalUnreadMsgCount().then(res => {
        setTotalUnreadCount(+res.data || 0);
      })
      openIM.on(CbEvents.ONTOTALUNREADMESSAGECOUNTCHANGED, (res) => {
        setTotalUnreadCount(+res.data || 0);
      })
      openIM.on(CbEvents.ONCONVERSATIONCHANGED, onConversationChange)
    }

    return () => {
      if (connected) {
        openIM.off(CbEvents.ONTOTALUNREADMESSAGECOUNTCHANGED, res => {
          console.log({res})
        })
        openIM.off(CbEvents.ONCONVERSATIONCHANGED, res => {
          console.log('OFFCONVERSATIONCHANGED', {res})
        })
      }
    }
  }, [connected]);

  const onConversationChange = (res) => {
    const data = parse(res.data);
    setMinimumPopupMessages(prevStates => {

      let isChange = false;

      data.forEach(item => {
        const index = prevStates.findIndex(value => value.conversationID === item.conversationID);

        if (index !== -1) {
          prevStates[index] = item;
          isChange = true;

          const latestMsg = parse(item.latestMsg);
          pushNotification({
            tag: item.conversationID,
            content: `${latestMsg.senderNickname || latestMsg.sendID}: ${renderContentConversation(
              latestMsg,
              false,
            )}`,
          });
        }
      })

      if (isChange) {
        return [...prevStates];
      }

      return prevStates;
    })
  }

  const onChangeOpen = () => {
    setOpen(prevState => !prevState);
  }

  const onChangeStatus = (data) => {
    setStatus(prevStates => {
      const newStatus = data.reduce(
        (previousValue, currentValue) =>
          Object.assign(previousValue, {
            [currentValue.userID]: {
              status: currentValue.status,
              detailPlatformStatus: currentValue.detailPlatformStatus,
            },
          }),
        {},
      )

      return {...prevStates, ...newStatus};
    })
  }

  const onAddPopupMessage = async (conversation, from = FROM.WINDOW_CHAT) => {

    let data = {};

    switch (from) {
      case FROM.NEW: {
        data = {...conversation, conversationID: FROM.NEW, type: FROM.NEW};

        break;
      }
      case FROM.WINDOW_CHAT: {
        const {sessionType, groupID, userID} = conversation;

        const elem = document.getElementById(sessionType === SessionType.Single ? userID : groupID);

        if (elem) {
          elem?.click();
          return;
        }

        const conversationRes = await openIM.getOneConversation({
          sessionType,
          sourceID: sessionType === SessionType.Single ? userID : groupID
        })

        data = parse(conversationRes.data);
        break;
      }
      case FROM.MINIMUM_POPUP_MESSAGE: {
        data = conversation;
        break;
      }
    }

    await setPopupMessages(prevStates => {
      const index = prevStates.findIndex(item => item.conversationID === data.conversationID);

      if (index !== -1) {
        return prevStates;
      }

      if (prevStates.length === popupCount) {
        const lastPopupMessage = prevStates.pop()
        if (lastPopupMessage.conversationID !== FROM.NEW) {
          onAddMinimumPopupMessage(lastPopupMessage);
        }
      }

      return [data, ...prevStates];
    })

    onRemoveMinimumPopupMessage(data);
  }

  const onRemovePopupMessage = (popupMessage) => {
    setPopupMessages(prevStates => {
      const index =
        prevStates.findIndex(item =>
          item.conversationID === popupMessage.conversationID);

      if (index === -1) {
        return prevStates;
      }

      prevStates.splice(index, 1);

      return [...prevStates];
    })
  }

  const onAddMinimumPopupMessage = (popupMessage) => {
    setMinimumPopupMessages(prevStates => [popupMessage, ...prevStates])
  }

  const onRemoveMinimumPopupMessage = (minimumPopupMessage) => {
    setMinimumPopupMessages(prevStates => {
      const index =
        prevStates.findIndex(item =>
          item.conversationID === minimumPopupMessage.conversationID);

      if (index === -1) {
        return prevStates;
      }

      prevStates.splice(index, 1);

      return [...prevStates];
    })
  }

  useEffect(() => {
    imLogin().then(() => {
      setConnected(true);
    }).catch(err => {
      console.log({err});
    })
  }, []);

  const showWindow = useMemo(() => {
    return connected && open;
  }, [open, connected]);

  const mapPopupMessage = (item) => {
    if (item.type === FROM.NEW) {
      return <WindowNewMessage key={FROM.NEW} initUsers={item.initUsers}/>;
    }

    return <WindowMessage key={item.conversationID} conversation={item}/>;
  }

  const replaceNewMessage = (conversation) => {
    setPopupMessages(prevStates => {
      const index = prevStates.findIndex(item => item.conversationID === FROM.NEW);

      if (index === -1) {
        return prevStates;
      }

      prevStates.splice(index, 1, conversation);

      return [...prevStates];
    })
  }

  return (
    connected && <ChatWindowContext.Provider
      value={{
        status,
        onChangeStatus,
        onAddPopupMessage,
        onAddMinimumPopupMessage,
        onRemovePopupMessage,
        onRemoveMinimumPopupMessage,
        deleteConversation,
        setDeleteConversation,
        replaceNewMessage,
        BASE_PATH
      }}>

      <div className={"flex fixed right-24 bottom-16 gap-3"}>
        {popupMessages.map(mapPopupMessage)}
        <div
          className={"window-chat bg-white rounded-t-lg"}
          style={{display: !showWindow ? 'none' : ''}}
        >
          <WindowChatTitle hiddenWindow={onChangeOpen}/>
          <WindowChatContent/>
        </div>
      </div>
      <FloatButton.Group
        shape={"circle"}
        type={"default"}
        className={"bottom-20 w-12 flex flex-col gap-3"}
      >
        <MinimumMessageList minimumPopupMessages={minimumPopupMessages}/>
        <FloatButton
          icon={<TbMessage size={28}/>}
          onClick={onChangeOpen}
          className={"w-12 h-12"}
          badge={{
            count: totalUnreadCount,
            offset: [-2, 8]
          }}
        />
      </FloatButton.Group>
    </ChatWindowContext.Provider>
  );
};
