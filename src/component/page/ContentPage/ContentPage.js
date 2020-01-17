import React from 'react';
import './less/contentPage.less';
import welcome from './images/welcome.jpg';

const ContentPage = () => {
    const iframeIndex = window.configs.iframeIndex || 'http://erp.kamennet.com/Home/Home';
    const accessToken = localStorage.getItem('access_token');
    const urlAddress = `${iframeIndex}?access_token=${accessToken}`;
    if (window.configs.clientId === '10000031' || window.configs.clientId === '10000034') {
        return (
            <div className="iframe-container">
                <iframe
                    style={{ width: '100%', height: '100%' }}
                    title="首页"
                    className="LRADMS_iframe"
                    src={urlAddress}
                />
            </div>
        );
    }
    return (
        <div className="workflow-container home-box">
            <img
                alt="首页"
                src={welcome}
            />
        </div>
    );
};

export default ContentPage;
