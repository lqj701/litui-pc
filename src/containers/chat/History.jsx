import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchHistoryMsg } from '../../actions/chat';
import styled from 'styled-components';
import Message from './Message';
import { msgDateStr } from '../../utils/utils';

const Wrapper = styled.div`
  position: relative;
  width: 500px;
  overflow: hidden;
`;

const Title = styled.div`
  background: #f7f7f7;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  padding: 12px 24px;
`;

const List = styled.div`
  height: calc(100% - 48px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  padding: 5px 24px;
  overflow-y: auto;
`;

export class History extends Component {
  static propTypes = {
    msgs: PropTypes.any,
    startLeft: PropTypes.any,
    startRight: PropTypes.any,
    imAccount: PropTypes.any,
    toAccount: PropTypes.any,
    fetchHistoryMsg: PropTypes.func
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

    this.initLoad = true;
  }

  componentDidMount() {
    this.pullDownFreshAction();
  }

  componentWillReceiveProps(nextProps) {
    if ('msgs' in nextProps) {
      this.handleTimeFormat(nextProps.msgs, 15);
    }
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
          currentSendItem._formatTime = msgDateStr(currentSendItem.msg_send_at);
          break;
        }

        // 最先发送的第一条消息
        if (i === 0) {
          const nextItem = sendDatas[i + 1];

          if (
            nextItem.msg_send_at - currentSendItem.msg_send_at < TIMERANGE &&
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
            currentSendItem.msg_send_at - prevItem.msg_send_at < TIMERANGE &&
            sendCount < num
          ) {
            sendCount += 1;
            currentSendItem._hideTime = true;
          } else {
            sendCount = 1;
            currentSendItem._hideTime = false;
          }
        }

        currentSendItem._formatTime = msgDateStr(currentSendItem.msg_send_at);
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
            currentItem._formatTime = msgDateStr(currentItem.msg_send_at);
            break;
          }

          const nextItem = msgs[i + 1];
          if (
            nextItem.msg_send_at - currentItem.msg_send_at < TIMERANGE &&
            count < num
          ) {
            count += 1;
          } else {
            count = 0;
          }

          currentItem._hideTime = false;
          currentItem._formatTime = msgDateStr(currentItem.msg_send_at);
          break;
        } else {
          const prevItem = msgs[i - 1];

          if (
            currentItem.msg_send_at - prevItem.msg_send_at < TIMERANGE &&
            count < num
          ) {
            currentItem._hideTime = true;
            count += 1;
          } else {
            currentItem._hideTime = false;
            count = 0;
          }
          currentItem._formatTime = msgDateStr(currentItem.msg_send_at);
        }
      }
    }

    this.setState({ msgs: [...this.state.msgs, ...msgs], msgCount: count });
  }

  onScroll() {
    const { scrollHeight } = this.scrollElem;
    this.scrollElem.scrollTop = scrollHeight;
  }

  handleScroll = event => {
    const scroller = event.target;
    const scrollTop = scroller.scrollTop;
    const scrollHeight = scroller.scrollHeight - this.scrollElem.offsetHeight;

    if (scrollHeight <= scrollTop) {
      this.pullDownFreshAction();
    }

    // if (scrollTop <= 0) {
    //   this.prevScrollHeight = scroller.scrollHeight;
    //   this.pullDownFreshAction();
    // }
  };

  getRef = node => {
    if (node) {
      this.scrollElem = node;
    }
  };

  pullDownFreshAction() {
    const { startLeft, startRight, imAccount, toAccount, history } = this.props;

    if (history.currentRow === 0) {
      return;
    }

    this.props.fetchHistoryMsg({
      leftAccountId: imAccount.account_id,
      rightAccountId: toAccount,
      startLeft: startLeft,
      startRight: startRight,
      row: 10
    });
  }

  render() {
    const { msgs } = this.state;

    return (
      <Wrapper>
        <Title>历史聊天记录</Title>
        <List innerRef={this.getRef} onScroll={this.handleScroll}>
          {msgs.map(item => {
            return (
              <Message
                key={Math.random()}
                avatar={item.avatar}
                date={item._formatTime}
                direction={item.position === 'r' ? 'right' : 'left'}
                hideTime={item._hideTime}
              >
                {item.msg}
              </Message>
            );
          })}
        </List>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  let msgs = [];
  let startLeft = 0;
  let startRight = 0;

  if ('msgList' in state.chat.history) {
    msgs = state.chat.history.msgList;
  }

  if ('startLeft' in state.chat.history) {
    startLeft = state.chat.history.startLeft;
  }

  if ('startRight' in state.chat.history) {
    startRight = state.chat.history.startRight;
  }

  const toAccount = `ccs_${window.AppConf.orgId}_${
    state.customer.customer.openid
  }`;
  const { imAccount } = state.chat;

  return {
    msgs: msgs,
    startLeft: startLeft,
    startRight: startRight,
    history: state.chat.history,
    imAccount: imAccount['data'] ? imAccount.data.imAccount : {},
    toAccount: toAccount
  };
};

const mapDispatchToProps = {
  fetchHistoryMsg
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(History);
