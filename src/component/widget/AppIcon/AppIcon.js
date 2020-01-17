import React from 'react';
import PropTypes from 'prop-types';
// import Icon from '../Icon';
import { Icon } from 'antd';
import development from './images/development.svg'; // 开发平台
import clouddata from './images/clouddata.svg'; // 福云大数据
import customerservice from './images/customerservice.svg'; // 客服
import fulumanager from './images/fulumanager.svg'; // 福禄总管
import oa from './images/oa.svg'; // OA
import pass from './images/pass.svg'; // 通行证
import personal from './images/personal.svg'; // 人事行政
import projectmanager from './images/projectmanager.svg'; // 项目管理
import sre from './images/sre.svg'; // 运维
import marketing from './images/marketing.svg'; // 销售平台
import erp from './images/erp.svg'; // 销售平台
import managementSystem from './images/managementSystem.svg';
import fuluworkflow from './images/fuluworkflow.svg';
import fuyunERP from './images/fuyunERP.svg';
import personnelAdmin from './images/personnelAdmin.svg';
import financialDocuments from './images/financialDocuments.svg';
import PM from './images/PM.svg';
import virtualMall from './images/virtual_mall.svg';
import logistics from './images/logistics.svg';
import batch from './images/batch.svg';
import supply from './images/supply.svg';
import recharge from './images/recharge.svg';


class AppIcon extends React.Component {
    static propTypes = {
        type: PropTypes.string,
    };

    static defaultProps = {
        type: '',
    };

    getImageByType = (type) => {
        switch (type) {
            case 'personal':
                return personal; // 行政办公
            case 'projectmanager':
                return projectmanager; // 项目管理
            case 'customerservice':
                return customerservice; // 客服工单
            case 'clouddata':
                return clouddata; // 分析统计
            case 'sre':
                return sre; // 维护平台
            case 'development':
                return development; // 开发平台
            case 'pass':
                return pass; // 通行证
            case 'oa':
                return oa; // OA
            case 'marketing':
                return marketing; // 销售平台
            case 'fulumanager':
                return fulumanager; // 福禄总管
            case 'erp':
                return erp; // erp
            case 'managementSystem':
                return managementSystem; // 系统管家
            case 'fuluworkflow':
                return fuluworkflow; // 福禄工作流
            case 'fuyunERP':
                return fuyunERP; // 福云ERP
            case 'personnelAdmin':
                return personnelAdmin; // 人事行政
            case 'financialDocuments':
                return financialDocuments; // 财务单据
            case 'PM':
                return PM; // 项目管理
            case 'virtualMall': // 虚拟商城
                return virtualMall;
            case 'logistics': // 物流
                return logistics;
            case 'batch': // 批冲批采
                return batch;
            case 'supply': // 我要供货
                return supply;
            case 'recharge': // 充值api
                return recharge;
            default:
                return fulumanager; // 福禄总管
        }
    };

    render() {
        const { type, ...restProps } = this.props;
        return <Icon {...restProps} component={this.getImageByType(type)} />;
    }
}

export default AppIcon;
