import { createAction } from 'redux-actions';
import { CALL_API } from '../utils/api';

export const createChatContacts = createAction('CREATE_CHAT_CONTACTS');
export const updateChatContacts = createAction('UPDATE_CHAT_CONTACTS');
export const createChatCommunication = createAction('CREATE_CHAT_COMMUNICATION');
export const updateChatCommunication = createAction('UPDATE_CHAT_COMMUNICATION');
export const appendChatCommunication = createAction('APPEND_CHAT_COMMUNICATION');
export const updateChatAllUnread = createAction('UPDATE_CHAT_ALL_UNREAD');
export const increaseChatAllUnread = createAction('INCREASE_CHAT_ALL_UNREAD');
export const decreaseChatAllUnread = createAction('DECREASE_CHAT_ALL_UNREAD');
export const fetchChatUserInfoAct = createAction('FETCH_CHAT_USER_INFO');
export const pushChatMsgAct = createAction('PUSH_CHAT_MSG');
export const setChatMsgReadAct = createAction('SET_CHAT_MSG_READ');
export const fetchImAccountAct = createAction('FETCH_IM_ACCOUNT');
export const fetchCustomerImAccountAct = createAction('FETCH_CUSTOMER_IM_ACCOUNT');
export const fetchUnreadNumAct = createAction('FETCH_UNREAD_NUM');
export const fetchHistoryMsgAct = createAction('FETCH_HISTORY_MSG');

export function fetchImAccount(params = {}) {
  return {
    [CALL_API]: {
      act: fetchImAccountAct,
      endpoint: 'im/1/user/info',
      domain: 'im',
      method: 'POST',
      params,
    },
  };
}

export function fetchCustomerImAccount(params = {}) {
  return {
    [CALL_API]: {
      act: fetchCustomerImAccountAct,
      endpoint: 'im/2/user/info',
      domain: 'im',
      method: 'POST',
      params,
    },
  };
}

export function fetchChatUserInfo(params = {}) {
  return {
    [CALL_API]: {
      act: fetchChatUserInfoAct,
      endpoint: 'im/user/info',
      domain: 'im',
      method: 'POST',
      params,
    },
  };
}

export function pushChatMsg(params = {}) {
  return {
    [CALL_API]: {
      act: pushChatMsgAct,
      endpoint: 'im/msg',
      domain: 'im',
      method: 'POST',
      params,
    },
  };
}

export function setChatMsgRead(params = {}) {
  return {
    [CALL_API]: {
      act: setChatMsgReadAct,
      endpoint: 'im/msg/status',
      domain: 'im',
      method: 'POST',
      params,
    },
  };
}

export function fetchUnreadNum(params = {}) {
  return {
    [CALL_API]: {
      act: fetchUnreadNumAct,
      endpoint: 'im/msg/unread',
      domain: 'im',
      method: 'POST',
      params,
    },
  };
}

// 获取历史记录
export function fetchHistoryMsg(params = {}) {
  return {
    [CALL_API]: {
      act: fetchHistoryMsgAct,
      endpoint: 'im/msg/history',
      domain: 'im',
      params,
    },
  };
}