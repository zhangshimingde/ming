export default [
    {
        label: '库存名称', // label
        type: 'Input', // 给Input Select RangePicker
        name: 'name', // name
        // col: {
        //     antColSpan: 24,
        //     wrapperColSpan: 8,
        //     labelColSpan: 4,
        // },
        rules: [
            { required: true, message: '请输入库存名称' },
            {
                pattern: /^[1-9]\d*$/,
                message: '库存名称只能输入正整数，请重新输入'
            }
        ],
        maxLength: 30,
        placeholder: '请输入库存名称', // placeholder
        initialValue: ''
    }, {
        label: '库存类型',
        type: 'Radio',
        name: 'type',
        initialValue: 0,
        // col: {
        //     antColSpan: 24,
        //     wrapperColSpan: 16,
        //     labelColSpan: 8,
        // },
        // tipsObj: {
        //     type: 'icon',
        //     text: '83213',
        // },
        rules: [
            { required: true, message: '请输入库存类型' },
        ],
        items: [
            { name: '在线', value: 0 },
            { name: '卡密', value: 1 },
        ]
    }, {
        label: '库存面值', // label
        type: 'Input', // 给Input Select RangePicker
        name: 'parValue', // name
        // col: {
        //     antColSpan: 24,
        //     wrapperColSpan: 8,
        //     labelColSpan: 4,
        // },
        rules: [
            { required: true, message: '请输入库存面值' },
            {
                pattern: /^[1-9]\d*$/,
                message: '库存面值只能输入正整数，请重新输入'
            }, {
                pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]{0,4})?$/,
                message: '库存面值只能输入正111整数，请重新输入'
            }
        ],
        placeholder: '请输入库存面值', // placeholder
        initialValue: ''
    }, {
        label: '库存报警数量', // label
        type: 'Input', // 给Input Select RangePicker
        name: 'warningCount', // name
        // col: {
        //     antColSpan: 24,
        //     wrapperColSpan: 16,
        //     labelColSpan: 8,
        // },
        // tipsObj: {
        //     type: 'icon',
        //     text: '提示：只有一个直充账号时报警数量只能填0，否则会警报或断货。',
        // },

        placeholder: '请输入库存报警数量', // placeholder
        initialValue: ''
    },
    {
        label: '充值渠道',
        type: 'Select',
        name: 'channelId',
        initialValue: '',
        showSearch: true,
        // col: {
        //     antColSpan: 24,
        //     wrapperColSpan: 8,
        //     labelColSpan: 4,
        // },
        items: [
            { name: '全部应用', value: '' },
            { name: '天宏Q币a', value: 1 },
            { name: '般豆Q币', value: 2 },
            { name: '天宏天游', value: 4 },
            { name: '全国Q币', value: 5 },
        ]
    },
    {
        label: '备注说明', // label
        type: 'TextArea', // 给Input Select RangePicker
        name: 'remark', // name
        autosize:{ minRows: 4, maxRows: 6 },
        // col: {
        //     antColSpan: 24,
        //     wrapperColSpan: 12,
        //     labelColSpan: 4,
        // },
        placeholder: '请输入备注说明', // placeholder
        initialValue: ''
    }
];
