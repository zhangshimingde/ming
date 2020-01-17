### 查询表单组件（SearchForm）
#### 组件传入值

```
<SearchForm
    searchConfig={searchFormConfig}
    initNoSearch={this.searchFormConfig.initNoSearch}
    exportToExcelSetting={{
        url: 'http://10.0.1.29:3002/api/admin/merchantstastic/ExportMerchantStasticList',
        merchantId: '',
        params: { name: 1 },
        fileName: '123123',
        method: 'post'
    }}
    exportToExcel={this.exportToExcel}
    search={this.search}
    onFieldsChange={this.onFieldsChange}
    showCount={this.searchFormConfig.showCount}
    toggleSearchForm={this.toggleSearchForm}
    onRef={r => this.child = r}
/>
```

参数 | 说明 | 类型
---|---|---
searchConfig | 传入的配置文件 | Array
initNoSearch | 初始化是否不加载，true：不加载，false：加载，不传默认加载列表 | Boolean
exportToExcel | 回调的导出excel的函数，传入则展示导出excel按钮，不传默认不展示(老功能) | Function
exportToExcelSetting | 传入导出excel的配置项（参数见ExportButton），不传默认不展示(新功能) | Object
search | 回调的查询函数 | Function
onFieldsChange | 字段改变传入的回调事件 | Function
showCount | 初始化展示文本框的个数，传入则展示收起、展开功能，不传默认展示全部 | Int
toggleSearchForm | 收起、展开功能的回调函数 | Int
onRef | 父子组件通信   this.child.reset();  this.child.search(); | Int

- 传入的配置项searchConfig

```
// 传入数组
[{
    label: '库存编号', // label
    type: 'Input', // 给Input Select Time
    name: 'id', // name
    numberObj: {
        type: 'decimal' // 数字e是否可以输入
    },
    maxLength: 10,
    placeholder: '请输入监控名称', // placeholder
    initialValue: ''
},  {
    label: '创建时间',
    type: 'RangePicker',
    name: 'Time',
    initialValue: '',
    responseFiled: {
        beginTime: 'startTime',
        endTime: 'endTime',
    },
    timeFormat: 'YYYY/MM/DD HH:mm:ss',
     // showTime: {
    //     hideDisabledOptions: true,
    //     defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
    // },
    allowClear: true,
    disabledTime: {
        beforeDate: '2019-07-01 00:00:00',
        afterDate: '2019-08-30 23:00:00'
    },
}
,{
    label: '创建时间单',
    type: 'MonthPicker',
    name: 'date',
    initialValue: '',
    timeFormat: 'YYYY-MM',
    allowClear: true,
},  {
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
}]
```

- 公用属性：

参数 | 说明 | 类型
---|---|---
label | 标签的文本 | String
type | 标签类型，分为Input、Select、RangePicker | String
name | 标签的字段名称 | String
initialValue | 文本框默认值 | String
placeholder | 描述输入字段预期值的提示信息 | String

- Input：

参数 | 说明 | 类型
---|---|---
numberObj | 是否是数字类型，type：decimal（只能输入小数），默认整数| Object
maxLength | 文本输入的最大数量 | Int

- MonthPicker，功能同RangePicker

参数 | 说明 | 类型
---|---|---
initialValue | 初始化值，时间，例如：'2018-01' | String
timeFormat | 时间返回的数据格式，例如：'YYYY/MM/DD HH:mm:ss' | String


- RangePicker

参数 | 说明 | 类型
---|---|---
responseFiled | 时间返回值，传入想要返回的开始时间和结束时间，例如：{beginTime: 'startTime',endTime: 'endTime' } | Object
timeFormat  | 时间返回的数据格式，例如：'YYYY/MM/DD HH:mm:ss' | String
showTime | 时间选择显示的格式，时间选择功能类比antd的时间选择功能 | Object
initialValue | 初始化值，可以传入数组也可以传入空字符串，例如：['2018-01-01 00:00:00', '2018-10-01 23:00:00'] | Array
allowClear | 是否允许清除，true：允许，false：不允许，不传不允许 | Boolean
disabledTime | 禁用时间段，true：默认禁用今天之后，false：不禁用时间，对象：传递对象时间段进行禁用 | Object Boolean

- Select

参数 | 说明 | 类型
---|---|---
showSearch | 是否展示搜索功能，true：展示，false：不展示，默认不展示 | Boolean
items | 加载的下拉数据 | Array
