import React from 'react';
import { connect } from 'react-redux';

import List from './List';

class ChatPage extends React.Component {
  static defaultProps = {
    list: []
  };

  componentDidMount() {
    document.title = '消息';
  }

  render() {
    const { list } = this.props;
    return <List dataSource={list} />;
  }
}

function sortToTime(list) {
  return list && list.length > 0
    ? list.sort((a, b) => a.lastMsgTime < b.lastMsgTime)
    : [];
}

function mapStateToProps(state) {
  const {
    chat: { contacts }
  } = state;

  return { list: sortToTime(contacts) };
}
export default connect(mapStateToProps)(ChatPage);
