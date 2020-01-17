import React from 'react';
import { connect } from 'dva';
import {
  Spin, Divider, Form, Input, Modal, message, Table, Button, Icon
} from 'antd';
import warningico from '../../images/warning-ico.svg';
import infoico from '../../images/info-ico.svg';
import successico from '../../images/success-ico.svg';
import errorico from '../../images/error-ico.svg';
import confirmico from '../../images/confirm-ico.svg';
import moment from 'moment';
const { confirm } = Modal;
const successCode = '0';
class CommonPageMethod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      total: 0,
      postData: {
        pageIndex: 1,
        pageSize: 10,
      },
      // 新增编辑form的config
      addOrEditFormConfig: [],
      // 查询编辑form的config
      searchFormConfig: [],
      // 表格字段Columns
      tableColumns: [],
      selectedRowKeys: [],
      selectedRows: [],
      // 是否展示详情页弹框
      showDetailModal: false,
      // 是否展示详情页弹框
      showAddOrEditModal: false,
      // 展示另外特殊场景的弹框
      showSpecialModal: false,
      // 展示table动画
      showTable: true,
      showTableTime: 0,
    };
    // 当前命名空间
    this.namespace = '';
    // table配置项
    this.tableConfig = {

    };
    // 查询form的配置项
    this.searchFormConfig = {
      showCount: false
    }
    // 详情页弹框配置项（传入组件）
    this.detailModal = null;
    // 新增编辑弹框配置项（传入组件）
    this.addOrEditModal = null;
    // 跳转到新增页面（传入路由）
    this.btnAddPageUrl = '';
    this.btnReturnUrl = '';
    // 展示什么操作按钮
    this.controlBar = {

    };
    // 是否展示tabs
    this.showTabsConfig = {};
  }
  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {

  }
  search = (err, values) => {
    if (err) return false;
    const { postData } = this.state;
    postData.pageIndex = 1;
    this.setState({ condition: values, postData }, () => { this.getData(); });
  }
  showModal = (field, record) => {
    this.setState({
      [field]: true,
      record
    })
  }
  hideModal = (field) => {
    this.setState({
      [field]: false
    });
  }
  btnCancel = () => {
    this.hideModal('showModal');
  }
  // 批量开启
  batchEnable = (isEnable) => {
    const { selectedRowKeys, selectedRows } = this.state;
    let ids = selectedRowKeys.join(',');
    if (!isEnable) {
      confirm({
        title: this.controlBar.leftControlBar.batchEnableConf.title || '禁用确认',
        content: this.controlBar.leftControlBar.batchEnableConf.content || '确定要禁用所选项吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.enableInfo(isEnable, ids);
        },
        onCancel() {
        },
      });
    }
    else {
      this.enableInfo(isEnable, ids);
    }
  }
  // 启用
  enableInfo = (isEnable, ids) => {
    this.props.dispatch({
      type: `${this.namespace}/${this.namespace}Enable`,
      payload: {
        [this.guidIds || 'ids']: ids,
        [this.controlBar.leftControlBar.batchEnableConf.enableField || 'isEnable']: isEnable,
      }
    }).then((res) => {
      if (res.code === '0') {
        message.success(res.message);
        this.setState({
          selectedRowKeys: [],
          selectedRows: []
        });
        this.getData();
      }
      else {
        message.error(res.message);
      }
    });
  }
  // 批量删除
  batchDelete = () => {
    const { selectedRowKeys, selectedRows } = this.state;
    // const flag = selectedRows.some((item) => { return item.isEnable === true });
    // if (flag) {
    //   return message.error('所选数据存在启用项，请先禁用再删除');
    // }
    let ids = selectedRowKeys.join(',');
    this.deleteInfo(ids);
  }
  // 删除
  deleteInfo = (ids) => {
    confirm({
      title: this.controlBar && this.controlBar.leftControlBar && this.controlBar.leftControlBar.batchDeleteConf &&
        this.controlBar.leftControlBar.batchDeleteConf.title || '删除确认',
      content: this.controlBar && this.controlBar.leftControlBar && this.controlBar.leftControlBar.batchDeleteConf &&
        this.controlBar.leftControlBar.batchDeleteConf.content || '确定要删除所选项吗？',
      okText: '确认',
      centered: true,
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: `${this.namespace}/${this.namespace}Delete`, payload: {
            [this.guidIds || 'ids']: ids,
          }
        }).then((res) => {
          if (res.code === '0') {
            message.success(res.message);
            this.setState({
              selectedRowKeys: [],
              selectedRows: []
            });
            this.getData();
          }
          else {
            message.error(res.message);
          }
        });
      },
      onCancel() {
      },
    });
  }
  // 弹框关闭
  btnModalCancel = () => {
    this.hideModal('showModal');
  }
  // 获取新增编辑的Form配置
  getAddOrEditFormConfig = () => {
    return [];
  }
  // 获取查询Form的配置
  getSearchFormConfig = () => {
    return [];
  }
  // 获取行的配置项
  getColumns = () => {
    return [];
  }
  // 确认取消弹框
  confirmModal = (type, confirmOption) => {
    // 如果不是confirm确认取消功能
    if (type !== 'confirm') {
      let confirmMethod = null;
      let icon = null;
      if (type === 'success') {
        confirmMethod = Modal.success;
        icon = successico;
      } else if (type === 'warning') {
        confirmMethod = Modal.warning;
        icon = warningico;
      } else if (type === 'info') {
        confirmMethod = Modal.info;
        icon = infoico;
      } else if (type === 'error') {
        confirmMethod = Modal.error;
        icon = errorico;
      }
      confirmMethod({
        title: confirmOption.title,
        width: confirmOption.width,
        content: confirmOption.content,
        centered: confirmOption.centered,
        icon: <Icon className="icon" component={icon} />,
        onOk() { confirmOption.onOk() },
      });
    }
    else {
      confirm({
        title: confirmOption.title,
        content: confirmOption.content,
        width: confirmOption.width,
        icon: <Icon className="icon" component={confirmico} />,
        centered: confirmOption.centered,
        onOk() {
          confirmOption.onOk();
        },
        onCancel() {
          confirmOption.onCancel();
        },
      });
    }
  }
  // 展示详情页弹框
  showDetailModal = (record) => {
    this.showModal('showDetailModal', record);
  }
  // 隐藏详情页弹框
  hideDetailModal = () => {
    this.hideModal('showDetailModal');
  }
  // 渲染详情弹框的操作
  renderDetailModal = () => this.state.showDetailModal
    && this.detailModal
    && React.createElement(this.detailModal, {
      onCancel: this.hideDetailModal,
      onOk: this.btnDetailModalSubmit,
      record: this.state.record,
    });
  // 详情弹框的确定按钮回调函数
  btnDetailModalSubmit = (err, values) => {
    // this.hideDetailModal();
  }
  // 展示新增编辑弹框
  showAddOrEditModal = (record = {}) => {
    // 如果是跳转页面
    if (this.btnAddPageUrl) {
      const deleteId = this.guidId ? record[this.guidId] : 'id';
      const url = deleteId ?
        `${this.btnAddPageUrl}?id=${deleteId}` :
        this.btnAddPageUrl;
      return this.props.history.push(url);
    }
    this.showModal('showAddOrEditModal', record);
  }
  // 隐藏编辑新增弹框
  hideAddOrEditModal = () => {
    // 如果是跳回页面
    if (this.btnReturnUrl) {
      return this.props.history.push(this.btnReturnUrl);
    }
    this.hideModal('showAddOrEditModal');
  }
  // 新增编辑弹框
  btnAddOrEditModalSubmit = (err, values) => {
    if (!err) {
      const { record } = this.state;
      // 编辑
      if (record.id) {
        return this.props.dispatch({
          type: `${this.namespace}/${this.namespace}Edit`, payload: {
            ...values,
            id: record.id
          }
        }).then((res) => {
          if (res.code === '0') {
            message.success(res.message);
            this.hideAddOrEditModal();
            this.getData();
          }
          else {
            message.error(res.message);
          }
        });
      }
      // 新增
      return this.props.dispatch({
        type: `${this.namespace}/${this.namespace}Add`, payload: {
          ...values,
        }
      }).then((res) => {
        if (res.code === '0') {
          message.success(res.message);
          this.hideAddOrEditModal();
          this.getData();
        }
        else {
          message.error(res.message);
        }
      });
    }
  }
  // 渲染新增编辑弹框的操作
  renderAddOrEditModal = () => this.state.showAddOrEditModal
    && this.addOrEditModal
    && React.createElement(this.addOrEditModal, {
      onCancel: this.hideAddOrEditModal,
      onOk: this.btnAddOrEditModalSubmit,
      record: this.state.record,
    });
  changeTabs = (value) => {
    const { postData } = this.state;
    let name = this.showTabsConfig.name;
    postData[name] = value;
    postData.pageIndex = 1;
    this.setState({
      postData,
      selectedRowKeys: [],
      selectedRows: []
    }, () => {
      this.getData();
    })
  }
  getData = () => {
    const { postData, condition, showTableTime } = this.state;
    this.setState({
      postData: {
        ...postData,
        ...condition,
      },
      showTable: false
    }, () => {
      this.props.dispatch({
        type: `${this.namespace}/${this.namespace}GetList`, payload: {
          ...postData,
          ...condition
        },
      }).then((res) => {
        const { code, data: { total, list } } = res;
        if (code === '0') {
          this.setState({
            dataSource: list,
            total
          });
          setTimeout(() => {
            this.setState({
              showTable: true
            })
          }, showTableTime);

        }
        else {
          message.error(res.message);
        }
      });
    });
  }
}
export default CommonPageMethod;

