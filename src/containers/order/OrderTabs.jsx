import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

export default class OrderTabs extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = { activeKey: props.activeKey };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      activeKey: nextProps.activeKey
    });
  }

  handleChange = index => {
    this.setState({
      activeKey: index
    });

    const { onChange } = this.props;
    onChange && onChange(index);
  };

  render() {
    const { activeKey } = this.state;

    return (
      <Tabs type="card" activeKey={activeKey} onChange={this.handleChange}>
        <TabPane tab="全部" key={-1} />
        <TabPane tab="待付款" key={0} />
        <TabPane tab="待发货" key={1} />
        <TabPane tab="已发货" key={2} />
        <TabPane tab="已关闭" key={3} />
      </Tabs>
    );
  }
}
