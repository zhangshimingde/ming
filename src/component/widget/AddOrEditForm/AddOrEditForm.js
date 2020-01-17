import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Col, Row, Icon, Tooltip, Radio } from 'antd';
import Button from '../WaveButton';
import Select from '../Select';
import DatePicker from '../DatePicker';
const { RangePicker } = DatePicker;
import UploadImg from '../UploadImg';
import { icons } from '../../images';
import arrow from '../../images/arrow.svg';
import dateIcon from '../../images/dateIcon.svg';
import './less/addOrEditForm.less';
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class AddOrEditForm extends React.PureComponent {
  static propTypes = {
    form: PropTypes.shape({
      validateFields: PropTypes.func.isRequired,
      getFieldDecorator: PropTypes.func.isRequired,
      setFieldsValue: PropTypes.func.isRequired,
      resetFields: PropTypes.func.isRequired,
      getFieldsValue: PropTypes.func.isRequired,
    }).isRequired,
    config: PropTypes.array,
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
    };
  }

  componentDidMount() {
    const { config } = this.props;
    // 时间控件波浪线调整为横线
    this.setDatePickerCenterIcons();
    // 如果有上传图片需要将值赋给state
    for (let index = 0; index < config.length; index++) {
      const element = config[index];
      if (element.type === 'Upload') {
        this.setState({
          [element.name]: element.initialValue
        });
      }
    }
  }
  componentWillUnmount() {
    // window.removeEventListener('resize', this.resize);
  }
  // 设置时间中间的波浪线
  setDatePickerCenterIcons = () => {
    var datePickerCenterIcons = document.getElementsByClassName('ant-calendar-range-picker-separator');
    for (let index = 0; index < datePickerCenterIcons.length; index++) {
      const element = datePickerCenterIcons[index];
      element.innerText = '—';
    }
  }
  getInputArea = (item) => {
    if (item.tips) {
      return
    }
  }
  getSelectIcon = () => {
    return <Icon className="icon" component={icons.arrow} />;
  }

  getDateIcon = () => {
    return <Icon className="icon" component={icons.dateIcon} />;
  }
  getFormArea = () => {
    try {
      const { getFieldDecorator } = this.props.form;
      let { config } = this.props;

      let children = [];
      for (let index = 0; index < config.length; index++) {
        const item = config[index];
        const { col = {} } = item;
        let antColSpan = col.antColSpan || '', labelColSpan = col.labelColSpan || '', wrapperColSpan = col.wrapperColSpan || '';
        let { rules = [] } = item;
        if (item.render) {
          children.push(item.render);
        }
        else if (item.type === 'Text') {
          children.push(
            <Col
              span={antColSpan || '24'}
            >
              <FormItem
                labelCol={{ span: labelColSpan || '4' }}
                wrapperCol={{ span: wrapperColSpan || '8' }}
                className="label-text"
                label={item.label} key={item.name}>
                {getFieldDecorator(item.name, {

                })(
                  <div>{item.initialValue}</div>
                )}
              </FormItem></Col>
          );
        }
        else if (item.type == 'Input' || item.type === 'Radio') {
          let dom = item.type === 'Input' ? <Input
            disabled={item.disabled}
            placeholder={item.placeholder || `请输入${item.label}`}
            maxLength={item.maxLength || 1000}
          /> : <RadioGroup name="radiogroup" disabled={item.disabled}>
              {item.items && item.items.map((opt) =>
                <Radio value={opt.value} key={opt.value}>{opt.name}</Radio>
              )}
            </RadioGroup>;
          // 如果有提示，文本和字段内容需要宽度提高到12，否则就给6
          const formItemDom =
            <Col
              span={antColSpan || '24'}
            >
              <FormItem
                label={item.label}
                key={item.name}
                labelCol={{ span: labelColSpan || '4' }}
                wrapperCol={{ span: wrapperColSpan || '8' }}
              >
                {getFieldDecorator(item.name, {
                  rules,
                  initialValue: item.initialValue
                })(dom)}
              </FormItem>
            </Col>;
          // 如果需要提示，则按左右分
          if (item.tipsObj) {
            children.push(
              <Col key={item.name} span={24}>
                <Col span={12}>
                  {formItemDom}
                </Col>
                <Col span={12} className="tips">
                  {/* {item.tips} */}
                  {item.tipsObj.type === 'icon' ? <Tooltip title={item.tipsObj.text}>
                    <Icon style={{ cursor: 'pointer' }} type="exclamation-circle" />
                  </Tooltip> : <span>{item.tipsObj.text}</span>}

                </Col>
              </Col>
            );
          } else {
            children.push(formItemDom);
          }
        }
        else if (item.type === 'TextArea') {
          let dom = <Input.TextArea
            className="textaea"
            disabled={item.disabled}
            autosize={item.autosize}
            placeholder={item.placeholder || `请输入${item.label}`}
            maxLength={item.maxLength || 1000}
          />;
          children.push(
            <Col span={24}>
              <FormItem
                key={item.name}
                labelCol={{ span: labelColSpan || '4' }}
                wrapperCol={{ span: wrapperColSpan || '8' }}
                label={item.label}
              >
                {getFieldDecorator(item.name, {
                  rules,
                  initialValue: item.initialValue
                })(dom)}
              </FormItem>
            </Col>);
        } else if (item.type === 'Select') {
          const formItemDom = <Col
            span={antColSpan || '24'}
          >
            <FormItem
              labelCol={{ span: labelColSpan || '4' }}
              wrapperCol={{ span: wrapperColSpan || '8' }}
              key={item.name}
              label={item.label}
            >
              {getFieldDecorator(item.name, {
                rules,
                initialValue: item.initialValue
              })(
                <Select
                  suffixIcon={this.getSelectIcon()}
                  onChange={item.change}
                  showSearch={item.showSearch}
                  disabled={item.disabled}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                  {item.items && item.items.map((opt) =>
                    <Select.Option value={opt.value} key={opt.value}>{opt.name}</Select.Option>)}
                </Select>
              )
              }
            </FormItem>
          </Col>
          // 如果需要提示，则按左右分
          if (item.tipsObj) {
            children.push(
              <Col key={item.name} span={24}>
                <Col span={12}>
                  {formItemDom}
                </Col>
                <Col span={12} className="tips">
                  {/* {item.tips} */}
                  {item.tipsObj.type === 'icon' ? <Tooltip title={item.tipsObj.text}>
                    <Icon style={{ cursor: 'pointer' }} type="exclamation-circle" />
                  </Tooltip> : <span>{item.tipsObj.text}</span>}

                </Col>
              </Col>
            );
          }
          else {
            children.push(formItemDom);
          }
        }
        else if (item.type === 'Upload') {
          children.push(
            <Col span={antColSpan || '24'}>
              <UploadImg
                disabled={item.disabled}
                previewImageWidth={item.previewImageWidth}
                col={item.col}
                uploadUrl={item.uploadUrl}
                triggerRef={(ref) => this[item.name] = ref}
                isRequred={item.isRequred}
                label={item.label}
                name={item.name}
                updateImg={this.updateImg}
                initialValue={item.initialValue}
              />
            </Col>);
        }
        else if (item.type === 'DatePicker') {
          children.push(
            <Col span={antColSpan || '24'}>
              <FormItem
                labelCol={{ span: labelColSpan || '4' }}
                wrapperCol={{ span: wrapperColSpan || '8' }}
                key={item.name}
                label={item.label}>
                {getFieldDecorator(item.name, {
                  rules,
                  initialValue: item.initialValue ? moment(item.initialValue, item.timeFormat) : ''
                })(
                  <DatePicker
                    disabled={item.disabled}
                    suffixIcon={this.getDateIcon()}
                    allowClear={item.allowClear || false}
                    className="wid-200"
                    showTime={item.showTime || 'YYYY/MM/DD HH:mm:ss'}
                    disabledDate={!item.disabledTime ? () => { } : (current) => this.disabledDate(current, item)}
                    format={item.timeFormat || 'YYYY/MM/DD HH:mm:ss'}
                  />
                )}
              </FormItem>
            </Col>);
        }
        else if (item.type === 'RangePicker') {
          children.push(
            <Col span={24}>
              <FormItem
                labelCol={{ span: labelColSpan || '4' }}
                wrapperCol={{ span: wrapperColSpan || '8' }}
                key={item.name}
                label={item.label}>
                {getFieldDecorator(item.name, {
                  rules,
                  initialValue: item.initialValue ? [moment(item.initialValue[0], item.timeFormat || 'YYYY/MM/DD HH:mm:ss'), moment(item.initialValue[1], item.timeFormat || 'YYYY/MM/DD HH:mm:ss')] : ''
                })(
                  <RangePicker
                    disabled={item.disabled}
                    suffixIcon={this.getDateIcon()}
                    style={{ width: '100%' }}
                    allowClear={item.allowClear || false}
                    showTime={item.showTime || 'YYYY/MM/DD HH:mm:ss'}
                    disabledDate={!item.disabledTime ? () => { } : (current) => this.disabledRangeDate(current, item)}
                    format={item.timeFormat || 'YYYY/MM/DD HH:mm:ss'}
                    placeholder={['开始时间', '结束时间']} />
                )}
              </FormItem>
            </Col>);
        }
      }
      return children;
    } catch (error) {
      console.log(error)
    }
  }
  updateImg = (field, value, fileEdit) => {
    this.setState({
      [field]: value,
      [fileEdit]: true
    })
  }
  disabledDate = (current,item) => {
    const { disabledTime } = item;
    if (disabledTime) {
      if(typeof disabledTime==="boolean"){
        return current && current > moment().endOf('day');
      }
      return current && current > moment(disabledTime);
    }
    return current && current > moment().endOf('day');
  }
  disabledRangeDate = (current, item) => {
    const { disabledTime = {} } = item;
    if (disabledTime.afterDate) {
      return current && !(current < moment(disabledTime.afterDate) && current > moment(disabledTime.beforeDate));
    }
    return current && current > moment().endOf('day');
  }
  btnSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { config, type } = this.props;
        // 处理时间数组
        for (const key in values) {
          if (values.hasOwnProperty(key)) {
            var nowVal = values[key];
            if (nowVal) {
              // 如果是时间
              if (Object.prototype.toString.call(nowVal) === "[object Array]" || nowVal._d) {
                // 获取用户想要的时间格式
                let timeFormat = "YYYY/MM/DD HH:mm:ss";
                for (let index = 0; index < config.length; index++) {
                  const element = config[index];
                  if (element.name === key && element.timeFormat) {
                    timeFormat = element.timeFormat;
                    // rangepicker
                    if (Object.prototype.toString.call(nowVal) === "[object Array]") {
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

                // datepicker
                if (!(Object.prototype.toString.call(nowVal) === "[object Array]")) {
                  values[`${key}`] = moment(nowVal).format(timeFormat);
                }
              }
              // 如果不是时间则做清空前后空格操作
              else if (values[key] && typeof values[key] == 'string') {
                values[key] = values[key].replace(/(^\s*)|(\s*$)/g, "");
              }

            }
          }
        }

        let { ...stateInfo } = this.state;
        // 图片是否可以提交
        let flag = true;
        // 处理图片
        for (let index = 0; index < config.length; index++) {
          const element = config[index];
          // 如果是上传图片
          if (element.type === 'Upload') {
            for (const key in stateInfo) {
              if (stateInfo.hasOwnProperty(key)) {
                const nowValue = stateInfo[key];
                // 如果state的key等于config的name，就能获取state的图片
                if (key === element.name) {
                  // 如果是新增
                  if (type === 'add') {
                    values[element.name] = nowValue ? (nowValue.flag ? nowValue.fileList[0].url :
                      nowValue.response.data) : '';
                  }
                  // 如果是编辑
                  else {
                    // 如果用户上传了或者删除了
                    if (stateInfo[`${key}Edit`]) {
                      values[element.name] = nowValue ? nowValue.response.data : '';
                    }
                    else {
                      values[element.name] = element.initialValue;
                    }
                  }
                  // 如果名字不存在，并且需要必填
                  if (!values[element.name] && element.isRequred) {
                    flag = false;
                    // 触发子组件的提交事件
                    this[key].btnSubmit();
                  }
                }
              }
            }
          }
        }
        // 如果图片验证成功了
        if (flag) {
          this.props.btnSubmit(err, values);
        }
      }
    });
  }

  reset = () => {
    this.props.form.resetFields();
  }
  render() {
    const children = this.getFormArea();
    const { cancelText, okText } = this.props;
    return (
      <div className="add-box">
        <Form
        // onSubmit={this.btnSubmit}
        >
          <Row>
            {children}
            <Col span={24}>
              <FormItem wrapperCol={{
                span: 12,
                offset: 4
              }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.btnSubmit}
                >
                  {okText || "保存"}
                </Button>
                <Button
                  className="mar-left-width ant-btn-secondary"
                  onClick={this.props.btnCancel}
                >
                  {cancelText || "取消"}
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create({
  onFieldsChange(props, changedFields) {
    if (props.onSubmitFieldsChange) props.onSubmitFieldsChange(changedFields);
  }
})(AddOrEditForm);
