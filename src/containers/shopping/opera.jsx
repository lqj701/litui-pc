import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from '../../components/Router';

import { Card, Checkbox, Radio } from 'antd';
import { Form, Button } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import Upload from '../../components/Upload';
import SingleSpec from './SingleSpec';
import FormName from '../../components/Form/FormName';
import FormTable from './FormTable';

const Header = styled.h1`
  position: relative;
  display: flex;
  margin-bottom: 0;
  font-size: 20px;
`;

const Title = styled.span`
  padding-right: 60px;
`;

const StyledCard = styled(Card)`
  margin: 10px 0 15px 0 !important;
`;

const formItemLayout = {
  labelCol: {
    sm: { span: 2 }
  },
  wrapperCol: {
    sm: { span: 8, offset: 1 }
  }
};

const formImageLayout = {
  labelCol: {
    sm: { span: 2 }
  },
  wrapperCol: {
    sm: { span: 21, offset: 1 }
  }
};

const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      span: 16,
      offset: 3
    }
  }
};

export class PayCheckBox extends Component {
  static defaultProps = {
    isShow: false,
    canBuy: true
  };

  constructor(props) {
    super(props);

    this.state = {
      isShow: this.getisShowProps(props)
    };
  }

  getisShowProps(props) {
    if (props.isShow && props.canBuy) {
      return true;
    }

    return false;
  }

  handleCanBuyChange = () => {
    if (!this.props.openPay) {
      this.setState({ isShow: !this.state.isShow });
    }
  };

  render() {
    const { tailFormItemLayout, canBuy, getFieldDecorator } = this.props;
    return (
      <FormItem
        {...tailFormItemLayout}
        extra={
          <span
            style={{
              color: '#f00',
              visibility: this.state.isShow ? 'visible' : 'hidden'
            }}
          >
            您尚未进行支付配置，是否立即去<Link to="/shopping/setting/pay">
              商城设置-支付设置
            </Link>配置？
          </span>
        }
      >
        {getFieldDecorator('canBuy', {
          initialValue: canBuy,
          valuePropName: 'checked'
        })(
          <Checkbox onChange={this.handleCanBuyChange}>
            支持在商城内完成支付
          </Checkbox>
        )}
      </FormItem>
    );
  }
}

export class Opera extends Component {
  static propTypes = {
    history: PropTypes.object,
    type: PropTypes.string,
    data: PropTypes.object,
    form: PropTypes.object,
    onSubmit: PropTypes.func
  };

  static defaultProps = {
    data: {
      name: null,
      showImages: [],
      detailImages: [],
      price: null,
      onSale: false
    }
  };

  constructor(props) {
    super(props);
  }

  handleCancelClick = () => {
    this.props.history.goBack();
  };

  handleSaveClick = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { openPay } = this.props.shopConfig;
        const { canBuy } = values;

        if (!openPay) {
          if (canBuy) {
            return;
          }
        }

        const { data } = this.props;
        let formData;
        let list = [];

        const { multiSpecification, ecGoodsList } = values;

        if (multiSpecification) {
          // console.log('多规格');
          if (ecGoodsList) {
            list = this.filterFormTable(ecGoodsList);
          } else {
            list = this.filterFormTable(data.ecGoodsList);
          }
        } else {
          // console.log('单规格：');
          const newData = {
            price: parseFloat(values.price) * 100,
            value: values.value ? values.value : `默认`,
            remainNum: values.totalNum, // filterFormTable方法需要处理
            totalNum: values.totalNum
          };

          if (data.ecGoodsList) {
            // 数据中有规格列表
            list = [...data.ecGoodsList];
            list[0] = { ...list[0], ...newData };
            list = this.filterFormTable(list);
          } else {
            list.push(newData);
          }
        }

        // 图片处理
        const showImages = values.showImages.map(image => {
          return typeof image === 'string' ? image : image.url;
        });

        const detailImages = values.detailImages.map(image => {
          return typeof image === 'string' ? image : image.url;
        });

        // 合并数据
        formData = { ...values, showImages, detailImages, ecGoodsList: list };

