import React from 'react';
import { Input, InputNumber, Select, DatePicker, Form } from 'antd';
import moment from 'moment';
import { isEditing } from '../TableUtil';
import { ROW_EDIT_CELL } from '../Constants';

const { Option } = Select;

const EditableContext = React.createContext();

class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: props.editOnRow && !props.editOnRow.toggleEditType,
        };
    }
    getEditInput = ({ editType, options = [], editOnRow = {} }) => {
        const { toggleEditType } = editOnRow;
        const comProps = {
            ref: node => (this.input = node),
            style: {
                width: '100%',
            }
        };
        if (toggleEditType === ROW_EDIT_CELL) {
            comProps.onPressEnter = this.onSave;
            comProps.onBlur = this.onBlur;
        }
        if (editType === 'InputNumber') {
            return <InputNumber {...comProps} />;
        } else if (editType === 'DatePicker') {
            return <DatePicker {...comProps} />;
        } else if (editType === 'Select') {
            return (<Select {...comProps}>
                {options.map(({ value, key, text }) => {
                    return (
                        <Option value={value} key={key || value}>{text}</Option>
                    );
                })}
            </Select>);
        }
        return <Input {...comProps} />;
    };
    getInitialValue = (record = {}, { dataIndex, editType, dateFormat = 'YYYY-MM-DD', editOnRow = {} }) => {
        if (editType === 'DatePicker') {
            return moment(record[dataIndex], dateFormat);
        }
        return record[dataIndex];
    };
    toggleEdit = (e) => {
        e && e.stopPropagation();
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
          if (editing) {
            this.input.focus();
          }
        });
    };
    isCellEditing = () => {
        const { editing, editOnRow = {} } = this.props;
        const { toggleEditType } = editOnRow;
        if (toggleEditType === ROW_EDIT_CELL || !toggleEditType) {
            return this.state.editing;
        }
        return editing;
    };
    onBlur = (e) => {
        const { editType } = this.props;
        if (editType === 'DatePicker' && e.target && e.target.nodeName.toLowerCase() === 'input') {
            return;
        }
        this.onSave(e);
    }
    onSave = (e) => {
        const { record, editOnRow = {}, dataIndex } = this.props;
        this.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            const newValues = Object.keys(values).reduce((obj, k) => {
                const nk = k.lastIndexOf('-') > 0 && k.slice(0, k.lastIndexOf('-'));
                if (nk == dataIndex) {
                    obj[nk] = values[k];
                } else {
                    obj[k] = values[k];
                }
                return obj;
            }, {});
            this.toggleEdit();
          editOnRow.onEditSave({ ...record, ...newValues });
        });
    };
    renderChildren(children) {
        const { editOnRow = {} } = this.props;
        const { toggleEditType } = editOnRow;
        if (toggleEditType === ROW_EDIT_CELL) {
            return (<div
                className="editable-cell-value-wrap"
                onClick={this.toggleEdit}
            >
                {children}
            </div>);
        }
        return children;
    }
    renderCell = ({ getFieldDecorator, validateFields }) => {
        const {
            editing,
            dataIndex,
            title,
            editType,
            record,
            index,
            rules,
            children,
            editOnRow = {},
            ...restProps
        } = this.props;
        this.validateFields = validateFields;
        // 底部合计行
        if (!record || record.isFooterExtra || record.isFake) {
            return (<td {...restProps}>
                {children}
            </td>);
        }
        return (
            <td {...restProps}>
                {this.isCellEditing() ? (
                    <Form.Item style={{ margin: 0, width: '100%' }}>
                        {getFieldDecorator(`${dataIndex}-${record.key}`, {
                            rules,
                            initialValue: this.getInitialValue(record, this.props),
                        })(this.getEditInput(this.props))}
                    </Form.Item>
                ) : this.renderChildren(children)}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

// 判断表格是否可编辑
const tableEditable = (columns) => {
    return columns.find((item) => {
        return item && item.editable;
    });
};

const handleEditCol = (col, context) => {
    if (!col.editable) {
        return col;
    }
    let cellObj = {};
    // 该单元格可伸缩
    if (typeof col.onCell === 'function') {
        cellObj = col.onCell();
    }
    const onCellObj = {
        ...col,
        onCell: (record) => {
            return {
                ...cellObj,
                record,
                width: col.width,
                editable: col.editable,
                editType: col.editType,
                dataIndex: col.dataIndex,
                title: col.title,
                options: col.options,
                rules: col.rules,
                editing: isEditing.call(context, record),
            }
        },
    };
    
    return onCellObj;
}

export default EditableCell;
export {
    EditableContext,
    handleEditCol,
    tableEditable,
};