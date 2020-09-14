import React, { Component } from 'react';
import { Modal, Alert, Form, Input, Radio, Tooltip, Icon } from 'antd';

const { TextArea } = Input;
const ADD = 'add'; // 创建商户
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

class MyModal extends Component {
    state = {
        remark: "",
        merchantName: "",
        merchantRole: '',
        cooperativeType: '',
    }
    componentDidMount() {
        const { modalType, editData } = this.props;
        if (modalType !== ADD) {
            const { name, remark, merchantRole, cooperativeType } = editData;
            this.setState({
                remark,
                merchantRole,
                merchantName: name,
                cooperativeType,
            });
        }
    }

    handleOk = () => {
        const { modalType, editData, form } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const formData = Object.assign({}, values);
                if (modalType === ADD) {
                    formData.fullName = values.merchantName;
                } else {
                    delete formData.merchantName;
                    delete formData.merchantRole;
                    formData.merchantId = editData.id;
                }
                this.props.handleOk(formData);
            }
        });
    }

    merchantRoleChange = (e) => {
        const merchantRole = e.target.value;
        this.setState({
            merchantRole,
            cooperativeType: ""
        }, () => {
            this.props.form.resetFields("cooperativeType");
        });
    }

    handleCancel = () => {
        this.props.handleCancel();
    }

    render() {
        const { modalType, form, isInternal } = this.props;
        const { merchantName, remark, merchantRole, cooperativeType } = this.state;
        const { getFieldDecorator } = form;
        const title = modalType === ADD ? '申请创建商户' : '编辑商户';
        return (
            <Modal
                title={title}
                visible={true}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="确认"
                cancelText="取消"
                className="create-member-modal"
                width={600}
            >
                {
                    modalType === ADD ?
                        <Alert
                            style={{
                                color: "#2787d9", marginBottom: 26,
                            }}
                            message="提示：商户名称申请后不可修改，请慎重填写"
                            type="info"
                            showIcon
                        /> : null
                }
                <Form >
                    <Form.Item
                        {...formItemLayout}
                        label="商户名称"
                    >
                        {getFieldDecorator('merchantName', {
                            rules: [{ required: true, message: '请输入商户名称' }, { max: 12, message: '最多12个字符' }],
                            initialValue: merchantName,
                        })(<Input disabled={modalType !== ADD} />)}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label=" 商户角色"
                    >
                        {getFieldDecorator('merchantRole', {
                            rules: [{ required: true, message: '请选择商户角色' }],
                            initialValue: merchantRole,
                        })(
                            <Radio.Group disabled={modalType !== ADD} onChange={this.merchantRoleChange}>
                                <Radio value={1}>进货商</Radio>
                                <Radio value={2}>供货商</Radio>
                                {
                                    isInternal == 1
                                    &&
                                    <Radio value={3}>FP</Radio>
                                }
                            </Radio.Group>
                        )}
                    </Form.Item>
                    {
                        merchantRole == 1
                        &&
                        <Form.Item
                            {...formItemLayout}
                            label="合作类型"
                        >
                            {getFieldDecorator('cooperativeType', {
                                rules: [{ required: true, message: '请选择合作类型' }],
                                initialValue: cooperativeType ? cooperativeType : 0,
                            })(
                                <Radio.Group disabled={modalType !== ADD}>
                                    <Radio value={0}>
                                        常规合作
                                        <Tooltip placement="top" title="虚拟商品采购进货">
                                            <Icon type="question-circle" style={{ fontSize: 12, marginLeft: 5 }} />
                                        </Tooltip>
                                    </Radio>
                                    <Radio value={1}>
                                        企业福利合作
                                        <Tooltip placement="top" title="福利合作，需与商务沟通(张经理：18171679977)" overlayStyle={{ maxWidth: "185px" }} >
                                            <Icon type="question-circle" style={{ fontSize: 12, marginLeft: 5 }} />
                                        </Tooltip>
                                    </Radio>
                                    {/* <Radio value={2}>短信应用</Radio> */}
                                </Radio.Group>
                            )}
                        </Form.Item>
                    }
                    {
                        merchantRole == 3
                        &&
                        <Form.Item
                            {...formItemLayout}
                            label="合作类型"
                        >
                            {getFieldDecorator('cooperativeType', {
                                rules: [{ required: true, message: '请选择合作类型' }],
                                initialValue: cooperativeType ? cooperativeType : 10,
                            })(
                                <Radio.Group disabled={modalType !== ADD}>
                                    <Radio value={10}>福禄FP</Radio>
                                    <Radio value={11}>推广大使</Radio>
                                    <Radio value={12}>战略伙伴</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    }
                    <Form.Item
                        {...formItemLayout}
                        label="备注"
                    >
                        {getFieldDecorator('remark', {
                            rules: [{ max: 30, message: '最多30个字符' }],
                            initialValue: remark,
                        })(
                            <TextArea
                                style={{
                                    width: '100%',
                                    height: '90px',
                                    resize: 'none',
                                    lineHeight: '1.6',
                                }}
                            />
                        )}

                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(MyModal);