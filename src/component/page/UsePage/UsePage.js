import React, { Component } from 'react';
import { connect } from 'dva';
import CommonPage from '../../widget/CommonPage';
import {
    Spin, Divider, Form, Input, Modal, message, Table, Button
} from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import ShowAddOrEditModal from './ShowAddOrEditModal';
import ShowDetailModal from './ShowDetailModal';
import searchFormConfig from './searchFormConfig';
import SpecialModal from './SpecialModal';
import '../../../assets/less/common.less';

class UsePage extends CommonPage {
    constructor(props) {
        super(props);
        this.namespace = 'usePage'; // 默认加载的命名空间，对应页面名称以及models
        // table配置项
        this.tableConfig = {
            scrollWidth: 1200, // table表格的宽度，超过出现滚动条
            // scrollHeight: 400, // table表格的高度，超过出现滚动条
            rowSelectionType: 'checkbox', // 表格单选多选展示
        };
        // 查询form的配置项
        this.searchFormConfig = {
            showCount: 5 // 查询表单默认展示个数
        }
        // 面包屑
        this.pageBreadCrumbs = {
            // 方式一：文本和url匹配
            breadCrumbText: '/开放平台售后工单/我收到的售后列表',
            // 方式二：自己配置
            breadCrumbList: [
                {
                    name: '首页',
                    link: true,
                    path: '/'
                },
                {
                    name: '开放平台售后工单',
                    link: false,
                },
                {
                    name: '我收到的售后列表',
                    link: false,
                }
            ]
        };
        // 详情页弹框配置项（传入组件）
        this.detailModal = ShowDetailModal;
        // 新增编辑弹框配置项（传入组件）
        this.addOrEditModal = ShowAddOrEditModal;
        // 跳转到新增页面（传入路由，如果传入则是跳转页面不是弹框）
        this.btnAddPageUrl = '/usePage/usePageAddForm';
        // 返回到当前页面（配合新增使用）
        this.btnReturnUrl = '/usePage';
        // 编辑、删除等操作的的默认id
        this.guidId = 'id';
        this.guidIds = 'ids';
        // 操作栏
        this.controlBar = {
            // 左边的操作按钮
            leftControlBar: {
                // 批量删除
                batchDeleteConf: {
                    title: '删除确认',
                    content: '确定要删除所选数据吗？',
                },
                // 批量启用禁用
                batchEnableConf: {
                    title: '禁用确认',
                    content: '确定要禁用11所选数据吗？',
                    // 启用禁用的字段是什么
                    enableField: 'isEnable',
                },
                // // 需要添加的操作栏
                // addLeftBtnArr: [{
                //     text: '展示特殊弹框', // 按钮的文字
                //     needDisabled: false, // 是否要根据表格选择的checkbox启用禁用
                //     onClick: this.specialModal // 回调的点击事件，回调this
                // },]
            },
            // 右边的操作按钮
            rightControlBar: {
                // 新增
                btnAddText: '新增数据',
                // 需要添加的操作栏
                addRightBtnArr: [{
                    text: '展示特殊弹框22',  // 按钮的文字 
                    onClick: this.showRightModal // 回调的点击事件，回调this
                }]
            }
        };
        // 是否展示tabs
        this.showTabsConfig = {
            name: 'orderStatus',
            list: [{
                key: '1',
                tab: '选项1'
            }, {
                key: '2',
                tab: '选项2'
            }, {
                key: '3',
                tab: '选项3'
            }, {
                key: '4',
                tab: '选项4'
            }]
        };

    }
    // 处理初始化的数据
    initManage = () => {
        // 如果有tab选项功能
        if (this.showTabsConfig.name) {
            const { postData } = this.state;
            postData[this.showTabsConfig.name] = this.showTabsConfig.list[0].key;
            this.setState({
                postData
            });
        }
        // 设置当前页面的state
        this.setState({
            searchFormConfig: cloneDeep(searchFormConfig), // 查询的formconfig
            // 控制table显示延迟时间
            showTableTime: 0,
            // 设置表格字段
            tableColumns: [{
                title: '报警ID',
                dataIndex: 'id',
                key: 'id',
                width: '150px',
            },
            {
                title: '报警应用',
                dataIndex: 'stockName',
                key: 'stockName',
            }, {
                title: '报警维度',
                dataIndex: 'type',
                key: 'type',
                width: '150px',
                render: (text) => {
                    const obj = { 1: '订单报警', 2: '库存报警', 3: '余额报警' };
                    return obj[text];
                }
            }, {
                title: '报警内容',
                dataIndex: 'name',
                key: 'name',
                width: '250px',
            }, {
                title: '报警方式',
                dataIndex: 'wranMode',
                key: 'wranMode',
                width: '150px',
                render: () => {
                    return '钉钉群';
                }
            }, {
                title: '发送时间',
                dataIndex: 'sendTime',
                key: 'sendTime',
                width: '150px',
            }, {
                title: '发送状态',
                dataIndex: 'isSend',
                key: 'isSend',
                width: '150px',
                render: (text) => {
                    return text ? '成功' : '失败';
                }
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '220px',
                fixed: 'right',
                render: (text, record) => {
                    return (<div>
                        <a onClick={() => this.showDetailModal(record)}>查看详情</a>
                        <Divider type="vertical" />
                        <a onClick={() => this.enableInfo(!record.isEnable, record.id)}>{record.isEnable ? '停用' : '启用'}</a>
                        <Divider type="vertical" />
                        <a onClick={() => this.showAddOrEditModal(record)}>编辑</a>
                        <Divider type="vertical" />
                        <a onClick={() => this.deleteInfo(record.id)}>删除</a>
                    </div>);
                }
            }]
        });
    }
    componentWillMount() {
        this.initManage();
    }
    componentWillReceiveProps(nextProps) {

    }

    // 加载loading
    getSpinningLoading = () => {
        if (this.props.loading)
            return !!this.props.loading.models[this.namespace];
        return false;
    }
    // 加载table上方的数据
    renderTableTopContent = () => {
    }
    // 加载table下方的数据
    renderTableBottomContent = () => {
    }
}
const mapStateToProps = (state) => {
    return {
        ...state
    };
}
export default connect(mapStateToProps)(UsePage);
