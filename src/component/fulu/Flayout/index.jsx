import React from 'react';
import { LocaleProvider, message, Button, Layout, Alert, Icon, Spin, Modal } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withRouter } from "react-router-dom";

import MyHeader from '../Header';
import MySlider from '../Slider';
import PageDj from '../error/PageDj';
import MerchantManager from '../MerchantManager';
import url from 'url';
import "./index.less";
import service from '../utils/service';
import commonFun from '../utils/tools';
import instance from '../utils/request';
import logoPic from './images/logo.png';
import teamIcon from './images/team.svg';

const { Content } = Layout;

const FuluContext = React.createContext({
    merchantInfo: {}, // 商户信息
    financeInfo: {}, // 余额信息
});

window.FuluContext = FuluContext;

// 注册全局方法
window.loginOut = service.loginOut.bind(service);
window.getAuthButtons = function (path, clientId) {
    if (path && clientId) { // 根据外部传入的路径来查找对应的按钮权限
        const xMenu = window.authModules.find(each =>
            each.urlAddress && path.indexOf(each.urlAddress) >= 0 && each.appId === clientId);

        if (xMenu && xMenu.moduleId) {
            return window.authButtons.filter(a => a.moduleId == xMenu.moduleId);
        }
        else
            return [];
    }
    else {
        let authButtons = window.authButtons || [];
        return authButtons.filter(a => a.moduleId == Flayout.moduleId);
    }

}

// 获取当前页面的菜单层级 用来显示面包屑 window.authModules
function traceMenu(list, arr, parentId) {
    var f = list.find(a => a.moduleId == parentId);
    if (f) {
        arr.unshift(f.fullName);
        traceMenu(list, arr, f.parentId);
    }
}
window.getBrandData = function () {

    let authModules = window.authModules || [];
    let arr = [];
    var m = authModules.find(a => a.moduleId == Flayout.moduleId);
    if (m) {
        arr.push(m.fullName);

        traceMenu(window.authModules, arr, m.parentId)
    }
    return arr;
}

