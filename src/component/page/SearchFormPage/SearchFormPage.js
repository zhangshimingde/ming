import React, { Component } from 'react';
import { Form, Input, Modal, Button, Row, Col, Radio, Select, Checkbox, Tabs, message, Spin, Icon } from 'antd';
import WangEditor from '../../widget/WangEditor';
import Table from '../../widget/Table';
// import SearchForm from '../../widget/SearchFormTest';
import SearchForm from '../../widget/SearchForm';
import searchConfig from './search';

import arrow from '../../images/arrow.svg';
import warningico from '../../images/warning-ico.svg';
import infoico from '../../images/info-ico.svg';
import successico from '../../images/success-ico.svg';
import errorico from '../../images/error-ico.svg';
import confirmico from '../../images/confirm-ico.svg';
import AddOrEditForm from '../../widget/AddOrEditForm';
import addOrEditFormConf from './addOrEditFormConf';
import BreadCrumb from '../../widget/BreadCrumb';
import './less/searchFormPage.less';
import DetailModal from '../../widget/Modal/DetailModal';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Search = Input.Search;
const { TabPane } = Tabs;

class SearchFormPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postData: {
                pageIndex: 1,
                pageSize: 10
            },
            type: 'edit',
            showFormModal: false,
            detailModal: false,
            editorContent: ''
        }
    }
    componentWillMount() {
        this.showModal();

        // setTimeout(() => {
        //     searchConfig.splice(5, 0, {
        //         label: '监控应用111',
        //         type: 'Input',
        //         name: 'clientApp',
        //         defaultValue: '',
        //         items: [
        //             { name: '全部应用22', value: '' },
        //             { name: 'SUP', value: 'SUP' },
        //             { name: 'TSC', value: 'TSC' },
        //             { name: 'API', value: 'API' },
        //             { name: 'POP', value: 'POP' },
        //             { name: 'MALL', value: 'MALL' },
        //             { name: '物流', value: '物流' },
        //         ]
        //     });
        //     this.setState({ searchConfig });
        // }, 3000);
    }
    componentWillReceiveProps() {

    }
    btnCancel = () => {
        this.hideModal('showFormModal');
    }
    hideModal = (type) => {
        this.setState({
            [type]: false
        })
    }
    showModal = (type) => {
        if (type === 'detailModal') {
            this.setState({
                detailModal: true
            })
        }
        if (type === 'showFormModal') {
            this.setState({
                [type]: true
            })
        }
        if (type === 'confirm') {
            confirm({
                title: '确定要删除吗？',
                content: '删除会对其余数据造成影响',
                icon: <Icon className="icon" component={confirmico} />,
                onOk() {
                    console.log('OK');
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
        if (type === 'delete') {
            confirm({
                title: '确定要删除吗？',
                content: '删除会对其余数据造成影响',
                okText: '确定',
                okType: 'danger',
                icon: <Icon className="icon" component={confirmico} />,
                cancelText: '取消',
                onOk() {
                    console.log('OK');
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
        if (type === 'success') {
            Modal.success({
                title: '确认取消吗',
                width: 500,
                icon: <Icon className="icon" component={successico} />,
                content: (
                    <div>
                        取消会造成数据无法还原
                    </div>
                ),
                onOk() { },
            });
        }
        if (type === 'warning') {
            Modal.warning({
                title: '确认取消吗',
                width: 500,
                icon: <Icon className="icon" component={warningico} />,
                content: (
                    <div>
                        取消会造成数据无法还原
                    </div>
                ),
                onOk() { },
            });
        }
        if (type === 'error') {
            Modal.error({
                title: '确认取消吗',
                width: 500,
                icon: <Icon className="icon" component={errorico} />,
                content: (
                    <div>
                        取消会造成数据无法还原
                    </div>
                ),
                onOk() { },
            });
        }
        if (type === 'info') {
            Modal.info({
                title: '确认取消吗',
                width: 500,
                icon: <Icon className="icon" component={infoico} />,
                content: (
                    <div>
                        取消会造成数据无法还原
                    </div>
                ),
                onOk() { },
            });
        }
    }
    onFieldsChange = (value) => {
        // console.log(value, 9999);
    }
    search = (err, values) => {
        const { postData } = this.state;
        postData.pageIndex = 1;
        this.setState({ condition: values, postData }, () => {
            console.log({ condition: values, postData }, 9992222)
        });
    }
    exportToExcel = () => {

    }
    btnSubmit = () => {

    }
    onSubmitFieldsChange = (changeFileds) => {
        console.log(changeFileds, 9090)
    }
    onChange = (e) => {
        console.log(e, 99);
    }
    addDom = () => {
        // const formItemLayout = {
        //     labelCol: { span: 6 },
        //     wrapperCol: { span: 6 },
        // };

        // const { getFieldDecorator } = this.props.form;
        // let arr = [{
        //     index: 0,
        //     dom:
        //         <FormItem {...formItemLayout} label="活动立减">
        //             {getFieldDecorator('reduceAmount', {
        //                 rules: [
        //                     { required: true, message: '请输入活动立减' }
        //                 ],
        //                 initialValue: '123'
        //             })(
        //                 <Input
        //                     placeholder="请输入活动立减"
        //                 />
        //             )}
        //         </FormItem>
        // },
        // {
        //     index: 1,
        //     dom:
        //         <FormItem {...formItemLayout} label="活动立减222">
        //             {getFieldDecorator('reduceAmount22', {
        //                 rules: [
        //                     { required: true, message: '请输入活动立减' }
        //                 ],
        //                 initialValue: '123'
        //             })(
        //                 <Input
        //                     placeholder="请输入活动立减"
        //                 />
        //             )}
        //         </FormItem>
        // }
        // ];
        // return arr;
    }
    btnDetailSubmit = () => {

    }
    success = () => {
        message.success('操作成功提示消息，3秒自动消失', 10000);
    }

    error = () => {
        message.error('错误操作提示，3秒自动消失', 10000);
    }

    warning = () => {
        message.warning('提示性内容，3秒自动消失，控制字段内容长度，3秒内能读完', 10000);
    }

    getSelectIcon = () => {
        return <Icon className="icon" component={arrow} />;
    }
    changeEditorContent = (editorContent) => {
        this.setState({
            editorContent
        });
        console.log(editorContent, 2222);
    }
    render() {
        const { type, showFormModal, detailModal, selectedRowKeys, editorContent } = this.state;
        const rowSelection = {
            type: "checkbox",
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows
                });
            },
        };
        const columns = [{
            title: '报警ID',
            dataIndex: 'logId',
            key: 'logId',
            width: '150px',
        },
        {
            title: '报警应用',
            dataIndex: 'clientId',
            key: 'clientId',
            width: '150px',
        }, {
            title: '报警维度',
            dataIndex: 'warnType',
            key: 'warnType',
            width: '150px',
            render: (text) => {
                const obj = { 1: '订单报警', 2: '库存报警', 3: '余额报警' };
                return obj[text];
            }
        }
        ];
        const options = [
            { label: 'Apple', value: 'Apple' },
            { label: 'Pear', value: 'Pear' },
            { label: 'Orange', value: 'Orange' },
        ];
        const optionsWithDisabled = [
            { label: 'Apple', value: 'Apple' },
            { label: 'Pear', value: 'Pear' },
            { label: 'Orange', value: 'Orange', disabled: false },
        ];

        return (
            <div className="common-page-content">
                <Spin spinning={false}>
                    <BreadCrumb
                        breadCrumbList={[
                            { name: '首页', path: '/', link: true },
                            { name: '使用页面', path: '/usePage', link: false },
                            { name: '查询页面', path: '/usePage/searchFormPage', link: false }
                        ]}
                        breadCrumbText="/使用页面/查询页面" history={this.props.history} />
                    <div className="clearfix margin-top-30">
                        <h3>富文本编辑</h3>
                        <WangEditor
                            width={800}
                            changeEditorContent={this.changeEditorContent}
                            editorContent={editorContent}
                            uploadImgServer={'http://it.console.service.api-admin.suuyuu.cn/api/FileUpload/Upload'}
                            token={'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImNlMjVhNzI2LTA4NzYtNDMxOC05ZWJiLWI0NjYxMGUxOGU1NSIsIm9wZW5faWQiOiIyRDgwOTkwQjM3QjRCNTVCQTMxNkIyOTM0QjM5N0I2MyIsIm5hbWUiOiI4NzcwIiwibmlja25hbWUiOiLojYbpgKLmo64iLCJwaG9uZV9udW1iZXIiOiIxMzYxODYyNzE4OSIsImVtYWlsIjoiNDQxMDc2NTA2QHFxLmNvbSIsInJvbGUiOiJVc2VyIiwibG9naW5faXAiOiIxMTMuNTcuMTE4LjU5IiwibG9naW5fYWRkcmVzcyI6Iua5luWMl-ecgeatpuaxieW4giIsImxhc3RfbG9naW5faXAiOiIxMTMuNTcuMTE4LjU5IiwibGFzdF9sb2dpbl9hZGRyZXNzIjoi5rmW5YyX55yB5q2m5rGJ5biCIiwiYmluZGluZ19zdGF0dXMiOiIwIiwidXJuOm9hdXRoOnNjb3BlIjoiZ2V0X3VzZXJfaW5mbyIsImNsaWVudF9pZCI6IjEwMDAwMTAxIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDoxNTMxIiwiYXVkIjoiYXBpIiwiZXhwIjoxNTY2Mzc1MzI3LCJuYmYiOjE1NjYzNjgxMjZ9.a7wILtWLepjmO4Y_WTmHYwkLM7IUbToe60Dx_DyTZ8I'}
                            merchantId={'e2256135-c010-06b8-d802-39eca803ed28'}
                            menus={[
                                'head',  // 标题
                                'bold',  // 粗体
                                'fontSize',  // 字号
                                'fontName',  // 字体
                                'italic',  // 斜体
                            ]}
                        />
                    </div>
                    <div className="clearfix margin-top-30">
                        <h3>查询form</h3>
                        <SearchForm
                            searchConfig={searchConfig}
                            exportToExcelSetting={{
                                url: 'http://10.0.1.29:3002/api/admin/merchantstastic/ExportMerchantStasticList',
                                merchantId: '',
                                params: { name: 1 },
                                fileName: '123123',
                                method: 'post'
                            }}
                            search={this.search}
                            initNoSearch={true}
                            onFieldsChange={this.onFieldsChange}
                        />
                    </div>
                    <div className="clearfix margin-top-30">
                        <h3>Input文本框</h3>
                        <Row gutter={40}>
                            <Col span={6}> <Input placeholder="可以清除" allowClear onChange={this.onChange} /></Col>
                            <Col span={6}>
                                <Search
                                    placeholder="搜索"
                                    onSearch={value => console.log(value)}
                                    style={{ width: 200 }}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className="margin-top-30">
                        <h3>Button按钮</h3>
                        <Row className="mar-top-width">
                            <Button type="primary" className=" mar-right-width">主要按钮</Button>
                            <Button type="primary" className="ant-btn-primary-disabled mar-right-width" disabled>主要按钮(禁用)</Button>
                            <Button className="ant-btn-secondary mar-right-width">同类次级按钮</Button>
                            <Button className="ant-btn-secondary-disabled" disabled>同类次级按钮(禁用)</Button>
                        </Row>
                        <Row className="mar-top-width">
                            <Button className="ant-btn-primary-next mar-right-width">主操作按钮</Button>
                            <Button className="ant-btn-primary-next-disabled mar-right-width" disabled>主操作按钮(禁用)</Button>
                            <Button className="ant-btn-secondary small-btn mar-right-width">同类次级按钮</Button>
                            <Button className="ant-btn-secondary-disabled small-btn mar-right-width" disabled>同类次级按钮(禁用)</Button>
                        </Row>
                        <Row className="mar-top-width">
                            <Button className="ant-btn-modal mar-right-width">输入区弹窗选择</Button>
                            <Button className="ant-btn-modal-disabled" disabled>输入区弹窗选择(禁用)</Button>
                        </Row>
                        <Row className="mar-top-width">
                            <a>a链接</a>
                        </Row>
                        <Row className="mar-top-width">
                            <Radio.Group>
                                <Radio.Button value="large" disabled>Large</Radio.Button>
                                <Radio.Button value="default">Default</Radio.Button>
                                <Radio.Button value="small">Small</Radio.Button>
                            </Radio.Group>
                        </Row>
                    </div>
                    <div className="margin-top-30">
                        <h3>下拉框Select</h3>
                        <Row gutter={24}>
                            <Col span={6}>
                                <Select value={'苹果'} suffixIcon={this.getSelectIcon()}>
                                    <Select.Option value={'苹果'} key={'苹果'}>苹果</Select.Option>
                                    <Select.Option value={'梨子'} key={'梨子'}>梨子</Select.Option>
                                </Select>
                            </Col>
                            <Col span={6}>
                                <Select value={'苹果'} suffixIcon={this.getSelectIcon()}>
                                    <Select.Option value={'苹果'} key={'苹果'}>苹果</Select.Option>
                                    <Select.Option value={'梨子'} key={'梨子'}>梨子</Select.Option>
                                </Select>
                            </Col>
                            <Col span={6}>
                                <Select value={'苹果'} suffixIcon={this.getSelectIcon()}>
                                    <Select.Option value={'苹果'} key={'苹果'}>苹果</Select.Option>
                                    <Select.Option value={'梨子'} key={'梨子'}>梨子</Select.Option>
                                </Select>
                            </Col>
                        </Row>
                    </div>
                    <div className="margin-top-30">
                        <h3>复选框</h3>
                        {/* <Checkbox indeterminate={true}></Checkbox> */}
                        <Table
                            bordered
                            columns={columns}
                            dataSource={[{ id: 11 }, { id: 22 }]}
                            pagination={false}
                            rowSelection={rowSelection}
                        />
                        <br />
                        <Checkbox.Group options={options} defaultValue={['Pear']} />
                        <br />
                        <Checkbox.Group
                            options={optionsWithDisabled}
                            disabled
                            defaultValue={['Apple']}
                        />
                    </div>
                    <div className="margin-top-30">
                        <h3>单选框</h3>
                        <Radio.Group>
                            <Radio value={1}>A</Radio>
                            <Radio value={2} disabled checked>B</Radio>
                            <Radio value={3} disabled>C</Radio>
                            <Radio value={4}>D</Radio>
                        </Radio.Group>
                    </div>
                    <div className="margin-top-30">
                        <h3>选项卡</h3>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Tab 1" key="1">
                                Content of Tab Pane 1
                        </TabPane>
                            <TabPane tab="Tab 2" key="2">
                                Content of Tab Pane 2
                        </TabPane>
                            <TabPane tab="Tab 3" key="3">
                                Content of Tab Pane 3
                        </TabPane>
                        </Tabs>
                    </div>
                    <div className="margin-top-30">
                        <h3>弹框</h3>
                        <Button className="ant-btn-secondary" onClick={this.success}>Success</Button>
                        <Button className="ant-btn-secondary" onClick={this.error}>Error</Button>
                        <Button className="ant-btn-secondary" onClick={this.warning}>Warning</Button>
                    </div>
                    <div className="margin-top-30">
                        <h3>弹框</h3>
                        <Button className="ant-btn-secondary" onClick={() => this.showModal('detailModal')}>detailModal</Button>
                        <Button className="ant-btn-secondary" onClick={() => this.showModal('showFormModal')}>showFormModal</Button>
                        <Button className="ant-btn-secondary" onClick={() => this.showModal('success')}>success</Button>
                        <Button className="ant-btn-secondary" onClick={() => this.showModal('info')}>info</Button>
                        <Button className="ant-btn-secondary" onClick={() => this.showModal('error')}>error</Button>
                        <Button className="ant-btn-secondary" onClick={() => this.showModal('warning')}>warning</Button>
                        <Button className="ant-btn-secondary" onClick={() => this.showModal('confirm')}>confirm</Button>
                        {/* <Button className="ant-btn-secondary" onClick={() => this.showModal('delete')}>delete</Button> */}
                    </div>
                    <div className="margin-top-30">
                        <h3>form新增编辑</h3>
                        <AddOrEditForm
                            okText="确定"
                            cancelText="取消"
                            config={addOrEditFormConf}
                            btnSubmit={this.btnSubmit}
                            btnCancel={this.btnCancel}
                            onSubmitFieldsChange={this.onSubmitFieldsChange}
                            addDom={this.addDom}
                            type={type}
                        />
                    </div>
                    {detailModal && <DetailModal
                        title="主题"
                        width="1200"
                        okText="保存"
                        cancelText="丢失"
                        btnDetailSubmit={this.btnDetailSubmit}
                        btnDetailCancel={() => this.hideModal('detailModal')}
                    >
                        213123
                    </DetailModal>}
                    {showFormModal && <Modal
                        title={"编辑监控"}
                        visible
                        onCancel={() => this.hideModal('showFormModal')}
                        onOk={this.btnOk}
                        width="800px"
                        maskClosable={false}
                        okText="确定"
                        cancelText="取消"
                        footer={null}
                    >
                        <AddOrEditForm
                            okText="确定"
                            cancelText="取消"
                            config={addOrEditFormConf}
                            btnSubmit={this.btnSubmit}
                            btnCancel={this.btnCancel}
                            onSubmitFieldsChange={this.onSubmitFieldsChange}
                        />
                    </Modal>}
                </Spin>
            </div>
        )
    }
}
export default Form.create()(SearchFormPage);