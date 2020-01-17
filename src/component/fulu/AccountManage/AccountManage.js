import React from 'react';
import PropTypes, { func } from 'prop-types';
import { Link } from 'react-router-dom';
import ModifyLoginPwd from './ModifyLoginPwd';

import { Form, Icon, Input, Button, Checkbox, Row, Col, message, Card, Modal, Spin, Menu, Switch, Select } from 'antd';

const FormItem = Form.Item;

import service from '../utils/service';

import './Account.less';
import { provinceData, cityData } from '../utils/cityData';

const Option = Select.Option;

function formatMoblie(mobile) {
  let newMobile = '';
  mobile.split("").forEach((value, i) => {
    if (i >= 3 && i <= 6) {
      newMobile += "*";
    } else {
      newMobile += value;
    }
  });
  return newMobile
}


class AccountManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentType: "2",
      basicInfoData: {},
      userinfo: window.userinfo,
      province: provinceData[0],
      cities: cityData[provinceData[0]],
      city: cityData[provinceData[0]][0],
      isEdit: false,
      updatephonenumvisible: false,
      sendphoneTxt: '发送验证码',
      isphoneSendIng: false,
      privacyMobile: ""
    }

  }
  componentWillReceiveProps(nextProps) {
    const { basicInfo, updateBasicInfo, changephoneno, sendmessagecode } = nextProps.account;

    if (changephoneno && changephoneno != this.props.account.changephoneno) {
      // this.getBasicInfo();
      // this.updatephonenumCancel();
      setTimeout(() => {
        window.loginOut && window.loginOut();
      }, 500);
    }

    // if (sendmessagecode && sendmessagecode != this.props.account.sendmessagecode) {
    //   this.countDown();
    // }
  }

  componentDidMount() {
    //显示个人基本信息
    this.getBasicInfo();
    let privacyMobile = formatMoblie(window.userinfo.mobile);
    this.setState({
      privacyMobile
    });
  }

  getBasicInfo() {
    service.getBasicInfo().then((res) => {
      if (res.code == '0') {
        this.setState({
          basicInfoData: res.data,
          province: res.data.province,
          city: res.data.city
        });
      }
      else {
        message.error(res.message);
      }
    })
  }

  updateBasicInfo(data) {
    service.updateBasicInfo(data).then((res) => {
      if (res.code == '0') {
        message.success('保存成功');
      }
      else {
        message.error(res.message);
      }
    })
  }

  changephone(data) {
    service.changephone(data).then((res) => {
      if (res.code == '0') {
        message.success('修改成功');
        setTimeout(() => {
          window.loginOut && window.loginOut();
        }, 500);
      }
      else {
        message.error(res.message);
      }
    })
  }

  sendmessagecode(data) {
    service.sendmessagecode(data).then((res) => {
      if (res.code == '0') {
        message.success('发送成功');
        this.countDown();
      }
      else {
        message.error(res.message);
      }
    })
  }

  changeType = ({ item, key, keyPath }) => {
    if (key == '2') {
      this.getBasicInfo();
    }
    this.setState({
      contentType: key
    })
  }

  handleProvinceChange = (value) => {
    this.setState({
      cities: cityData[value],
      city: cityData[value][0],
    });
    this.props.form.setFieldsValue({
      cities: cityData[value],
      city: cityData[value][0]
    });
  }

  onSecondCityChange = (value) => {
    this.setState({
      city: value,
    });
  }

  handleSubmit = (e) => {
    const form = this.props.form;
    form.validateFields(["address"], (err) => {
      if (!err) {
        const params = form.getFieldsValue();
        this.setState({
          isEdit: false
        });
        this.updateBasicInfo(params);
      }
    });

  };

  showLoginModal = (e) => {
    this.setState({
      Loginvisible: true
    });
  }

  handleLogin = (ev) => {
    this.setState({
      Loginvisible: ev.Loginvisible
    });
  }

  editAccount = () => {
    this.setState({
      isEdit: true
    })
  }

  countDown = () => {
    var _t = 60;
    this.setState({
      isphoneSendIng: true,
      sendphoneTxt: _t + 's'
    });
    var time = setInterval(() => {
      --_t;
      if (_t == 0) {
        clearInterval(time);
        this.setState({
          isphoneSendIng: false,
          sendphoneTxt: '发送验证码'
        });
        return;
      }
      this.setState({
        sendphoneTxt: _t + 's'
      });
    }, 1000);
  }

  showUpdatePhone = () => {
    this.props.form.setFieldsValue({
      phonenumUpdate: this.state.privacyMobile
    });
    this.setState({
      updatephonenumvisible: true
    });
  }

  getphoneVcode = () => {
    const form = this.props.form;
    form.validateFields(['newphonenumUpdate'], (err) => {
      if (!err) {
        if (!this.state.isphoneSendIng) {
          var _newphonenumUpdate = this.props.form.getFieldValue('newphonenumUpdate');
          if (_newphonenumUpdate) {

            var captcha1 = new TencentCaptcha('2079932958', (res) => {
              if (res.ret === 0) {
                this.sendmessagecode({
                  // access_token: localStorage.getItem('access_token'),
                  PhoneNo: _newphonenumUpdate,
                  Type: 'changephoneno',
                  Ticket: res.ticket,
                  RandStr: res.randstr
                });
              }
            });
            captcha1.show(); // 显示验证码
          } else {
            message.destroy();
            message.error('请输入新手机号码');
          }
        }
      }
    });
  }

  updatephonenumOk = () => {
    const form = this.props.form;
    form.validateFields(['newphonenumUpdate', 'messageCode'], (err) => {
      if (!err) {
        this.changephone({
          phone: form.getFieldValue('newphonenumUpdate'),
          code: form.getFieldValue('messageCode')
        });
        // this.changephoneno({
        //   phoneno: form.getFieldValue('newphonenumUpdate'),
        //   messageCode: form.getFieldValue('messageCode')
        // });
      }
    });
  }

  updatephonenumCancel = () => {
    this.setState({
      updatephonenumvisible: false,
    });
  }

  checkPhonenumUpdate = (rule, value, callback) => {
    let cardValid = value != this.state.userinfo.mobile;
    if (cardValid) {
      callback();
    } else {
      callback('请填写新的手机号码');
    }
  }

  renderContent(type) {
    const { getFieldDecorator } = this.props.form;
    const { province, cities, city, basicInfoData, isEdit, privacyMobile } = this.state;
    let userinfo = window.userinfo;
    const isAudit = !!(userinfo.auditStatus == 1);
    const unAuthen = !!(userinfo.auditStatus == 1 && (userinfo.authenticationType == 0 || userinfo.authenticationType == 1) && userinfo.authenticationStatus != 2)
    const isPersonAuthen = !!(userinfo.auditStatus == 1 && userinfo.authenticationType == 2 && userinfo.authenticationStatus == 2);
    const isCompanyAuthen = !!(userinfo.auditStatus == 1 && userinfo.authenticationType == 3 && userinfo.authenticationStatus == 2)
    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 8
      },
    };


    const btns = window.getAuthButtons();
    let editBtn = btns.find(a => a.enCode === 'lr-edit');

    switch (type) {
      case "1":
        return (
          <div>
            <div className="content-title">基本信息</div>
            <div className="status-box">账户状态：
              <span className="auditstatus">未审核</span>
              <Button className="auditbtn" type='primary'>立即审核</Button>
            </div>
            <div className="account-info">
              <div className="label">平台账号</div>
              <div>{privacyMobile}</div>
            </div>
          </div>
        );
      case "2":
        return (
          <div>
            <div className="content-title">联系信息</div>
            <div className="application-frame">
              {
                isAudit ?
                  <div className="ant-form-item-label" style={{ marginBottom: "20px" }}>
                    <label className="anthenType">认证类型</label>
                    {
                      isPersonAuthen ?
                        <span className="authenBox" style={{ color: userinfo.authenticationStatus == 1 ? '#FF7800' : '#3983D7' }}>
                          <span className="authenIcon"><Icon type="safety" /></span>
                          个人认证</span>
                        : null
                    }
                    {
                      isCompanyAuthen ?
                        <span className="authenBox" style={{ color: userinfo.authenticationStatus == 1 ? '#FF7800' : '#3983D7' }}>
                          <span className="authenIcon"><Icon type="safety" /></span>
                          企业认证</span>
                        : null
                    }
                    {
                      unAuthen ?
                        <span> <Link to="/authen" style={{ color: '#FF7800' }}>未认证</Link></span>
                        : null
                    }
                  </div> : null
              }
              <Form layout="vertical" className="cxform" hideRequiredMark>
                <FormItem label="所在地区">
                  {getFieldDecorator('province', {
                    initialValue: province
                  })(
                    <Select
                      style={{ width: 180 }}
                      onChange={this.handleProvinceChange}
                      disabled={!isEdit}
                    >
                      {provinceData.map(province => <Option key={province}>{province}</Option>)}
                    </Select>
                    )}
                  {getFieldDecorator('city', {
                    initialValue: city
                  })(
                    <Select
                      style={{ width: 180, marginLeft: "20px" }}
                      onChange={this.onSecondCityChange}
                      disabled={!isEdit}
                    >
                      {cities.map(city => <Option key={city}>{city}</Option>)}
                    </Select>
                    )}
                </FormItem>
                <FormItem label="街道地址">
                  {getFieldDecorator('address', {
                    initialValue: basicInfoData.address,
                    rules: [{ required: true, message: '请输入您的街道地址!' }],
                    validateTrigger: 'onBlur'
                  })(
                    <Input style={{ width: 300 }} disabled={!isEdit} placeholder="请输入详细地址" />
                    )}
                </FormItem>
                <FormItem label="电子邮件">
                  {getFieldDecorator('email', {
                    initialValue: basicInfoData.email,
                    rules: [{
                      required: false,
                      type: 'email', message: '请填写正确的邮箱地址!',
                    }],
                    validateTrigger: 'onBlur'
                  })(
                    <Input style={{ width: 300 }} disabled={!isEdit} placeholder="请填写" />
                    )}
                </FormItem>
                <FormItem label="QQ">
                  {getFieldDecorator('qq', {
                    initialValue: basicInfoData.qq,
                    rules: [{
                      required: false,
                      pattern: /^\d{5,25}$/, message: 'QQ号只能为数字，长度在5-25位之间'
                    }],
                    validateTrigger: 'onBlur'
                  })(
                    <Input style={{ width: 120 }} disabled={!isEdit} placeholder="请填写" />
                    )}
                </FormItem>
                {
                  editBtn ?
                    isEdit ?
                      <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>保存</Button> :
                      <Button type="primary" htmlType="submit" onClick={this.editAccount}>修改</Button>
                    : null
                }
              </Form>
            </div>
          </div>
        );
      case "3":
        return (
          <div>
            <div className="content-title">安全设置</div>
            <div className="password-box">
              <div className="left-box">
                <div>登录密码：<span className="pwd">********</span></div>
                <div className="desc">密码长度必须包含字母，符号或数字中至少两项且长度超过8位</div>
              </div>
              <div className="right-box">
                <span><Icon type="check-circle" theme="filled" style={{ marginRight: "10px" }} />已设置</span>
                <Button className="auditbtn" type='primary' onClick={this.showLoginModal}>修改</Button>
              </div>
            </div>
            <div className="tel-box">
              <div className="left-box">
                <div>手机号码</div>
                <div className="tel-info">您已经设置了：<span className="tel-number">{privacyMobile}</span></div>
              </div>
              <div className="right-box">
                <span><Icon type="check-circle" theme="filled" style={{ marginRight: "10px" }} />已设置</span>
                <Button className="auditbtn" type='primary' onClick={this.showUpdatePhone}>修改</Button>
              </div>
            </div>
          </div>
        );
    }
  }

  render() {
    const { loading } = this.props;
    const { basicInfoData, privacyMobile } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 },

      },
    };

    return (
      <div className="account-layout">
        <div className="column-title">基本资料</div>
        <Spin spinning={loading.effects['account/getBasicInfo']}>
          <div className="account-box">
            <Row type="flex" className="account-row">
              <div className="memu-box">
                <Menu
                  style={{ width: 256, height: '100%' }}
                  defaultSelectedKeys={['2']}
                  defaultOpenKeys={['sub1']}
                  mode='inline'
                  theme='light'
                  onClick={this.changeType}
                >
                  {/* <Menu.Item className="menu-item" key="1">基本信息</Menu.Item> */}
                  <Menu.Item className="menu-item" key="2">联系信息</Menu.Item>
                  <Menu.Item className="menu-item" key="3">安全设置</Menu.Item>
                </Menu>
              </div>
              <div className="content-box">
                {this.renderContent(this.state.contentType)}
              </div>
            </Row>
          </div>
          <ModifyLoginPwd
            data={this.state.basicInfoData}
            visible={this.state.Loginvisible}
            callHandleLogin={this.handleLogin}
            confirmLoading={this.state.confirmLoginPwdLoading}
          />
          <Modal
            title="修改手机号"
            okText="保存"
            cancelText="取消"
            visible={this.state.updatephonenumvisible}
            onOk={this.updatephonenumOk}
            onCancel={this.updatephonenumCancel}
          >
            <FormItem
              {...formItemLayout}
              label="手机号码"
            >
              {getFieldDecorator('phonenumUpdate', {
                initialValue: privacyMobile,
                rules: [],
              })(
                <Input disabled style={{ width: '80%' }} />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="新手机号码"
            >
              {getFieldDecorator('newphonenumUpdate', {
                rules: [
                  { required: true, message: '请输入手机号码!' },
                  { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号' },
                  { validator: this.checkPhonenumUpdate }
                ],
              })(
                <Input style={{ width: '80%' }} />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="短信验证码"
            >
              <Row gutter={8}>
                <Col span={12}>
                  {getFieldDecorator('messageCode', {
                    rules: [{ required: true, message: '请输入验证码!' }],
                  })(
                    <Input />
                    )}
                </Col>
                <Col span={12}>
                  <Button onClick={this.getphoneVcode}>{this.state.sendphoneTxt}</Button>
                </Col>
              </Row>
            </FormItem>
          </Modal>
        </Spin>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    ...state,
  };
}

export default Form.create()(AccountManage);