class Flayout extends React.PureComponent {
    static moduleId = ''
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            userInfo: null,
            authApps: [],   // 授权应用
            allApps: [],
            authMenus: [],  // 授权菜单，将数组结构转换为树形结构数据
            authButtons: [], // 应用授权按钮
            listMenu: [],   // 数组结构菜单
            isLoading: true,
            cfgs: props.config,
            currentMenu: {},    // 当前默认选中菜单
            pageError: {
                code: 0,
                msg: '',
            },
            merchantInfo: {},
            financeInfo: {},
            showMerchantZone: false,    // 通过该值判断是显示商户管理区还是显示内页数据
            invitor: null,  // 协作邀请者
            refreshUI: false,
            merchants: [],
            pollingTime: 30000, // 轮询时间间隔默认30s
        };
        this.checkAuth = false;
        const cfgs = this.props.config;
        instance.init(cfgs);
        service.init(cfgs);
        this.renderJoinTeam = this.renderJoinTeam.bind(this);
        this.onSetPollingTime = this.onSetPollingTime.bind(this);
        const { MerchantId, debug } = url.parse(window.location.href, true).query;
        // 链接中有商户id，直接进入商户，而不是商户管理区
        if (debug) {
            debugger
        }
        if (MerchantId) {
            if (MerchantId == '0') {
                localStorage.removeItem("MerchantId");
            } else {
                localStorage.setItem("MerchantId", MerchantId);
            }
        } else {
            if (cfgs.clientId != '10000049' && !localStorage.getItem("MerchantId")) {
                window.location.href = `${cfgs.host.main}?MerchantId=0`;
            }
        }
        window.updateMerchantInfo = () => {
            if (localStorage.getItem("MerchantId")) {
                service.getMerchantContext().then((res) => {
                    if (res.code === '0') {
                        const merchantInfo = res.data;
                        window.merchantInfo = merchantInfo;
                        this.setState({
                            merchantInfo,
                        }); 
                    }
                });
            }
        }
    }
    toggle = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname != nextProps.location.pathname) {
            const { pathname } = nextProps.location;
            const { listMenu } = this.state;

            const xMenu = listMenu.find(each => {
                const urlAddress = each.urlAddress || '';
                if (!urlAddress || each.appId !== this.props.config.clientId) {
                    return false;
                }
                if (urlAddress == '/' && urlAddress == pathname) {
                    return true;
                }
                else if (urlAddress != '/' && (pathname.indexOf(urlAddress) >= 0 || pathname.indexOf(urlAddress.slice(0, urlAddress.indexOf('?'))) >= 0)) {
                    return true;
                }
                else
                    return false;
            });

            if (xMenu && xMenu.moduleId) {
                Flayout.moduleId = xMenu.moduleId;

                this.setState({
                    currentMenu: xMenu,
                })
            }
            else {
                Flayout.moduleId = '';
                this.setState({
                    currentMenu: {},
                })
            }
        }
    }

    componentDidMount() {
        const { code, state, invideCode, debug } = url.parse(window.location.href, true).query;
        if (debug) {
            debugger
        }
        const payload = {
            code,
            state,
            redirect_uri: localStorage.getItem('redirectUrl'),
        };
        // 如果有邀请码，通过邀请码获取邀请人信息
        if (invideCode) {
            service.getInviterInfo(invideCode).then((res) => {
                if (res.code == "0") {
                    this.setState({
                        invitor: res.data,
                    });
                }
            })
        }
        if (code && !localStorage.getItem('access_token')) {
            service.fetchAuth(payload)
                .then((res) => {
                    if (res.code == '0') {
                        localStorage.setItem('authCount', 0);
                        localStorage.setItem('access_token', res.data.access_token);
                        localStorage.removeItem('passportState');
                        return service.fetchUserInfo();
                    }
                    else {
                        instance.login();
                    }
                })
                .then((fetchUserRes) => {
                    if (fetchUserRes.code == '0') {
                        window.userinfo = fetchUserRes.data;
                        this.setState({
                            userInfo: fetchUserRes.data,
                        });
                        this.setLoginCookie();
                        return service.getUserMerchants();
                    }
                })
                .then(this.onCheckUserAuth)
                .catch(this.exceptionCallBack)

        }
        else if (code && localStorage.getItem('access_token') && state && localStorage.getItem('passportState') === state) {
            service.fetchUserInfo()
                .then((fetchUserRes) => {
                    if (fetchUserRes.code == 0) {
                        window.userinfo = fetchUserRes.data;
                        this.setState({
                            userInfo: fetchUserRes.data,
                        });
                        this.setLoginCookie();
                        return service.getUserMerchants();
                    }
                    else {
                        instance.login();
                    }
                })
                .then(this.onCheckUserAuth)
                .catch(this.exceptionCallBack)
        }
        else {
            instance.login();
        }
    }
    setLoginCookie() {
        const domain = commonFun.getDomain();
        if (domain) {
            document.cookie = `logout=0;domain=${domain};`; // 设置用户登录标识cookie
        }
    }
    componentDidUpdate() {
        if (this.checkAuth && !this.state.showMerchantZone) {
            this.onCheckUserAuth({
                code: 0,
                data: {
                    list: this.state.merchants,
                }
            }, false);
            this.checkAuth = false;
        }
    }
    componentWillUnmount() {
        this.initPollTime = false;
    }
    /**
     * @desc  设置轮询时间间隔
     * @param time 时间间隔/ms
     */
    onSetPollingTime(time) {
        if (!this.initPollTime) {
            this.initPollTime = true;
            setTimeout(() => {
                this.setState({
                    pollingTime: time,
                });
            }, 0);
        }
    }
    onCheckUserAuth = (merchantRes, updateState = true) => {
        const { debug } = url.parse(window.location.href, true).query;
        if (debug) {
            debugger
        }
        if (merchantRes.code == '0') {
            if (updateState) {
                this.setState({
                    merchants: merchantRes.data.list,
                });
            }
            const localId = localStorage.getItem('MerchantId');
            if (!localId) {
                if (!this.state.showMerchantZone) {
                    this.redirectToHomePage();
                }
                return;
            }
            const f = merchantRes.data.list.find(a => a.id == localId);
            if (f) {
                // 不是协作者
                if (f.isOwner) {
                    this.reqLeftNav();
                } else {
                    service.existRole(f.id, true).then(res => {
                        if (res.code == 0) {
                            this.reqLeftNav();
                        } else {
                            localStorage.removeItem('MerchantId');
                            if (!this.state.showMerchantZone) {
                                this.redirectToHomePage();
                            }
                        }
                    });  
                }
            } else {
                if (!this.state.showMerchantZone) {
                    this.redirectToHomePage();
                }
            }
        }
    }
    /**
     * @desc 重定向到商户管理区
     */
    redirectToHomePage = () => {
        const { config = {} } = this.props;
        if (config.clientId != '10000049') {
            window.location.href = `${config.host.main}?MerchantId=0`;
        } else {
            this.setState({ showMerchantZone: true, isLoading: false });
            this.checkAuth = true;
        }
    }

    exceptionCallBack = (e) => {
        if (e && e.response) {
            this.setState({
                pageError: {
                    code: e.response.status,
                    msg: e.response.data.message || 'NetWork Error',
                }
            });
        } else {
            this.setState({
                pageError: {
                    code: 500,
                    msg: '网络请求错误',
                }
            });
        }
    }

    isInnerPage = (pathname) => {
        pathname = pathname || window.location.pathname;
        const innerPage = {
            '/': '首页',
        }
        return innerPage[pathname] || '';
    }

    reqLeftNav = () => {
        Promise.all([
            service.fetchAuthApps(),
            service.fetchAllApps(),
            service.fetchAuthMenus()])
            .then((res) => {
                const [fetchAuthAppRes, fetchAllAppRes, fetchAuthMenuRes] = res;
                // const urlQuery = url.parse(window.location.href, true).query;
                const { pathname } = window.location;

                if (fetchAuthAppRes.code == '0'
                    && fetchAllAppRes.code == '0'
                    && fetchAuthMenuRes.code == '0') {

                    let menus = fetchAuthMenuRes.data.modules.sort((a, b) => parseInt(a.sortCode) - parseInt(b.sortCode));

                    let treeMenu = this.getData('0', menus);

                    // 将权限和用户信息放在window下，供子页面使用
                    window.authApps = fetchAuthAppRes.data.list;
                    window.allApps = fetchAllAppRes.data.list;
                    window.authButtons = fetchAuthMenuRes.data.buttons;
                    window.authModules = menus;

                    this.setState({
                        isLoading: false,
                        showMerchantZone: false,
                        authApps: fetchAuthAppRes.data.list,
                        allApps: fetchAllAppRes.data.list,
                        authMenus: treeMenu,
                        authButtons: fetchAuthMenuRes.data.buttons,
                        listMenu: fetchAuthMenuRes.data.modules,
                    });
                    
                    const xMenu = menus.find(each =>
                        each.urlAddress && (pathname.indexOf(each.urlAddress) >= 0 || pathname.indexOf(each.urlAddress.slice(0, each.urlAddress.indexOf('?'))) >= 0)
                        && each.appId === this.props.config.clientId);

                    if (xMenu && xMenu.moduleId) {
                        Flayout.moduleId = xMenu.moduleId;

                        this.setState({
                            currentMenu: xMenu,
                            isLoading: false,
                        })
                        return;
                    }
                    else {
                        this.setState({
                            isLoading: false,
                        })
                    }

                    if (this.isInnerPage(pathname) || __DEV__) {
                        return;
                    }

                    // pathname 为404等路径 直接返回
                    if (pathname.length == 4 && /^\/(4\d{2}|5\d{2})/.test(pathname)) {
                        return;
                    }

                    if (!xMenu || pathname.split('/').length <= 2) {
                        window.location.href = '/403';
                        return;
                    }
                }
            }).catch(this.exceptionCallBack);
    }

    updateUserInfo = (userinfo) => {
        this.userinfo = userinfo;
    }

    getData = (id, arr) => {
        var child = this.getParentData(id, arr);

        for (let i = 0; i < child.length; i++) {
            child[i].children = this.getData(child[i].moduleId, arr);
        }

        return child;
    }

    getParentData = (parentId, arr) => {
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (parentId == arr[i].parentId) {
                newArr.push({
                    ...arr[i],
                    children: [],
                });
            }
        }

        return newArr;
    }

    // 进入商户
    selectMerchant = (id) => {
        if (!id || typeof id !== 'string') return;

        localStorage.setItem("MerchantId", id);

        this.reqLeftNav();
    }

    returnMerchantZone = () => {
        const { config } = this.props;
        if (config.clientId == '10000049') {
            localStorage.removeItem("MerchantId");
            this.setState({
                showMerchantZone: true,
            });
            this.checkAuth = true;
        }
        else {
            window.location.href = `${config.host.main}?MerchantId=0`
        }

    }

    joinTeam = (invideCode) => {
        service.joinTeam(invideCode).then((res) => {
            if (res.code == "0") {
                message.success("加入成功");
                // this.setState({
                //     refreshUI: true,
                // });

                setTimeout(function () {
                    window.location.href = `${window.location.origin}?MerchantId=0`;
                }, 1000);
                // window.location.href = `${window.location.origin}?MerchantId=0`;
            }
        })
    }

    // 加入团队
    renderInvite = () => {
        const { invitor } = this.state;
        const { invideCode } = url.parse(window.location.href, true).query;
        if (!invideCode || !invitor) {
            return null;
        }
        return (
            <Modal
                closable={false}
                title="福禄开放平台邀请您加入"
                visible={true}
                footer={null}
                onCancel={this.handleCancel}
            >
                <div style={{ textAlign: "center" }}>
                    <div style={{ marginTop: "-20px" }}>
                        <Icon component={teamIcon} style={{ fontSize: 120, color: "#3983d7" }} />
                    </div>
                    <p>{invitor.mobile}邀请你加入他的协作团队</p>
                    <Button style={{ width: 217, height: 32 }} type="primary" onClick={() => this.joinTeam(invideCode)}>加入团队</Button>
                </div>
                <div style={{ textAlign: "center", marginTop: 18 }}>
                    <img style={{ width: 90 }} src={logoPic} alt="" />
                </div>
            </Modal>
        )
    }

    updateMerchants = (merchants) => {
        if (Array.isArray(merchants)) {
            this.setState({
                merchants,
            });
        }
    }

    onUpdateContext = (newContext) => {
        this.setState({
            ...newContext,
        });
    }
    renderJoinTeam() {
        const { isLoading } = this.state;
        const { config, JoinTeamZone } = this.props;
        if (config && !isLoading) {
            return JoinTeamZone ? <JoinTeamZone /> : this.renderInvite()
        }
        return null;
    }
    render() {
        const { authApps, allApps, authMenus, listMenu, isLoading, currentMenu,
            pageError, showMerchantZone, refreshUI, merchants, userInfo } = this.state;
        let { config, appName, showSlider = true } = this.props;

        if (pageError.code > 0) {
            return <PageDj msg={pageError.msg} />
        }

        return (
            <LocaleProvider>
                <Layout style={{ height: '100%', overflow: 'hidden' }}>
                    <Spin
                        spinning={isLoading}
                        tip="拼命加载中...."
                        style={{ position: 'fixed', left: '50%', top: '50%' }}>
                    </Spin>
                    {!config && <Alert
                        style={{ textAlign: 'center' }}
                        message="配置文件丢失"
                        type="error"
                    />
                    }
                    {
                        (config && !isLoading && showMerchantZone) &&
                        <MerchantManager
                            merchants={merchants}
                            refreshUI={refreshUI}
                            selectMerchant={this.selectMerchant}
                            appName={appName}
                            userInfo={userInfo}
                            updateMerchants={this.updateMerchants}
                            {...this.props}
                        />
                    }
                    {
                        (config && !isLoading && !showMerchantZone) && <MySlider
                            hostUrl={config.host.main}
                            collapsed={this.state.collapsed}
                            pollingTime={this.state.pollingTime}
                            menus={authMenus}
                            listMenu={listMenu}
                            appName={appName}
                            currentMenu={currentMenu}
                            {...this.props}
                        />
                    }
                    {
                        (config && !isLoading && !showMerchantZone) && <Layout>
                            <FuluContext.Provider
                                value={{
                                    merchantInfo: this.state.merchantInfo, // 商户信息
                                    financeInfo: this.state.financeInfo, // 余额信息
                                    merchantList: merchants,
                                    onSetPollingTime: this.onSetPollingTime,
                                }}
                            >
                                <MyHeader
                                    merchants={merchants}
                                    refreshUI={refreshUI}
                                    returnMerchantZone={this.returnMerchantZone}
                                    onUpdateContext={this.onUpdateContext}
                                    collapsed={this.state.collapsed}
                                    toggle={this.toggle}
                                    authApps={authApps}
                                    allApps={allApps}
                                    cfgs={config}
                                    appName={appName}
                                    hostUrl={config.host.main}
                                    showSlider={showSlider}
                                    {...this.props}
                                />
                                <Content className="layout-content">
                                    {
                                        this.props.children
                                    }
                                </Content>
                            </FuluContext.Provider>
                        </Layout>
                    }
                    {
                        this.renderJoinTeam()
                    }
                </Layout>
            </LocaleProvider>
        );
    }
}

Flayout.propTypes = {
    config: PropTypes.object,
    appName: PropTypes.string,
    showHeader: PropTypes.bool,
    showSlider: PropTypes.bool,
};

Flayout.defaultTypes = {
    appName: "福禄网络",
    showHeader: true,
    showSlider: true,
}
export default withRouter(Flayout);
