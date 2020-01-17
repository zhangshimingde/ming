import React from 'react';
import PropTypes from 'prop-types';
import {
    Form, Input, Button, message, Col, Row,
} from 'antd';

const FormItem = Form.Item;

class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        const { form, service, userinfo } = this.props;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                form.resetFields();// 清空提交的表单
                values.userId = userinfo.userId;
                this.setState({
                    loading: true,
                });
                service.modifyUserinfo(values).then((res) => {
                    if (res.code !== '0' || !res.data) {
                        return message.error(res.message || '修改失败');
                    }
                    message.success('修改成功');
                    this.setState({
                        loading: false,
                    });
                    return null;
                }).catch(() => {
                    message.error(e.message || '修改失败');
                    this.setState({
                        loading: false,
                    });
                });
            }
        });
    }

    render() {
        const { loading } = this.state;
        const { form, style, userinfo } = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        };
        return (
            <div style={style} className="information-contact">
                <Form>
                    <FormItem {...formItemLayout} label="手机">
                        {getFieldDecorator('mobile', {
                            initialValue: userinfo.mobile,
                            rules: [{
                                required: true, message: '请输入手机号',
                            }],
                        })(
                            <Input placeholder="请输入手机号" />,
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="邮箱">
                        {getFieldDecorator('email', {
                            initialValue: userinfo.email,
                            rules: [{
                                required: true, message: '请输入邮箱',
                            }, {
                                pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
                                message: '邮箱格式不正确',
                            }],
                        })(
                            <Input placeholder="请输入邮箱" />,
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="微信">
                        {getFieldDecorator('weChat', {
                            initialValue: userinfo.weChat,
                            rules: [{
                                message: '请输入微信',
                            }],
                        })(
                            <Input placeholder="请输入微信" />,
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="QQ">
                        {getFieldDecorator('oicq', {
                            initialValue: userinfo.oicq,
                            rules: [{
                                required: true, message: '请输入QQ',
                            }],
                        })(
                            <Input placeholder="请输入QQ" />,
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="现居住地址">
                        {getFieldDecorator('currentAddress', {
                            initialValue: userinfo.currentAddress,
                            rules: [{
                                message: '请输入现居住地址',
                            }],
                        })(
                            <Input placeholder="请输入现居住地址" />,
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="紧急联系人">
                        {getFieldDecorator('emergencyContactPerson', {
                            initialValue: userinfo.emergencyContactPerson,
                            rules: [{
                                required: true, message: '请输入紧急联系人',
                            }],
                        })(
                            <Input placeholder="请输入紧急联系人" />,
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="紧急联系方式">
                        {getFieldDecorator('emergencyContactNumber', {
                            initialValue: userinfo.emergencyContactNumber,
                            rules: [{
                                required: true, message: '请输入紧急联系方式',
                            }],
                        })(
                            <Input placeholder="请输入紧急联系方式" />,
                        )}
                    </FormItem>
                </Form>
                <Row>
                    <Col span={3} />
                    <Col span={8}>
                        <Button
                            onClick={this.handleSubmit}
                            type="primary"
                            loading={loading}
                        >
                            提交
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

Contact.propTypes = {
    form: PropTypes.object,
    style: PropTypes.object,
    userinfo: PropTypes.object,
    service: PropTypes.object,
};

Contact.defaultProps = {
    form: {},
    style: {},
    userinfo: {},
    service: {},
};

export default Form.create()(Contact);
