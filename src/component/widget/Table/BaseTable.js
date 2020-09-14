/**
 * @desc   规范table组件
 * @author zhangkegui@fulu.com
 * @date   2019-01-29
 * @version 1.1
 */

import React, { PureComponent, Fragment } from 'react';
import { Popconfirm, Icon, Tooltip } from 'antd';
import { EditableContext } from './extend/EditableCell';
import transferDecimal from '../../../utils/DecimalUtil';
import { isFunction, isFakeData, isEditing } from './TableUtil';
import {
    CELL_HEIGHT,
    MAX_SHOW,
    DEF_ROW_KEY,
    OPERATION_WIDTH,
    PAGE_SIZE_OPTIONS,
    OPERATION,
    ROW_EDIT_CELL,
    ROW_EDIT_OPERATION,
} from './Constants';
import cancelIcon from './icon/cancel.svg';
import editIcon from './icon/edit.svg';
import saveIcon from './icon/save.svg';
import './index.less';

class BaseTable extends PureComponent {
    constructor(props) {
        super(props);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleShowSizeChange = this.handleShowSizeChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleColumns = this.handleColumns.bind(this);
        this.getVerticalScroll = this.getVerticalScroll.bind(this);
        this.handleDataSource = this.handleDataSource.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
    }
    getCellMaxWidth(column) {
        if (column.fixed) {
            return `${column.width - 30}px`;
        }
        return '100%';
    }
    /**
     * @desc 刷新表格
     */
    handleUpdate() {
        const { handleUpdate, pageSize, current: pageIndex } = this.props.pagination || {};
        if (isFunction(handleUpdate)) {
            handleUpdate(pageIndex, pageSize);
        }
    }
    handlePageChange(pageIndex, pageSize) {
        const { onChange } = this.props.pagination || {};
        // if (window.location.search.indexOf('debug=true') > 0) {
        //     console.log(this.tbRef.current);
        // }
        if (Object.prototype.hasOwnProperty.call(this.props.scroll || {}, 'y')) {
            const scrollWrapperSelctor = '.ant-table-scroll .ant-table-body';
            if (this.tbRef.current && typeof this.tbRef.current.getPopupContainer === 'function') {
                const tableContainer = this.tbRef.current.getPopupContainer();
                const scrollWrapper = tableContainer.querySelector(scrollWrapperSelctor);
                if (scrollWrapper && scrollWrapper.scrollTop !== 0) {
                    scrollWrapper.scrollTop = 0;
                }
            } else {
                document.querySelectorAll('.fulu-table').forEach((tb) => {
                    const $selectTarget = tb.querySelector(`.ant-table-wrapper ${scrollWrapperSelctor}`);
                    if (parseInt(getComputedStyle(tb).width) !== 0 && $selectTarget && $selectTarget.scrollTop !== 0) {
                        $selectTarget.scrollTop = 0;
                    }
                });
            }
        }
        if (isFunction(onChange)) {
            onChange(pageIndex, pageSize);
        }
    }
    handleShowSizeChange(current, size) {
        const { onShowSizeChange } = this.props.pagination || {};
        if (isFunction(onShowSizeChange)) {
            onShowSizeChange(current, size);
        }
    }
    handlePagination() {
        const { pagination, total, loading } = this.props;
        let newPagination = false;
        // 展示分页
        if (pagination) {
            // const { pageSize } = this.state;
            const { handleUpdate, showQuickJumper = true, showSizeChanger = true } = pagination || {};
            const listTotalNum = pagination.total || total || 0;
            const defaultPagination = {
                showQuickJumper,
                showSizeChanger,
                total: listTotalNum,
                loading,
                pageSizeOptions: pagination.pageSizeOptions || PAGE_SIZE_OPTIONS,
                showTotal: () => {
                    return (
                        <Fragment>
                            <span className="page-total">{`共 ${listTotalNum} 条`}</span>
                            {
                                typeof handleUpdate === 'function' ? 
                                    <span
                                        className="tb-update"
                                        onClick={context.handleUpdate}
                                    >
                                        <Icon type="sync" /> 刷新
                                    </span> : null
                            }
                        </Fragment>
                    );
                },
                onChange: this.handlePageChange,
                onShowSizeChange: this.handleShowSizeChange,
            };
            newPagination = Object.assign({}, pagination, defaultPagination);
        }
        return newPagination;
    };
    
