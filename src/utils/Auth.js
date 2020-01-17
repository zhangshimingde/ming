import uuidv4 from 'uuid/v4';
import url from 'url';

/*
 记录每次调用auth方法的时间，确保1min只能调用15次
 防止出现获取access_token成功，但该token无法使用 导致页面死循环
*/
function canInvokeAuth() {
    let authRecords = localStorage.getItem('authInvokeTime');
    if (!authRecords) {
        authRecords = [];
    } else {
        authRecords = JSON.parse(authRecords);
    }
    const now = ~~(new Date().getTime() / 1000);
    authRecords = authRecords.filter((item) => {
        return item > now - 60;
    });
    authRecords.push(now);
    localStorage.setItem('authInvokeTime', JSON.stringify(authRecords));
    if (authRecords.length >= 20) {
        return false;
    }
    return true;
}

function auth() {
    if (!canInvokeAuth()) {
        localStorage.setItem('authCount', 0);
        window.location.href = '/403';
        return false;
    }
    const count = parseInt(localStorage.getItem('authCount') || 0, 10);
    const lastAuthTime = parseInt(localStorage.getItem('lastAuthTime') || 0, 10);
    const current = Math.round(new Date().getTime() / 1000);
    // 1分钟3次重试防止后端出现授权失败, 前端死循环
    if (count > 2 && current - lastAuthTime < 60 * 1000) {
        localStorage.setItem('authCount', 0);
        return {};
    }
    localStorage.setItem('authCount', count + 1);
    localStorage.setItem('lastAuthTime', current);
    const { configs } = window;
    // code 用来授权, 重定向地址需要移除code参数以免影响后期授权
    const xUrl = url.parse(window.location.href, true);
    xUrl.query.code = undefined;
    xUrl.query.state = undefined;
    xUrl.query.code2 = undefined;
    xUrl.query.appid = xUrl.query.appid || configs.clientId || '';
    const xSearch = [];
    Object.keys(xUrl.query).forEach((itemKey) => {
        if (itemKey && xUrl.query[itemKey] != null) {
            if (itemKey !== 'scope') {
                xSearch.push(`${itemKey}=${xUrl.query[itemKey]}`);
            }
        }
    });
    const searchStr = xSearch.length ? `?${xSearch.join('&')}` : '';
    const redirectUrl = encodeURIComponent(`${xUrl.protocol}//${xUrl.host}${xUrl.pathname}${searchStr}`);
    const passportState = uuidv4();
    localStorage.removeItem('access_token');
    localStorage.setItem('redirectUrl', redirectUrl);
    localStorage.setItem('passportState', passportState);
    window.location.href = `${configs.host.passport.auth}/oauth/authorize?client_id=${configs.authorId || configs.clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=get_user_info&state=${passportState}`;
    return true;
}

export default auth;
