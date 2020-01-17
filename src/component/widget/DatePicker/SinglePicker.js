
import React, { Component } from 'react';
import { DatePicker, Icon } from 'antd';
import dateIcon from '../../images/dateIcon.svg';

class SinglePicker extends Component {
    render() {
        const { props } = this;
        return (
            <DatePicker suffixIcon={<Icon className="icon" component={dateIcon} />} {...props} />
        );
    }
}
export default SinglePicker;