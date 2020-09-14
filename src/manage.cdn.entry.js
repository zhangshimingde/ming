import React from 'react';
import dynamic from 'dva/dynamic';
import PublicLayout from './model/PublicLayout';
import FL from './component/layout/FLayout';
import RouteWithLayout from './component/layout/RouteWithLayout';

import AddOrEditForm from './component/widget/AddOrEditForm';
import SearchForm from './component/widget/SearchForm';
import CommonPage from './component/widget/CommonPage';
import DragSortTable from './component/widget/DragSortTable';
import QueueAnimFulu from './component/widget/QueueAnimFulu';
import WangEditor from './component/widget/WangEditor';
import BraftEditor from './component/widget/BraftEditor';
import SimpleTable from './component/widget/SimpleTable';
import Table from './component/widget/Table';
import Select from './component/widget/Select';
import DatePicker from './component/widget/DatePicker';
import BreadCrumb from './component/widget/BreadCrumb';
import FuluIcon from './component/widget/FuluIcon';
import WaveButton from './component/widget/WaveButton';
import ExportButton from './component/widget/ExportButton';
import TradeValidateWrap from './component/widget/TradeValidateWrap';
import ScrollNumber from './component/widget/ScrollNumber';
import Confirm from './component/widget/Confirm';
import Copy from './component/widget/Copy';
import Popover from './component/widget/Popover';
import DivideScrollNumber from './component/widget/ScrollNumber/DivideScrollNumber';

const FLayout = (app, home) => {
    React.homePage = home;
    return dynamic({
        app,
        component: () => { return Promise.resolve(FL); },
    });
};

// eslint-disable-next-line func-names
// eslint-disable-next-line space-before-function-paren
// eslint-disable-next-line func-names
window.flPro = (function (exports) {
    exports.FLayout = FLayout;
    exports.RouteWithLayout = RouteWithLayout;
    exports.PublicLayout = PublicLayout;

    exports.DragSortTable = DragSortTable;
    exports.SearchForm = SearchForm;
    exports.AddOrEditForm = AddOrEditForm;
    exports.WangEditor = WangEditor;
    exports.BraftEditor = BraftEditor;
    exports.CommonPage = CommonPage;
    exports.QueueAnimFulu = QueueAnimFulu;

    exports.Confirm = Confirm;
    exports.Table = Table;
    exports.SimpleTable = SimpleTable;
    exports.Select = Select;
    exports.DatePicker = DatePicker;
    exports.Copy = Copy;
    exports.Popover = Popover;

    exports.FuluIcon = FuluIcon;
    exports.ExportButton = ExportButton;
    exports.BreadCrumb = BreadCrumb;
    exports.WaveButton = WaveButton;
    exports.TradeValidateWrap = TradeValidateWrap;
    exports.ScrollNumber = ScrollNumber;
    exports.DivideScrollNumber = DivideScrollNumber;
    return exports;
}({}));
