import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, Checkbox, Row, Col, message, Card, Modal } from 'antd';
const FormItem = Form.Item;

import service from '../utils/service';

class ModifyLoginPwd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      data: props.data,
      confirmLoading: props.confirmLoading
    }
  }

  handleLoginOk = (e) => {
    this.handleLoginSubmit(e);
  }
  handleLoginCancel = (e) => {
    this.setState({
      visible: false
    });
    this.props.callHandleLogin({
      Loginvisible: false
    });
  }
  handleLoginSubmit = (e) => {
    let access_token = localStorage.getItem('access_token');
    e.preventDefault();
    this.setState({
      confirmLoading: true
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        delete values.RePwd;
        // this.props.dispatch({
        //   type: 'account/changepwd',
        //   payload: values
        // });

        service.changepwd(values).then((res) => {
          if (res.code == '0') {
            message.success('修改成功');
            setTimeout(() => {
              window.loginOut && window.loginOut();
            }, 500);
          }
          else {
            message.error(res.message);
          }
        });

        this.props.form.resetFields();
      } else {
        this.setState({
          confirmLoading: false
        });
        return false;
      }
    });
  };
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('2次输入的密码不一致!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    var regBool = /^(?=.*[^\d])(.{6,20})$/.test(value);
    if (value && !regBool) {
      callback('请输入6-20位密码，不能为纯数字!');
    } else {
      callback();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      confirmLoading: nextProps.confirmLoading,
      data: nextProps.data,
    });
  }
  componentDidUpdate() {
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { data } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    return (
      <Modal
        title="修改登录密码"
        visible={this.props.visible}
        onOk={this.handleLoginOk}
        onCancel={this.handleLoginCancel}
        confirmLoading={this.state.confirmLoading}
        cancelText="取消"
        okText="确认"
      >
        <div className="modify-password-frame">
          <Form className="login-form" onSubmit={this.handleLoginSubmit}>
            <FormItem {...formItemLayout} label="手机号">
              <Input value={data && data.tel} disabled />
            </FormItem>
            <FormItem {...formItemLayout} label="旧密码">
              {getFieldDecorator('oldPassword', {
                rules: [
                  { required: true, message: '请输入旧密码!' }
                ],
                validateTrigger: 'onBlur'
              })(
                <Input type="password" />
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="新密码" extra="大写字母、小写字母、数字和标点符号至少包含2种">
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '请输入新密码!' },
                  { validator: this.checkConfirm }
                ],
                validateTrigger: 'onBlur'
              })(
                <Input type="password" />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="重复新密码"
            >
              {getFieldDecorator('RePwd', {
                rules: [{
                  required: true, message: '请重复新密码!',
                }, {
                  validator: this.checkPassword,
                }],
                validateTrigger: 'onBlur'
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />
                )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(ModifyLoginPwd);