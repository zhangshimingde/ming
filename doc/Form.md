### Form

## 响应式写法

*.添加className="fl-form"

```
<Form layout="inline" className="fl-form">
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

效果图

<img src="./form.gif">
