import React, { Component } from 'react'
import { connect } from 'dva';
import {
    Divider, Form, Input, Modal, message, Button, Radio, Tabs, Spin
} from 'antd';
import BasePage from './BasePage';
import SearchForm from '../SearchForm';
import BreadCrumb from '../BreadCrumb';
import QueueAnimFulu from '../QueueAnimFulu';
import AddOrEditForm from '../AddOrEditForm';
import Table from '../Table';
import './less/commonPageCom.less';
const { TabPane } = Tabs;

class CommonPage extends BasePage {
    constructor(props) {
        super(props);
        // this.props.triggerRef(this);

    }
    isNullObj = (obj) => {
        return obj && Object.keys(obj).length !== 0;
    }
    getScrollOpt = () => {
        let obj = {};
        if (this.tableConfig.scrollWidth || this.tableConfig.scrollHeight) {
            obj = { scroll: {} };
        }
        if (this.tableConfig.scrollWidth) {
            obj.scroll.x = this.tableConfig.scrollWidth;
        }
        if (this.tableConfig.scrollHeight) {
            obj.scroll.y = this.tableConfig.scrollHeight;
        }
        console.log(obj, 222222);
        return obj;
    }
    render() {
        const { total, dataSource, postData, searchFormConfig, showSpecialModal, showTable } = this.state;
        const pagination = {
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: postData.pageSize,
            current: postData.pageIndex,
            pageSizeOptions: ['10', '30', '50'],
            onShowSizeChange: (current, pageSize) => {
                Object.assign(postData, { pageSize, pageIndex: current })
                this.setState({ postData }, () => {
                    this.getData();
                });
            },
            onChange: (current) => {
                Object.assign(postData, { pageIndex: current });
                this.setState({ postData }, () => {
                    this.getData();
                })
            },
        };
        const { selectedRowKeys, selectedRows, tableColumns } = this.state;
        const rowSelection = {
            type: this.tableConfig && this.tableConfig.rowSelectionType,
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows
                });
            },
        };
        return (
            <div>
                <Spin spinning={this.getSpinningLoading ? this.getSpinningLoading() : false}>
                    {this.pageBreadCrumbs && <BreadCrumb
                        breadCrumbText={this.pageBreadCrumbs.breadCrumbText || ''}
                        breadCrumbList={this.pageBreadCrumbs.breadCrumbList || ''}
                        history={this.props.history}
                    />}
                    <div className="common-page-content">
                        <QueueAnimFulu>
                            <SearchForm
                                key={1}
                                searchConfig={searchFormConfig}
                                initNoSearch={this.searchFormConfig.initNoSearch}
                                exportToExcel={this.exportToExcel}
                                search={this.search}
                                onFieldsChange={this.onFieldsChange}
                                showCount={this.searchFormConfig.showCount}
                            />
                            {this.isNullObj(this.showTabsConfig) ?
                                <Tabs
                                    key={2} type={this.showTabsConfig.type ? this.showTabsConfig.type : "line"}
                                    onChange={this.changeTabs}>
                                    {this.showTabsConfig.list.map((item) =>
                                        <TabPane tab={item.tab} key={item.key}>
                                        </TabPane>)
                                    }
                                </Tabs> : ''}
                            {this.isNullObj(this.controlBar) && <div className="table-control-bar clearfix" key={3}>
                                {this.isNullObj(this.controlBar.leftControlBar) &&
                                    <Radio.Group>
                                        {this.controlBar.leftControlBar.batchEnableConf && <Radio.Button
                                            value={'批量启用'}
                                            onClick={() => this.batchEnable(true)}
                                            disabled={selectedRowKeys.length <= 0}
                                        >批量启用</Radio.Button>}
                                        {this.controlBar.leftControlBar.batchEnableConf && <Radio.Button
                                            value={'批量停用'}
                                            onClick={() => this.batchEnable(false)}
                                            disabled={selectedRowKeys.length <= 0}
                                        >批量停用</Radio.Button>}
                                        {this.controlBar.leftControlBar.batchDeleteConf && <Radio.Button
                                            value={'批量删除'}
                                            onClick={() => this.batchDelete()}
                                            disabled={selectedRowKeys.length <= 0}
                                        >批量删除</Radio.Button>}
                                        {this.controlBar.leftControlBar.addLeftBtnArr && this.controlBar.leftControlBar.addLeftBtnArr.map((item, index) =>
                                            <Radio.Button
                                                value={index}
                                                onClick={() => item.onClick(this)}
                                                disabled={selectedRowKeys.length <= 0 && item.needDisabled}
                                            >{item.text}</Radio.Button>)}
                                    </Radio.Group>}
                                {this.isNullObj(this.controlBar.rightControlBar) &&
                                    this.controlBar.rightControlBar.btnAddText && <Button className="ant-btn-primary-next float-right"
                                        onClick={this.showAddOrEditModal}> {this.controlBar.rightControlBar.btnAddText} </Button>
                                }
                                {this.isNullObj(this.controlBar.rightControlBar) && this.controlBar.rightControlBar.addRightBtnArr ?
                                    this.controlBar.rightControlBar.addRightBtnArr.map((item) =>
                                        <Button className="ant-btn-primary-next float-right mar-right-width" onClick={() => item.onClick(this)}> {item.text}</Button>
                                    ) : ''}

                            </div>}
                            {this.renderTableTopContent && this.renderTableTopContent()}
                            {showTable && <Table
                                key={4}
                                rowKey={this.guidId || "id"}
                                bordered
                                {...this.getScrollOpt()}
                                columns={tableColumns}
                                dataSource={dataSource}
                                pagination={pagination}
                                rowSelection={this.tableConfig.rowSelectionType ? rowSelection : false}
                            />}
                        </QueueAnimFulu>
                        {this.renderTableBottomContent && this.renderTableBottomContent()}
                        {this.renderDetailModal()}
                        {this.renderAddOrEditModal()}
                        {showSpecialModal && this.specialModal}

                    </div>
                </Spin>
            </div>
        )
    }
}
// const mapStateToProps = (state) => {
//     return {
//         ...state
//     };
// }
// export default connect(mapStateToProps)(ChildCom);
export default CommonPage;


