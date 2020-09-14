import axios from 'axios';
import { message } from 'antd';
import uuidv4 from 'uuid/v4';

axios.defaults.withCredentials = true; // 允许跨域且携带 Cookie（或自定义头）。默认值：false
axios.defaults.timeout = 30000; // 设置请求超时时间（ms）不超过半分钟
axios.defaults.headers.post['Content-Type'] = 'application/json'; // 设置请求提内容类型，其他可选值：application/x-www-form-urlencoded

axios.interceptors.request.use((config) => {
    const key = `${config.method}-${config.url}`;
    const xUuid = sessionStorage.getItem(key);
    if (!xUuid) {
        sessionStorage.setItem(key, uuidv4());
    }
    config.headers['x-requestid'] = sessionStorage.getItem(key);
    if (localStorage.getItem('access_token') && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const logout = () => {
    const redirectUrl = window.location.origin;
    const logoutUrl = `${window.configs.host.passport.auth}/oauth/authorize?client_id=${window.configs.authorId || window.configs.clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=get_user_info&state=xyz`;
    window.location.href = `${window.configs.host.passport.auth}/user/logout?returnurl=${encodeURIComponent(logoutUrl)}`;
};

const handleErrorResponse = (response) => {
    if (response) {
        const { config } = response;
        if (Object.hasOwnProperty.call(response, 'config')) {
            sessionStorage.removeItem(`${config.method}-${config.url}`);
        }
        switch (response.status) {
            case 200:
                return response ? response.data : {};
            case 400:
            case 401:
                return response ? response.data : response.error;
            case 504:
                // window.location.href = '/login';
                logout();
                break;
            case 403:
                window.location.href = '/403';
                break;
            case 404:
                message.error(`请求 URL 格式错误（${config.url}）`);
                break;
            case 405:
                message.error(`请求 Method 格式错误（${config.url}）`);
                break;
            case 406:
                message.error(`请求 Content-Type 格式错误（${config.url}）`);
                break;
            case 408:
                message.warning(`请求超时（${config.url}）`);
                break;
            default:
                message.error(response.message || '请求错误');
                break;
        }

        const err = /^5\d{2}$/g;
        if (err.test(response.status)) {
            // 接口报500错误不能跳转
            return response ? response.data : response;
        }
        // 在设置请求时触发错误，发生了一些问题
        // 1）请求超过指定的时间：终止请求
        if (message === `timeout of ${(response.config || {}).timeout}ms exceeded`) {
            return message.warning('请求超时，请刷新页面重新请求！');
        }
        // 2 网络错误
        if (message === 'Network Error') {
            window.location.href = '/error';
            return null;
        }
    }
    return Promise.reject(response);
};

const httpRequest = (url, data, method = 'get') => {
    if (method === 'get') {
        return axios.get(url, { params: data }).then((response) => {
            const { code } = response;
            if (code === 0 || code === '0') {
                return Promise.resolve(response);
            }
            return handleErrorResponse(response);
        }).catch(handleErrorResponse);
    }
    return axios({
        method,
        url,
        data,
    }).then((response) => {
        const { code } = response;
        if (code === 0 || code === '0') {
            return Promise.resolve(response);
        }
        return handleErrorResponse(response);
    }).catch(handleErrorResponse);
};

class Remote {
    static get(url, params = {}) {
        return httpRequest(url, params);
    }

    static put(url, params = {}) {
        return httpRequest(url, params, 'put');
    }

    static post(url, params = {}) {
        return httpRequest(url, params, 'post');
    }

    static delete(url, params = {}) {
        return httpRequest(url, params, 'delete');
    }
}

export default Remote;
