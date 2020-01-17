import React from 'react';
import { Icon } from 'antd';

import profile from './images/profile.svg';
import apply from './images/apply.svg';
import authority from './images/authority.svg';
import financial from './images/financial.svg';
import home from './images/home.svg';
import report_manage from './images/report_manage.svg';
import financial_manage from './images/financial_manage.svg';
import operation_log from './images/operation_log.svg';
import store_manage from './images/store_manage.svg';
import order_manage from './images/order_manage.svg';
import wind_control from './images/wind_control.svg';
import personal_data from './images/personal_data.svg';
import shopping_cart from './images/shopping_cart.svg';
import inventory_manage from './images/inventory_manage.svg';
import batch_acquisition from './images/batch_acquisition.svg';
import batch_direct_charge from './images/batch_direct_charge.svg';
import auth_manage from './images/auth_manage.svg';
import shopping_mall from './images/shopping_mall.svg';
import commodity_manage from './images/commodity_manage.svg';
import home_manage from './images/home_manage.svg';
import after_sale_manage from './images/after_sale_manage.svg';
import app_manage from './images/app_manage.svg';
import app_config from './images/app_config.svg';
import game_manage from './images/game_manage.svg';
import balance from './images/balance.svg';
import pay_config from './images/pay_config.svg';
import product_list from './images/product_list.svg';
import template_manager from './images/template_manager.svg';
import marketing_manage from './images/marketing_manage.svg';
import vendor_manage from './images/vendor_manage.svg';
import logistics from './images/logistics.svg';

let IconMap = {
    fl_report_manage: { el: <Icon component={report_manage} />, desc: "报表管理" },
    fl_financial_manage: { el: <Icon component={financial_manage} />, desc: "财务管理" },
    fl_operation_log: { el: <Icon component={operation_log} />, desc: "操作日志" },
    fl_store_manage: { el: <Icon component={store_manage} />, desc: "店铺管理" },
    fl_order_manage: { el: <Icon component={order_manage} />, desc: "订单管理" },
    fl_wind_control: { el: <Icon component={wind_control} />, desc: "风控管理" },
    fl_personal_data: { el: <Icon component={personal_data} />, desc: "个人资料" },
    fl_shopping_cart: { el: <Icon component={shopping_cart} />, desc: "购物车" },
    fl_inventory_manage: { el: <Icon component={inventory_manage} />, desc: "库存管理" },
    fl_batch_acquisition: { el: <Icon component={batch_acquisition} />, desc: "批量采卡" },
    fl_batch_direct_charge: { el: <Icon component={batch_direct_charge} />, desc: "批量直充" },
    fl_auth_manage: { el: <Icon component={auth_manage} />, desc: "权限管理" },
    fl_shopping_mall : { el: <Icon component={shopping_mall} />, desc: "商城概况" },
    fl_commodity_manage : { el: <Icon component={commodity_manage} />, desc: "商品管理" },
    fl_home_manage : { el: <Icon component={home_manage} />, desc: "首页管理" },
    fl_after_sale_manage : { el: <Icon component={after_sale_manage} />, desc: "售后管理" },
    fl_app_manage : { el: <Icon component={app_manage} />, desc: "应用管理" },
    fl_app_config : { el: <Icon component={app_config} />, desc: "应用配置" },
    fl_game_manage : { el: <Icon component={game_manage} />, desc: "游戏管理" },
    fl_pay_config : { el: <Icon component={pay_config} />, desc: "支付管理" },
    fl_product_list : { el: <Icon component={product_list} />, desc: "商品列表" },
    fl_template_manager : { el: <Icon component={template_manager} />, desc: "模板管理" },
    fl_marketing_manage : { el: <Icon component={marketing_manage} />, desc: "营销管理" },
    fl_vendor_manage : { el: <Icon component={vendor_manage} />, desc: "厂商管理" },
    fl_logistics : { el: <Icon component={logistics} />, desc: "物流管理" },
}

export default IconMap;