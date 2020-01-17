### 新增编辑表单组件（AddOrEditForm）
#### 组件传入值

```
<AddOrEditForm
    okText="确定"
    cancelText="取消"
    config={addOrEditFormConfig}
    btnSubmit={this.btnModalSubmit}
    btnCancel={this.btnModalCancel}
    onSubmitFieldsChange={this.onSubmitFieldsChange}
/>
```

参数 | 说明 | 类型
---|---|---
okText | 确定按钮的文本值 | String
cancelText | 取消按钮的文本值 | String
config | 传入的配置项 | Array
btnSubmit | 回调的保存函数 | Function
btnCancel | 回调的取消函数 | Function
onFieldsChange | 字段改变传入的回调事件 | Function

- 1.组件配置项
- 传入的配置项addOrEditFormConfig

```
[
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
        autosize: true,
        disabled: true,
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
        disabled: true,
        col: {
            antColSpan: 24,
            wrapperColSpan: 8,
            labelColSpan: 4,
        },
        rules: [
            { required: true, message: '请输入创建时间单' }
        ],
        allowClear: true,
        isAllowAfterTime: false
    },
    {
        label: '创建时间',
        type: 'RangePicker',
        name: 'Time',
        disabled: true,
        responseFiled: {
            beginTime: 'startCreateTime',
            endTime: 'endCreateTime',
        },
        initialValue: ['2018-01-01 00:00:00', '2018-10-01 23:00:00'],
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
        disabledTime: {
            beforeDate: '2019-07-01 00:00:00',
            afterDate: '2019-08-30 23:00:00'
        },
    }
]
```

- 公用：

参数 | 说明 | 类型
---|---|---
label | 标签的文本 | String
type | 标签类型，分为Input、Select、RangePicker | String
name | 标签的字段名称 | String
disabled | 是否禁用 | Boolean
initialValue | 文本框默认值 | String
placeholder | 描述输入字段预期值的提示信息 | String
rules | 验证文本框数据，同antd的验证一样 | Array
col | antColSpan：当前行占的大小，labelColSpan：标题文本的大小，wrapperColSpan：文本所占的大小 | Object

- Input：

参数 | 说明 | 类型
---|---|---
tipsObj | 展示文本框右侧的文字或图标的提示，type：text（文本），icon（图标），text：文本值 | Object
rules | 验证功能，requiredMessage：传入必填项提示文本，type：decimal（只能输入小数），默认整数，decimalPlaces：小数的个数（2位或4位，不传无限个小数），patternMessage：验证失败提示的文字 | Object
maxLength | 文本输入的最大数量 | Int

- TextArea

参数 | 说明 | 类型
---|---|---
rules | 验证功能，requiredMessage：传入必填项提示文本 | Object
maxLength | 文本输入的最大数量 | Int
autosize | textarea的高度 | Obj

- Radio

参数 | 说明 | 类型
---|---|---
tipsObj | 展示文本框右侧的文字或图标的提示，type：text（文本），icon（图标），text：文本值 | Object
rules | 验证功能，requiredMessage：传入必填项提示文本 | Object
items | 加载的下拉数据 | Array

- RangePicker
实现了时间返回格式的处理，以及想要返回的数据字段

参数 | 说明 | 类型
---|---|---
rules | 验证功能，requiredMessage：传入必填项提示文本 | Object
responseFiled | 时间返回值，传入想要返回的开始时间和结束时间，例如：{beginTime: 'startTime',endTime: 'endTime' } | Object
timeFormat  | 时间返回的数据格式，例如：'YYYY/MM/DD HH:mm:ss' | String
showTime | 时间选择显示的格式，时间选择功能类比antd的时间选择功能 | Object
initialValue | 初始化值，可以传入数组也可以传入空字符串，例如：['2018-01-01 00:00:00', '2018-10-01 23:00:00'] | Array
allowClear | 是否允许清除，true：允许，false：不允许，不传不允许 | Boolean
disabledTime | 禁用时间段，true：默认禁用今天之后，false：不禁用时间，对象：传递对象时间段进行禁用 | Object Boolean

- DatePicker，功能同RangePicker

参数 | 说明 | 类型
---|---|---
initialValue | 初始化值，时间，例如：'2018-01-01 00:00:00' | String
disabledTime | 禁用时间，true：默认禁用今天之后，false：不禁用时间，字符串：传递禁用时间进行禁用 | String

- Select

参数 | 说明 | 类型
---|---|---
rules | 验证功能，requiredMessage：传入必填项提示文本 | Object
showSearch | 是否展示搜索功能，true：展示，false：不展示，默认不展示 | Boolean
items | 加载的下拉数据 | Array 

- Upload
已处理图片传入返回格式（新增、编辑）

参数 | 说明 | 类型
---|---|---
isRequred | 是否必填，true：必填，false：不必填，不传默认不必填 | Boolean
uploadUrl | 上传图片的地址 | Boolean
previewImageWidth | 图片预览的大小 | Int


- render
自定义组件
```
{
    render() {

    }
}
// 使用
addOrEditFormConfig[3].render = <span>111</span>
```