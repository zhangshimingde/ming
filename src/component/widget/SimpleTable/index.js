/**
 * @desc 修改样式的简易版本Table，不包含其他自定义功能
 * @date 2020-07-23
 * @author zhangkegui@fulu.com
 * @version 1.0
 */
import React from 'react';
import AntdTable from 'antd/lib/table';
import 'antd/es/table/style/index.css';
import '../Table/index.less';

class SimpleTable extends React.Component {
    constructor(props) {
        super(props);
        this.tbWrapperRef = React.createRef();
        this.onWinResize = this.onWinResize.bind(this);
    }
    componentDidMount() {
        if (this.props.ellipsis && this.props.scroll
            && this.props.scroll.x && this.tbWrapperRef.current) {
                this.resizeTag = true;
                this.onWinResize(true);
                window.addEventListener('resize', this.onWinResize);
        }
    }
    componentWillUnmount() {
        if (this.resizeTag) {
            window.removeEventListener('resize', this.onWinResize);
            if (this.resizeTimer) {
                clearTimeout(this.resizeTimer);
            }
        }
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
                if (disabled && record.isFooterExtra) {
                    rowSelectionProps.style = {
                        display: 'none',
                    };
                }
                return rowSelectionProps;
            };
            return newRowSelection;
        }
    }
    /**
     * @desc 判断数据是否被禁止选中
     * @return{boolean} disabled
     */
    getSelectionDisabled(record, rowSelection) {
        const disabled = record.isFooterExtra;
        if (typeof rowSelection.getCheckboxProps === 'function') {
            return disabled || rowSelection.getCheckboxProps(record).disabled;
        }
        return disabled;
    }
    render() {
        const clsArr = ['fulu-table', 'small-padding'];
        const _props = Object.assign({ bordered: true }, this.props);
        if (_props.dataSource.length === 0 && _props.emptyNoScrollBar) {
            clsArr.push('no-scroll');
        }
        if (_props.smallSize) {
            clsArr.push('small-table');
        }
        if (_props.ellipsis) {
            clsArr.push('fl-tb-ellipsis');
        }
        const clsName = clsArr.join(' ');
        _props.rowSelection = this.handleRowSelection();
        return (
            <div className={clsName} ref={this.tbWrapperRef}>
                <AntdTable
                    {..._props}
                    size="small"
                />
            </div>
        );
    }   
};

export default SimpleTable;

