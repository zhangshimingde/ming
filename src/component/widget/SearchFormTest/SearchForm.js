import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Col, Row, Icon, Drawer } from 'antd';
import Button from '../WaveButton';
import Select from '../Select';
import DatePicker from '../DatePicker';
const { RangePicker } = DatePicker;

import InputNumber from './InputNumber';
// import './less/searchForm.less';
import moment from 'moment';
const FormItem = Form.Item;

class SearchForm extends React.PureComponent {
  static propTypes = {
    form: PropTypes.shape({
      validateFields: PropTypes.func.isRequired,
      getFieldDecorator: PropTypes.func.isRequired,
      setFieldsValue: PropTypes.func.isRequired,
      resetFields: PropTypes.func.isRequired,
      getFieldsValue: PropTypes.func.isRequired,
    }).isRequired,
    searchConfig: PropTypes.array,
    init: PropTypes.func,
  }

  static defaultProps = {
    init: () => { },
  }
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      width: 12,
      visible: false
    };
  }

  componentDidMount() {
    // 时间控件波浪线调整为横线
    this.setDatePickerCenterIcons();
    // 如果没有不查询的配置
    if (!this.props.initNoSearch) {
      // 如果需要传递参数加载
      this.getParamObj();
    }
  }
  componentWillUnmount() {
  }
  // 设置时间中间的波浪线
  setDatePickerCenterIcons = () => {
    var datePickerCenterIcons = document.getElementsByClassName('ant-calendar-range-picker-separator');
    for (let index = 0; index < datePickerCenterIcons.length; index++) {
      const element = datePickerCenterIcons[index];
      element.innerText = '—';
    }
  }
  getParamObj = () => {
    try {
      const { searchConfig } = this.props;
      const REQUEST = new Object, aParams = document.location.search.substr(1).split("&");
      for (let i = 0; i < aParams.length; i++) {
        var aParam = aParams[i].split("=");
        REQUEST[aParam[0]] = aParam[1];
      }
      // 匹配路由url和查询参数比较，有的话则赋值
      for (const key in REQUEST) {
        if (REQUEST.hasOwnProperty(key)) {
          for (let index = 0; index < searchConfig.length; index++) {
            const element = searchConfig[index];
            if (key === element.name) {
              // 字符串转boolean
              if (REQUEST[key] === 'true' || REQUEST[key] === 'false') {
                REQUEST[key] = REQUEST[key] === 'false' ? false : true;
              }
              this.props.form.setFieldsValue({ [key]: REQUEST[key] });
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    this.search();
  }

 
  getSearchComponent = (item) => {
    if (item.type === 'Input') {
      if (item.numberObj) return <InputNumber type={item.numberObj.type}
        placeholder={item.placeholder || `请输入${item.label}`} maxLength={item.maxLength || 1000} />
      return <Input placeholder={item.placeholder || `请输入${item.label}`} maxLength={item.maxLength || 1000} />;
    } else if (item.type === 'Select') {
      return (<Select
        onChange={item.change}
        showSearch={item.showSearch}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {item.items && item.items.map((opt) =>
          (<Select.Option value={opt.value} key={opt.value}>{opt.name}</Select.Option>))}
      </Select>);
    }
  }
  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  }
  getSearchArea = () => {
    const children = [];
    let allColSpan = 0;
    const { getFieldDecorator } = this.props.form;
    let { exportToExcel, searchConfig } = this.props;
    const { width, expand } = this.state;
    for (let index = 0; index < searchConfig.length; index++) {
      const item = searchConfig[index];

      // 判断之前占了多少个col
      const Search = item.type === 'RangePicker' ?
        <Col span={24} key={item.name}>
          <FormItem label={item.label} >
            {getFieldDecorator(`${item.name}`, {
              initialValue: item.initialValue ? [moment(item.initialValue[0], item.timeFormat || 'YYYY/MM/DD HH:mm:ss'), moment(item.initialValue[1], item.timeFormat || 'YYYY/MM/DD HH:mm:ss')] : ''
            })(
              <RangePicker
                disabledDate={item.isAllowAfterTime ? () => { } : this.disabledDate}
                allowClear={item.allowClear || false}
                showTime={item.showTime ? 'HH:mm:ss' : null}
                format={item.timeFormat || 'YYYY/MM/DD HH:mm:ss'}
                placeholder={['开始时间', '结束时间']} />
            )}
          </FormItem>
        </Col>
        :
        <Col span={item.noSingle ? 12 : 24} key={item.name}>
          <FormItem
            label={item.label}
          >
            {getFieldDecorator(item.name, {
              initialValue: item.initialValue
            })(this.getSearchComponent(item))}
          </FormItem>
        </Col>
      children.push(Search);
    }
    // 如果前面是不能铺满整行，操作按钮就按顺序铺

    children.push(<Col className="clearfix float-left">
      <Button
        type="primary"
        onClick={this.search}>查询</Button>
      <Button className="mar-left-width ant-btn-secondary"
        onClick={this.reset}>重置</Button>
      {exportToExcel && <Button
        className="mar-left-width ant-btn-secondary"
        onClick={exportToExcel}>导出</Button>}

    </Col>);
    return children;
  }
  search = () => {
    this.props.form.validateFields((err, values) => {
      const { searchConfig } = this.props;
      // 处理时间数组
      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          var nowVal = values[key];
          // 如果是数组
          if (Object.prototype.toString.call(nowVal) === "[object Array]") {
            // 获取用户想要的时间格式
            let timeFormat = "YYYY/MM/DD HH:mm:ss";
            for (let index = 0; index < searchConfig.length; index++) {
              const element = searchConfig[index];
              if (element.name === key && element.timeFormat) {
                timeFormat = element.timeFormat;
                // 如果传入了返回的字段
                if (element.responseFiled) {
                  values[element.responseFiled.beginTime] = nowVal[0] && moment(nowVal[0]).format(timeFormat) || "";
                  values[element.responseFiled.endTime] = nowVal[0] && moment(nowVal[1]).format(timeFormat) || "";
                } else {
                  values[`start${key}`] = nowVal[0] && moment(nowVal[0]).format(timeFormat) || "";
                  values[`end${key}`] = nowVal[0] && moment(nowVal[1]).format(timeFormat) || "";
                }
              }
            }
          }
          // 如果不是时间则做清空前后空格操作
          else {
            values[key] = values[key] && typeof values[key] == 'string' ? values[key].replace(/(^\s*)|(\s*$)/g, "") : values[key];
          }
        }
      }
      this.props.search(err, values);
    });
  }

  reset = () => {
    this.props.form.resetFields();
  }
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const children = this.getSearchArea();
    return (
      <div>
        <Button className="ant-btn-primary float-right mar-left-width" onClick={this.showDrawer}>高级查询</Button>
        <Input.Search
          className="float-right"
          onSearch={value => console.log(value)}
          style={{ width: 200 }}
        />
        <Drawer
          width={'30%'}
          title="高级查询"
          placement="right"
          className="search-box"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Form
            className="cxform"
            onSubmit={this.handleSearch}
          >
            <Row gutter={24}>
              {children}
            </Row>
          </Form>
        </Drawer>
      </div >
    );
  }
}

export default Form.create({
  onFieldsChange(props, changedFields) {
    if (props.onFieldsChange) props.onFieldsChange(changedFields);
  }
})(SearchForm);

