## 组件开发规范指南

### 前言
目前组件库基于antd封装了一些个性化组件，为保证页面最终效果符合UI规范，请遵循以下开发指南；

### 组件引用

<p style="color:red;">以下组件在antd和fl-pro都存在，但是具有一些差别，如果需要使用这些组件的话，请优先使用fl-pro提供的组件</p>
#### 1.DatePicker
*DatePicker主要修改了样式，而RangePicker进行了较大调整，在项目中需要使用DatePicker时，请使用公司组件库的组件：

```
import { DatePicker } from 'fl-pro';

const { RangePicker, MonthPicker } = DatePicker;
```

RangePicker组件示例

<img src="./rangePicker.png">

#### 2.Select
*Select组件修改了默认图标样式，使用方式保持一致

```
import { Select } from 'fl-pro';

const Option = Select.Option;
```

#### 3.Confirm
*Confirm基于Modal封装，优化了图标和其他样式
```
import { Confirm } from 'fl-pro';

......
Confirm({
	type: 'warn',
	title: 'This is a warning message',
	content: 'some messages...some messages...',
});
```

#### 4.Popover
*Popover基于antd的Popover封装，只支持title属性，去掉了content属性

```
import { Popover } from 'fl-pro';

......

<Popover placement="rightTop" title="Title">
    <Button type="primary">Hover me</Button>
</Popover>
```

#### 5.Table

```
import { Table } from 'fl-pro';

...
```

*Table在列较多的情况下，容易出现换行或者错位的问题，导致体验较差，在这种情况下，推荐如下写法(ellipsis确保不换行，scroll.x确保表格出现滚动条的最小宽度)：

```
<Table
    ellipsis
    scroll={{
        x: 1280,
        ...
    }}
    ...
/>
```

*注意事项: 如果采用上述写法且自定义render方法，那么最好提供标签的title属性，以防文字省略导致内容不可见；

### 响应式开发

#### 1.Form表单

*Form表单可以支持组件排列自适应的效果，但是在实际工作中却很少使用，为了更好的交互效果，请遵循如下写法（这里只是示例，最佳数值设置可能需要实际调试）：

<p style="color:red;">RangePicker由于组件较长，因此占据控件比一般组件大一倍，在设置Col属性时，与其他组件稍有不同</p>
```
<Form layout="inline">
    <Row gutter={{
        sm: 16,
        md: 24,
    }}>
        <Col xs={24} sm={16} md={12} lg={8} xl={8}>
            <Form.Item label="日期">
                <RangePicker showTime />
            </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={4}>
            <Form.Item label="a">
                <Input />
            </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={4}>
            <Form.Item label="aaaa">
                <Input />
            </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={4}>
            <Form.Item label="ab">
                <Select defaultValue="lucy">
                    <Option value="lucy">Lucy</Option>
                </Select>
            </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={4}>
            <Form.Item label="a">
                <Input />
            </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={4}>
            <Form.Item label="a">
                <Input />
            </Form.Item>
        </Col>
    </Row>
</Form>
```