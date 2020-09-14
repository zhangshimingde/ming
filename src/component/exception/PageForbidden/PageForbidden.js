import React from 'react';
import Placeholder from '../../widget/Placeholder';
import './less/pageForbidden.less';

const clearCache = () => {
    Object.keys(localStorage).forEach((k) => {
        localStorage.removeItem(k);
    });
};

const linkToLoginPage = () => {
    clearCache();
    const redirectUrl = window.location.origin;
    const logoutUrl = `${window.configs.host.passport.auth}/oauth/authorize?client_id=${window.configs.authorId || window.configs.clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=get_user_info&state=xyz`;
    window.location.href = `${window.configs.host.passport.auth}/user/logout?returnurl=${encodeURIComponent(logoutUrl)}`;
};

const PageForbidden = () => {
    return (
        <Placeholder
            className="placeholder-403"
            slogan="女汤部，你无权访问该页面"
            extra={
                <a href="javascript:void(0);" onClick={linkToLoginPage}>返回首页</a>
            }
        />
    );
};

export default PageForbidden;
