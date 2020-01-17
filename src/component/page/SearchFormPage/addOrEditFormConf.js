export default [
    {
        label: '监控名称', // label
        type: 'Text', // 给Input Select Time
        name: 'monitorName2',
        col: {
            antColSpan: 12,
            wrapperColSpan: 16,
            labelColSpan: 8,
        },
        initialValue: '监控列表报警数据3'
    },
    {
        label: '监控名称22', // label
        type: 'Text', // 给Input Select Time
        name: 'monitorName222',
        col: {
            antColSpan: 12,
            wrapperColSpan: 16,
            labelColSpan: 8,
        },
        initialValue: '监控列表报警数据4'
    }, {
        label: '监控应用',
        type: 'Select',
        name: 'clientId',
        initialValue: 'SUP',
        disabled: true,
        col: {
            antColSpan: 24,
            wrapperColSpan: 16,
            labelColSpan: 8,
        },
        tipsObj: {
            type: 'icon',
            text: '123213',
        },
        items: [
            { name: '全部应用', value: '' },
            { name: 'SUP', value: 'SUP' },
            { name: 'TSC', value: 'TSC' },
            { name: 'API', value: 'API' },
            { name: 'POP', value: 'POP' },
            { name: 'MALL', value: 'MALL' },
            { name: '物流', value: '物流' },
        ]
    }, {
        label: '上传图片', // label
        type: 'Upload', // 给Input Select Time
        name: 'imgUrl', // name
        // initialValue: '',
        disabled: true,
        col: {
            antColSpan: 24,
            wrapperColSpan: 16,
            labelColSpan: 8,
        },
        uploadUrl: 'http://test.h5-manage.k8s.ichnb.com/api/FileUpload/Upload',
        initialValue: 'http://fulu-ich-oa.oss-cn-hangzhou.aliyuncs.com/280240cfd71b4a358c866d8d496d49ac.png',
        previewImageWidth: 900,
        isRequred: true,
        col: {
            antColSpan: 24,
            wrapperColSpan: 8,
            labelColSpan: 4,
        },
    }, {
        label: '单选框',
        type: 'Radio',
        name: 'radio',
        initialValue: 'TSC',
        disabled: true,
        tipsObj: {
            type: 'icon',
            text: '123213',
        },
        col: {
            antColSpan: 24,
            wrapperColSpan: 16,
            labelColSpan: 8,
        },
        rules: [
            { required: true, message: '请输入单选框' }
        ],
        items: [
            { name: 'SUP', value: 'SUP' },
            { name: 'TSC', value: 'TSC' },
            { name: 'API', value: 'API' },
            { name: 'POP', value: 'POP' },
            { name: 'MALL', value: 'MALL' },
            { name: '物流', value: '物流' },
        ]
    }, {
        label: '监控名称221', // label
        type: 'Input', // 给Input Select Time
        name: 'name2112', // name
        maxLength: 10,
        disabled: true,
        col: {
            antColSpan: 24,
            wrapperColSpan: 8,
            labelColSpan: 4,
        },
        rules: [
            { required: true, message: '请输入监控名称' }
        ],
        placeholder: '请输入监控名称', // placeholder
        initialValue: 'SUP1'
    }, {
        label: '监控名称222', // label
        type: 'Input', // 给Input Select Time
        name: 'name33332', // name
        col: {
            antColSpan: 24,
            wrapperColSpan: 16,
            labelColSpan: 8,
        },
        tipsObj: {
            type: 'icon',
            text: '123213',
        },
        rules: [
            { required: true, message: '请输入监控名称' }
        ],
        placeholder: '请输入监控名称', // placeholder
        initialValue: 'SUP1'
    },
    {
        label: '备注说明', // label
        type: 'TextArea', // 给Input Select RangePicker
        name: 'remark', // name
        autosize: { minRows: 6, maxRows: 6 },
        col: {
            antColSpan: 24,
            wrapperColSpan: 12,
            labelColSpan: 4,
        },
        placeholder: '请输入备注说明', // placeholder
        initialValue: ''
    },
    {
        label: '创建时间单',
        type: 'DatePicker',
        name: 'date',
        initialValue: '2018-01-01 00:00:00',
        timeFormat: 'YYYY/MM/DD',
        col: {
            antColSpan: 24,
            wrapperColSpan: 8,
            labelColSpan: 4,
        },
        rules: [
            { required: true, message: '请输入创建时间单' }
        ],
        allowClear: true,
        disabledTime: '2019.08.15 23:00:00',
    },
    {
        label: '创建时间',
        type: 'RangePicker',
        name: 'Time',
        responseFiled: {
            beginTime: 'startCreateTime',
            endTime: 'endCreateTime',
        },
        initialValue: ['2019.09.20 00:00:00', '2019.10.15 23:00:00'],
        timeFormat: 'YYYY/MM/DD',
        col: {
            antColSpan: 24,
            wrapperColSpan: 16,
            labelColSpan: 4,
        },
        rules: [
            { required: true, message: '请输入创建时间' }
        ],
        allowClear: true,
        // disabledTime: {
        //     beforeDate: '2019-07-01 00:00:00',
        //     afterDate: '2019-08-30 23:00:00'
        // },
    }
];
