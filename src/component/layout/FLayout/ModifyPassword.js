import React from 'react';
import PropTypes from 'prop-types';
import {
    Form, Input, message, Button, Col, Row,
} from 'antd';

const FormItem = Form.Item;

class ModifyPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    handleSubmit = (e) => {
        const { form, service } = this.props;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const params = new URLSearchParams();
                params.append('password', values.password);
                params.append('oldPassword', values.oldPassword);
                params.append('access_token', localStorage.getItem('access_token'));
                this.setState({
                    loading: true,
                });
                service.modifyPassword(params).then((res) => {
                    this.setState({
                        loading: false,
                    });
                    if (res.code === '0') {
                        form.resetFields();
                        message.success('修改密码成功');
                    }
                }).catch(() => {
                    this.setState({
                        loading: false,
                    });
                    return message.error(e.message || '密码修改失败');
                });
            }
        });
    }

    render() {
        const { form, style } = this.props;
        const { loading } = this.state;
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
            <div
                style={style}
                className="information-password"
            >
                <Form>
                    <FormItem {...formItemLayout} label="旧密码">
                        {getFieldDecorator('oldPassword', {
                            rules: [{
                                required: true,
                                message: '请输入旧密码',
                            }, {
                                pattern: /^[a-zA-Z0-9_]{6,16}$/,
                                message: '密码是长度为6~16的字母、数字、下划线组成',
                            }],
                        })(
                            <Input type="password" placeholder="请输入旧密码" />,
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="新密码">
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true,
                                message: '请输入新密码',
                            }, {
                                pattern: /^[a-zA-Z0-9_]{6,16}$/,
                                message: '密码是长度为6~16的字母、数字、下划线组成',
                            }, {
                                message: '新密码不能与旧密码一样',
                                validator: (rule, value, callback) => {
                                    const { getFieldValue } = form;
                                    if (value && value === getFieldValue('oldPassword')) {
                                        return callback('新密码不能与旧密码一样');
                                    }
                                    return callback();
                                },
                            }],
                        })(
                            <Input type="password" placeholder="请输入新密码" />,
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="重复新密码">
                        {getFieldDecorator('confirmPassword', {
                            rules: [{
                                required: true,
                                message: '请重复新密码',
                            }, {
                                validator: (rule, value, callback) => {
                                    const { getFieldValue } = form;
                                    if (value && value !== getFieldValue('password')) {
                                        return callback('两次输入不一致！');
                                    }
                                    return callback();
                                },
                            }],
                        })(
                            <Input type="password" placeholder="请重复新密码" />,
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

ModifyPassword.propTypes = {
    form: PropTypes.object,
    style: PropTypes.object,
    service: PropTypes.object,
};

ModifyPassword.defaultProps = {
    form: {},
    style: {},
    service: {},
};

export default Form.create()(ModifyPassword);
