import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, Select , Input, Button, message } from 'antd';
import { getActivity,getUserList,saveActivity } from '../../actions/wx-moments';

const FormItem = Form.Item;
const Option = Select.Option;

const StyledWrapper = styled.div`
  height: 80vh;
  padding: 20px;
  background: #fff;
`;

const StyledTitle = styled.h2`
  padding: 10px;
`;

class WxMoments extends Component{
    static propTypes = {
      form: PropTypes.object,
      getActivity: PropTypes.func,
      getUserList: PropTypes.func,
      saveActivity: PropTypes.func,
      userList: PropTypes.array,
      currentActivity: PropTypes.object,
    };

    static defaultProps = {
      userList: [],
      currentActivity: {}
    }

    state = {
      isSaving: false,
      isFormLoading: false,
      pages: [
        {id:0,name:'名片详情页',url: 'pages/people/card/index'},
        {id:1,name:'产品列表页',url: 'pages/people/product/index'},
        {id:2,name:'商品列表页',url: 'pages/people/product/index'},
        {id:3,name:'官网页',url: 'pages/people/website/index'}
      ],
      formData: []
    };

    componentDidMount(){
      this.setState({isFormLoading: true});
      this.props.getUserList({page: 1,row: 99999});
      if(this.props.match.params.id){
        const param = {
          distributorId:this.props.match.params.id,
          activityName:this.props.match.params.name
        };
        this.props.getActivity(param).then((res)=>{
          if(res.payload.code === 0){
            this.props.form.setFieldsValue({
              name: res.payload.data.activity_name,
              user: res.payload.data.name,
              page: res.payload.data.landing_page,
            });
          }
          this.setState({isFormLoading: false});
        });
      }else{
        this.setState({isFormLoading: false});
      }
    }

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (err){
          return;
        }else{
          this.setState({isSaving:true});
          const param = {
            distributorId: this.props.match.params.id || values.user.split('-')[0],
            oldName: this.props.match.params.name,
            newName: values.name ,
            landingPage: values.page
          };
          this.props.saveActivity(param).then(res=>{
            if(res.payload.code === 0){
              message.success('保存成功');
              window.location.href = `/wx/${AppConf.appId}/h5/wx-moments-list`;
            }else{
              message.error('保存失败');
            }
            this.setState({isSaving:false});
          });
        }
      });
    }

    render(){
      const { getFieldDecorator } = this.props.form;
      const {pages,isSaving} = this.state;
      const {userList,match} = this.props;

      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      };

      const config = [{ required: true, message: '输入内容不合法'}];

      return (
        <StyledWrapper>
          <StyledTitle>小程序路径</StyledTitle>
          <Form onSubmit={this.handleSubmit} style={{ maxWidth: "600px" }}>
            <FormItem {...formItemLayout} label="活动名称：">
              {getFieldDecorator('name',{
                rules:[{ required: true, message: '输入内容不合法', max: 30 }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="分发人：" required>
              {getFieldDecorator('user',{rules:config})(
                <Select placeholder="请选择用户" disabled={!!match.params.id}>
                  {userList.map(user=>(
                    <Option key={`${user.id}-${user.access_token}`}>{user.name}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="落地页：">
              {getFieldDecorator('page',{rules:config})(
                <Select placeholder="请选择落地页" disabled={!!match.params.id}>
                  {pages.map(page=>(
                    <Option key={page.name}>{page.name}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 4 },
              }}
            >
              <Button type="primary" htmlType="submit" loading={isSaving}>保存</Button>
            </FormItem>
          </Form>
        </StyledWrapper>
      );
    }
}

const mapStateToProps = state => {
  let {
    wxMoments: { userList,currentActivity }
  } = state;
  return {userList,currentActivity};
};

const mapDispatchToProps = { getActivity, getUserList, saveActivity };

const wrapperComponent = Form.create()(WxMoments);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(wrapperComponent);
