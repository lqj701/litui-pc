import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Send from './Send';
import Message from './Message';
import Profile from './Profile';
import Toolbar from './toolbar';
import find from 'lodash/find';
import { msgDateStr } from '../../utils/utils';

import {
  createChatCommunication,
  updateChatCommunication,
  appendChatCommunication,
  decreaseChatAllUnread,
  updateChatContacts,
  pushChatMsg,
  setChatMsgRead
} from '../../actions/chat';

import imsdk from '../../utils/imsdk';
import webim from '../../utils/imsdk/webim';

const Wrapper = styled.div`
  position: relative;
  width: 540px;
  border-left: 1px solid rgba(0, 0, 0, 0.09);
  border-right: 1px solid rgba(0, 0, 0, 0.09);
`;

const List = styled.div`
  height: 350px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  padding: 5px 24px;
  overflow-y: auto;
`;

class InstantMessag extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    contact: PropTypes.object,
    imAccount: PropTypes.object,
    customerDetail: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      scroll: null,
      lastMsgTime: 0,
      msgKey: '',
      moreMsgs: true,
      msgCount: 0,
      msgs: [],
      prevScrollHeight: 0
    };

    // todo, comoponentDidUpdate 第一次时加载
    this.initLoad = true;

    // 4分钟换取token
    // setInterval(()=>{
    //   console.error(1223455544333);
    //   window.AppConf.api.accessToken=1
    // }, 1000 * 1);
  }

  handleMsgs(msgs) {
    const { contact, imAccount, toAccount } = this.props;
    // const { id } = this.props.match.params;
    // const id = 'ccs_1_oQprx5HCQc4eJ5vjmZwHUS9OsFQ0';
    const id = toAccount;

    return msgs.map(item => {
      let avatar;
      let direction;
      let name;

      if (item.fromAccount === id) {
        avatar = contact.toAccountAvatar;
        direction = 'left';
        name = contact.toAccountNick;
      } else {
        avatar = imAccount.face_url;
        direction = 'right';
        name = imAccount.nike_name;
      }

      return {
        dataSource: 'history',
        random: item.random,
        message: item.elems[0].content.text,
        lastTime: item.time * 1000,
        avator: avatar,
        direction,
        name,
        wx_user_id: imAccount.account_id,
        customer_id: id
      };
    });
  }

  fetchHistoryMsgs() {
    // const toId = this.props.match.params.id;
    // const toId = 'ccs_1_oQprx5HCQc4eJ5vjmZwHUS9OsFQ0';
    const { lastMsgTime, msgKey } = this.state;
    const { toAccount } = this.props;

    return imsdk
      .getLastC2CHistoryMsgs({ toId: toAccount, lastMsgTime, msgKey })
      .then(resp => {
        this.setState({
          lastMsgTime: resp.LastMsgTime,
          msgKey: resp.MsgKey,
          moreMsgs: resp.Complete === 0
        });

        return this.handleMsgs(resp.MsgList);
      });
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    // const id = 'ccs_1_oQprx5HCQc4eJ5vjmZwHUS9OsFQ0';
    const { toAccount } = this.props;

    this.fetchHistoryMsgs().then(msgs => {
      this.props.createChatCommunication({ id: toAccount, msgs });
    });
    
  }

  componentWillReceiveProps(nextProps) {
    this.setMsgRead(nextProps);

    if (nextProps.msgs) {
      this.handleTimeFormat(nextProps.msgs, 15);
    }
  }

  componentDidUpdate() {
    if(this.initLoad && this.props.msgs.length) {
      this.onScroll();
      this.initLoad = false;
    }
    
    const { scrollTop, scrollHeight } = this.scrollElem;
    if (scrollTop <= 0) {
      this.scrollElem.scrollTop = scrollHeight - this.prevScrollHeight;
    } else {
      this.scrollElem.scrollTop = scrollHeight;
    }
  }

  setMsgRead(props) {
    const { msgs } = props;
    if (!msgs.length) return; // 没有消息时不需要上报

    const lastMsg = msgs[msgs.length - 1];
    const lastMsgRandom = lastMsg.random;
    if (this.lastMsgRandom === lastMsgRandom) return; // 最后一条消息与之前的消息一样时不需要上报
    this.lastMsgRandom = lastMsgRandom;

    // 有新消息后需要 refresh scroll 并滚动到最后一条消息

    const { contact } = props;
    if (contact.unread === 0) return; // 未读消息为 0 时不需要上报

    const { id } = props.match.params;
    this.props.updateChatContacts({ toAccount: id, unread: 0 }); // 更新 contact 未读数
    this.props.decreaseChatAllUnread(contact.unread); // 更新消息总未读数
    const msgSess = webim.MsgStore.sessByTypeId(webim.SESSION_TYPE.C2C, id);
    webim.setAutoRead(msgSess, true, true); // 上报给腾讯 IM
    this.props.setChatMsgRead({ msgSeq: lastMsgRandom }); // 上报给我们自己
  }

  handleTimeFormat(msgs, num) {
    const { msgCount } = this.state;
    const TIMERANGE = 1000 * 60;

    const len = msgs.length;
    const sendDatas = [];

    if (len > 0) {
      for (let i = len - 1; i >= 0; i--) {
        const currentItem = msgs[i];
        if (currentItem.dataSource === 'send') {
          sendDatas.unshift(currentItem);
        } else {
          break;
        }
      }
    }

    // 新发送的消息
    const sendLen = sendDatas.length;
    let sendCount = 0;
    if (sendLen > 0) {
      for (let i = 0; i < sendLen; i++) {
        const currentSendItem = sendDatas[i];

        if (sendLen === 1) {
          // 发送的消息个数只有一条
          currentSendItem._hideTime = false;
          currentSendItem._formatTime = msgDateStr(currentSendItem.lastTime);
          break;
        }

        // 最先发送的第一条消息
        if (i === 0) {
          const nextItem = sendDatas[i + 1];

          if (
            nextItem.lastTime - currentSendItem.lastTime < TIMERANGE &&
            sendCount < num
          ) {
            sendCount += 1;
          } else {
            sendCount = 1;
          }
          currentSendItem._hideTime = false;
        } else {
          const prevItem = sendDatas[i - 1];

          if (
            currentSendItem.lastTime - prevItem.lastTime < TIMERANGE &&
            sendCount < num
          ) {
            sendCount += 1;
            currentSendItem._hideTime = true;
          } else {
            sendCount = 1;
            currentSendItem._hideTime = false;
          }
        }

        currentSendItem._formatTime = msgDateStr(currentSendItem.lastTime);
      }
    }

    // 历史消息
    let count = msgCount;
    if (len - sendLen > 0) {
      for (let i = len - sendLen - 1; i >= 0; i--) {
        const currentItem = msgs[i];

        if (i === 0) {
          if (len === 1) {
            count = 0;
            currentItem._hideTime = false;
            currentItem._formatTime = msgDateStr(currentItem.lastTime);
            break;
          }

          const nextItem = msgs[i + 1];
          if (
            nextItem.lastTime - currentItem.lastTime < TIMERANGE &&
            count < num
          ) {
            count += 1;
          } else {
            count = 0;
          }

          currentItem._hideTime = false;
          currentItem._formatTime = msgDateStr(currentItem.lastTime);
          break;
        } else {
          const prevItem = msgs[i - 1];

          if (
            currentItem.lastTime - prevItem.lastTime < TIMERANGE &&
            count < num
          ) {
            currentItem._hideTime = true;
            count += 1;
          } else {
            currentItem._hideTime = false;
            count = 0;
          }
          currentItem._formatTime = msgDateStr(currentItem.lastTime);
        }
      }
    }

    this.setState({ msgs, msgCount: count });
  }

  handleSendChange = content => {
    this.sendMessage(content);
  };

  onScroll() {
    const { scrollHeight } = this.scrollElem;
    this.scrollElem.scrollTop = scrollHeight;
  }

  handleScroll = event => {
    const scroller = event.target;
    const scrollTop = scroller.scrollTop;
    const scrollHeight = scroller.scrollHeight - this.scrollElem.offsetHeight;
    
    // console.error(
    //   scrollHeight,
    //   scrollTop,
    //   scroller.scrollHeight,
    //   this.scrollElem.offsetHeight
    // );

    if (scrollTop <= 0) {
      this.prevScrollHeight = scroller.scrollHeight;
      this.pullDownFreshAction();
    }
  };

  getRef = node => {
    if (node) {
      this.scrollElem = node;
    }
  };

  sendMessage(content) {
    if (!content) return;

    // const { id } = this.props.match.params;
    const id = this.props.toAccount;

    const { imAccount, contact, customerDetail } = this.props;
    const random = Math.round(Math.random() * 4294967296);
    const msgTime = Math.round(new Date().getTime() / 1000);

    const msg = {
      random,
      name: '',
      avator: imAccount.face_url,
      message: content,
      direction: 'right',
      lastTime: msgTime * 1000,
      dataSource: 'send',
      wx_user_id: imAccount.account_id,
      customer_id: id
    };

    imsdk.sendCommonMsg({ toId: id, random, msgTime, content });
    this.props.updateChatCommunication({ id, msg });

    const contactOpts = {
      toAccount: id,
      unread: 0,
      lastMsg: content,
      lastMsgTime: msg.lastTime
    };

    if (!contact) {
      contactOpts.toAccountAvatar = customerDetail.avatar_url;
      contactOpts.toAccountNick = customerDetail.nickname;
    }

    this.props.updateChatContacts(contactOpts);

   
    this.props.pushChatMsg({
      from_account_id: imAccount.account_id,
      to_account_id: id,
      msg_seq: random,
      msg_send: msg.lastTime,
      content
    });
  }

  pullDownFreshAction() {
    // const id = this.props.match.params.id;
    const { toAccount } = this.props;

    return this.fetchHistoryMsgs().then(msgs => {
      this.props.appendChatCommunication({ id: toAccount, msgs });
    });
  }

  handleSwitchHistory = () => {
    const { onSwitchHistory } = this.props;
    onSwitchHistory && onSwitchHistory();
  };

  render() {
    const { msgs } = this.state;

    return (
      <Wrapper>
        <Profile />
        <List innerRef={this.getRef} onScroll={this.handleScroll}>
          {msgs.map(item => {
            return (
              <Message
                key={item.random}
                avatar={item.avator}
                date={item._formatTime}
                direction={item.direction}
                hideTime={item._hideTime}
              >
                {item.message}
              </Message>
            );
          })}
        </List>

        {/* <Toolbar onChatClick={this.handleSwitchHistory} /> */}

        <Send onValueChange={this.handleSendChange} />
      </Wrapper>
    );
  }
}

function mapStateToProps(state) {
  // const id = 'ccs_1_oQprx5HCQc4eJ5vjmZwHUS9OsFQ0';
  const { imAccount } = state.chat;
  const toAccount = `ccs_${window.AppConf.orgId}_${state.customer.customer.openid}`;

  return {
    msgs: state.chat.communication[toAccount] || [],
    contact: find(state.chat.contacts, { toAccount }),
    imAccount: imAccount['data'] ? imAccount.data.imAccount : {},
    toAccount: toAccount,
    customerDetail: state.customer.customer
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      createChatCommunication,
      updateChatCommunication,
      appendChatCommunication,
      decreaseChatAllUnread,
      updateChatContacts,
      pushChatMsg,
      setChatMsgRead
    }
  )(InstantMessag)
);
