import React, { Component } from 'react';
import { DatePicker, Icon } from 'antd';
const { MonthPicker } = DatePicker;
import dateIcon from '../../images/dateIcon.svg';
class MyMonthPicker extends Component {
    render() {
        const { props } = this;
        return (
            <MonthPicker suffixIcon={<Icon className="icon" component={dateIcon} />} {...props} />
        );
    }
}

export default MyMonthPicker;