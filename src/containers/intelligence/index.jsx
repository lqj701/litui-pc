import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { getCustomerInformations } from '../../actions/customer';
import RevisitLog from '../Customer/RevisitLog';

const Wrapper = styled.div`
  width: 400px;
  overflow: hidden;
  overflow-y: auto;
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
  overflow-y: auto;
`;

export class index extends Component {
  static propTypes = {
    list: PropTypes.any,
    getCustomerInformations: PropTypes.any,
    customer: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentPage: 1
    };
  }

  getRef = node => {
    if (node) {
      this.scrollElem = node;
    }
  };

  handleScroll = event => {
    const scroller = event.target;
    const scrollTop = scroller.scrollTop;
    const scrollHeight = scroller.scrollHeight - this.scrollElem.offsetHeight;

    if (scrollHeight <= scrollTop) {
      this.pullDownFreshAction();
    }

    if (scrollTop <= 0) {
      this.prevScrollHeight = scroller.scrollHeight;
    }
  };

  pullDownFreshAction() {
    const { id, wx_user_id } = this.props.customer;
    const { currentPage } = this.state;
    const { hasNext } = this.props;

    if (!id && !wx_user_id) {
      return;
    }

    if (!hasNext) {
      return;
    }

    this.props.getCustomerInformations({
      wxUserId: wx_user_id,
      customer_wx_user_id: id,
      goalsType: 0,
      page: currentPage,
      row: 100
    });
  }

  filterRevisitLogs(data) {
    return data.map((value, key) => {
      return {
        createdAt: value.information.sent_at,
        revisitLog: value.information.revisit_log,
        avatar: value.avatar,
        message: value.message,
        direction: value.information.goals_type ? 'right' : 'left',
        isShowTimer: key ? false : true
      };
    });
  }

  componentDidMount() {
    // debug
    // const wx_user_id = 26;
    // const id = 77;

    const { id, wx_user_id } = this.props.customer;

    if (!id && !wx_user_id) {
      return;
    }

    this.props.getCustomerInformations({
      wxUserId: wx_user_id,
      customer_wx_user_id: id,
      goalsType: 0,
      page: 1,
      row: 100
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list != nextProps.list) {
      let logs = this.filterRevisitLogs(nextProps.list);

      var i = 0;
      for (i; i < logs.length; i++) {
        for (var j = i; j < logs.length - 1; j++) {
          const interval = Math.abs(logs[i].createdAt - logs[j + 1].createdAt);

          if (interval >= 60000) {
            logs[j + 1].isShowTimer = true;
          } else {
            i = j + 1;
            logs[j + 1].isShowTimer = false;
            continue;
          }
        }
      }

      const { data, currentPage } = this.state;

      if (currentPage === 1) {
        this.setState({ data: logs, currentPage: currentPage + 1 });
      } else {
        this.setState({
          data: [...data, ...logs],
          currentPage: currentPage + 1
        });
      }
    }
  }

  render() {
    return (
      <Wrapper>
        <Title>情报数据</Title>
        <List innerRef={this.getRef} onScroll={this.handleScroll}>
          <RevisitLog logs={this.state.data} />
        </List>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    list: state.customer.revisitLog.data,
    hasNext: state.customer.revisitLog.hasNext,
    customer: state.customer.customer
  };
};

const mapDispatchToProps = { getCustomerInformations };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(index)
);
