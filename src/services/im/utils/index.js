import {MessageType} from "open-im-sdk";
import {getMe, html2Text} from "../../utils";

const showName = (item, capitalize = true) => {
  return getMe().openImUserID === item.userID
    ? `${capitalize ? 'Bạn' : 'bạn'}`
    : item.nickname || item.userID;
};

export const renderContentConversation = (message, isMine) => {
  const obj = isMine ? 'Bạn' : message.senderNickname?.split(' ').pop() || message.sendID;
  switch (message.contentType) {
    case MessageType.PICTUREMESSAGE:
      return `${obj} đã gửi 1 ảnh.`;
    case MessageType.FILEMESSAGE:
      return `${obj} đã gửi một file đính kèm.`;
    case MessageType.REVOKEMESSAGE:
      return `${obj} đã thu hồi một tin nhắn.`;
    case MessageType.GROUPCREATED: {
      const content1 = JSON.parse(message.content);
      const contentDetail1 = JSON.parse(content1.jsonDetail);
      return `${showName(contentDetail1.opUser)} đã tạo nhóm này.`;
    }
    case MessageType.GROUPINFOUPDATED: {
      const content = JSON.parse(message.content);
      const contentDetail = JSON.parse(content.jsonDetail);
      const detail = contentDetail.group.groupName
        ? `đã đặt tên nhóm là ${contentDetail.group.groupName}`
        : 'đã thay đổi ảnh nhóm';
      return `${showName(contentDetail.opUser)} ${detail}.`;
    }
    case MessageType.MEMBERQUIT: {
      const content = JSON.parse(message.content);
      const contentDetail = JSON.parse(content.jsonDetail);
      return `${
        isMine
          ? 'Bạn'
          : contentDetail.quitUser.nickname || contentDetail.quitUser.userID
      } đã rời nhóm.`;
    }
    case MessageType.MEMBERKICKED: {
      const content = JSON.parse(message.content);
      const contentDetail = JSON.parse(content.jsonDetail);
      const userKicked = contentDetail.kickedUserList[0];
      const opUser = contentDetail.opUser;
      return `${isMine ? 'Bạn' : opUser.nickname || opUser.userID} đã xóa ${
        getMe().openImUserID === userKicked.userID
          ? 'bạn'
          : userKicked.nickname || userKicked.userID
      } khỏi nhóm.`;
    }
    case MessageType.GROUPOWNERTRANSFERRED: {
      const content = JSON.parse(message.content);
      const contentDetail = JSON.parse(content.jsonDetail);
      const newGroupOwner = contentDetail.newGroupOwner;
      const opUser = contentDetail.opUser;
      return `${isMine ? 'Bạn' : opUser.nickname || opUser.userID} đã chỉ định ${
        getMe().openImUserID === newGroupOwner.userID
          ? 'bạn'
          : newGroupOwner.nickname || newGroupOwner.userID
      } làm chủ nhóm.`;
    }
    case MessageType.MEMBERINVITED: {
      const content = JSON.parse(message.content);
      const contentDetail = JSON.parse(content.jsonDetail);
      const inviteUser = contentDetail.invitedUserList
        ?.map((item) => showName(item, false))
        .join(', ');

      return `${showName(contentDetail.opUser)} đã thêm ${inviteUser} vào nhóm.`;
    }
    default:
      return `${isMine ? 'Bạn: ' : ''} ${html2Text(message?.content || "")}`;
  }
};

export const MESSAGE_ORDER = {
  NONE: 'NONE',
  TOP: 'TOP',
  MIDDLE: 'MIDDLE',
  BOTTOM: 'BOTTOM',
};
export const MESSAGE_ORDER_BORDER = {
  TOP: 'rounded-bl',
  MIDDLE: 'rounded-l',
  BOTTOM: 'rounded-tl',
  TOP_MINE: 'rounded-br',
  MIDDLE_MINE: 'rounded-r',
  BOTTOM_MINE: 'rounded-tr',
};

export const isGroup = (msg1 = {}, msg2 = {}, durationMinutes = 15) => {
  if (
    msg1.msgFrom === 0 ||
    msg2.msgFrom === 0 ||
    msg1.contentType === 111 ||
    msg2.contentType === 111
  ) {
    return false;
  }

  if (msg1.sendID !== msg2.sendID) {
    return false;
  }

  const diffTime = Math.abs(msg2.sendTime - msg1.sendTime);
  return diffTime < 1000 * 60 * durationMinutes;
};

export const getOrderMessage = (prevItem, item, nextItem) => {
  const isGroupFirst = isGroup(prevItem, item);
  const isGroupLast = isGroup(item, nextItem);
  if (!isGroupFirst && isGroupLast) {
    return MESSAGE_ORDER.TOP;
  }

  if (isGroupFirst && isGroupLast) {
    return MESSAGE_ORDER.MIDDLE;
  }

  if (isGroupFirst && !isGroupLast) {
    return MESSAGE_ORDER.BOTTOM;
  }

  return MESSAGE_ORDER.NONE;
};

export const isMessageHere = (conversation, data) => {
  const {userID, groupID} = conversation;
  return (
    (groupID && groupID === data.groupID) ||
    (!data.groupID &&
      (userID === data.sendID || userID === data.recvID || userID === data.userID))
  );
};
