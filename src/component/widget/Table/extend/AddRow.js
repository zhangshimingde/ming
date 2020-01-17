import React, { Component } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import './addRow.less';

const { Option } = Select;

class AddRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdd: false,
            scrollBarWidth: 0,
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onToggleAdd = this.onToggleAdd.bind(this);
    }
    componentDidMount() {
        const minWidthNum = parseInt(this.props.quickAddRow.minWidth);
        if (/\d+/.test(minWidthNum)) {
            this.minWidth = minWidthNum;
            this.onWindowResize();
            window.onresize = () => {
                let timer = null;
                if (!timer) {
                    timer = setTimeout(() => {
                        this.onWindowResize();
                        timer = null;
                    }, 500);
                }
            };
        }
    }
    componentWillUnmount() {
        window.onresize = null;
    }
    getTableWidth() {
        return document.querySelector('.add-row-box').parentNode.getClientRects()[0].width;
    }
    onWindowResize() {
        if (this.getTableWidth() < this.minWidth) {
            this.onUpdateSrcollBar(this.getTableWidth());
        } else {
            this.onUpdateSrcollBar(0);
        }
    }
    onUpdateSrcollBar(sWidth) {
        this.setState({
            scrollBarWidth: typeof sWidth === 'undefined' ? this.minWidth : sWidth,
        });
    }
    onSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
              return;
            }
            const { quickAddRow } = this.props;
            const { onAddSave } = quickAddRow;
            onAddSave(fieldsValue);
            this.setState({
                isAdd: false,
            });
        });
    }
    onToggleAdd() {
        this.setState({
            isAdd: !this.state.isAdd,
        });
    }
    renderFormItem() {
        const { quickAddRow, form } = this.props;
        const columns = Array.isArray(quickAddRow.columns) ? quickAddRow.columns : this.props.columns;
        const { getFieldDecorator } = form;
        if (Array.isArray(columns)) {
            return columns.map(({ dataIndex, key, editType, rules, initialValue, resizeble, sorter, sortOrder,
                editable, minWidth, nowrap, showToolTip, ...otherProps }) => {
                if (editable) {
                    return (
                        <Form.Item key={`add-item-${dataIndex || key}`}>
                            {getFieldDecorator(dataIndex || key, {
                                rules,
                                initialValue,
                            })(
                                this.renderFormItemComp(editType, otherProps)
                            )}
                        </Form.Item>
                    );
                }
                return null;
            });
        }
        return null;
    }
    renderFormItemComp(editType, otherProps) {
        let comp = null;
        switch (editType) {
            case 'Input':
                comp = (<Input {...otherProps} />);
                break;
            case 'Select':
                const { options } = otherProps;
                comp = (<Select {...otherProps}>
                    {
                        Array.isArray(options) ? options.map(({value, key, text}) => {
                            return (<Option value={value} key={key||value}>{text}</Option>);
                        }) : null
                    }
                </Select>);
                break;
            case 'DatePicker':
                comp = (<DatePicker {...otherProps} />);
                break;
            default:
                break;
        }
        return comp;
    }
    renderForm() {
        const { scrollBarWidth } = this.state;
        if (scrollBarWidth !== 0 && this.minWidth) {
            return (
                <Scrollbars style={{ width: scrollBarWidth, height: 40 }}>
                    <Form layout="inline" onSubmit={this.onSubmit} style={{ minWidth: this.minWidth }}>
                        {this.renderFormItem()}
                        <Form.Item>
                            <span>
                                <Button size="small" htmlType="submit" type="primary">确定</Button>
                                <Button size="small" onClick={this.onToggleAdd}>取消</Button>
                            </span>
                        </Form.Item>
                    </Form>
                </Scrollbars>
            );
        }
        return (
            <Form layout="inline" onSubmit={this.onSubmit}>
                {this.renderFormItem()}
                <Form.Item>
                    <span>
                        <Button size="small" htmlType="submit" type="primary">确定</Button>
                        <Button size="small" onClick={this.onToggleAdd}>取消</Button>
                    </span>
                </Form.Item>
            </Form>
        );
    }
    render() {
        const { isAdd, scrollBarWidth } = this.state;
        const { quickAddRow } = this.props;
        const { addBtnText = '+快速创建' } = quickAddRow;
        const cls = scrollBarWidth !== 0 ? 'add-row-box scroll-hor' : 'add-row-box';
        return (
            <div className={cls}>
                {
                    isAdd ? this.renderForm() :
                        <a className="add-btn" onClick={this.onToggleAdd} href="javascript:void(0);">{addBtnText}</a>
                }
            </div>
        );
    }
}

export default Form.create()(AddRow);
