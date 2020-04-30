import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from '../../components/Router';
import { Table, Divider , message } from 'antd';
import { getActivityList } from '../../actions/wx-moments';

const { Column } = Table;

const StyledWrapper = styled.div`
  height: 80vh;
  padding: 20px;
  background: #fff;
`;

const StyledTitle = styled.h2`
`;

const pages = {
  '名片详情页': 'pages/people/card/index',
  '产品列表页': 'pages/people/product/index',
  '商品列表页': 'pages/people/product/index',
  '官网页': 'pages/people/website/index'}
;

class List extends Component{

  static propTypes = {
    match: PropTypes.object,
    getActivityList: PropTypes.func,
    activityList: PropTypes.array,
  }

  static defaultProps = {
    activityList: [],
  }

  state = {
    loading: true,
  };

  componentDidMount(){
    const param = {
      page: 1,
      row: 9999
    };
    this.props.getActivityList(param).then(()=>{
      this.setState({ loading: false,});
    });
  }

  handleCopy = (text,result) => {
    if(result){
      message.success('复制成功');
    }
  }

  render(){
    const {loading} = this.state;
    const {activityList} = this.props;

    const url = ({landing_page,access_token}) => {
      return `${pages[landing_page]}?salesToken=${access_token}&from=wx-moments`;
    };

    const action = (text, record) => {
      return (
        <span>
          <Link to={`/wx-moments-edit/${record.distributor_id}/${record.activity_name}`}>编辑</Link>
          <Divider type="vertical" />
          <CopyToClipboard text={url(record)} onCopy={this.handleCopy}>
            <a>复制链接</a>
          </CopyToClipboard>
        </span>
      );
    };

    return (
      <StyledWrapper>
        <StyledTitle>分发活动</StyledTitle>
        <Link style={{float: 'right',marginTop: '-40px',marginRight:'10px',padding: '4px 10px',border: '1px solid #1890ff',borderRadius: '4px'}} to={`/wx-moments-edit`}>新增</Link>
        <Table dataSource={activityList} rowKey={record => record.id} loading={loading}>
          <Column
            title="活动名"
            dataIndex="activity_name"
            key="activity_name"
          />
          <Column
            title="落地页"
            dataIndex="landing_page"
            key="landing_page"
          />
          <Column
            title="分发人"
            dataIndex="name"
            key="name"
          />
          <Column
            title="转发链接"
            dataIndex="url"
            key="url"
            render={action}
          />
        </Table>
      </StyledWrapper>
    );
  }
}

const mapStateToProps = state => {
  let {
    wxMoments: { activityList}
  } = state;
  activityList && activityList.forEach((v,i) => v.id = i);
  return { activityList };
};

const mapDispatchToProps = { getActivityList };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
