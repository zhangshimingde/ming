import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Col, Row, Icon } from 'antd';
import Button from '../WaveButton';
import ExportButton from '../ExportButton';
import Select from '../Select';
import DatePicker from '../DatePicker';
const { RangePicker, MonthPicker } = DatePicker;

import { icons } from '../../images';
import expandDownIcon from '../../images/expand-down.svg';
import expandUpIcon from '../../images/expand-up.svg';

import InputNumber from './InputNumber';
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
      width: 6,
      expand: false
    };
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
    // 时间控件波浪线调整为横线
    this.setDatePickerCenterIcons();
    this.resize();
    window.addEventListener('resize', this.debounce(this.resize, 200));
    // 如果没有不查询的配置
    if (!this.props.initNoSearch) {
      // 如果需要传递参数加载
      this.getParamObj();
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
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
        REQUEST[aParam[0]] = decodeURI(aParam[1]);
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

  debounce = (func, delay) => {
    var timeout;
    return function (e) {
      clearTimeout(timeout);
      var context = this, args = arguments;
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, delay)
    };
  };

  // 重新计算form一行展示个数
  resize = () => {
    try {
      let nowIndex = 0;
      if (document.getElementsByClassName('anole-tabs-nav')[0]) {
        let tabsActiveChildNodes = document.getElementsByClassName('anole-tabs-nav')[0].childNodes;
        for (let index = 0; index < tabsActiveChildNodes.length; index++) {
          const element = tabsActiveChildNodes[index];
          if (element.className.indexOf('anole-tabs-tab-active') !== -1) {
            // 因为包括了首页，所以要减去
            nowIndex = index - 1;
            break;
          }
        }
      }

      // 获取当前·页面的宽度
      var nowSearchFormWidth = document.getElementsByClassName('search-box')[nowIndex].clientWidth;
      var width = 3;
      var obj = { 0: 12, 1: 8, 2: 6, 3: 4, 4: 3 };
      var objWidth = { 0: 800, 1: 1200, 2: 1600, 3: 2000, 4: 2300 };
      for (var key in objWidth) {
        if (objWidth.hasOwnProperty(key)) {
          var element = objWidth[key];
          if (nowSearchFormWidth < element) {
            width = obj[key];
            break;
          }
        }
      }
      this.setState({
        width: width
      });
    } catch (error) {
      console.log(error);
    }

  }
  toggle = () => {

    this.setState({
      expand: !this.state.expand
    }, () => {
      this.setDatePickerCenterIcons();
      this.props.toggleSearchForm && this.props.toggleSearchForm();
    })
  }
  getSearchComponent = (item) => {
    if (item.type === 'Input') {
      if (item.numberObj) return <InputNumber type={item.numberObj.type}
        placeholder={item.placeholder || `请输入${item.label}`} maxLength={item.maxLength || 1000} />
      return <Input placeholder={item.placeholder || `请输入${item.label}`} maxLength={item.maxLength || 1000} />;
    } else if (item.type === 'Select') {
      const { type, ...resetProps } = item;
      return (<Select
        {...resetProps}
        onChange={item.change}
        showSearch={item.showSearch}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {item.items && item.items.map((opt) =>
          (<Select.Option value={opt.value} key={opt.value}>{opt.name}</Select.Option>))}
      </Select>);
    } else if (item.type === 'MonthPicker') {
      return (
        <MonthPicker
          suffixIcon={this.getDateIcon()}
          allowClear={item.allowClear || false}
          defaultValue={moment(item.initialValue, item.timeFormat || 'YYYY/MM')}
          format={item.timeFormat || 'YYYY/MM'}
        />)
    }
  }
  getDateIcon = () => {
    return <Icon className="icon" component={icons.dateIcon} />;
  }
  disabledDate = (current, item) => {
    const { disabledTime = {} } = item;
    // Can not select days before today and today
    // return current && (moment().endOf('day') < current || current < moment().subtract(7, 'day'));
    if (disabledTime.afterDate) {
      return current && current < moment(disabledTime.beforeDate) || current > moment(disabledTime.afterDate);
    }
    return current && current > moment().endOf('day');
  }
  getSearchArea = () => {
    const children = [];
    let allColSpan = 0;
    const { getFieldDecorator } = this.props.form;
    let { exportToExcel, searchConfig, showCount, exportToExcelSetting } = this.props;
    const { width, expand } = this.state;
    for (let index = 0; index < searchConfig.length; index++) {
      const item = searchConfig[index];
      // 如果没展开并且需要展开并且当前索引大于需要看到的
      // if (!expand && showCount && index >= showCount) {
      //   break;
      // }
      // 判断之前占了多少个col
      item.type === 'RangePicker' ? allColSpan += width * 2 : allColSpan += width;
      const Search = item.type === 'RangePicker' ?
        <Col span={width * 2} key={item.name} style={{ display: !expand && showCount && index >= showCount ? 'none' : 'block' }}>
          <FormItem label={item.label}>
            {getFieldDecorator(`${item.name}`, {
              initialValue: item.initialValue ? [moment(item.initialValue[0], item.timeFormat || 'YYYY/MM/DD HH:mm:ss'), moment(item.initialValue[1], item.timeFormat || 'YYYY/MM/DD HH:mm:ss')] : ''
            })(
              <RangePicker
                disabledDate={!item.disabledTime ? () => { } : (current) => this.disabledDate(current, item)}
                allowClear={item.allowClear || false}
                showTime={item.showTime || 'YYYY/MM/DD HH:mm:ss'}
                format={item.timeFormat || 'YYYY/MM/DD HH:mm:ss'}
                placeholder={['开始时间', '结束时间']} />
            )}
          </FormItem>
        </Col>
        :
        <Col span={width} key={item.name} style={{ display: !expand && showCount && index >= showCount ? 'none' : 'block' }}>
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

    children.push(<Col className="clearfix float-left mar-bottom-width">
      <Button
        type="primary"
        onClick={this.search}>查询</Button>
      <Button className="mar-left-width ant-btn-secondary"
        onClick={this.reset}>重置</Button>
      {exportToExcelSetting && <ExportButton {...exportToExcelSetting}
        className="mar-left-width ant-btn-secondary"
      >导出</ExportButton>}
      {exportToExcel && <Button
        className="mar-left-width ant-btn-secondary"
        onClick={exportToExcel}>导出</Button>}
      {showCount &&
        <span className="normal-color expand" onClick={this.toggle}>
          {expand ? '收起' : '展开'}  <Icon className="icon" component={expand ? expandUpIcon : expandDownIcon} />
        </span>
      }
    </Col>);
    // // 如果可以铺满，操作按钮则新开一行并右对齐
    // else {
    //   children.push(<Row gutter={40} className="clearfix"><Col>
    //     <Button
    //       type="primary"
    //       onClick={this.search}>查询</Button>
    //     <Button className="mar-left-width"
    //       onClick={this.reset}>重置</Button>
    //     {exportToExcel && <Button
    //       className="mar-left-width"
    //       onClick={exportToExcel}>导出</Button>}
    //     {showCount &&
    //       <a className="mar-left-width normal-color expand" onClick={this.toggle}>
    //         {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
    //       </a>
    //     }
    //   </Col></Row>);
    // }
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
          // 如果不是双日期时间则做清空前后空格操作
          else {
            // 如果是单个日期组件
            if (nowVal && nowVal._d) {
              searchConfig.map((item, index) => {
                if (item.name === key && item.timeFormat) {
                  values[key] = nowVal && moment(nowVal).format(item.timeFormat) || "";
                }
              })
            }
            else {
              values[key] = values[key] && typeof values[key] == 'string' ? values[key].replace(/(^\s*)|(\s*$)/g, "") : values[key];
            }

          }
        }
      }
      this.props.search(err, values);
    });
  }
  setFieldsValue = (key, value) => {
    this.props.form.setFieldsValue({ [key]: value })
  }

  reset = () => {
    this.props.form.resetFields();
  }
  render() {
    const children = this.getSearchArea();
    return (
      <div className="search-box" id="search-box-id">
        <Form
          className="cxform"
          onSubmit={this.handleSearch}
        >
          <Row gutter={24}>
            {children}
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create({
  onFieldsChange(props, changedFields) {
    if (props.onFieldsChange) props.onFieldsChange(changedFields);
  }
})(SearchForm);
