import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUsers } from '../../actions/user';
import styled from 'styled-components';
import { Table, Card } from 'antd';

const StyledCard = styled(Card)`
  margin-top: 20px !important;

  .ant-card-body {
    padding: 0 !important;
  }
`;
const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    font-size: 14px;
    color: white;
    background-color: #108ee9;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    &:last-child {
      border-right: none;
    }
    .ant-checkbox-inner {
      border-radius: 2px;
      background-color: #108ee9 !important;
      border-color: white !important;
    }
  }
`;

const columns = [
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '部门',
    dataIndex: 'deptName'
  },
  {
    title: '职务',
    dataIndex: 'position'
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (v, obj) => {
      if (obj.status === 0) {
        return obj.usable ? '正常' : '超出工号上限，不可使用';
      }

      return '删除';
    }
  }
];

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      pagination: { defaultPageSize: 15 },
      loading: false
    };

    this.handleTableChange = this.handleTableChange.bind(this);
    this.rowClassName = this.rowClassName.bind(this);
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers(params = {}) {
    this.setState({ loading: true });

    this.props
      .fetchUsers(Object.assign({ page: 1, row: 15 }, params))
      .then(() => {
        const pagination = { ...this.state.pagination };

        pagination.total = this.props.users.pageSize;

        this.setState({
          loading: false,
          data: this.props.users.list,
          pagination
        });
      });
  }

  handleTableChange(pagination) {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({ pagination: pager });

    this.fetchUsers({ page: pagination.current });
  }

  rowClassName(record) {
    if (record.status !== 0 || !record.usable) {
      return 'deleted-user';
    }
  }

  render() {
    const { loading, data, pagination } = this.state;

    return (
      <StyledCard>
        <StyledTable
          rowKey="id"
          dataSource={data}
          pagination={pagination}
          columns={columns}
          loading={loading}
          onChange={this.handleTableChange}
          rowClassName={this.rowClassName}
        />
      </StyledCard>
    );
  }
}

UserList.propTypes = {
  fetchUsers: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return { users: state.users };
}

export default connect(
  mapStateToProps,
  { fetchUsers },
  null,
  { withRef: true }
)(UserList);
