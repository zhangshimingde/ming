import React from 'react';
import dynamic from 'dva/dynamic';

const FLayout = (app, home) => {
    React.homePage = home;
    return dynamic({
        app,
        component: () => { return import('./component/layout/FLayout'); },
    });
};

export default FLayout;
