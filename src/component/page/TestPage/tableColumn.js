import React from 'react';
import {
    Menu,
} from 'antd';

const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
        </Menu.Item>
    </Menu>
);

const columns = [{
        title: '序号',
        sortIndex: true,
        align: 'center',
        width: 80,
    }, {
        title: 'name',
        dataIndex: 'name',
        width: '180px',
        // resizeble: true, // 列可伸缩配置
        minWidth: '100px',
        nowrap: true,
        showToolTip: true,
        editType: 'Input',
        editable: true, // 可编辑配置
        rules: [{ // 编辑校验规则
            required: true,
            message: '请输入姓名',
        }]
    }, {
        title: 'age',
        dataIndex: 'age',
        width: '150',
        decimal: {
            length: 4, // 小数位保留长度
            thousandBit: true, // 千分位显示
        },
        // resizeble: true, // 列可伸缩配置
        // editType: 'Input',
        // editable: true,
        // decimal: {
        //     thousandBit: true, 
        // },
        // rules: [{
        //     required: true,
        //     message: '请输入年龄',
        // }],
        // sorter: true,
        // sortOrder: 'ascend',
    }, {
        title: '性别',
        dataIndex: 'sex',
        width: '150',
        style: {
            width: '150px',
        },
        editType: 'Select',
        options: [{
            value: '1',
            text: '男'
        }, {
            value: '2',
            text: '女'
        }],
        // editable: true,
        render: (text) => {
            return (
                <span>{ text === '1' ? '男' : '女' }</span>
            );
        }
    }, {
        title: 'date',
        dataIndex: 'date',
        // editType: 'DatePicker',
        // editable: true,
    }, {
        title: '操作',
        dataIndex: 'operation',
        useIcon: true,
        // fixed: 'right',
    }
];

export default columns;
