import React from 'react';
import propsType from 'prop-types';
import MessageBox from '../../components/MessageBox';
import { formatDate } from '../../utils/utils';

class RevisitLog extends React.Component {
  static propTypes = {
    dataSource: propsType.any.isRequired
  };

  static defaultProps = {
    dataSource: []
  };

  formatText(text) {
    const reg = /(进入|点了|取消|转发|复制|查看|咨询|保存|名片|产品列表|产品|聊天窗口|官网|电话|邮箱|地址|赞|加入|购买|提交|商城|购物车|商品|订单)/g;

    return text.replace(reg, ($0, $1) => {
      return `<span style="color:#4a8cf2">${$1}</span>`;
    });
  }

  handleMessageClick = (id, wxUserId) => {
    if (!id || !wxUserId) {
      return;
    }
    this.props.history.push(`/Customer/detail/${id}/${wxUserId}`);
  };

  render() {
    const { logs } = this.props;

    const renderLogs = logs.map((item, index) => {
      return (
        <MessageBox
          key={index}
          avatar={item.avatar}
          date={item.isShowTimer && formatDate(item.createdAt)}
          direction={item.direction}
          onClick={() => this.handleMessageClick(item.id, item.goalsId)}
        >
          {this.formatText(item.message)}
        </MessageBox>
      );
    });

    return <div>{renderLogs}</div>;
  }
}

export default RevisitLog;
