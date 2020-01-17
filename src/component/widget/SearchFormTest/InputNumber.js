import React from 'react';
import { Input, Tooltip } from 'antd';

function formatNumber(value) {
    value += '';
    const list = value.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

class NumericInput extends React.Component {
    static getDerivedStateFromProps(nextProps, prevState) {

        return null;
    }
    onChange = e => {
        const { value } = e.target;
        const { type } = this.props;
        // 小数和整数使用的正则表达式不一样
        const reg = type === 'decimal' ? /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/ : /^[0-9]*[1-9][0-9]*$/;
        if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            console.log(value, 88)
            console.log(this.props, 22)
            this.props.onChange(value);
        }
    };
    render() {
        const { placeholder, maxLength } = this.props;
        return (
            <Input
                {...this.props}
                onChange={this.onChange}
                placeholder={placeholder}
                maxLength={maxLength}
            />
        );
    }
}
export default NumericInput;