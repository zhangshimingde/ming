
import _ from 'lodash';
import request from './request';
import api from '../cfg/api';
import commonFun from './tools';

const service = {};
let _configs = null;

service.init = function(cfg) {
    _configs = cfg;
}

const getConfigs = () => {
    return _configs || window.configs;
};

// 获取消息中心总条数
service.fetchMsgTotal = function() {
    return request.get(getConfigs().host.common + api.msgTotal);
    // return request.get('http://10.0.1.90:5000' + api.msgTotal);
}

// 认证
service.fetchAuth = function(payload) {
    return request.post(getConfigs().host.passport.authCode + api.authCode, payload);
}

// 获取用户信息
service.fetchUserInfo = function() {
    return request.get(getConfigs().host.common + api.getUserInfo);
}
// 获取获取平台下的所有应用
service.fetchAllApps = function(params) {
    return request.get(getConfigs().host.common + api.getAllApps);
}
// 获取授权app
service.fetchAuthApps = function() {
    return request.get(getConfigs().host.common + api.getAuthApps);
}
// 获取授权菜单
service.fetchAuthMenus = function(params) {
    return request.get(getConfigs().host.common + api.getAuthMenus);
}
// 获取通行证用户 用户的信息用次接口来获取
service.fetchCurrentUserInfo = function() {
    return request.get(getConfigs().host.common + api.userinfo);
}
// 登出
service.loginOut = function() {
    const domain = commonFun.getDomain();
    if (domain) {
        document.cookie = `logout=1;domain=${domain};`;
    }
    const redirectUrl = getConfigs().host.main;
    const logoutUrl = `${getConfigs().host.passport.auth + api.auth}?client_id=10000049&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=get_user_info&state=xyz&pt=1`;
    
    window.location.href = getConfigs().host.passport.auth + api.logout + '?returnurl=' + encodeURIComponent(logoutUrl);
}
//  将通行证的用户注册到商户控制台
service.register = function() {
    return request.get(getConfigs().host.common + api.register);
}

// 获取余额信息
service.getBalance = function () {
    return request.get(getConfigs().host.common + api.balance);
}
// 获取账号的商户
service.getUserMerchants = function () {
    return request.get(getConfigs().host.common + api.userMerchants);
}
// 创建商户
service.createMerchant = function(payload) {
    return request.post(getConfigs().host.common + api.createMerchants, payload);
}
// 编辑商户备注信息
service.updateMerchantRemark = function(payload) {
    return request.put(getConfigs().host.common + api.updateMerchantRemark, payload);
}
//
service.getMerchantContext = function() {
    return request.get(getConfigs().host.common + api.getMechantInfo + "/" + localStorage.getItem("MerchantId"));
}
// 已认证商户主体列表
service.getAffiliatedCompanyList = function() {
    return request.get(getConfigs().host.common + api.AffiliatedCompanyList);
}
// 企业商户主体继承
service.AuthMerchantByCopy = function (id) {
    return request.put(getConfigs().host.common + api.AuthMerchantByCopy, { MemberId: id});
}
// 获取已认证的个人商户列表
service.getAffiliatedPersonalList = function() {
    return request.get(getConfigs().host.common + api.getAffiliatedPersonalList);
}
// 加入团队
service.joinTeam = function(code) {
    return request.post(getConfigs().host.common + api.joinTeam, { code })
}
// 根据邀请码获取邀请者信息
service.getInviterInfo = function(code) {
    return request.get(getConfigs().host.common + api.getInviterInfo + "?code=" + code )
}
// 获取客服系统消息数 展示在菜单上
service.getCustomerNotify = function (menuBradgeUrl) {
    const requestUrl = menuBradgeUrl || `${getConfigs().host.webapi}${api.getCustomerNotify}`;
    return request.get(requestUrl);
}

// 判断协作者是否拥有角色
service.existRole = function(id, noError = false) {
    const requestObj = {
        url: getConfigs().host.common + api.existRole,
        method: "get",
        headers: {
            MerchantId: id
        }
    };
    if (noError) {
        requestObj.params = { noError };
    }
    return request(requestObj);
}

// 获取财务信息
service.getFinAccount = function (accountType) {
    request.get(getConfigs().host.webapi + api.getFinAccount, {
        params: { accountType }
    });
}

// 获取商户信息
service.getMemberInfo = function () {
    return request.get(getConfigs().host.webapi + api.getMemberInfo);
}

export default service;