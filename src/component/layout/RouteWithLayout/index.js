import React from 'react';
import { Route } from 'dva/router';
import CustomSettings from '../FLayout/CustomSettings';
import BasicInformation from '../FLayout/BasicInformation';
import FavsManage from '../FLayout/FavsManage';
import IframePage from '../../page/IframePage';
import ContentPage from '../../page/ContentPage';

// 用户中心路由配置信息
const userPathConfig = {
    '/settings': CustomSettings,
    '/info': BasicInformation,
    '/iframe': IframePage,
    '/fav': FavsManage,
};

export default function RouteWithLayout({ layout, component, userCenterConfig = {}, ...rest }) {
    const expandMenu = Object.hasOwnProperty.call(rest || {}, 'expandMenu') ? rest.expandMenu : true;
    return (
        <Route
            {...rest}
            render={(props) => {
                const composeProps = {
                    layout,
                    ...props,
                    expandMenu,
                    userCenterConfig,
                };
                if (Object.hasOwnProperty.call(rest || {}, 'basePath')) {
                    composeProps.basePath = rest.basePath;
                }
                if(Object.hasOwnProperty.call(userPathConfig, rest.path)) {
                    composeProps.xc = userPathConfig[rest.path];
                    return React.createElement(layout, composeProps);
                }
                composeProps.xc = component || React.homePage || ContentPage;
                return React.createElement(layout, composeProps);
            }}
        />
    );
}