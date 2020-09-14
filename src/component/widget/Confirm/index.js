import React from 'react';
import { Modal, Icon } from 'antd';

const { info, success, confirm } = Modal;

const Confirm = ({type = 'info', ...rest}) => {
    const newConfigs = Object.assign({}, rest, { okText: '确定' });
    let ConfirmComp = confirm;
    switch (type) {
        case 'info':
            ConfirmComp = info;
            newConfigs.icon = <Icon type="info-circle" theme="filled" />;
            break;
        case 'success':
            ConfirmComp = success;
            newConfigs.icon = <Icon type="check-circle" theme="filled" />;
            break;
        case 'warn':
            newConfigs.icon = <Icon type="question-circle" theme="filled" />;
            break;
        case 'error':
            // newConfigs.okType = 'danger ant-btn-background-ghost';
            newConfigs.icon = <Icon type="close-circle" theme="filled" style={{ color: '#F5222D' }} />;
            break;
        default:
            break;
    }
    return (ConfirmComp(newConfigs));
};

export default Confirm;
