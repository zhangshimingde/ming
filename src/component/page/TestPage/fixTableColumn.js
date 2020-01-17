import React from 'react';

const columns = [
    {
        title: '序号',
        align: 'center',
        dataIndex: 'index',
        className: 'sort-cell',
        width: 80,
        fixed: 'left',
        render: (text, record, index) => {
            return (
                <span>{index + 1}</span>
            );
        },
    }, {
        title: '店铺订单号',
        width: 180,
        dataIndex: 'name',
        fixed: 'left',
    }, {
        title: '付款时间',
        width: 120,
        dataIndex: 'age',
        fixed: 'left',
    }, {
        title: '充值账号',
        width: 100,
        dataIndex: 'sex',
        fixed: 'left',
    }, {
        title: '店铺商品编号',
        width: 140,
        dataIndex: 'productId',
    }, {
        title: '店铺商品名称',
        width: 150,
        dataIndex: 'productName',
    }, {
        title: '购买数量',
        width: 100,
        dataIndex: 'buyNum',
    }, {
        title: '购买总价(元)',
        width: 120,
        dataIndex: 'totalPrice',
    }, {
        title: '订单号',
        width: 100,
        dataIndex: 'fuluOrderNo',
    }, {
        title: '订单状态',
        // width: 100,
        dataIndex: 'orderStatus',
    }, {
        title: '充值成功时间',
        width: 140,
        dataIndex: 'successTime',
    }, {
        title: '订单耗时',
        width: 100,
        dataIndex: 'elapsedTime',
    }, {
        title: '成本价(元)',
        width: 100,
        dataIndex: 'costPrice',
    }, {
        title: '利润(元)',
        width: 100,
        dataIndex: 'profit',
    }, {
        title: '手续费(元)',
        width: 100,
        dataIndex: 'buyerQQ',
    }, {
        title: '操作',
        width: 60,
        dataIndex: 'operration',
        fixed: 'right',
        // renderContent: [
        //     {
        //         type: 'span',
        //         text: '详情',
        //         config: {
        //             className: 'operation-link',
        //         },
        //         clickfnname: 'handleShowDetail',
        //     },
        // ],
    },
];

export default columns;
