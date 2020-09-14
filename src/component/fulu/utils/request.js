import axios from 'axios';
import { message } from 'antd';
import url from 'url';
import uuidv4 from 'uuid/v4';
import api from '../cfg/api';
import service from './service';

var instance = axios.create({
  timeout: 30000,
});

instance.interceptors.request.use(function (config) {
  config.headers["Authorization"] = `Bearer ${localStorage.getItem('access_token')}`;

  let merchantId = localStorage.getItem('MerchantId');
  if (merchantId) {
    config.headers["MerchantId"] = merchantId;
  }
  return config;
})

instance.interceptors.response.use(function (response) {
  if (response.data.code != '0' && response.data.message) {
    if (response.config && Object.hasOwnProperty.call(response.config.params || {}, 'noError')) {
      return response.data;
    }
    message.error(response.data.message);
  }
  return response.data;
}, handleErrNavCallBack);

/*记录每次调用auth方法的时间，确保1min只能调用15次
防止出现获取access_token成功，但该token无法使用 导致页面死循环
*/
function canInvokeAuth() {
  var authRecords = localStorage.getItem('authInvokeTime');
  if (!authRecords) {
    authRecords = [];
  } else {
    authRecords = JSON.parse(authRecords);
  }

  var now = ~~(new Date().getTime() / 1000);
  authRecords = _.filter(authRecords, each => each > now - 60);

  authRecords.push(now)

  localStorage.setItem('authInvokeTime', JSON.stringify(authRecords));

  if (authRecords.length >= 20) {
    return false;
  }

  return true;
}

function handleErrCallBack(error) {
  if (error.response) {
    // 请求被执行，服务器以状态码进行响应

    switch (error.response.status) {
      case 400:
        // 400（Bad Request）：请求参数格式错误；提示错误消息
        // return message.error('请求参数（data）格式错误（' + error.config.method + error.config.url + '）');
        message.error('参数错误');
        break;
      case 401:
        message.error('登录token失效，请重新登录');
        service.loginOut();
        break;
      case 403:
        // 403（Forbidden）：已授权或不需要授权，但禁止访问；跳转到 403 页

        // localStorage.setItem('errMsg', error.response.data.message);
        // window.location.href = '/403';
        message.error('没有权限，请联系管理员授权');
        break;
      case 504:
        // service.log
        // return window.location.href = '/login';
        service.loginOut();
        break;
      case 404:
        // 404（Not Found）：请求 URL 格式错误；提示错误消息
        return message.error('请求 URL 格式错误（' + error.config.url + '）');
        break;
      case 405:
        // 405（Method Not Allowed）：请求 Method 格式错误；提示错误消息
        return message.error('请求 Method 格式错误（' + error.config.url + '）');
        break;
      case 406:
        // 406（Not Acceptable）：请求 Content-Type 格式错误
        return message.error('请求 Content-Type 格式错误（' + error.config.url + '）');
        break;
      case 408:
        // 408（Request Timeout）：请求超时
        return message.warning('请求超时（' + error.config.url + '）');
        break;
    }

  } else if (error.request) {
    // 请求被提出，但是没有收到任何回应
  } else {
    const errCode = /^5\d{2}$/g;
    if (error.response && errCode.test(error.response.status)) {
      // 接口报500错误不能跳转
      return error.response.data;
    }
    // 1）请求超过指定的时间：终止请求
    if (error.message === 'timeout of ' + error.config.timeout + 'ms exceeded') {
      return message.warning('请求超时，请刷新页面重新请求！');
    }
    // 控制路由跳转判断
    if (error.config) {
      if (Object.hasOwnProperty.call(error.config.data || {}, 'noRedirect')) {
        return;
      }
      if (error.config.url && error.config.url.indexOf('noRedirect=') > 0) {
        return;
      }
    }
    // 2 ）网络错误
    if (error.message === 'Network Error') {
      return window.location.href = '/error';
    }
  }
  return Promise.reject(error);
}

