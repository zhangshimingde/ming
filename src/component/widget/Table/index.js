/**
 * @desc   规范table组件
 * @author zhangkegui@fulu.com
 * @date   2019-01-29
 * @version 1.0
 */

import React, { Fragment } from 'react';
import { Table as AntTable, Form, Switch } from 'antd';
import { initTableComponets, handleResizeCol } from './extend/Resize';
import { EditableContext, handleEditCol, tableEditable } from './extend/EditableCell';
import { isEditing, isFunction } from './TableUtil';
import ColumnShowSetModal from '../ColumnShowSetModal';
import FooterExtra from './extend/FooterExtra';
import AddRow from './extend/AddRow';
import BaseTable from './BaseTable';
import './index.less';

class Table extends BaseTable {
    constructor(props) {
        super(props);
        const columns = this.initColumns(props.columns);
        this.state = {
            columns,
            showColumns: columns,
            editingKey: '',
            selectedRowKeys: [],
            showColumnSetModal: false,
            updateColumns: false,
            tbSizeBig: props.tableDefaultSize !== 'small', // 表格显示为大尺寸的标识
        };
        this.resizeTimer = null;
        this.tbRef = React.createRef();
        this.tbWrapperRef = React.createRef();
        this.onWinResize = this.onWinResize.bind(this);
        this.onColumnShowSet = this.onColumnShowSet.bind(this);
        this.onValidateFields = this.onValidateFields.bind(this);
        this.handleTbSizeChange = this.handleTbSizeChange.bind(this);
        this.handleChangeColumns = this.handleChangeColumns.bind(this);
        this.handleHideColSetModal = this.handleHideColSetModal.bind(this);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const { columns = [] } = nextProps;
        if (prevState && Array.isArray(prevState.columns)) {
            if (columns.length !== prevState.columns.length) {
                return {
                    updateColumns: true,
                };
            }
            const updateColumns = columns.find((a, i) => {
                const b = prevState.columns[i];
                return a.title !== b.title || a.dataIndex !== b.dataIndex || a.key !== b.key || a.editType !== b.editType
                    || a.editable !== b.editable || a.sortOrder !== b.sortOrder || a.resizeble !== b.resizeble;
            });
            if (updateColumns) {
                return {
                    updateColumns: !!updateColumns,
                };
            }
        }
        
        return null;
    }
    componentDidMount() {
        this.setClickToColumnShowBtn();
        if (typeof this.props.onValidateFunc == 'function') {
            this.props.onValidateFunc(this.onValidateFields);
        }
        if (this.props.ellipsis && this.props.scroll
            && this.props.scroll.x && this.tbWrapperRef.current) {
                this.resizeTag = true;
                this.onWinResize(true);
                window.addEventListener('resize', this.onWinResize);
        }
    }
    componentDidUpdate() {
        if (this.state.updateColumns) {
            this.onUpdateColumns();
        }
        this.setClickToColumnShowBtn();
    }
    componentWillUnmount() {
        if (this.resizeTag) {
            window.removeEventListener('resize', this.onWinResize);
            if (this.resizeTimer) {
                clearTimeout(this.resizeTimer);
            }
        }
        this.setClickToColumnShowBtn(true);
    }
    onWinResize(noDelay = false) {
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
        if (noDelay) {
            this.execResize();
        } else {
            this.resizeTimer = setTimeout(() => {
               this.execResize();
            }, 200);
        }
    }
    execResize() {
        const $tbWrapper = this.tbWrapperRef.current;
        const isShowScrollX = $tbWrapper.clientWidth < this.props.scroll.x;
        Array.from($tbWrapper.querySelectorAll('.ant-table-body')).forEach((tb) => {
            if (isShowScrollX) {
                tb.style.overflowX = 'scroll';
            } else {
                tb.style.overflowX = 'auto';
            }
        });
        const $fixedLeftTb = $tbWrapper.querySelector('.ant-table-fixed-left table');
        const { columns, rowSelection } = this.props;
        if ($fixedLeftTb) {
            const leftLen = $fixedLeftTb.querySelectorAll('thead th').length;
            $fixedLeftTb.style.width = `${this.calcFixedTbWidth(0, leftLen - 1)}px`;
        }
        const $fixedRightb = $tbWrapper.querySelector('.ant-table-fixed-right table');
        if ($fixedRightb) {
            let rightLen = $fixedRightb.querySelectorAll('thead th').length;
            if (rowSelection) {
                rightLen = rightLen - 1;
            }
            $fixedRightb.style.width = `${this.calcFixedTbWidth(columns.length - rightLen, columns.length - 1)}px`;
        }
    }
    calcFixedTbWidth(start, end) {
        const $tbWrapper = this.tbWrapperRef.current;
        const thArrLike = $tbWrapper.querySelectorAll('.ant-table-scroll thead th');
        let totalWidth = 0;
        for (let i = start; i <= end; i++) {
            if (thArrLike[i]) {
                totalWidth += thArrLike[i].offsetWidth;
            }
        }
        return totalWidth;
    }

