import React from 'react';
import { Button, ConfigProvider, Select, DatePicker, Modal, Input, Steps, Tooltip,
    Alert, message, Drawer, Breadcrumb, Form, Row, Col, Tabs, Radio } from 'antd';
// import { Copy, Popover, Confirm, Table, DatePicker as FlDatePicker } from 'fl-pro';
import Copy from '../../widget/Copy';
import Popover from '../../widget/Popover';
import Table from '../../widget/Table';
import SimpleTable from '../../widget/SimpleTable';
import Confirm from '../../widget/Confirm';
import FlDatePicker from '../../widget/DatePicker';
import zhCN from 'antd/es/locale-provider/zh_CN';
import columns from '../TestPage/fixTableColumn';
import './index.css';
import '../../../assets/less/cdn.less';

const { RangePicker } = FlDatePicker;
const { Option } = Select;
const { Step } = Steps;
const { TabPane } = Tabs;

// const columns = [{
//     title: '序号',
//     dataIndex: 'sort',
// }, {
//     title: '商品编号',
//     dataIndex: 'a',
//     width: '5%'
// }, {
//     title: '商品名称',
//     dataIndex: 'b',
//     width: '15%',
// }, {
//     title: '面值(元)',
//     dataIndex: 'c',
//     align: 'right',
// }, {
//     title: '销售价',
//     dataIndex: 'd',
//     align: 'right',
// }];
// const dataSource =[{
//     sort: 1,
//     a: '1000001',
//     b: '测试腾讯Q币卡密1元测试腾讯Q币卡密1元测试腾讯Q币卡密1元测试腾讯Q币卡密1元测试腾讯Q币卡密1元',
//     c: 10,
//     d: 1,
// }, {
//     sort: 2,
//     a: '1000002',
//     b: '测试腾讯Q币卡密1元',
//     c: 10,
//     d: 1,
// }, {
//     sort: 3,
//     a: '1000003',
//     b: '测试腾讯Q币卡密1元',
//     c: 10,
//     d: 1,
// }, {
//     sort: 4,
//     a: '1000004',
//     b: '测试腾讯Q币卡密1元',
//     c: 10,
//     d: 1,
// }];
const dataSource = [];
for (let i = 0; i < 2; i++) {
    dataSource.push({
        key: i.toString(),
        productId: 'RW-2019080515541972720190805155419727',
        name: '10101010101010101010110101010',
        sex: '1',
        age: '2020-12-12 20:20:20',
        date: '2019-08-08',
        address: `London Park no. ${i}`,
    });
}

