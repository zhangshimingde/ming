import React from 'react';
import { Modal } from 'antd';
import DragAndDrop from './DragAndDrop';

class ColumnShowSetModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showColumns:[],
            allColumns:[],
            disabled : false, //判断是否有操作栏
        }
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSetShowColumns = this.handleSetShowColumns.bind(this);
        this.handleData = this.handleData.bind(this);
        this.bool = true;
        this.bool1 = true;
    }
    componentDidMount() {
        this.handleData();
    }
    handleData() {
        const { showColumns, allColumns } = this.props;
        let arr = [];
        let arr1 =[];
        const that = this;
        let disabled = false;
        showColumns.map((item) => {
            // 操作列不可以隐藏
            if (item.title === "操作") {
                disabled = true;
            }
            arr.push({
                ...item,
                defaultChecked: true,
                type:'ITEM'
            });
        });
        allColumns.map((item)=>{
            arr1.push({
                ...item,
                defaultChecked: false,
                type: 'ITEM',
            });
        });
        this.setState({
            showColumns: {
                type: 'BOX',
                bool: !that.bool1,
                items: arr,
            },
            allColumns:{
                type: 'BOX',
                items: arr1,
            },
            disabled,
        });
    }
    componentDidUpdate() {
        if (this.bool) {
            this.handleData();
            this.bool = false;
        }
    }
    handleOk() {
        const { handleOk } = this.props;
        const { showColumns } = this.state;
        const columns = showColumns.items.map((item) => {
            return {
                ...item,
            };
        }).map((item) => {
            delete item.defaultChecked;
            delete item.type;
            return item;
        });
        handleOk(columns);
    }
    handleCancel() {
        this.props.handleCancel();
        this.bool = true;
    }
    handleSetShowColumns(showColumns, allColumns) {
        this.setState({
            showColumns,
            allColumns
        });
    }
    render() {
        const { visible } = this.props;
        const { showColumns, allColumns, disabled } = this.state;
        return (
            <Modal
                title="设置显示字段"
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText= "保存"
                cancelText= "取消"
                width= {"920px"}
                maskStyle={{backgroundColor: "rgba(0,0,0,0.65)"}}
                maskClosable={false}
                bodyStyle={{padding:" 0 12px"}}
            >
                <DragAndDrop
                    showColumns={showColumns}
                    disabled={disabled}
                    allColumns={allColumns}
                    handleSetShowColumns={this.handleSetShowColumns}
                />
            </Modal>
        );
    }
}

export default ColumnShowSetModal;
