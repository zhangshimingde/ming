import React from 'react';
import { Button, Badge, Breadcrumb, ConfigProvider, Checkbox, Radio, Form, Col, Row,
    Switch, Select, Icon, Input, InputNumber, Pagination, Tabs, message } from 'antd';
import Table from '../../widget/Table';
import moment from 'moment';
import 'moment/locale/zh-cn';
import zhCN from 'antd/es/locale-provider/zh_CN';
import DatePicker from '../../widget/DatePicker';
// import { DatePicker } from 'fl-pro';
import tableColumn from '../TestPage/tableColumn';
import '../../../assets/less/cdn.less';

// moment.locale('zh-cn');

const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 16 },
    },
};
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const { TabPane } = Tabs;

class UIPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            pageSize: 10,
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.columns = tableColumn.slice();
        this.columns[this.columns.length -1].render = (text, record, index) => {
            return (
                <React.Fragment>
                    <a>编辑</a>
                    <a>查看</a>
                </React.Fragment>
            );
        };
    }
    onSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    render() {
        const { pageIndex, pageSize } = this.state;
        const { getFieldDecorator } = this.props.form;
        const pagination = {
            total: dataSource.length,
            pageSize,
            current: pageIndex,
            onChange: (pIndex, pSize) => {
                this.setState({
                    pageIndex: pIndex,
                    pageSize: pSize,
                });
            },
            onShowSizeChange: (current, pSize) => {
                this.setState({
                    pageIndex: 1,
                    pageSize: pSize,
                });
            }
        };
        return (
            <ConfigProvider locale={zhCN}>
                <div className="fulu-wrapper" style={{ margin: '20px' }}>
                    <p>
                        <Button type="primary">主按钮</Button>
                        <Button type="primary" ghost>主按钮</Button>
                        <Button ghost>主按钮</Button>
                        <Button>主按钮</Button>
                    </p>
                    <p>
                        <Button type="primary" disabled>主按钮</Button>
                        <Button type="primary" ghost disabled>主按钮</Button>
                        <Button ghost disabled>主按钮</Button>
                        <Button disabled>主按钮</Button>
                    </p>
                    <p>
                        <Button type="primary" size="small">主按钮</Button>
                        <Button type="primary" ghost size="small">主按钮</Button>
                        <Button ghost size="small">主按钮</Button>
                        <Button size="small">主按钮</Button>
                    </p>
                    <p>
                        <Button type="primary" disabled size="small">主按钮</Button>
                        <Button type="primary" ghost disabled size="small">主按钮</Button>
                        <Button ghost disabled size="small">主按钮</Button>
                        <Button disabled size="small">主按钮</Button>
                    </p>
                    <p>
                    <Button type="primary">主按钮主按钮</Button>
                    </p>
                    <p>单选复选框</p>
                    <p>
                        <Radio>Radio</Radio>
                        <Radio checked>Radio</Radio>
                        <Radio disabled>Radio</Radio>
                        <Radio checked disabled>Radio</Radio>
                        <Radio.Group>
                            <Radio value={1}>A</Radio>
                            <Radio value={2}>B</Radio>
                            <Radio value={3}>C</Radio>
                            <Radio value={4}>D</Radio>
                        </Radio.Group>
                    </p>
                    <p>
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value="a">上海</Radio.Button>
                            <Radio.Button value="b">北京</Radio.Button>
                            <Radio.Button value="c">Beijing</Radio.Button>
                            <Radio.Button value="d">Chengdu</Radio.Button>
                        </Radio.Group>
                    </p>
                    <p>
                        <Radio.Group buttonStyle="solid" disabled value="a">
                            <Radio.Button value="a">Hangzhou</Radio.Button>
                            <Radio.Button value="b">Shanghai</Radio.Button>
                            <Radio.Button value="c">Beijing</Radio.Button>
                            <Radio.Button value="d">Chengdu</Radio.Button>
                        </Radio.Group>
                    </p>
                    <p>
                        <Checkbox>Checkbox</Checkbox>
                        <Checkbox checked>Checkbox</Checkbox>
                        <Checkbox disabled>Checkbox</Checkbox>
                        <Checkbox checked disabled>Checkbox</Checkbox>
                    </p>
                    <p>
                        <CheckboxGroup
                            options={['Apple', 'Pear', 'Orange']}
                        />
                    </p>
                    <p>开关</p>
                    <p>
                        <Switch />
                        <Switch disabled />
                        <Switch defaultChecked disabled />
                    </p>
                    <Switch disabled checkedChildren="开" unCheckedChildren="关" defaultChecked />
                    <Switch disabled checkedChildren="1" unCheckedChildren="0" />
                    <Switch
                        checkedChildren={<Icon type="check" />}
                        unCheckedChildren={<Icon type="close" />}
                        defaultChecked
                    />
                    <p>
                        <Badge count={5} />
                        <Badge count={25} style={{ margin: '0 10px' }} />
                        <Badge count={125} />
                    </p>
                    <p>下拉框</p>
                    <p>
                        <Select defaultValue="lucy" style={{ width: 120 }} size="small">
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="disabled" disabled>
                                Disabled
                            </Option>
                            <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                        <Select defaultValue="lucy" style={{ width: 120 }} mode="tags" tokenSeparators={[',']}>
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                        <Select defaultValue="lucy" style={{ width: 120 }} disabled>
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="disabled" disabled>
                                Disabled
                            </Option>
                            <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                    </p>
                    <p>输入框</p>
                    <Input style={{ width: '150px' }}  placeholder="请输入" />
                    <Input style={{ width: '150px' }} disabled />
                    <Input style={{ width: '150px' }} size="small" />
                    <p>
                        <InputNumber />
                        <InputNumber disabled/>
                        <InputNumber size="small" />
                    </p>
                    <p>时间</p>
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                    <MonthPicker />
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" disabledTime={disabledRangeTime} />
                    <p>table</p>
                    <Table
                        columns={this.columns}
                        dataSource={dataSource}
                        rowSelection={{
                            type: 'checkbox',
                        }}
                        pagination={pagination}
                        rowKey="id"
                    />
                    <Pagination defaultCurrent={1} total={50} />
                    <p>面包屑</p>
                    <Breadcrumb>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>
                        <a href="">Application Center</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                        <a href="">Application List</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>An Application</Breadcrumb.Item>
                    </Breadcrumb>
                    <p>
                    <Tabs type="card">
                        <TabPane tab="Tab 1" key="1">
                            Content of Tab Pane 1
                        </TabPane>
                        <TabPane tab="Tab 2" key="2">
                            Content of Tab Pane 2
                        </TabPane>
                        <TabPane tab="Tab 3" key="3">
                            Content of Tab Pane 3
                        </TabPane>
                    </Tabs>
                    <Tabs>
                        <TabPane tab="全部" key="1">
                            Content of Tab Pane 1
                        </TabPane>
                        <TabPane tab="Tab 2" key="2">
                            Content of Tab Pane 2
                        </TabPane>
                        <TabPane tab="Tab 3" key="3">
                            Content of Tab Pane 3
                        </TabPane>
                    </Tabs>
                    </p>
                    <p>message</p>
                    <Button onClick={() => {
                        message.success('成功消息');
                    }}>message</Button>
                    <Form layout="inline" onSubmit={this.onSubmit}>
                        <Row gutter={24}>
                            <Col span={6}>
                                <Form.Item label="电子邮件" {...formItemLayout}>
                                    {getFieldDecorator('email')(<Input />)}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="性别" {...formItemLayout}>
                                    {getFieldDecorator('s')(
                                        <Select>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="日期">
                                    {getFieldDecorator('ddddd')(
                                        <RangePicker showTime />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="输入框">
                                    {getFieldDecorator('d')(<Input />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={6}>
                                <Form.Item label="输入框">
                                    {getFieldDecorator('dd')(<Input />)}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">查询</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    <Form layout="vertical" onSubmit={this.onSubmit}>
                        <Form.Item label="电子邮件" {...formItemLayout}>
                            {getFieldDecorator('email')(<Input />)}
                        </Form.Item>
                        <Form.Item label="性别" {...formItemLayout}>
                            {getFieldDecorator('s')(
                                <Select>
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="Yiminghe">yiminghe</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="日期"  {...formItemLayout}>
                            {getFieldDecorator('date', {
                                // initialValue: [moment('2015/01/01 00:00:00', 'YYYY/MM/DD HH:mm:ss'), moment('2015/01/01 23:59:59', 'YYYY/MM/DD HH:mm:ss')]
                            })(
                                <RangePicker
                                    ranges={{ 
                                        今天: [
                                            moment(Date.now(), 'YYYY/MM/DD HH:mm:ss'),
                                            moment(Date.now(), 'YYYY/MM/DD HH:mm:ss')
                                        ]
                                    }}
                                    format="YYYY/MM/DD HH:mm:ss"
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'),
                                        moment('23:59:54', 'HH:mm:ss')],
                                    }}
                                    placeholder={['开始时间', '结束时间']}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="输入框"  {...formItemLayout}>
                            {getFieldDecorator('d')(<Input />)}
                        </Form.Item>
                        <Form.Item label="输入框"  {...formItemLayout}>
                            {getFieldDecorator('dd')(<Input />)}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </Form.Item>
                    </Form>
                </div>
            </ConfigProvider>
        );
    }
}
const dataSource = [];
for (let i = 0; i < 24; i++) {
    dataSource.push({
        key: i.toString(),
        id: i,
        proInfoId: 'RW-2019080515541972720190805155419727',
        name: i < 9 ?  `name ${i}` : `EdrwardEdrwardEdrward ${i}`,
        sex: '1',
        age: null,
        date: '2019-08-08',
        address: `London Park no. ${i}`,
    });
}

function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
}
function disabledRangeTime(_, type) {
    if (type === 'start') {
      return {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => range(0, 60).splice(20, 4),
      disabledMinutes: () => range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  }

export default Form.create()(UIPage);