    /**
     * @desc 设置表格列显示按钮点击事件
     * @param {*boolean} removeClick 是否移除click事件
     */
    setClickToColumnShowBtn(removeClick = false) {
        // 可以设置列显示与隐藏
        if (this.props.columnShowSetRef && this.props.columnShowSetRef.current) {
            const btnProps = Object.assign({}, this.props.columnShowSetRef.current.props);
            btnProps.onClick = !removeClick ? this.onColumnShowSet : null;
            this.props.columnShowSetRef.current.props = btnProps;
        }
    }
    /**
     * @desc 表格columns更新
     */
    onUpdateColumns() {
        const columns = this.initColumns(this.props.columns);
        this.setState({
            columns,
            showColumns: columns,
            updateColumns: false,
        });
    }
    /**
     * @desc 显示设置表格列显示设置的弹窗
     */
    onColumnShowSet() {
        this.setState({
            showColumnSetModal: true,
        });
    };

    onPageChange = (pIndex, pSize) => {
        this.onCancel();
        this.props.pagination.onChange(pIndex, pSize);
    };

    onCancel = () => {
        this.setState({ editingKey: '' });
    };

    onEditSave(form, record) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const { onEditSave } = this.props.editOnRow;
            onEditSave({ ...record, ...row});
            this.setState({
                editingKey: '',
            });
        });
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    initColumns(columns) {
        if (!Array.isArray(columns)) {
            return [];
        }
        let newColumns = columns.slice();
        // 不自定义渲染components
        if (!this.props.flCustomRender) {
            // 判断表格是否可以编辑
            const editable = tableEditable(columns);
            if (editable) {
                this.editable = editable;
            }
            newColumns = this.updateColumnsByResize(columns);
            this.tbComponents = initTableComponets(this, editable);
        }
        return newColumns;
    }
    updateColumnsByResize(columns) {
        if (Array.isArray(columns)) {
            return columns.map((col, index) => {
                let newCol = handleResizeCol(col, index, this); // 伸缩判断处理
                if (this.editable) {
                    newCol = handleEditCol(newCol, this); // 编辑判断处理
                }
                return newCol;
            }, this);
        }
        return columns;
    }
    handleHideColSetModal() {
        this.setState({
            showColumnSetModal: false,
        });
    }

    handleChangeColumns(columns) {
        this.setState({
            showColumns: this.initColumns(columns),
        });
        this.handleHideColSetModal();
    }

    handleTbSizeChange(checked) {
        // 可编辑模式下不能改变表格大小
        if (this.editable) {
            return;
        }
        this.setState({
            tbSizeBig: checked,
        });
    }

    renderSizeChangeBtn() {
        const { sizeChange, pagination, dataSource, tableDefaultSize = 'big' } = this.props;
        const hasDataSource = Array.isArray(dataSource) && dataSource.length > 0;
        if (sizeChange && hasDataSource && !this.editable) {
            const clsName = pagination ? 'size-change-abs-box' : 'size-change-box';
            return (
                <div className={clsName}>
                    <Switch
                        size="small"
                        checkedChildren="大"
                        unCheckedChildren="小"
                        defaultChecked={tableDefaultSize === 'big'}
                        onChange={this.handleTbSizeChange}
                    />
                    <span className="size-change-tips">表格尺寸</span>
                </div>
            );
        }
        return null;
    }

    renderTable(tbProps) {
        const { footerExtra, columnShowSetRef, quickAddRow } = this.props;
        const { pagination, dataSource = [], columns, sizeChange = false, ...restProps } = tbProps;
        // 是否显示表格底部统计行
        const showFooterExtra = Array.isArray(footerExtra) && footerExtra.length > 0;
        const newDataSource = showFooterExtra ? dataSource.concat(footerExtra.map((item) => {
            return Object.assign({}, item, { isFooterExtra: true });
        })) : dataSource.slice();
        if (dataSource.length === 0 || !dataSource[0].q_a_r) {
            if (quickAddRow) {
                const holderItem = this.getfakeDataItem(-1); // 构造一行假数据
                holderItem.q_a_r = true; // 快速新建的占位行标识
                newDataSource.unshift(holderItem);
            }
        }
        const tbColumns = this.handleColumns(columns);
        return (
            <Fragment>
                <AntTable
                    {...restProps}
                    columns={tbColumns}
                    dataSource={newDataSource}
                    pagination={showFooterExtra || quickAddRow ? false : pagination}
                    ref={this.tbRef}
                />
                {
                    quickAddRow ? (<AddRow {...this.props} />) : null
                }
                <FooterExtra
                    show={showFooterExtra || quickAddRow}
                    pagination={pagination}
                />
                {
                    this.renderSizeChangeBtn()
                }
                {
                    columnShowSetRef ?
                        <ColumnShowSetModal
                            visible={this.state.showColumnSetModal}
                            showColumns={tbColumns}
                            allColumns={this.state.columns}
                            handleOk={this.handleChangeColumns}
                            handleCancel={this.handleHideColSetModal}
                        /> : null
                }
            </Fragment>
        );
    }

    findTableRowDom(node) {
        if (!node instanceof Node) {
            return null;
        }
        const nodeName = this.getNodeName(node);
        if ( nodeName === 'a' || nodeName === 'button' || nodeName === 'input') {
            return null;
        }
        let tempNode = node;
        while(!this.isTableRow(tempNode) && this.getNodeName(tempNode) !== 'body') {
            tempNode = tempNode.parentNode;
        }
        return this.isTableRow(tempNode) ? tempNode : null;
    }

    getNodeName(node) {
        return node && node.nodeName.toLowerCase();
    }

    isTableRow(node) {
        return node.classList.contains('ant-table-row');
    }

    getEditRowKey(record) {
        const { rowKey } = this.props;
        if (isFunction(rowKey)) {
            return rowKey(record);
        }
        return record[rowKey];
    }
    onValidateFields() {
        const { dataSource = [], columns, form } = this.props;
        return new Promise((resolve) => {
            form.validateFields((error, values) => {
                if (error) {
                    resolve(null);
                }
                const allEditKey = columns.reduce((obj, { dataIndex, key, editable }) => {
                    if (editable && (dataIndex || key)) {
                        obj[dataIndex || key] = true;
                    }
                    return obj;
                }, {});
                const newDataSource = dataSource.reduce((arr, record) => {
                    Object.keys(allEditKey).forEach((editKey) => {
                        const formKey = `${editKey}-${record.key}`;
                        if (Object.hasOwnProperty.call(values, formKey)) {
                            record[editKey] = values[formKey];
                        }
                    });
                    arr.push(Object.assign({}, record));
                    return arr;
                }, []);
                resolve(newDataSource);
            });
        });
    }
    render() {
        const { showColumns, tbSizeBig } = this.state;
        const newTbProps = this.handleProps(this.props);
        const clsArr = ['fulu-table'];
        if (!tbSizeBig) {
            clsArr.push('small-table');
        }
        if (Array.isArray(newTbProps.dataSource) && newTbProps.dataSource.length === 0 && this.props.emptyNoScrollBar) {
            clsArr.push('no-scroll');
        }
        if (!this.props.bigPadding) {
            clsArr.push('small-padding');
        }
        if (this.props.ellipsis) {
            clsArr.push('fl-tb-ellipsis');
        }
        const clsName = clsArr.join(' ');
        if (!this.props.flCustomRender) {
            newTbProps.components = this.tbComponents;
        }
        newTbProps.columns = showColumns;
        // 表格可编辑
        if (this.editable && this.props.editOnRow) {
            newTbProps.rowClassName = "editable-row";
            if (newTbProps.pagination) {
                newTbProps.pagination.onChange = this.onPageChange;
            }
            // 行点击事件对象设置，覆盖onClick事件
            newTbProps.onRow = (record) => {
                return {
                    onDoubleClick: (e) => {
                        if (typeof newTbProps.onDoubleClick === 'function') {
                            newTbProps.onDoubleClick(e, record);
                        }
                    },
                    onClick: (e) => {
                        // 填充的假数据，点击无反应
                        if (record.isFake) {
                            return;
                        }
                        if (newTbProps.rowSelection) {
                            // 正在编辑，点击无反应
                            if (e.target.classList.contains('ant-select-selection__rendered')) {
                                return;
                            }
                            if (this.editable && isEditing.call(this, record)) {
                                return;
                            }
                            // 触发行点击事件
                            const rowDom = this.findTableRowDom(e.target);
                            if (rowDom) {
                                let selectInput = rowDom.children[0].querySelector('input');
                                if (selectInput) {
                                    selectInput.click();
                                }
                            }
                        }
                    },
                };
            };
        }
        return (
            <div className={clsName} ref={this.tbWrapperRef}>
                {
                    this.editable ? (<EditableContext.Provider value={this.props.form}>
                             {this.renderTable(newTbProps)}
                         </EditableContext.Provider>) :  this.renderTable(newTbProps)
                }
            </div>
        );
    }
};

export default Form.create()(Table);