function handleErrNavCallBack(error) {
  if (error.response) {
    // 请求被执行，服务器以状态码进行响应

    switch (error.response.status) {
      case 400:
        // 400（Bad Request）：请求参数格式错误；提示错误消息
        // return message.error('请求参数（data）格式错误（' + error.config.method + error.config.url + '）');
        message.error('参数错误');
        break;
      case 401:
        message.error('登录token失效，请重新登录');
        service.loginOut();
        break;
      case 403:
        // 403（Forbidden）：已授权或不需要授权，但禁止访问；跳转到 403 页

        // localStorage.setItem('errMsg', error.response.data.message);
        // message.error('没有权限，请联系管理员授权');
        window.location.href = '/403';
        break;
      case 504:
        // service.log
        // return window.location.href = '/login';
        service.loginOut();
        break;
      case 404:
        // 404（Not Found）：请求 URL 格式错误；提示错误消息
        return message.error('请求 URL 格式错误（' + error.config.url + '）');
        break;
      case 405:
        // 405（Method Not Allowed）：请求 Method 格式错误；提示错误消息
        return message.error('请求 Method 格式错误（' + error.config.url + '）');
        break;
      case 406:
        // 406（Not Acceptable）：请求 Content-Type 格式错误
        return message.error('请求 Content-Type 格式错误（' + error.config.url + '）');
        break;
      case 408:
        // 408（Request Timeout）：请求超时
        return message.warning('请求超时（' + error.config.url + '）');
        break;
    }

  } else if (error.request) {
    // 请求被提出，但是没有收到任何回应
  } else {
    const errCode = /^5\d{2}$/g;
    if (error.response && errCode.test(error.response.status)) {
      // 接口报500错误不能跳转
      return error.response.data;
    }
    // 1）请求超过指定的时间：终止请求
    if (error.message === 'timeout of ' + error.config.timeout + 'ms exceeded') {
      return message.warning('请求超时，请刷新页面重新请求！');
    }
    // 控制路由跳转判断
    if (error.config) {
      if (Object.hasOwnProperty.call(error.config.data || {}, 'noRedirect')) {
        return;
      }
      if (error.config.url && error.config.url.indexOf('noRedirect=') > 0) {
        return;
      }
    }
    // 2 ）网络错误
    if (error.message === 'Network Error') {
      return window.location.href = '/error';
    }
  }
  return Promise.reject(error);
}

instance.login = function () {
  if (location.pathname === '/403') {
    return;
  }
  if (!canInvokeAuth()) {
    localStorage.setItem('authCount', 0);
    return window.location.href = '/403';
  }
  const count = parseInt(localStorage.getItem('authCount') || 0);
  const lastAuthTime = parseInt(localStorage.getItem('lastAuthTime') || 0);
  const current = Math.round(new Date().getTime() / 1000);
  // 1分钟3次重试防止后端出现授权失败, 前端死循环
  if (count > 2 && current - lastAuthTime < 60 * 1000) {
    localStorage.setItem('authCount', 0);
    return {};
  }
  localStorage.setItem('authCount', count + 1);
  localStorage.setItem('lastAuthTime', current);


  // code 用来授权, 重定向地址需要移除code参数以免影响后期授权
  var xUrl = url.parse(window.location.href, true)
  xUrl.query.code = undefined;
  xUrl.query.state = undefined;
  xUrl.query.code2 = undefined;

  if (!xUrl.query.appid && this.cfg.clientId) {
    xUrl.query.appid = this.cfg.clientId;
  }

  var xSearch = [];

  for (var key in xUrl.query) {
    if (!_.isUndefined(xUrl.query[key]) && key !== 'scope') {
      xSearch.push(`${key}=${xUrl.query[key]}`);
    }
  }

  var searchStr = '';
  if (xSearch.length)
    searchStr = '?' + xSearch.join('&');

  var redirectUrl = encodeURIComponent(`${xUrl.protocol}//${xUrl.host}${xUrl.pathname}${searchStr}`);

  // const redirectUrl = encodeURIComponent(window.location.href.replace(/code=/g, 'code2='));

  const passportState = uuidv4();
  localStorage.removeItem('access_token');
  localStorage.setItem('redirectUrl', redirectUrl);
  localStorage.setItem('passportState', passportState);

  return window.location.href = `${this.cfg.host.passport.auth + api.auth}?client_id=${this.cfg.authorId || this.cfg.clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=get_user_info&state=${passportState}&pt=1`;
}

instance.init = (cfg) => {
  instance.cfg = cfg;
}
export default instance;

export {
  handleErrCallBack,
  handleErrNavCallBack,
};
