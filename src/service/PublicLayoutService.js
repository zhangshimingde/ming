import { Remote } from '../utils';

const HOST = window.configs.host.common;

// 获取菜单的按钮权限
const authBtn = (payload) => {
    return Remote.get(`${HOST}/api/module/modulebutton/getauthlist`, payload);
};

export default authBtn;