class UI3Page extends React.Component {
    constructor(props) {
        super(props);
        this.columns = columns.slice();
        this.columns[this.columns.length - 1].render = () => {
            return (
                <span className="text-ellipsis">
                    <a>编辑</a>
                    <a>编辑</a>
                    <a>编辑</a>
                </span>
            );
        };
        this.state = {
            visible: false,
            showOrderModal: false,
            showDrawer: false,
        };
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    
    handleOk = e => {
        console.log(e);
        this.setState({
        visible: false,
        });
    };
    
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    render() {
        const { visible, showOrderModal } = this.state;
        return (
            <ConfigProvider locale={zhCN}>
                <div style={{ margin: '20px' }}>
                    <Tabs>
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
                    <Radio.Group buttonStyle="solid" value="a">
                        <Radio.Button value="a">Hangzhou</Radio.Button>
                        <Radio.Button value="b">Shanghai</Radio.Button>
                        <Radio.Button value="c">Beijing</Radio.Button>
                        <Radio.Button value="d">Chengdu</Radio.Button>
                    </Radio.Group>
                </div>
                <div className="fulu-wrapper" style={{ margin: '20px' }}>
                    <div className="chapter">
                        <div className="chapter-header">阴影</div>

                        <span className="ui-label">小投影：</span>
                        <Select defaultValue="lucy" style={{ width: 120 }}>
                            <Option value="lucy">Lucy</Option>
                        </Select>

                        <span className="ui-label">大投影：</span>
                        <DatePicker />

                        <span className="ui-label">超大投影：</span>
                        <Button type="primary" onClick={this.showModal}>
                            弹窗
                        </Button>
                    </div>
                    <div className="chapter">
                        <div className="chapter-header">圆角</div>
                        <span className="ui-label">4px：</span>
                        <Input placeholder="Basic usage" style={{ width: '150px' }} />

                    </div>
                    <div className="chapter">
                        <div className="chapter-header">步骤条</div>
                        <Steps current={0}>
                            <Step title="选择商品分类" />
                            <Step title="填写商品信息" />
                            <Step title="填写商品详情" />
                        </Steps>
                        <Steps current={1}>
                            <Step title="选择商品分类" />
                            <Step title="填写商品信息" />
                            <Step title="填写商品详情" />
                        </Steps>
                        <Steps current={2}>
                            <Step title="选择商品分类" />
                            <Step title="填写商品信息" />
                            <Step title="填写商品详情" />
                        </Steps>
                        <Steps direction="vertical" current={1}>
                            <Step title="选择商品分类" />
                            <Step title="填写商品信息" />
                            <Step title="填写商品详情" />
                        </Steps>
                    </div>
                    <div className="chapter">
                        <div className="chapter-header">复制</div>
                        <div className="copy-wrapper">
                            <Input style={{ width: '150px', paddingRight: '42px' }} id="inpt" />
                            <Copy selector="#inpt" />
                        </div>
                        <img
                            id="antd-icon"
                            alt="logo"
                            height="32"
                            style={{
                                marginLeft: '20px'
                            }}
                            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                        />
                        <Copy selector="#antd-icon" isButton type="primary" />
                        <span
                            id="sp-text"
                            style={{
                                marginLeft: '20px'
                            }}
                        >
                            this is span text!
                        </span>
                        <Copy selector="#sp-text" />
                        <div className="tips">*.复制组件样式(如显示位置)由开发人员确定，场景难统一，组件难以封装且显示的位置</div>
                    </div>
                    <div className="chapter">
                        <div className="chapter-header">文字提示</div>
                        <Tooltip title="prompt text">
                            <span>Tooltip will show on mouse enter.</span>
                        </Tooltip>
                    </div>
                    <div className="chapter">
                        <div className="chapter-header">气泡提示</div>
                        <Popover placement="rightTop" title="Title">
                            <Button type="primary">Hover me</Button>
                        </Popover>
                        <Popover title="Title" placement="bottomLeft">
                            <Button type="primary">Hover me</Button>
                        </Popover>
                    </div>
                    <div className="chapter">
                        <div className="chapter-header">警告提示</div>
                        <Alert message="提示文案，常规提示" type="info" showIcon closable />
                        <Alert message="提示文案，警告提示" type="warning" showIcon closable />
                        <Alert message="提示文案，成功提示" type="success" showIcon closable />
                        <Alert message="提示文案，失败提示" type="error" showIcon closable />
                    </div>
                    <div className="chapter">
                        <div className="chapter-header">轻提示</div>
                        <Button onClick={() => {
                            message.success('This is a success message');
                        }}>Success</Button>
                        <Button onClick={() => {
                            message.error('This is an error message');
                        }}>Error</Button>
                        <Button onClick={() => {
                            message.warning('This is a warning message');
                        }}>Warning</Button>
                    </div>
                    <div className="chapter">
                        <div className="chapter-header">弹窗</div>
                        <span className="ui-label">confirm：</span>
                        <Button onClick={() => {
                            Confirm({
                                type: 'info',
                                title: 'This is a notification message',
                                content: (
                                  <div>
                                    <p>some messages...some messages...</p>
                                    <p>some messages...some messages...</p>
                                  </div>
                                ),
                            });
                        }}>info</Button>
                        <Button onClick={() => {
                            Confirm({
                                type: 'success',
                                title: 'This is a notification message',
                                content: 'some messages...some messages...',
                            });
                        }}>success</Button>
                          <Button onClick={() => {
                            Confirm({
                                type: 'error',
                                title: 'This is an error message',
                                content: 'some messages...some messages...',
                            });
                        }}>error</Button>
                          <Button onClick={() => {
                            Confirm({
                                type: 'warn',
                                title: 'This is a warning message',
                                content: 'some messages...some messages...',
                            });
                        }}>warning</Button>
                        <div style={{ margin: '20px 0' }}>
                            <span className="ui-label">Modal：</span>
                            <Button onClick={() => {
                                this.setState({
                                    showOrderModal: true,
                                });
                            }}>show modal</Button>
                        </div>
                        <div>
                            <span className="ui-label">Drawer：</span>
                            <Button onClick={() => {
                                this.setState({
                                    showDrawer: true,
                                });
                            }}>show Drawer</Button>
                        </div>
                    </div>
                    <div className="chapter">
                        <div className="chapter-header">面包屑导航</div>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                一级菜单
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a>二级菜单</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a>三级菜单</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                四级菜单
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="chapter">
                        <div className="chapter-header">表格</div>
                        <Table
                            columns={columns}
                            ellipsis
                            dataSource={dataSource}
                            rowSelection={{
                                type: 'checkbox',
                            }}
                            scroll={{
                                x: 1280,
                            }}
                            rowKey="sort"
                            pagination={{
                                pageSize: 2,
                                total: 10,
                                showQuickJumper: true,
                                showSizeChanger: true,
                            }}
                        />
                        <SimpleTable
                            columns={[
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
                            }]}
                            ellipsis
                            dataSource={dataSource}
                            rowSelection={{
                                type: 'checkbox',
                            }}
                            rowKey="sort"
                            pagination={{
                                pageSize: 2,
                                total: 10,
                                showQuickJumper: true,
                                showSizeChanger: true,
                            }}
                        />
                        <div className="tips">*.表头对齐方式由开发人员通过属性定义</div>
                    </div>
                    <div className="chapter">
                        <div className="chapter-header">按钮交互</div>

                        <div className="row-item">
                            <span className="ui-label">主按钮：</span>
                            <Button type="primary">主按钮</Button>
                            <Button type="primary" disabled>主按钮</Button>
                        </div>
                        <div className="row-item">
                            <span className="ui-label">次按钮：</span>
                            <Button type="primary" ghost>次按钮</Button>
                            <Button type="primary" ghost disabled>次按钮</Button>
                        </div>
                        <div className="row-item">
                            <span className="ui-label">普通按钮：</span>
                            <Button>普通按钮</Button>
                            <Button disabled>普通按钮</Button>
                        </div>
                        <div className="row-item">
                            <span className="ui-label">多文字按钮：</span>
                            <Button type="primary" ghost>主按钮文字占位</Button>
                            <Button type="primary" ghost disabled>主按钮文字占位</Button>
                        </div>
                        <div className="row-item">
                            <span className="ui-label">链接按钮：</span>
                            <Button type="link">链接按钮</Button>
                            <Button type="link" disabled>链接按钮</Button>
                        </div>
                        {/* <div className="row-item">
                            <span className="ui-label">警示按钮：</span>
                            <Button type="danger" ghost>警示按钮</Button>
                            <Button type="danger" ghost disabled>警示按钮</Button>
                        </div> */}
                        <div className="row-item">
                            <span className="ui-label">警示按钮：</span>
                            <Button type="danger">警示按钮</Button>
                            <Button type="danger" disabled>警示按钮</Button>
                        </div>
                        <div className="row-item">
                            <span className="ui-label">图标按钮：</span>
                            <Button type="primary" icon="search">
                                Search
                            </Button>
                            <Button type="primary" disabled icon="search">
                                Search
                            </Button>
                        </div>
                        <div className="row-item">
                            <span className="ui-label">辅助按钮：</span>
                            <Button type="primary" size="small">主按钮</Button>
                            <Button type="primary" size="small" disabled>主按钮</Button>
                        </div>
                        <div className="row-item">
                            <span className="ui-label">辅助次按钮：</span>
                            <Button type="primary" size="small" ghost>次按钮</Button>
                            <Button type="primary" size="small" ghost disabled>次按钮</Button>
                        </div>
                        <div className="row-item">
                            <span className="ui-label">辅助多文字按钮：</span>
                            <Button type="primary" size="small" ghost>主按钮多文字占位</Button>
                            <Button type="primary" size="small" ghost disabled>主按钮多文字占位</Button>
                        </div>
                    </div>
                    <div className="chapter">
                        <div className="chapter-header">日期组件</div>
                        <Form layout="inline" className="fl-form">
                            <Row gutter={{
                                sm: 16,
                                md: 24,
                            }}>
                                <Col xs={24} sm={16} md={12} lg={8} xl={8}>
                                    <Form.Item label="日期">
                                        <RangePicker
                                            style={{ width: '100%' }}
                                            showTime={
                                            [{defaultValue: '00:00:00'},
                                            {defaultValue: '23:59:59'}]}
                                            format="YYYY-MM-DD hh:mm:ss"
                                        />
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
                    </div>
                </div>
                <Modal
                    title="Basic Modal"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>Some contents...</p>
                </Modal>
                <Modal
                    title="订单详情"
                    visible={showOrderModal}
                    onOk={() => {
                        this.setState({
                            showOrderModal: false,
                        });
                    }}
                    onCancel={() => {
                        this.setState({
                            showOrderModal: false,
                        });
                    }}
                    >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
                <Drawer
                    title="Basic Drawer"
                    placement="right"
                    width={720}
                    onClose={() => {
                        this.setState({
                            showDrawer: false,
                        });
                    }}
                    visible={this.state.showDrawer}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <div
                        style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '10px 16px',
                        background: '#fff',
                        textAlign: 'right',
                        }}
                    >
                        <Button
                            onClick={() => {
                                this.setState({
                                    showDrawer: false,
                                });
                            }} type="primary">
                            确定
                        </Button>
                    </div>
                </Drawer>
            </ConfigProvider>
        );
    }
}

export default Form.create()(UI3Page);
