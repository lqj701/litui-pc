import React from 'react';
import { Table, Input, Icon, Form, Modal, message } from 'antd';
import Upload from '../../components/Upload';
import { toMoney } from '../../utils/utils';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInitialValue(value) {
    if (this.props.price === 'price') {
      return value / 100;
    }

    return value;
  }

  renderFormItemType(form) {
    const { dataIndex, title, record } = this.props;

    const { getFieldDecorator } = form;
    switch (dataIndex) {
      case 'price':
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入 ${title}!`
                },
                {
                  pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,9}\.\d{0,2}$|^[1-9]\d{0,9}$/,
                  message: '请输入正确的价格'
                }
              ],
              initialValue: this.getInitialValue(record[dataIndex])
            })(<Input prefix={'¥'} maxLength="10" />)}
          </FormItem>
        );
      case 'ecGoodsImage':
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入 ${title}!`
                }
              ],
              initialValue: this.getInitialValue(record[dataIndex])
            })(
              <Upload
                cropper
                small
                maxCount={1}
                token={this.props.uploadconfig.token}
                host={this.props.uploadconfig.host}
                bucket={this.props.uploadconfig.bucket}
              />
            )}
          </FormItem>
        );
      case 'value':
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入 ${title}!`
                }
              ],
              initialValue: this.getInitialValue(record[dataIndex])
            })(<Input maxLength="20" />)}
          </FormItem>
        );
      case 'remainNum':
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入 ${title}!`
                },
                {
                  pattern: /^\d*$/,
                  message: '请输入正确的库存数'
                }
              ],
              initialValue: this.getInitialValue(record[dataIndex])
            })(<Input maxLength="6" />)}
          </FormItem>
        );
      default:
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入 ${title}!`
                }
              ],
              initialValue: this.getInitialValue(record[dataIndex])
            })(<Input />)}
          </FormItem>
        );
    }
  }

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {form => (
          <td {...restProps}>
            {editing ? this.renderFormItemType(form) : restProps.children}
          </td>
        )}
      </EditableContext.Consumer>
    );
  }
}

const getPropsValue = props => {
  if (props.value) {
    return props.value;
  }

  return [];
};

const getPropsValueLength = props => {
  if (props.value) {
    return props.value.length;
  }

  return 0;
};

const getPropsEditingKey = props => {
  if (props.value && props.value[0].type) {
    return props.value[0].ecGoodsId;
  }

  return '';
};

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: getPropsValue(props),
      count: getPropsValueLength(props),
      editingKey: getPropsEditingKey(props)
    };

    this.cacheEditableForm = undefined;

    this.columns = [
      {
        title: '商品规格图',
        dataIndex: 'ecGoodsImage',
        editable: true,
        width: '105px',
        render: text =>
          text && (
            <Upload
              small
              disabled
              showRemoveIcon={false}
              maxCount={1}
              value={text}
              token={this.props.token}
              host={this.props.host}
              bucket={this.props.bucket}
            />
          )
      },
      {
        title: '商品规格名',
        dataIndex: 'value',
        editable: true
      },
      {
        title: '商品单价',
        dataIndex: 'price',
        editable: true,
        width: '180px',
        render: text => text && toMoney(text)
      },
      {
        title: '商品库存',
        dataIndex: 'remainNum',
        width: '180px',
        editable: true
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);

          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => {
                      this.cacheEditableForm = {
                        form,
                        ecGoodsId: record.ecGoodsId,
                        editable
                      };
                      return (
                        <a
                          href="javascript:;"
                          onClick={() => this.save(form, record.ecGoodsId)}
                          style={{ marginRight: 8 }}
                        >
                          保存
                        </a>
                      );
                    }}
                  </EditableContext.Consumer>
                  <a onClick={() => this.cancel(record.ecGoodsId)}>取消</a>
                </span>
              ) : (
                <React.Fragment>
                  <a
                    onClick={() => this.edit(record.ecGoodsId)}
                    style={{ marginRight: 8 }}
                  >
                    编辑
                  </a>
                  {this.findDataIndex(record) > 0 && (
                    <a onClick={() => this.delete(record)}>删除</a>
                  )}
                </React.Fragment>
              )}
            </div>
          );
        }
      }
    ];
  }

  isEditing = record => {
    return record.ecGoodsId === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  findDataIndex(item) {
    let newData = [...this.state.data];
    return newData.indexOf(item);
  }

  delete(item) {
    const self = this;

    confirm({
      title: `删除提示`,
      content: '商品删除后有此商品规格的待付款订单都将取消，是否确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        self.deleteConfirm(item);
      }
    });
  }

  deleteConfirm(item) {
    let newData = [...this.state.data];
    let i = newData.indexOf(item);
    newData = [...newData.slice(0, i), ...newData.slice(i + 1)];
    this.setState({ data: newData, count: this.state.count - 1 });

    if (this.props.deleteProductGood && item.ecGoodsId < 1531450884005) {
      this.props.deleteProductGood({ ecGoodsIds: [item.ecGoodsId] });
      // 更新数据
    }

    const { onChange } = this.props;
    onChange && onChange(newData);
  }

  save(form, ecGoodsId) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      console.log('FormTable =>', row);

      this.cacheEditableForm = undefined;

      let ecGoodsImage = row.ecGoodsImage;
      if (typeof row.ecGoodsImage === 'object') {
        ecGoodsImage = row.ecGoodsImage[0].url;
      }

      const values = {
        ...row,
        // totalNum: row.remainNum,
        price: parseFloat(row.price) * 100,
        ecGoodsImage
      };

      const newData = [...this.state.data];
      const index = newData.findIndex(item => ecGoodsId === item.ecGoodsId);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...values
        });

        this.setState({ data: newData, editingKey: '' });
      }

      const { onChange } = this.props;
      onChange && onChange(newData);
    });
  }

  cancel = () => {
    this.cacheEditableForm = undefined;
    this.setState({ editingKey: '' });
  };

  handleAdd = () => {
    const { count, data } = this.state;

    if (count >= 30) {
      Modal.error({
        title: '已达到上限，不可继续增加'
      });

      return;
    }

    // console.error(this.cacheEditableForm);
    if (
      this.cacheEditableForm &&
      this.cacheEditableForm.editable &&
      this.cacheEditableForm.ecGoodsId
    ) {
      // this.save(this.cacheEditableForm.form, this.cacheEditableForm.ecGoodsId);
      message.error('您有未保存的商品规格，请先保存');
      return;
    }

    const key = +new Date();

    const newData = {
      key: key,
      ecGoodsId: key,
      price: '',
      totalNum: '',
      value: ``,
      ecGoodsImage: '',
      type: 'new'
    };
    this.setState({
      data: [...data, newData],
      count: count + 1
    });

    // 打开编辑状态
    this.edit(key);
  };

  componentWillReceiveProps(nexProps) {
    if (nexProps.value !== this.props.value) {
      this.setState({
        data: nexProps.value,
        count: nexProps.value.length
      });
    }
  }

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'remainNum' ? 'number' : 'text',
          price: col.dataIndex === 'price' ? 'price' : 'text',
          image: col.dataIndex === 'ecGoodsImage' ? 'image' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          uploadconfig: {
            host: this.props.host,
            token: this.props.token,
            bucket: this.props.bucket
          }
        })
      };
    });

    const Footer = () => (
      <div style={{ textAlign: 'center' }}>
        <a onClick={() => this.handleAdd()}>
          <Icon type="plus" />新增规格
        </a>
      </div>
    );

    return (
      <Table
        ref={element => (this._tablaRef = element)}
        rowKey="ecGoodsId"
        components={components}
        bordered
        dataSource={this.state.data}
        columns={columns}
        pagination={false}
        footer={Footer}
        style={{ marginBottom: 20 }}
      />
    );
  }
}
