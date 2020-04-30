import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Table, Modal, Input, Icon, Card, message } from 'antd';
const confirm = Modal.confirm;
const Search = Input.Search;
import { Link } from '../../components/Router';

import { formatDate, toMoney } from '../../utils/utils';

const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 0 !important;
  }
`;

const Toolbar = styled.div`
  background: #fff;
  padding: 6px 24px;
  display: flex;
  align-items: center;
  height: 64px;
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

const StyledButton = styled(Button)`
  margin-left: 40px;
`;

export default class Index extends Component {
  static propTypes = {
    history: PropTypes.object,
    type: PropTypes.number,
    checkUnfinishedOrder: PropTypes.any,
    fetchProducts: PropTypes.any,
    searchProducts: PropTypes.any,
    saleProduct: PropTypes.any,
    deleteProduct: PropTypes.any
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedTotal: 0,
      downButtonDisabled: true,
      selectedRowKeys: [],
      loading: false
    };

    this.page = 1;
    this.row = 20;

    const { type } = props;
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          return (
            <React.Fragment>
              <img
                width="24"
                src={record.showImages[0]}
                style={{ marginRight: 10 }}
              />
              {text}
            </React.Fragment>
          );
        }
      },
      {
        title: '单价',
        dataIndex: 'minPrice',
        key: 'minPrice',
        render: text => toMoney(text)
      },
      {
        title: '库存',
        dataIndex: 'totalStock',
        key: 'totalStock'
      },
      {
        title: '总销量',
        dataIndex: 'totalSoldNum',
        key: 'totalSoldNum'
      },
      {
        title: `${type === 2 ? '售罄' : '创建'}时间`,
        dataIndex: `${type === 2 ? 'onSaleAt' : 'createAt'}`,
        key: `createAt`,
        render: text => formatDate(text)
      },
      {
        title: `${!type ? '下' : '上'}架时间`,
        dataIndex: 'onSaleAt',
        key: 'onSaleAt',
        render: text => formatDate(text)
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={`${this.props.match.url}/editor/${record.id}`}>编辑</Link>&nbsp;&nbsp;
            <a
              href="javascript:;"
              onClick={e => this.showConfirm(record.id, record.onSale)}
            >
              {record.onSale ? '下架' : '上架'}
            </a>
            {!record.onSale && (
              <a
                onClick={e => this.delete(record.id, record.onSale)}
                style={{ marginLeft: 8 }}
              >
                删除
              </a>
            )}
          </span>
        )
      }
    ];
  }

  // 删除接口
  checkUnfinishedOrder(id, status) {
    this.props.checkUnfinishedOrder({ productIds: id }).then(action => {
      if (action.payload.code === 0) {
        if (action.payload.data) {
          Modal.warning({
            title: '提示',
            content: '该商品存在未付款订单，暂时无法下架'
          });
        } else {
          this.updateSaleProduct([id], status);
        }
      }
    });
  }

  updateSaleProduct(ids, onSale) {
    this.props.saleProduct({ ids, onSale }).then(action => {
      const status = {
        0: '操作成功',
        500: '系统异常'
      };
      message.success(status[action.payload.code]);

      if (action.payload.code === 0) {
        this.setState({
          selectedRowKeys: [],
          loading: false
        });
        // 更新table 数据
        this.getProducts(this.page, this.row);
      } else {
        this.setState({
          loading: false
        });
      }
    });
  }

  deleteProduct(ids) {
    this.props.deleteProduct({ productIds: ids }).then(action => {
      const status = {
        0: '操作成功',
        500: '系统异常'
      };

      message.success(status[action.payload.code]);
      if (action.payload.code === 0) {
        this.getProducts(this.page, this.row);
      }
    });
  }

  getProducts(page, pageSize) {
    const { type, fetchProducts } = this.props;

    const params = {
      onSale: type ? true : false,
      page: page,
      row: pageSize
    };

    if (type === 2) {
      params.sellOut = true;
    }

    fetchProducts(params);
  }

  showConfirm = (id, status) => {
    const self = this;
    const text = status ? '下' : '上';

    const down = `商品${text}架后，有此商品的待付款订单都将直接关闭，确认${text}架吗？`;
    const up = ``;

    confirm({
      title: `确认要${text}架此商品吗？`,
      content: status ? down : up,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        self.updateSaleProduct([id], !status);
      }
    });
  };

  delete = (id, status) => {
    const self = this;

    confirm({
      title: `删除提示`,
      content: '删除商品后不可恢复，是否确认删除',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        self.deleteProduct([id]);
      }
    });
  };

  handleSaleClick = () => {
    const { type } = this.props;
    const { selectedRowKeys } = this.state;

    this.setState({ loading: true });
    this.updateSaleProduct(selectedRowKeys, type ? false : true);
  };

  handlePaginationChange = (page, pageSize) => {
    this.getProducts(page, pageSize);
  };

  handleSearch = value => {
    const { type } = this.props;

    const params = {
      name: value,
      page: this.page,
      row: this.row,
      onSale: type ? true : false
    };

    if (type === 2) {
      params.sellOut = true;
    }

    this.props.searchProducts(params);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const { type, data, pageSize } = this.props;

    const { loading, selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
      <StyledCard bordered={false}>
        <Toolbar>
          已选 {hasSelected ? selectedRowKeys.length : 0} 条商品
          <StyledButton
            disabled={!hasSelected}
            loading={loading}
            onClick={this.handleSaleClick}
          >
            <Icon type="enter" />
            {type ? '下' : '上'}架
          </StyledButton>
          <span style={{ flex: '1 1 1e-09px' }} />
          <Search
            placeholder="请输入商品名称进行查询"
            onSearch={this.handleSearch}
            style={{ width: 200 }}
          />
        </Toolbar>
        <StyledTable
          rowKey="id"
          rowSelection={rowSelection}
          columns={this.columns}
          dataSource={data}
          pagination={{
            total: pageSize,
            defaultPageSize: 20,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            onChange: this.handlePaginationChange
          }}
        />
      </StyledCard>
    );
  }
}
