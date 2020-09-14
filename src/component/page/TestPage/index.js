import React from 'react';
// import { Spin, Alert, Table } from 'antd';
import moment from 'moment';
import Table from '../../widget/Table';
// import Table from '../../widget/DragSortTable';
import WaveButton from '../../widget/WaveButton';
import ExportButton from '../../widget/ExportButton';
import FuluIcon from '../../widget/FuluIcon';
import { Dragable, Dropable } from '../../container/PageCreator';
import TradeValidateWrap from '../../widget/TradeValidateWrap';
import ScrollNumber from '../../widget/ScrollNumber';
import TurnNumber from '../../widget/TurnNumber';
import DivideScrollNumber from '../../widget/ScrollNumber/DivideScrollNumber';
import columns from './tableColumn';
import { Button } from 'antd';
// import columns from './fixTableColumn';
// import columns from './bugColumn';

const dataSource = [];
for (let i = 0; i < 24; i++) {
    dataSource.push({
        key: i.toString(),
        proInfoId: 'RW-2019080515541972720190805155419727',
        name: i < 9 ?  `name ${i}` : `EdrwaEdrward ${i}`,
        sex: '1',
        age: i,
        date: '2019-08-08',
        address: `London Park no. ${i}`,
    });
}

class Validator extends React.Component {
    render() {
        return (<div>validator</div>);
    }
}

class TestPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            pageIndex: 1,
            dataSource,
            count: 98,
            // turnValue: 0,
            time: this.getTime(),
            cols: columns.slice(),
        };
        this.columnsBtn = React.createRef();
        this.onEditSave = this.onEditSave.bind(this);
        this.onUpdateColumns = this.onUpdateColumns.bind(this);
    }
    componentDidMount() {
        // document.addEventListener('tabChange', function(e) {
        //     console.log(e);
        // });
        // setInterval(() => {
        //     this.setState({
        //         count: this.state.count + 1,
        //     });
        // }, 3000);
        setInterval(() => {
            this.setState({
                time: this.getTime(),
            });
        }, 1000);
    }

    getTime() {
        const date = new Date();
        return [date.getFullYear(), this.fillPrefixZero(date.getMonth() + 1),
            this.fillPrefixZero(date.getDate()), this.fillPrefixZero(date.getHours()),
            this.fillPrefixZero(date.getMinutes()), this.fillPrefixZero(date.getSeconds())];
    }

    fillPrefixZero(v) {
        return `0${v}`.slice(-2);
    }

    onEditSave(rowData) {
        const newData = [...this.state.dataSource];
        Object.keys(rowData).forEach((k) => {
           if(rowData[k] instanceof moment) {
            rowData[k] = rowData[k].format(rowData[k]._f);
           }
        });
        const index = newData.findIndex(item => rowData.key === item.key);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...rowData,
            });
            this.setState({ dataSource: newData });
        } else {
            newData.push(rowData);
            this.setState({ dataSource: newData });
        }
    }
    onUpdateColumns() {
        const { cols } = this.state;
        const newCols = cols.slice();
        newCols[1].title ='2aaa';
        this.setState({
            cols: newCols,
        });
    }
    onAddSave(params) {
        console.log(params);
    }
    render() {
        const { pageIndex, pageSize, dataSource, cols, count, time } = this.state;
        const [year, month, date, hour, min, second] = time;
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
        const yearStr = `${year}`;
        return (
            <div style={{ padding: '24px', height: '100%' }}>
                {
                    this.state.a.length > 0 ? <span>1</span> : null
                }
                {/* <p style={{ margin: '30px', fontSize: '30px' }}>
                    <ScrollNumber value={count} height="42px" initalValue="0" duration={1000} delay={0} />
                </p> */}
                <p style={{ margin: '30px', fontSize: '30px' }}>
                    $<DivideScrollNumber value={count} height="42px" initalValue=" " delay={500} />万
                </p>
                <TurnNumber value={yearStr.slice(0,1)} />
                <TurnNumber value={yearStr.slice(1,2)} />
                <TurnNumber value={yearStr.slice(2,3)} />
                <TurnNumber value={yearStr.slice(3,4)} />
                <span className="sp" style={{ lineHeight: '60px' }}>-</span>
                <TurnNumber value={month.slice(0,1)} />
                <TurnNumber value={month.slice(1,2)} />
                <span className="sp" style={{ lineHeight: '60px' }}>-</span>
                <TurnNumber value={date.slice(0,1)} />
                <TurnNumber value={date.slice(1,2)} />

                <TurnNumber value={hour.slice(0,1)} />
                <TurnNumber value={hour.slice(1,2)} />
                <span className="sp" style={{ lineHeight: '60px' }}>:</span>
                <TurnNumber value={min.slice(0,1)} />
                <TurnNumber value={min.slice(1,2)} />
                <span className="sp" style={{ lineHeight: '60px' }}>:</span>
                <TurnNumber value={second.slice(0,1)} />
                <TurnNumber value={second.slice(1,2)} />
                {/* <div>
                    <Dragable importPath="../../container/PageCreator/Test/List">
                        <span>drag me</span>
                    </Dragable>
                    <Dropable
                        renderEmpty={() => {
                            return (<span>drop here</span>);
                        }}
                    >
                    </Dropable>
                </div> */}
                {/* <FuluIcon
                    src="http://fulu-common-util.oss-cn-hangzhou.aliyuncs.com/test/281e282f-0d65-42a3-bf57-a5dce0f9ab87.svg"
                    width="20"
                    heigh="20"
                    iconType="menu"
                    showDefault
                /> */}
                <div style={{ position: "relative" , height: "300px", display: 'none' }}>
                    {/* <TradeValidateWrap
                        env={{
                            prod: 'https://gj.admin.fulu.com',
                            it: 'http://it.gj.admin.fulu.com',
                            pre: 'http://pre.gj.admin.fulu.com'
                        }}
                        phoneNo="1862713139"
                        block
                        renderSpin={() => {
                            return (
                                <Spin tip="Loading..." size="large" />
                            );
                        }}
                    >
                        {({ validateType, error }) => {
                            console.log(validateType, error);
                            return (<Validator />);
                        }}
                    </TradeValidateWrap> */}
                </div>
                <div style={{ margin: '50px 0' }}>
                    {/* <WaveButton ref={this.columnsBtn}>设置columns</WaveButton> */}
                    <WaveButton
                        className="a"
                        onClick={() => {
                            this.validateFunc().then((records) => {
                                console.log(records);
                            });
                        }}
                    >waveButton</WaveButton>
                    <WaveButton type="primary" data-mid="btn-a">Primary</WaveButton>
                    <WaveButton type="dashed">Dashed</WaveButton>
                    <WaveButton type="danger">Danger</WaveButton>
                    <WaveButton type="link">Link</WaveButton>
                    <ExportButton
                        url="http://10.0.1.68:3001/api/Stock/ExportCardBatchInfo"
                        merchantId="39e93568-81ae-638f-3e99-3ea303694d82"
                        // method="GET"
                        beforeClick={() => {
                            return false;
                        }}
                        params={{
                            BeginTime: '2019/08/14 00:00:00',
                            EndTime: '2019/08/14 23:59:59',
                            IsSoldOut: '',
                        }}
                        linkTag
                        fileName="卡密"
                    >导出</ExportButton>
                    {/* <Button onClick={this.onUpdateColumns}>update columns</Button> */}
                </div>
                <Table
                    dataSource={dataSource}
                    pagination={pagination}
                    // columnShowSetRef={this.columnsBtn} // columns显示设置
                    lastColumnNoWidth
                    emptyNoScrollBar
                    // editOnRow={{ // 行编辑
                    //     toggleEditType: 'cell', // 编辑模式 1.operation：点击操作列的编辑，整行变成可编辑 2.cell：鼠标移入单元格变成可编辑
                    //     onEditSave: this.onEditSave, // 编辑保存回调事件
                    //     // useIcon: true, // 编辑、保存、取消三个操作项是否使用图标
                    // }}
                    // quickAddRow={{
                    //     onAddSave: this.onAddSave, // 保存回调
                    //     addBtnText: '+快速创建', // 新增按钮显示文字，默认'+快速创建'
                    //     columns: [{ // 新增行的表单配置列表，默认取table的columns作为入参，也可以自己定义新增项
                    //         dataIndex: 'title',
                    //         editable: true,
                    //         editType: 'Input',
                    //         placeholder: '请输入标题',
                    //         rules: [{
                    //             required: true, message: '请输入标题',
                    //         }],
                    //     }]
                    // }}
                    rowSelection={{
                        type: 'checkbox',
                        getCheckboxProps: () => {
                            return {
                                disabled: true,
                            };
                        }
                    }}
                    onValidateFunc={(fuc) => {
                        this.validateFunc = fuc;
                    }}
                    bigPadding
                    flCustomRender={false}
                    fillHeight={false} // 当实际显示的数据小于PageSize时，是否填充空数据
                    // quickAddRow={{ // 快速创建行
                    //     onAddSave: this.onAddSave,
                    //     addBtnText: '+快速创建',
                    //     minWidth: 950,
                    // }}
                    // footerExtra={[{ // 底部统计
                    //     key: 'f-1',
                    //     name: '23',
                    //     sex: '34',
                    //     age: 4222,
                    //     date: '5555',
                    // }, {
                    //     key: 'f-2',
                    //     name: '441',
                    //     sex: '2333',
                    //     age: 3222,
                    //     date: '4444',
                    // }]}
                    // tableDefaultSize="small"
                    scroll={{ x: 2500, y: 200 }}
                    // sizeChange
                    columns={cols}
                    rowKey={(record) => {
                        return record.key;
                    }}
                />
            </div>
        );
    }
}

export default TestPage;