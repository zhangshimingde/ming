import moment from 'moment';
export default [{
    label: '创建时间单',
    type: 'MonthPicker',
    name: 'date',
    initialValue: '',
    timeFormat: 'YYYY-MM',
    allowClear: true,
}, {
    label: '监控名称', // label
    type: 'Input', // 给Input Select Time
    name: 'name', // name
    numberObj: {
        type: 'decimal' // 数字e是否可以输入
    },
    noSingle: true,
    placeholder: '请输入监控名称', // placeholder
}, {
    label: '监控名称',
    type: 'Input',
    name: 'name1',
    noSingle: true,
}, {
    label: '监控应用',
    type: 'Select',
    name: 'clientId',
    initialValue: '',
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
    label: '创建人',
    type: 'Input',
    name: 'creatorName',
    numberObj: {
    },
    placeholder: '请输入创建人',
}, {
    label: '监控状态',
    type: 'Select',
    name: 'isEnable',
    initialValue: '',
    showSearch: true,
    items: [
        { name: '全部', value: '' },
        { name: '启用', value: true },
        { name: '停用', value: false },
    ]
}, {
    label: '监控状态2',
    type: 'Select',
    name: 'isEnable1',
    showSearch: true,
    initialValue: '',
    items: [
        { name: '全部', value: '' },
        { name: '启用', value: true },
        { name: '停用', value: false },
    ]
},
{
    label: '默认时间',
    type: 'RangePicker',
    name: 'DefaultTime',
    initialValue: ['2019.07.20 00:00:00', '2019.08.15 23:59:59'],
    timeFormat: 'YYYY.MM.DD',
    responseFiled: {
        beginTime: 'startDefaultTime',
        endTime: 'endDefaultTime',
    },
    allowClear: true,
    disabledTime: {
        beforeDate: moment(moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00')),
        afterDate: moment(moment().format('YYYY-MM-DD 23:59:59')),
    },
    // isAllowAfterTime: {
    //     beforeDate: '2019-07-01 00:00:00',
    //     afterDate: '2019-08-30 23:00:00'
    // }
},
{
    label: '创建时间2',
    type: 'RangePicker',
    name: 'CreateTime',
    initialValue: ['2019.07.01 00:00:00', '2019.07.03 23:00:00'],
    timeFormat: 'YYYY-MM-DD HH:mm:ss',
    responseFiled: {
        beginTime: 'start11CreateTime',
        endTime: 'end22CreateTime',
    },
    // showTime: {
    //     hideDisabledOptions: true,
    //     defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
    // },
    disabledTime: {
        beforeDate: moment(moment().subtract(3, 'day').format('YYYY-MM-DD 00:00:00')),
        afterDate: moment(moment().format('YYYY-MM-DD 23:59:59')),
    },
    allowClear: true,
}
];