    handleRowSelection() {
        const { rowSelection } = this.props;
        // 行选择
        if (rowSelection) {
            const newRowSelection = Object.assign({}, rowSelection); 
            newRowSelection.columnWidth = 40;
            newRowSelection.getCheckboxProps = (record) => {
                const disabled = this.getSelectionDisabled(record, rowSelection);
                const rowSelectionProps = {
                    disabled,
                };
                // 禁止选中，隐藏掉Radio/Checkbox
                if (disabled && (isFakeData(record) || record.isFooterExtra)) {
                    rowSelectionProps.style = {
                        display: 'none',
                    };
                }
                return rowSelectionProps;
            };
            return newRowSelection;
        }
    };
    /**
     * @desc 判断数据是否被禁止选中
     * @return{boolean} disabled
     */
    getSelectionDisabled(record, rowSelection) {
        const disabled = isFakeData(record) || record.isFooterExtra;
        if (typeof rowSelection.getCheckboxProps === 'function') {
            return disabled || rowSelection.getCheckboxProps(record).disabled
        }
        return disabled;
    }
    handleColumns(columns = []) {
        const columnsCopy = columns.slice();
        const { lastColumnNoWidth = false } = this.props;
        columnsCopy.forEach((columnEntity) => {
            const originRender = columnEntity.render;
            if (columnEntity.title === OPERATION) {
                if (!this.operationColumn) {
                    this.operationColumn = Object.assign({}, columnEntity);
                }
                return;
            }
            // 绝对宽度转换成纯数字
            if (Object.hasOwnProperty.call(columnEntity, 'width') && !(/%$/).test(columnEntity.width)) {
                columnEntity.width = parseFloat(columnEntity.width);
            }
            const { showToolTip = false, align = 'left' } = columnEntity;
            let tipPlacement = 'topLeft';
            if (align) {
                tipPlacement = align !== 'center' ? `top${align.slice(0, 1).toUpperCase()}${align.slice(1)}` : 'top';
            }
            columnEntity.render = (text, record, index) => {
                if (isFakeData(record)) {
                    return (
                        <span>
                            &nbsp;
                        </span>
                    );
                }
                // 金额小数位设置
                if (Object.hasOwnProperty.call(columnEntity || {}, 'decimal')) {
                    const { decimal ={} } = columnEntity;
                    let pLength = decimal;
                    let pRound = true;
                    let pPrefixChar = '';
                    let pThousandBit = false;
                    if (Object.prototype.toString.call(decimal) === '[object Object]') {
                        const {
                            length = 2,
                            round = true,
                            prefixChar = '',
                            thousandBit = false,
                        } = decimal;
                        pLength = length;
                        pRound = round;
                        pPrefixChar = prefixChar;
                        pThousandBit = thousandBit;
                    } else {
                        pLength = +pLength;
                    }
                    const showDecimal = transferDecimal(text, pLength, pRound, pPrefixChar, pThousandBit);
                    if (isFunction(originRender)) {
                        return originRender(showDecimal, record, index);
                    }
                    if (showToolTip) {
                        return (
                            <Tooltip title={showDecimal} placement={tipPlacement}>
                                <span
                                    className="cell-nowrap"
                                    style={{ maxWidth: this.getCellMaxWidth(columnEntity) }}
                                >
                                    {showDecimal}
                                </span>
                            </Tooltip>
                        );
                    }
                    // return (
                    //     <span
                    //         className="cell-nowrap"
                    //         title={showDecimal}
                    //         style={{
                    //             maxWidth: this.getCellMaxWidth(columnEntity)
                    //         }}
                    //     >
                    //         {showDecimal}
                    //     </span>
                    // );
                    return (<span title={showDecimal}>{showDecimal}</span>);
                    
                }
                if (isFakeData(record)) {
                    return null;
                }
                if (isFunction(originRender)) {
                   return originRender(text, record, index);
                }
                // 序号列
                if (columnEntity.sortIndex) {
                    // 合计行，不显示内容
                    if (Array.isArray(this.props.footerExtra) && this.props.footerExtra.length > 0 && record.isFooterExtra) {
                        return null;
                    }
                    const { pagination, dataSource = [], quickAddRow } = this.props;
                    if (pagination) {
                        const { pageSize = dataSource.length, current = 1 } = pagination;
                        if (quickAddRow) {
                            return (
                                <span>{index + (current - 1)* pageSize}</span>
                            );
                        }
                        return (
                            <span>{index + (current - 1)* pageSize + 1}</span>
                        );
                    }
                    return (
                        <span>{index + 1}</span>
                    );
                    
                }
                const { nowrap = true } = columnEntity;
                // 不换行
                if (nowrap) {
                    if (showToolTip) {
                        return (
                            <Tooltip title={text} placement={tipPlacement}>
                                <span
                                    className="cell-nowrap"
                                    style={{ maxWidth: this.getCellMaxWidth(columnEntity) }}
                                >
                                    {text}
                                </span>
                            </Tooltip>
                        );
                    }
                    // return (
                    //     <span
                    //         className="cell-nowrap"
                    //         title={text}
                    //         style={{
                    //             maxWidth: this.getCellMaxWidth(columnEntity),
                    //         }}
                    //     >
                    //         {text}
                    //     </span>
                    // );
                    return (<span title={text}>{text}</span>);
                }
                return (<span title={text}>{text}</span>);
            };
        });
        const lastColumn = columnsCopy[columnsCopy.length - 1];
        // 最后一列是操作列
        if (lastColumn && lastColumn.title === OPERATION) {
            if (lastColumnNoWidth && columnsCopy.length > 1) {
                delete columnsCopy[columnsCopy.length - 2].width;
                delete columnsCopy[columnsCopy.length - 2].resizeble;
            }
            // 设置默认宽度
            if (!lastColumn.width) {
                lastColumn.width = OPERATION_WIDTH;
            }
            lastColumn.className = 'operation-col';
            // if (!lastColumn.renderContent) {
            //     lastColumn.renderContent = lastColumn.render;
            // }
            const originRender = this.operationColumn.render;
            lastColumn.render = (text, record, index) => {
                // 合计行，不显示内容
                if (Array.isArray(this.props.footerExtra) && this.props.footerExtra.length > 0 && record.isFooterExtra) {
                    return null;
                }
                // 可编辑行且在行上直接编辑
                if (this.editable && this.props.editOnRow) {
                    const { editingKey } = this.state;
                    const { toggleEditType = ROW_EDIT_CELL, useIcon = true } = this.props.editOnRow;
                    // 操作列中点击编辑模式
                    if (toggleEditType == ROW_EDIT_OPERATION) {
                        return isEditing.call(this, record) ? (
                            <span>
                                <EditableContext.Consumer>
                                    {form => (
                                        this.renderOperationItem(useIcon, saveIcon, {
                                            onClick: () => this.onEditSave(form, record),
                                            style: { marginRight: 5, cursor: 'pointer' },
                                            text: '保存',
                                        })
                                    )}
                                </EditableContext.Consumer>
                                <Popconfirm title="确定取消?" onConfirm={() => this.onCancel(this.getEditRowKey(record))}>
                                    {
                                        this.renderOperationItem(useIcon, cancelIcon, {
                                            style: { cursor: 'pointer' },
                                            text: '取消',
                                        })
                                    }
                                </Popconfirm>
                            </span>) : (
                                <Fragment>
                                    {
                                        this.renderOperationItem(useIcon, editIcon, {
                                            disabled: editingKey !== '',
                                            style: { cursor: 'pointer' },
                                            onClick: () => this.edit(this.getEditRowKey(record)),
                                            text: '编辑',
                                        })
                                    }
                                    {
                                        isFunction(originRender) ? originRender(text, record, index) : null
                                    }
                                </Fragment>
                        );
                    }
                    if(isFunction(originRender)) {
                        return originRender(text, record, index);
                    }
                }
                if(isFunction(originRender)) {
                    return originRender(text, record, index);
                }
            };
        } else if (lastColumnNoWidth && columnsCopy.length > 1) {
            delete columnsCopy[columnsCopy.length - 1].width;
            delete columnsCopy[columnsCopy.length - 1].resizeble;
        }
        return columnsCopy;
    }
    renderOperationItem(useIcon, icon, itemProps) {
        const { text } = itemProps;
        // 渲染图标
        if (useIcon) {
            return (
                <Tooltip title={text} placement="topLeft" arrowPointAtCenter>
                    <Icon component={icon} {...itemProps} className="custom-operation-icon" />
                </Tooltip>
            );
        }
        return (
            <Tooltip title={text} placement="topLeft" arrowPointAtCenter>
                <a
                    href="javascript:;"
                    {...itemProps}
                >
                    {text}
                </a>
            </Tooltip> 
        );
    }
    /**
     * @desc 获取表格垂直滚动属性
     */
    getVerticalScroll() {
        if (Object.hasOwnProperty.call(this.props, 'maxShow')) {
            const { maxShow = MAX_SHOW } = this.props;
            return { y: maxShow * CELL_HEIGHT };
        }
        return null;
    }
    handleProps() {
        const {
            rowKey = DEF_ROW_KEY,
            dataSource,
            pagination = {},
            total = 0,
            loading = false,
            footerStatistics = false,
            ...resetProps,
        } = this.props;
        const scrollPropY = this.getVerticalScroll();
        // 出现垂直滚动条
        if (scrollPropY) {
            resetProps.scroll = Object.assign({}, resetProps.scroll, scrollPropY);
        }
        resetProps.rowSelection = this.handleRowSelection();
        resetProps.size = "small";
        if (!this.props.hasOwnProperty('bordered')) {
            resetProps.bordered = true;
        }
        return {
            ...resetProps,
            rowKey,
            dataSource: this.handleDataSource(dataSource),
            pagination: this.handlePagination(),
        };
    }
    handleDataSource(dataSource = []) {
        const { fillHeight = false, pagination = {}, emptyFillRow } = this.props;
        let currentDataSource = dataSource.length === 0 && emptyFillRow ? this.getFakeDataSource(emptyFillRow) : dataSource;
        const { pageSize, current: pageIndex } = pagination;
        if (pagination && pageSize < dataSource.length) {
            currentDataSource = dataSource.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
        }
        // 有效数据小于表格的最大可见数目
        if (currentDataSource.length < pagination.pageSize && fillHeight) {
            const fakeListSzie = pagination.pageSize - currentDataSource.length;
            const newDataSource = currentDataSource.slice();
            return newDataSource.concat(this.getFakeDataSource(fakeListSzie));
        }
        return currentDataSource;
    }
    /**
     * @desc  填充空白数据占据表格内容区域
     * @param {*} len 
     */
    getFakeDataSource(len) {
        const fakeDataSource = [];
        for (let i = 1; i <= len; i++) {
            fakeDataSource.push(this.getfakeDataItem(i));
        }
        return fakeDataSource;
    }
    /**
     * @desc  根据索引构造单条假数据
     * @param {number} index 
     */
    getfakeDataItem(index) {
        const { columns = [], dataSource } = this.props;
        let dataKeys = columns;
        if (dataSource.length > 0) {
            dataKeys = Object.keys(dataSource[0]);
        }
        const fakeData= {
            isFake: true, // 假数据标识
        };
        dataKeys.forEach(k => {
            fakeData[k] = `${k}-fake-${index}`;
        });
        return fakeData;
    }
};

export default BaseTable;