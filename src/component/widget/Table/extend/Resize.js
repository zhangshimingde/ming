/**
 * @desc    列宽度可变的表格
 * @author  zhangkegui@fulu.com
 * @date    2019-6-3
 * @version 1.0
 */

import React from 'react';
import { Resizable } from 'react-resizable';
import EditableCell from './EditableCell';

const initTableComponets = (context, editable) => {
    const components = {
        header: {
            cell: renderHeaderCell,
        },
        body: {
            cell: renderBodyCell(context, editable),
        }
    };
    return components;
};
   
const renderHeaderCell = (props) => {
    const { onResize, resizeble = false, editType, editable, nowrap, showToolTip, sorter, dataIndex, sortOrder,
        sortIndex, minWidth, onCell, onHeaderCell, width, render, ...restProps } = props;
    if (!width || !resizeble) {
        return <th {...restProps} />;
    }
    return (
        <Resizable
            width={parseFloat(width || 0)}
            height={0}
            onResize={onResize}
            axis="x"
            title=""
        >
            <th {...restProps} />
        </Resizable>
    );
}
  
const renderBodyCell  = function(context, editable) {
    return function(props) {
        const { onResize, resizeble = false, minWidth, ...restProps } = props;
        restProps.editOnRow = context.props.editOnRow;
        const { showColumns } = context.state;
        const colItem = showColumns.find((item) => {
            return item && (restProps.dataindex || restProps.key) === (item.dataindex || item.key);
        });
        restProps.editable = `${restProps.editable}`;
        const { width } = colItem || {};
        const tdProps = Object.assign({}, restProps);
        delete tdProps.editOnRow;
        // 不可被拉伸
        if (!resizeble) {
            // 可编辑
            if(editable) {
                return (<EditableCell {...restProps} />);
            }
            return <td {...tdProps} />;
        }
        return (
            <Resizable
                width={parseFloat(width || 0)}
                height={0}
                onResize={onResize}
                axis="x"
            >
                {
                    editable ? <EditableCell {...restProps} /> : <td {...tdProps} />
                }
            </Resizable>
        );
    }
};

const handleResize = function(index, context) {
    return function(e, { size }) {
        context.setState(({ showColumns }) => {
            if (parseInt(showColumns[index].minWidth || 0, 10) >= size.width) {
                return { showColumns };
            }
            const nextColumns =[...showColumns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { showColumns: nextColumns };
            // return { showColumns:  context.updateColumnsByResize(nextColumns) };
        });
    }
};

/**
 * @desc 判断表格是否可伸缩
 */
const tableResizeble = (columns) => columns.find(({ resizeble = false, width }) => {
    // 设置宽度同时又伸缩配置项
    return resizeble && validateWidth(width);
});

const validateWidth = (w) => {
    // 只能包含正整数
    return (/^[1-9]\d*(px)?$/).test(w);
};

/**
 * @desc  针对columns每一列判断是否可伸缩，并设置相应的属性
 * @param {*} col 
 * @param {*} index 
 * @param {*} context 
 */
const handleResizeCol = function(col, index, context) {
    if (!col.resizeble) {
        return col;
    }
    const _handleResize = handleResize(index, context);
    const w = validateWidth(col.width) ? parseInt(col.width) : col.width;
    const finalResizeble = validateWidth(col.width); // 列的宽度为整数才可以伸缩
    const newCol = {
        ...col,
        width: w,
        onHeaderCell: (column) => ({
            ...column,
            width: w,
            resizeble: finalResizeble,
            onResize: _handleResize,
        }),
        onCell: (record) => ({
            record,
            width: w,
            minWidth: col.minWidth,
            resizeble: finalResizeble,
            onResize: _handleResize,
            dataindex: col.dataIndex || col.key,
            editOnRow: context.props.editOnRow,
        })
    };
    return newCol;
}

export {
    initTableComponets,
    tableResizeble,
    handleResize,
    handleResizeCol,
};