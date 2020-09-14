import { RouteWithLayout } from './component/layout';
import fulu, { handleErrCallBack, handleErrNavCallBack } from './component/fulu';
import { Table, DragSortTable, AddOrEditForm, SearchForm, CommonPage, DatePicker, ExportButton,
    Select, Button, WaveButton, QueueAnimFulu, BreadCrumb, WangEditor, FuluIcon, TradeValidateWrap,
    ScrollNumber, DivideScrollNumber, Confirm, Copy, Popover, BraftEditor } from './component/widget';
import FLayout from './FLayout';
import { icons } from './component/images';
import PublicLayout from './model/PublicLayout';
// import './assets/less/cdn.less';
// import './assets/less/common.less';
// import './assets/less/antd/antCommon.less';

export default RouteWithLayout;

export {
    Table,
    fulu,
    FuluIcon,
    handleErrCallBack,
    handleErrNavCallBack,
    DragSortTable,
    FLayout,
    Copy,
    Popover,
    ExportButton,
    PublicLayout,
    AddOrEditForm,
    SearchForm,
    CommonPage,
    DatePicker,
    Select,
    Confirm,
    Button,
    icons,
    QueueAnimFulu,
    BreadCrumb,
    WaveButton,
    TradeValidateWrap,
    WangEditor,
    ScrollNumber,
    BraftEditor,
    DivideScrollNumber,
};