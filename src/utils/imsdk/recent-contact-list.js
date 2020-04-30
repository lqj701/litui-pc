import webim from './webim';

export function getRecentContactList() {
  return new Promise((resolve) => {
    webim.getRecentContactList({ 'Count': 100 }, (resp) => {
      const items = resp.SessionItem ? resp.SessionItem.map((item) => ({
        toAccount: item.To_Account,
        toAccountAvatar: item.ToAccountAvatar,
        toAccountNick: item.ToAccountNick,
        lastMsg: item.MsgShow,
        lastMsgTime: item.MsgTimeStamp * 1000,
        unread: 0,
      })) : [];

      resolve(items);
    });
  });
}
