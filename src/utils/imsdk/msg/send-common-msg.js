import webim from '../webim';
import { getLoginInfo } from '../config';

const sessions = {};
const sessType = webim.SESSION_TYPE.C2C;
const isSend = true; // 是否为自己发送
const seq = -1; // 消息序列，-1表示sdk自动生成，用于去重
const subType = webim.C2C_MSG_SUB_TYPE.COMMON;
const loginInfo = getLoginInfo();

function sendMsg({ toId, random, msgTime, content }) {
  if (content.length < 1) return;

  if (!sessions[toId]) {
    sessions[toId] = new webim.Session(sessType, toId, toId, '', Math.round(new Date().getTime() / 1000));
  }

  const msg = new webim.Msg(sessions[toId], isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
  const textObj = new webim.Msg.Elem.Text(content);

  msg.addText(textObj);

  msg.PushInfo = {
    "PushFlag": 0,
    "Desc": '测试离线推送内容', //离线推送内容
    "Ext": '测试离线推送透传内容', //离线推送透传内容
    "AndroidInfo": {
      "Sound": "android.mp3" //离线推送声音文件路径。
    },
    "ApnsInfo": {
      "Sound": "apns.mp3", //离线推送声音文件路径。
      "BadgeMode": 1
    }
  };

  msg.PushInfoBoolean = true; //是否开启离线推送push同步
  msg.sending = 1;
  msg.originContent = content;

  webim.sendMsg(msg, function(resp) {
    //发送成功，把sending清理
    webim.Tool.setCookie("tmpmsg_" + toId, '', 0);
  }, function(err) {
  });
}

export default sendMsg;
