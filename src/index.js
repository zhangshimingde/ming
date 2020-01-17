import dynamic from 'dva/dynamic';
import { RouteWithLayout } from './component/layout';
import fulu, { handleErrCallBack, handleErrNavCallBack } from './component/fulu';
import { Table, DragSortTable, AddOrEditForm, SearchForm, CommonPage, DatePicker, ExportButton, Select, Button, WaveButton,
    QueueAnimFulu, BreadCrumb, WangEditor, FuluIcon, TradeValidateWrap, ScrollNumber, DivideScrollNumber } from './component/widget';
import { icons } from './component/images';
import PublicLayout from './model/PublicLayout';
// import './assets/less/common.less';
// import './assets/less/antd/antCommon.less';

import React from 'react';

export default RouteWithLayout;

const FLayout = (app, home) => {
    React.homePage = home;
    return dynamic({
        app,
        component: () => { return import('./component/layout/FLayout'); },
    });
};

export {
    Table,
    fulu,
    FuluIcon,
    handleErrCallBack,
    handleErrNavCallBack,
    DragSortTable,
    FLayout,
    ExportButton,
    PublicLayout,
    AddOrEditForm,
    SearchForm,
    CommonPage,
    DatePicker,
    Select,
    Button,
    icons,
    QueueAnimFulu,
    BreadCrumb,
    WaveButton,
    TradeValidateWrap,
    WangEditor,
    ScrollNumber,
    DivideScrollNumber,
};