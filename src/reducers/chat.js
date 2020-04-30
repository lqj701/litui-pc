import { handleActions, handleAction } from 'redux-actions';
import { combineReducers } from 'redux';
import {
  createChatContacts,
  updateChatContacts,
  createChatCommunication,
  updateChatCommunication,
  appendChatCommunication,
  updateChatAllUnread,
  increaseChatAllUnread,
  decreaseChatAllUnread,
  fetchImAccountAct,
  fetchCustomerImAccountAct,
  fetchUnreadNumAct,
  fetchHistoryMsgAct
} from '../actions/chat';

const imAccount = handleAction(fetchImAccountAct, (state, action) => {
  return action.payload ? action.payload : state;
}, {});

const customerImAccounts = handleAction(fetchCustomerImAccountAct, (state, action) => {
  return action.payload ? Object.assign({}, state,  action.payload) : state;
}, {});

const contacts = handleActions({
  [createChatContacts] (state, action) {
    return action.payload ? action.payload : state;
  },
  [updateChatContacts] (state, action) {
    if (action.payload) {
      if (state) {
        let matched;
        const list = state.map((item) => {
          if (item.toAccount === action.payload.toAccount) {
            matched = true;
            const unread = action.payload.unread !== undefined ? action.payload.unread : item.unread + 1;
            return Object.assign({}, item, action.payload, { unread });
          } else {
            return item;
          }
        });

        if (!matched) {
          list.push(Object.assign(action.payload, { unread: 1 }));
        }

        return list;
      }

      return [Object.assign(action.payload, { unread: 1 })];
    }

    return state;
  },
}, []);

const communication = handleActions({
  [createChatCommunication] (state, action) {
    if (action.payload) {
      return Object.assign({}, state, { [action.payload.id]: action.payload.msgs });
    }

    return state;
  },
  [updateChatCommunication] (state, action) {
    if (action.payload && state[action.payload.id]) {
      const id = action.payload.id;
      return Object.assign({}, state, { [id]: [...state[id], action.payload.msg] });
    }

    return state;
  },
  [appendChatCommunication] (state, action) {
    const id = action.payload.id;
    return Object.assign({}, state, { [id]: [...action.payload.msgs, ...state[id]] });
  },
}, {});

const allUnread = handleActions({
  [updateChatAllUnread] (state, action) {
    return action.payload;
  },
  [increaseChatAllUnread] (state, action) {
    const increaseCount = action.payload || 1;
    return state + increaseCount;
  },
  [decreaseChatAllUnread] (state, action) {
    const decreaseCount = action.payload || 1;
    return state - decreaseCount;
  },
}, 0);

const unreadNum =handleActions({
  [fetchUnreadNumAct] (state, action) {
    return action.payload ? action.payload : state;
  }
}, {});

const history = handleActions({
  [fetchHistoryMsgAct] (state, action) {
    if(action.payload) {
      return {
        ...action.payload.data,
        currentRow: action.payload.data.msgList.length,
        isFetch: false,
      }
    }
    
    return state;
  }
}, {
  isFetch: true
});

export default combineReducers({
  imAccount,
  customerImAccounts,
  contacts,
  communication,
  allUnread,
  unreadNum,
  history
});

