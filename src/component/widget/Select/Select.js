
import React, { Component } from 'react';
import { Select, Icon } from 'antd';
import arrowIcon from '../../images/arrow.svg';
class SelectCom extends Component {
  render() {
    const { props } = this;
    return (
      <Select suffixIcon={<Icon className="icon" component={arrowIcon} />} {...props} />
    );
  }
}
export default SelectCom;