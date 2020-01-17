import React, { Component } from 'react';
import { connect } from 'dva';
import {
    Spin, Modal, message, Button, Form, Col
} from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import addOrEditFormConfig from './addOrEditFormConfig';
import AddOrEditForm from '../../widget/AddOrEditForm';
const FormItem = Form.Item;
@Form.create()
@connect((state) => state)
export default class ShowAddOrEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addOrEditFormConfig: cloneDeep(addOrEditFormConfig),
        }
    }
    componentWillMount() {
        const { record } = this.props;
        if (record.id)
            this.getDetailInfo();
    }
    getDetailInfo = () => {
        const { record } = this.props;
        const { addOrEditFormConfig } = this.state;
        this.props.dispatch({
            type: `usePage/usePageDetail`, payload: {
                id: record.id
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
    btnModalCancel = () => {
        this.props.onCancel();
    }
    btnModalSubmit = (err, values) => {
        this.props.onOk(err, values);
    }
   
    render() {
        const { record } = this.props;
        const { addOrEditFormConfig } = this.state;
        return (
            <Modal
                title={record.id ? "编辑监控" : "新建监控"}
                visible
                width={800}
                maskClosable={false}
                onCancel={this.btnModalCancel}
                footer={null}
                okText="确定"
                cancelText="取消">
                <AddOrEditForm
                    okText="确定"
                    cancelText="取消"
                    config={addOrEditFormConfig}
                    btnSubmit={this.btnModalSubmit}
                    btnCancel={this.btnModalCancel}
                    onSubmitFieldsChange={this.onSubmitFieldsChange}
                />
            </Modal>
        )
    }
}
