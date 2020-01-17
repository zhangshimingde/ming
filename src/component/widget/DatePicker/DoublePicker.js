import React, { Component } from 'react';
import { DatePicker, Icon } from 'antd';
const { RangePicker } = DatePicker;
import dateIcon from '../../images/dateIcon.svg';
class DoublePicker extends Component {
    render() {
        const { props } = this;
        return (
            <RangePicker suffixIcon={<Icon className="icon" component={dateIcon} />} {...props} />
        );
    }
}

export default DoublePicker;