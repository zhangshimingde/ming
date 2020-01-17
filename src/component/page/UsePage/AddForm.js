import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Button, Row, Col, Radio, Select, Checkbox, Tabs, message, Spin } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import AddOrEditForm from '../../widget/AddOrEditForm';
import addOrEditFormConfig from './addOrEditFormConfig';
import '../../../assets/less/common.less';
const FormItem = Form.Item;
const confirm = Modal.confirm;

@Form.create()
@connect((state) => state)
class AddForm extends Component {
    constructor(props) {
        super(props);
        const id = this.getParam('id');
        this.state = {
            addOrEditFormConfig: cloneDeep(addOrEditFormConfig),
            id
        }
    }
    componentWillMount() {
        // 获取详情
        this.getDetailInfo();
        // 重新设置表单
        this.setAddorEditConfig();
    }
    componentWillReceiveProps() {
    }
    // 如果有新增的数据
    setAddorEditConfig = () => {
        // const formItemLayout = {
        //     labelCol: { span: 4 },
        //     wrapperCol: { span: 8 },
        // };
        // const { getFieldDecorator } = this.props.form;
        // const { addOrEditFormConfig } = this.state;
        // addOrEditFormConfig[2].render = <FormItem {...formItemLayout} label="活动立减">
        //     {getFieldDecorator('reduceAmount', {
        //         rules: [
        //             { required: true, message: '请输入活动立减' }
        //         ],
        //         initialValue: '123'
        //     })(
        //         <Input
        //             placeholder="请输入活动立减"
        //         />
        //     )}
        // </FormItem>;
        // this.setState({
        //     addOrEditFormConfig
        // })
    }
    getDetailInfo = () => {
        const { addOrEditFormConfig, id } = this.state;
        if (id) {
            this.props.dispatch({
                type: `usePage/usePageDetail`, payload: {
                    id
                }
            }).then((res) => {
                const { code, data } = res;
                if (code === '0') {
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            const element = data[key];
                            addOrEditFormConfig.map((item) => {
                                // 赋值
                                if (item.name === key) {
                                    item.initialValue = element;
                                }
                            });
                        }
                    }
                    // 赋值
                    this.setState({
                        addOrEditFormConfig
                    })
                }
                else {
                    message.error(res.message);
                }
            });
        }

    }
    getParam = (paramName) => {
        // 获取参数
        const url = window.location.search;
        // 正则筛选地址栏
        const reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
        // 匹配目标参数
        const result = url.substr(1).match(reg);
        //返回参数值
        return result ? decodeURIComponent(result[2]) : null;

    }
    btnCancel = () => {
        this.props.history.push('/usePage');
    }
    btnSubmit = (err, values) => {
        if (!err) {
            const { id } = this.state;
            // 编辑
            if (id) {
                return this.props.dispatch({
                    type: `usePage/usePageEdit`, payload: {
                        ...values,
                        id
                    }, callback: (res) => {
                        if (res.code === '0') {
                            message.success(res.message);
                            this.props.history.push('/usePage');
                        }
                        else {
                            message.error(res.message);
                        }
                    }
                });
            }
            // 新增
            return this.props.dispatch({
                type: `usePage/usePageAdd`, payload: {
                    ...values,
                }, callback: (res) => {
                    if (res.code === '0') {
                        message.success(res.message);
                        this.props.history.push('/usePage');
                    }
                    else {
                        message.error(res.message);
                    }
                }
            });
        }
    }
    btnCancel = () => {
        this.props.history.push('/usePage');
    }
    render() {
        const { type, showFormModal, detailModal, selectedRowKeys, addOrEditFormConfig } = this.state;
        return (
            <div>
                <Spin spinning={false}>
                    <div className="bread-crumbs">新增库存列表</div>
                    <div className="common-page-content">
                        <AddOrEditForm
                            okText="确定"
                            cancelText="取消"
                            config={addOrEditFormConfig}
                            btnSubmit={this.btnSubmit}
                            btnCancel={this.btnCancel}
                            onSubmitFieldsChange={this.onSubmitFieldsChange}
                            addDom={this.addDom}
                            type={type}
                        />
                    </div>
                </Spin>
            </div>
        )
    }
}
export default Form.create()(AddForm);