        // console.error(formData);
        const { onSubmit } = this.props;
        onSubmit && onSubmit(formData);
      }
    });
  };

  filterFormTable(values) {
    return values.map(value => {
      if (value.type == 'new') {
        return {
          ecGoodsImage: value.ecGoodsImage,
          price: value.price,
          totalNum: value.remainNum,
          value: value.value
        };
      }

      return {
        ecGoodsId: value.ecGoodsId,
        ecGoodsImage: value.ecGoodsImage,
        price: value.price,
        value: value.value,
        totalNum: value.remainNum
      };
    });
  }

  render() {
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const { data, type } = this.props;

    const PayFormItem = () => {
      if (this.props.shopConfig) {
        let canBuy = true;
        let openPay = !this.props.shopConfig.openPay;

        if (data.canBuy) {
          canBuy = true;
        } else if (data.canBuy === false) {
          canBuy = false;
        } else {
          canBuy = true;
          if (type === 'editor') {
            openPay = false;
          }
        }

        return (
          <PayCheckBox
            canBuy={canBuy}
            isShow={openPay}
            openPay={this.props.shopConfig.openPay}
            tailFormItemLayout={tailFormItemLayout}
            getFieldDecorator={getFieldDecorator}
          />
        );
      }
    };

    return (
      <React.Fragment>
        <Header>
          <Title>{type === 'editor' ? '编辑' : '添加'}商品</Title>
          <span style={{ flex: '1 1 1e-09px' }} />
          <Button
            onClick={this.handleCancelClick}
            style={{ marginRight: '10px' }}
          >
            取消
          </Button>
          <Button type="primary" onClick={this.handleSaveClick}>
            保存
          </Button>
        </Header>
        <StyledCard title="基本信息" loading={!data}>
          <Form onSubmit={this.handleSubmit}>
            <FormName
              field="name"
              initialValue={data.name}
              getFieldDecorator={getFieldDecorator}
              {...formItemLayout}
            />

            <FormItem
              {...formImageLayout}
              label="商品图"
              extra="最多上传5张图片，单张最大支持3M，第一张将作为商品封面"
            >
              {getFieldDecorator('showImages', {
                initialValue: data.showImages,
                rules: [{ required: true, message: '至少需要一张商品图!' }]
              })(
                <Upload
                  cropper
                  token={this.props.token}
                  host={this.props.host}
                  bucket={this.props.bucket}
                />
              )}
            </FormItem>

            <FormItem
              {...formImageLayout}
              label="商品详情图"
              extra="最多上传25张图片，单张最大支持3M"
            >
              {getFieldDecorator('detailImages', {
                initialValue: data.detailImages
              })(
                <Upload
                  // multiple
                  token={this.props.token}
                  host={this.props.host}
                  bucket={this.props.bucket}
                  maxCount={25}
                />
              )}
            </FormItem>

            {PayFormItem()}
          </Form>
        </StyledCard>
        <StyledCard title="价格">
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="规格">
              {getFieldDecorator('multiSpecification', {
                initialValue: data.multiSpecification ? true : false
              })(
                <RadioGroup>
                  <Radio value={false}>单规格</Radio>
                  <Radio value={true}>多规格</Radio>
                </RadioGroup>
              )}
            </FormItem>

            {data.ecGoodsList ? (
              getFieldsValue(['multiSpecification']).multiSpecification ? (
                <FormItem>
                  {getFieldDecorator('ecGoodsList', {
                    initialValue: data.ecGoodsList
                  })(<FormTable {...this.props} />)}
                </FormItem>
              ) : (
                <SingleSpec
                  dataSource={data.ecGoodsList[0]}
                  formItemLayout={formItemLayout}
                  {...this.props}
                />
              )
            ) : getFieldsValue(['multiSpecification']).multiSpecification ? (
              <FormItem>
                {getFieldDecorator('ecGoodsList', {
                  initialValue: [
                    {
                      ecGoodsId: 2531796452358,
                      value: `默认`,
                      price: '',
                      totalNum: '',
                      type: 'new'
                    }
                  ]
                })(<FormTable {...this.props} />)}
              </FormItem>
            ) : (
              <SingleSpec
                dataSource={[]}
                formItemLayout={formItemLayout}
                {...this.props}
              />
            )}

            <FormItem {...formItemLayout} label="状态">
              {getFieldDecorator('onSale', { initialValue: data.onSale })(
                <RadioGroup>
                  <Radio value={false}>暂不上架(添加至未上架)</Radio>
                  <Radio value={true}>即时上架(添加已上架)</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Form>
        </StyledCard>
      </React.Fragment>
    );
  }
}

export default Form.create()(Opera);
