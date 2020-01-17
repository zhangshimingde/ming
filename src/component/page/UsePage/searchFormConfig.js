export default [{
    label: '库存编号', // label
    type: 'Input', // 给Input Select Time
    name: 'id', // name
    // numberObj: {
    //     type: 'decimal' // 数字e是否可以输入
    // },
    // maxLength: 10,
    placeholder: '请输入监控名称', // placeholder
    initialValue: ''
}, {
    label: '库存名称',
    type: 'Input',
    name: 'name',
    maxLength: 10,
    initialValue: ''
}, {
    label: '创建时间',
    type: 'RangePicker',
    name: 'Time',
    initialValue: '',
    responseFiled: {
        beginTime: 'startTime',
        endTime: 'endTime',
    },
    timeFormat: 'YYYY/MM/DD HH:mm:ss',
    showTime: true,
    allowClear: true,
}, {
    label: '库存状态',
    type: 'Select',
    name: 'status',
    initialValue: '',
    items: [
        { name: '全部', value: '' },
        { name: '库存充足', value: 0 },
        { name: '库存警报', value: 1 },
        { name: '库存断货', value: 2 },
    ]
}, {
    label: '库存类型',
    type: 'Select',
    name: 'type',
    initialValue: '',
    items: [
        { name: '全部', value: '' },
        { name: '在线', value: 0 },
        { name: '卡密', value: 1 },
    ]
},{
    label: '库存面值',
    type: 'Input',
    name: 'parValue',
    maxLength: 10,
    initialValue: ''
}];
