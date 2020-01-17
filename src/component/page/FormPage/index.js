import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';

class FormPage extends Component {
    constructor(props) {
        super(props);
        console.log('FormPage constructor');
        this.openUrl = this.openUrl.bind(this);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
    }
    openUrl() {
        this.props.history.push('/open/ProjectManager/PM_Project/Index');
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" onSubmit={this.handleSubmit} style={{ padding: '20px' }}>
                <Form.Item>
                    {getFieldDecorator('userName', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button
                    type="primary"
                    htmlType="submit"
                    >
                    Log in
                    </Button>
            </Form.Item>
            <a href="javascript:void(0);" onClick={this.openUrl}>跳转路由测试</a>
        </Form>);
    }
}

export default Form.create()(FormPage);