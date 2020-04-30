import webim from '../webim';

// 获取最新的c2c历史消息, 用于切换好友聊天，重新拉取好友的聊天消息
export const getLastC2CHistoryMsgs = ({ toId, lastMsgTime = 0, msgKey = '' }) => {
  const options = {
    Peer_Account: toId, // 好友帐号
    MaxCnt: 15, //拉取消息条数
    LastMsgTime: lastMsgTime, // 最近的消息时间，即从这个时间点向前拉取历史消息
    MsgKey: msgKey,
  };

  return new Promise((resolve) => {
    webim.getC2CHistoryMsgs(options, (resp) => {
      return resolve(resp);
    });
  });
};
