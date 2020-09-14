import React from "react";
import { Button, DatePicker, TimePicker, Form } from "antd";
import moment from "moment";
import locale from "antd/es/date-picker/locale/zh_CN";
import "moment/locale/zh-cn";
import "./index.less";

const { RangePicker } = DatePicker;
const cls = "custom-picker-wrapper";
const errTip = "请选择时间";
moment.locale("zh-cn");
moment.defineLocale('zh-cn', {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
      '_'
  ),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
      '_'
  ),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'YYYY/MM/DD',
      LL: 'YYYY年M月D日',
      LLL: 'YYYY年M月D日Ah点mm分',
      LLLL: 'YYYY年M月D日ddddAh点mm分',
      l: 'YYYY/M/D',
      ll: 'YYYY年M月D日',
      lll: 'YYYY年M月D日 HH:mm',
      llll: 'YYYY年M月D日dddd HH:mm',
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour: function (hour, meridiem) {
      if (hour === 12) {
          hour = 0;
      }
      if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
          return hour;
      } else if (meridiem === '下午' || meridiem === '晚上') {
          return hour + 12;
      } else {
          // '中午'
          return hour >= 11 ? hour : hour + 12;
      }
  },
  meridiem: function (hour, minute, isLower) {
      var hm = hour * 100 + minute;
      if (hm < 600) {
          return '凌晨';
      } else if (hm < 900) {
          return '早上';
      } else if (hm < 1130) {
          return '上午';
      } else if (hm < 1230) {
          return '中午';
      } else if (hm < 1800) {
          return '下午';
      } else {
          return '晚上';
      }
  },
  calendar: {
      sameDay: '[今天]LT',
      nextDay: '[明天]LT',
      nextWeek: function (now) {
          if (now.week() !== this.week()) {
              return '[下]dddLT';
          } else {
              return '[本]dddLT';
          }
      },
      lastDay: '[昨天]LT',
      lastWeek: function (now) {
          if (this.week() !== now.week()) {
              return '[上]dddLT';
          } else {
              return '[本]dddLT';
          }
      },
      sameElse: 'L',
  },
  dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
  ordinal: function (number, period) {
      switch (period) {
          case 'd':
          case 'D':
          case 'DDD':
              return number + '日';
          case 'M':
              return number + '月';
          case 'w':
          case 'W':
              return number + '周';
          default:
              return number;
      }
  },
  relativeTime: {
      future: '%s后',
      past: '%s前',
      s: '几秒',
      ss: '%d 秒',
      m: '1 分钟',
      mm: '%d 分钟',
      h: '1 小时',
      hh: '%d 小时',
      d: '1 天',
      dd: '%d 天',
      M: '1 个月',
      MM: '%d 个月',
      y: '1 年',
      yy: '%d 年',
  },
  week: {
      dow: 1, // Monday is the first day of the week.
      doy: 4, // The week that contains Jan 4th is the first week of the year.
  },
});
class FlRangePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      startTime: null,
      disableTime: true,
      endTime: null,
      sTimeError: null,
      eTimeError: null,
      dates: props.defaultValue || props.value || [],
      rangePickerInitShow: false // 时间面板是否显示
    };
    this.isToday = false;
    this.isInitalVal = false;
    this.sTimer = null;
    this.eTimer = null;
    this.onOk = this.onOk.bind(this);
    this.onToday = this.onToday.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onCalendarChange = this.onCalendarChange.bind(this);
  }
  componentWillUnmount() {
    clearTimeout(this.sTimer);
    clearTimeout(this.eTimer);
  }
  initalVal() {
    const { defaultValue, value } = this.props;
    const initalValArr = defaultValue || value;
    if (Array.isArray(initalValArr) && initalValArr.length > 0) {
      let startTime = initalValArr[0];
      let endTime = initalValArr[1];
      if (!moment.isMoment(startTime)) {
        startTime = moment(new Date(startTime._d).getTime());
        initalValArr[0] = startTime;
      }
      if (!moment.isMoment(endTime)) {
        endTime = moment(new Date(endTime._d).getTime());
        initalValArr[1] = endTime;
      }
      this.setState({
        dates: initalValArr,
        disableTime: false,
        isOpen: true,
        rangePickerInitShow: true,
        startTime,
        endTime
      });
    } else {
      this.setState({
        isOpen: true,
        rangePickerInitShow: true
      });
    }
  }
  onTimeChange(time, isStart = true) {
    let timer = isStart ? this.sTimer : this.eTimer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const {
        dates: [startDate, endDate]
      } = this.state;
      const timeState = {
        [isStart ? "startTime" : "endTime"]: time,
        [isStart ? "sTimeError" : "eTimeError"]: time ? "" : errTip
      };
      if (time) {
        if (isStart && startDate) {
          timeState.dates = [this.concatFullDate(startDate, time), endDate];
        }
        if (!isStart && endDate) {
          timeState.dates = [startDate, this.concatFullDate(endDate, time)];
        }
      }
      this.setState(timeState);
    }, 500);
  }
  concatFullDate(date, time) {
    const timeStr = typeof time === "object" ? time.format("HH:mm:ss") : time;
    const dateStr = `${date.format("YYYY-MM-DD")} ${timeStr}`;
    return moment(dateStr);
  }
  gerDateByChange(dates) {
    const { startTime, endTime } = this.state;
    const newDates = dates.slice();
    const newState = {
      disableTime: dates.length !== 2,
      dates: newDates
    };
    if (newDates.length > 0) {
      if (startTime) {
        newDates[0] = this.concatFullDate(
          newDates[0],
          startTime.format("HH:mm:ss")
        );
      } else {
        newState.startTime = newDates[0];
      }
    }
    if (newDates.length > 1) {
      if (endTime) {
        newDates[1] = this.concatFullDate(
          newDates[1],
          endTime.format("HH:mm:ss")
        );
      } else {
        newState.endTime = newDates[1];
      }
    }
    this.setState(newState);
    return newState;
  }
  onCalendarChange(dates) {
    const { onCalendarChange } = this.props;
    const newDates = this.gerDateByChange(dates);
    if (typeof onCalendarChange === "function") {
      onCalendarChange(newDates.dates, [
        this.transferDateToStr(newDates.dates[0]),
        this.transferDateToStr(newDates.dates[1])
      ]);
    }
    if (this.isToday && dates.length > 1) {
      this.onOpenChange(false);
      this.isToday = false;
    }
  }
  transferDateToStr(m) {
    return m && m.format(this.props.format || "YYYY-MM-DD HH:mm:ss");
  }
  onDateChange(dates) {
    const { onChange } = this.props;
    const newDates = this.gerDateByChange(dates);
    if (typeof onChange === "function") {
      onChange(newDates.dates, [
        this.transferDateToStr(newDates.dates[0]),
        this.transferDateToStr(newDates.dates[1])
      ]);
    }
  }
  onOpenChange(isOpen) {
    const { onChange, onOpenChange } = this.props;
    const { sTimeError, eTimeError, dates } = this.state;
    if (sTimeError || eTimeError) {
      return;
    }
    if (isOpen && !this.isInitalVal) {
      this.isInitalVal = true;
      this.initalVal();
    } else {
      const newState = {
        isOpen,
        rangePickerInitShow: true
      };
      if (isOpen && dates.length === 0) {
        newState.startTime = null;
        newState.endTime = null;
      }
      if (!isOpen) {
        if (dates.length === 2) {
          Object.assign(newState, this.gerDateByChange(dates));
          if (typeof onChange === "function") {
            onChange(dates);
          }
        } else {
          newState.dates = [];
        }
      }
      this.setState(newState);
      if (typeof onOpenChange === "function") {
        onOpenChange(isOpen);
      }
    }
  }
  getTodayNode() {
    return document.querySelector(".custom-picker-wrapper .ant-calendar-today");
  }
  onToday() {
    const todayNode = this.getTodayNode();
    todayNode.click();
    this.isToday = true;
    setTimeout(() => {
      todayNode.click();
    }, 0);
  }
  onOk() {
    const { onChange } = this.props;
    const { startTime, endTime, dates } = this.state;
    const errTips = {};
    if (!startTime) {
      errTips.sTimeError = errTip;
    }
    if (!endTime) {
      errTips.eTimeError = errTip;
    }
    if (dates.length !== 2) {
      return;
    }
    if (Object.keys(errTips).length > 0) {
      this.setState(errTips);
      return;
    }
    if (typeof onChange === "function") {
      onChange(dates);
    }
    this.onOpenChange(false);
  }
  getDisabledTime() {
    const { disabledTime } = this.props;
    const { dates } = this.state;
    if (typeof disabledTime === "function") {
      const startDisabledTime = disabledTime(dates, "start");
      const endDisabledTime = disabledTime(dates, "end");
      return [startDisabledTime, endDisabledTime];
    }
  }
  renderFooter() {
    const {
      sTimeError,
      eTimeError,
      disableTime,
      rangePickerInitShow,
      startTime,
      endTime
    } = this.state;
    if (rangePickerInitShow) {
      const disabledTime = this.getDisabledTime();
      const comProps = {
        allowClear: false,
        disabled: disableTime,
        placeholder: "请选择时间",
        popupClassName: "custom-range-time-picker"
      };
      const startTimeProps = Object.assign({}, comProps);
      const endTimeProps = Object.assign({}, comProps);
      if (Array.isArray(disabledTime)) {
        const [startDisabledTime, endDisabledTime] = disabledTime;
        Object.assign(startTimeProps, startDisabledTime);
        Object.assign(endTimeProps, endDisabledTime);
      }
      return (
        <div className="fl-range-footer">
          <span>时 间 &nbsp;</span>
          <Form.Item
            validateStatus={sTimeError ? "error" : ""}
            help={sTimeError}
          >
            <TimePicker
              value={moment.isMoment(startTime) ? startTime : null}
              onChange={time => {
                this.onTimeChange(time);
              }}
              {...startTimeProps}
            />
          </Form.Item>
          <span>&nbsp;&nbsp;~ &nbsp;</span>
          <Form.Item
            validateStatus={eTimeError ? "error" : ""}
            help={eTimeError}
          >
            <TimePicker
              value={moment.isMoment(endTime) ? endTime : null}
              onChange={time => {
                this.onTimeChange(time, false);
              }}
              {...endTimeProps}
            />
          </Form.Item>
          <Button
            type="primary"
            ghost
            className="btn-today"
            onClick={this.onToday}
          >
            今天
          </Button>
          <Button
            type="primary"
            disabled={disableTime}
            className="btn-ok"
            onClick={this.onOk}
          >
            确定
          </Button>
        </div>
      );
    }
    return null;
  }
  render() {
    const { showTime, value } = this.props;
    const { dates, isOpen } = this.state;
    const propsCopy = Object.assign({}, this.props);
    if (showTime) {
      propsCopy.dropdownClassName = cls;
      propsCopy.renderExtraFooter = this.renderFooter;
    }
    return (
      <React.Fragment>
        <RangePicker
          locale={locale}
          {...propsCopy}
          value={value || dates}
          open={isOpen}
          onOpenChange={this.onOpenChange}
          onChange={this.onDateChange}
          onCalendarChange={this.onCalendarChange}
        />
        {this.renderFooter()}
      </React.Fragment>
    );
  }
}

export default FlRangePicker;
