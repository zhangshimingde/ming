import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, message, Menu, Dropdown, Badge, Icon } from 'antd';
import getUserCenterUrl from '../../../configs/UserCenterUrl';
import service from '../utils/service';
// import MerchantAuthSecond from './MerchantAuthSecond';
import "./index.less";

// import authEnterprise from './images/auth_enterprise.svg';
// import authPerson from './images/auth_person.svg';
const UserCenterAppId = '10000049';
let maxMenuCount = 4;

const toThousands = (num) => {
    let thNum = num;
    if (num && num.indexOf) {
        const dotIndex = num.indexOf('.');
        if (dotIndex > 0) {
            thNum = `${num.slice(0, dotIndex).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')}${num.slice(dotIndex)}`;
        } else {
            thNum = num.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
        }
    }
    return thNum;
};

class MyHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            balanceArr: [],
            unReadMsgTotal: 0,
            showMsgTotal: true,
            showAuthMerchant: false, // 商户认证状态  0未认证 1认证待审核 2认证通过 3认证不通过
            authState: 1, // 1 表示 个人认证， 2表示企业商户认证
            AuthMerchants: [],
            step: 1
        };

        if (document.body.clientWidth) {
            maxMenuCount = (document.body.clientWidth - 760) / 130;
            maxMenuCount = maxMenuCount <= 0 ? 2 : maxMenuCount;
        }
        this.updateUserBalance = this.updateUserBalance.bind(this);
        window.updateUserBalance = this.updateUserBalance;
    }

    componentDidMount() {
        Promise.all([service.getMerchantContext(), service.getAffiliatedCompanyList()]).then((res) => {
            if (this.unmount) {
                return;
            }
            if (res[0].data.authenticationStatus == '0') {
                this.setState({
                    showAuthMerchant: true,
                });
            } else {
                this.setState({
                    showAuthMerchant: false,
                });
            }
            const merchantInfo = res[0].data;
            window.merchantInfo = merchantInfo; // 商户信息保存在全局

            this.props.onUpdateContext({
                merchantInfo,
            });

            if (res[1].code == '0') {
                if (res[1].data.list.length > 0) {
                    this.setState({
                        AuthMerchants: res[1].data.list,
                    });
                }
            }
        });
        // 查询消息总数
        service.fetchMsgTotal().then((result) => {
            const { code, data: { unRead } } = result;
            if (code === '0') {
                this.setState({
                    unReadMsgTotal: unRead,
                    showMsgTotal: unRead > 0,
                });
            }
        });
        window.addEventListener("resize", this.onResize);
        // 自定义头部区域
        if (this.props.CustomHeaderZone) {
            return;
        }
        this.updateUserBalance();
    }
    componentWillUnmount() {
        this.unmount = true;
        clearTimeout(this.timer);
    }

    updateUserBalance() {
        // 获取账户金额
        service.getBalance().then(res => {
            if (this.unmount) {
                return;
            }
            if (res.code == 0) {
                const balanceArr = [];
                const financeInfo = res.data || {};
                window.Finance = financeInfo;
                const { isPurchasers, isSupplier } = financeInfo;
                this.props.onUpdateContext({
                    financeInfo,
                });
                let accountType = 1;
                if (isPurchasers == '1' && financeInfo.purchasers) { // 进货商
                    balanceArr.push({
                        text: '进货商余额',
                        // balance: financeInfo.purchasers.balance,
                        balance: null,
                    });
                    accountType = 2;
                }
                if (isSupplier == '1' && financeInfo.supplier) { // 供货商
                    if (balanceArr.length === 1) {
                        balanceArr.length = 0;
                    }
                    balanceArr.push({
                        text: '供货商余额',
                        balance: financeInfo.supplier.balance,
                    });
                    accountType = accountType === 2 ? 4 : 3;
                }
                // 既不是供货商，又不是进货商
                if (accountType === 1) {
                    balanceArr.push({
                        text: '余额',
                        balance: financeInfo.purchasers ? financeInfo.purchasers.balance : 0, // 显示进货商余额
                    });
                }
                this.setState({
                    balanceArr,
                });
            }
        });
    }

    onAddBalance = (a, b) => {
        const _a = Number(a);
        const _b = Number(b);
        const _init_a = Number.isNaN(_a) ? 0 : _a;
        const _init_b = Number.isNaN(_b) ? 0 : _b;
        return ((_init_a * 10000).toFixed(0) + (_init_b * 10000).toFixed(0)) / 10000;
    }

    onResize = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (document.body.clientWidth && !this.unmount) {
                maxMenuCount = (document.body.clientWidth - 760) / 130;
                maxMenuCount = maxMenuCount <= 0 ? 2 : maxMenuCount;
                this.forceUpdate();
            }
        }, 200);
    }

    // 点击退出
    handleLoginOut = () => {
        service.loginOut();
    }

    goApp = (appid, url) => {
        service.fetchAuthApps().then((res) => {
            let apps = res.data.list;
            if (Array.isArray(res.data)) {
                apps = res.data;
            }

            let f = apps.find((a) => a == appid);
            if (f) {
                const MerchantId = localStorage.getItem("MerchantId");
                if (MerchantId) {
                    window.location.href = `${url}?MerchantId=${MerchantId}`
                }
            }
            else {
                message.error("该应用已禁用");
            }
        });
    }

    // 返回 0.0000格式的金额
    formatMoney = (m) => {
        if (m == null) {
            return;
        }
        if (m.toString) {
            m = m.toString();
        }
        var v = '';
        let arr = m.split('.');
        if (arr.length == 2) {
            v = `${arr[0]}.${arr[1]}`;
            for (let i = arr[1].length; i < 4; i++) {
                v += '0'
            }
            return v;
        }
        else {
            return m + '.0000';
        }
    }

    // 切换商户
    switchMerchant = (id) => {
        const { cfgs, hostUrl } = this.props;
        if (cfgs.clientId == UserCenterAppId) {
            localStorage.setItem("MerchantId", id);
            window.location.href = `${window.location.origin}?MerchantId=${id}`
        }
        else {
            window.location.href = `${hostUrl}?MerchantId=${id}`
        }

    }

    // 渲染下拉菜单
    renderOverMenu = () => {
        const { authApps = [], cfgs } = this.props;

        let data = [];
        if (authApps.length > maxMenuCount) {
            data = authApps.slice(maxMenuCount);
        }

        return (
            <Menu>
                {
                    data.map((appid, index) => {
                        var app = allApps.find((a) => a.appId == appid);
                        if (appid != cfgs.clientId) {
                            return <Menu.Item key={app.appId}><a className="btn" onClick={this.goApp.bind(this, app.appId, app.hostUrl)}>{app.appName}</a></Menu.Item>
                        }
                        else {
                            return <Menu.Item key={app.appId}><a className="btn" style={{ background: "#3983d7", color: "#ffffff" }} onClick={() => { window.location.href = '/' }}>{app.appName}</a></Menu.Item>
                        }
                    })
                }
            </Menu>


        )
    }

    // 选择商户认证类型 个人/企业
    stateChange = (e) => {
        this.setState({
            authState: e.target.value,
        })
    }

    gotoAuthPage = () => {
        service.getAffiliatedPersonalList().then(res => {
            if (res.code == 0) {
                let lastMerchant = res.data.list.length > 0 ? res.data.list[0] : null;
                // 企业认证
                if (this.state.authState == 2 || !lastMerchant) {
                    this.setState({
                        showAuthMerchant: false,
                    });
                    this.props.history.push(`/authen/${this.state.authState}`);
                }
                else {
                    service.AuthMerchantByCopy(lastMerchant.memberId).then(res2 => {
                        if (res2.code == '0') {
                            this.setState({
                                showAuthMerchant: false,
                            });
                            this.props.history.push(`/authen/${this.state.authState}`);
                        }
                    })
                }
            }
        })

    }

    locationBascInfo = () => {
        const { cfgs, hostUrl } = this.props;
        if (cfgs.clientId == UserCenterAppId) {
            this.props.history.push('/account');
        }
        else {
            window.location.href = `${hostUrl}/account`;
        }

    }

    handleBalance = () => {
        const { cfgs, hostUrl } = this.props;
        if (cfgs.clientId == UserCenterAppId) {
            this.props.history.push('/finance/mybalance');
        }
        else {
            window.location.href = `${hostUrl}/finance/mybalance`;
        }
    }

    onNavToMsgCenter = () => {
        const appId = window.configs.clientId;
        if (appId === UserCenterAppId) { // 商户中心应用
            this.props.history.push('/message/center');
            this.state.showMsgTotal && this.setState({
                showMsgTotal: false,
            });
        } else {
            const { allApps = [] } = this.props;
            const userCenterApp = allApps.find((item) => {
                return item.appId === UserCenterAppId;
            });
            let hostUrl = '';
            if (userCenterApp && (hostUrl = userCenterApp.hostUrl)) {
                window.location.href = `${hostUrl}/message/center`;
            } else {
                message.warn('请打开用户中心应用查看消息');
            }
        }
    }
    renderBalance() {
        const { balanceArr = [] } = this.state;
        const balanceStyle = {};
        if (balanceArr.length > 1) {
            balanceStyle.lineHeight = '16px';
            balanceStyle.verticalAlign = 'middle';
        }
        return (
            <span className="balance">
                {
                    balanceArr.map(({ text, balance }, i) => {
                        if (balance == null) {
                            return null;
                        }
                        const mb = toThousands(this.formatMoney(balance));
                        const [ intNum, decimalNum ] = mb.split('.');
                        return (
                            <React.Fragment key={`${text}-${balance}`}>
                                { i === 1 ? <br /> : null }
                                <span className="rmb-icon">¥</span>
                                <span title={mb}>
                                    {intNum}.<span className="decimal">{decimalNum}</span>
                                </span>
                            </React.Fragment>
                        );
                    })
                }
            </span>
        );
    }

    renderMerchantList = (curMerchant) => {
        const { merchants = [] } = this.props;
        if (curMerchant == null || !Array.isArray(merchants)) {
            return null;
        }
        const nodeList = merchants.filter(item => item.auditStatus == '1' && item.id != curMerchant.id).map((item) => {
            return (
                <li key={item.id}>
                    <a href="javascript:void(0)" title={item.name} onClick={this.switchMerchant.bind(this, item.id)}>{item.name}</a>
                </li>
            )
        });
        return nodeList.concat(
                <li key="rt" style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                    <a href="javascript:void(0)" onClick={() => this.props.returnMerchantZone()}>返回商户管理区</a>
                </li>
        );
    }

    // 如果已申请应用在所有应用中没有，表示是内部应用，则不展示在前端
    render() {
        const { allApps, authApps, cfgs, collapsed, merchants = [],
            CustomAuthZone = null, CustomHeaderZone = null } = this.props;
        const { step, unReadMsgTotal, showMsgTotal } = this.state;
        const { userinfo } = window;
        let authAppslimt = authApps;
        if (authApps.length > maxMenuCount) {
            authAppslimt = authApps.slice(0, maxMenuCount);
        }
        let curMerchant = {};
        if (Array.isArray(merchants) && merchants.length > 0) {
            curMerchant = merchants.find(item => item.id == localStorage.getItem("MerchantId"));
        }
        if (step == 2) {
            Footer = [
                <Button type="primary" key="back" onClick={() => this.gotoAuthPage()} >确定</Button>,
                <Button key="ok" onClick={() => this.setState({ step: 1 })} >返回</Button>
            ];
        }
        return (
            <div className="top" style={{ background: "#192632" }}>
                <Icon
                    className="trigger"
                    type={collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.props.toggle}
                />
                <div className="inner-app">
                    {
                        authAppslimt.map((appid, index) => {
                            var app = allApps.find((a) => a.appId == appid);
                            if (!app) {
                                return null;
                            }
                            if (appid != cfgs.clientId) {
                                return <a className="btn" key={app.appId} onClick={this.goApp.bind(this, app.appId, app.hostUrl)}>{app.appName}</a>
                            }
                            else {
                                return <a className="btn bnt-select" key={app.appId} onClick={() => { window.location.href = '/' }}>{app.appName}</a>
                            }
                        })
                    }
                    {
                        authApps.length > maxMenuCount &&
                        <Dropdown overlay={this.renderOverMenu()} placement="bottomLeft">
                            <a className="btn">
                                更多<Icon type="down" />
                            </a>
                        </Dropdown>
                    }
                </div>
                <div className="userCenter">
                    {
                        <div className="msg-box uc-item" onClick={this.onNavToMsgCenter}>
                            <Icon type="bell" />
                            {
                                showMsgTotal ? 
                                <Badge
                                    count={!showMsgTotal || isNaN(unReadMsgTotal) ? 0 : unReadMsgTotal}
                                    offset={[5, -2]}
                                >
                                    消息中心
                                </Badge> : <span style={{ marginLeft: '8px' }}>消息中心</span>
                            }
                        </div>
                    }
                    <div className="merchant-box uc-item">
                        <span
                            className="merchant-name"
                            title={curMerchant.name}
                        >
                            {curMerchant.name}
                        </span>
                        <ul className="merchant-list">
                            {this.renderMerchantList(curMerchant)}
                        </ul>
                    </div>
                    <div className="user-center-content uc-item">
                        <span className="user-mobile">
                            <Icon type="user" />
                            {userinfo.mobile}
                        </span>
                        <div className="drop-down">
                            <p className="balance-title">余额：</p>
                            <div className="balance-box">
                                {
                                    this.renderBalance()
                                }
                                <Button type="primary" onClick={this.handleBalance}>查看</Button>
                            </div>
                            <div className="link-box">
                                <div className="half-l">
                                    <a href="javascript:void(0)" onClick={this.locationBascInfo}>基本信息</a>
                                </div>
                                <div className="half-l">
                                    <a href={getUserCenterUrl(this.props.config)} target="_blank">安全中心</a>
                                </div>
                            </div>
                            <div className="exit-box">
                                <a onClick={this.handleLoginOut}>退出</a>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    CustomAuthZone ? <CustomAuthZone {...this.props} /> : null
                }
                {/* {
                    (cfgs.clientId !== '10000084' && showAuthMerchant && !CustomAuthZone && (AuthMerchants.length > 0 ? AuthMerchants[0].authenticationType != '3' : true)) &&
                    <Modal
                        visible={true}
                        title="提示"
                        footer={Footer}
                        closable={false}
                        getContainer={() => document.getElementById("app")}
                        maskStyle={{ top: 64 }}
                    >
                        {
                            step == 1 &&
                            <React.Fragment>
                                <Alert message="请根据您的真实情况选择商户主体，主体确认后不可更改" type="warning" showIcon />
                                <Row style={{ marginTop: 20 }}>
                                    <Col span={10} offset={2} style={{ textAlign: 'center' }}>
                                        <Icon component={authPerson} style={{ color: authState == 1 ? '#3983d7' : '#e8e8e8', fontSize: 70 }} />
                                    </Col>
                                    <Col span={10} style={{ textAlign: 'center' }} >
                                        <Icon component={authEnterprise} style={{ color: authState == 2 ? '#3983d7' : '#e8e8e8', fontSize: 70 }} />
                                    </Col>
                                    <Radio.Group
                                        name="radiogroup"
                                        defaultValue={authState}
                                        style={{ width: '100%', marginTop: 10 }}
                                        onChange={this.stateChange}
                                    >
                                        <Col span={10} offset={2} style={{ textAlign: 'center' }}>
                                            <Radio value={1} style={{ color: authState == 1 ? '#3983d7' : '' }}>个人商户认证</Radio>
                                        </Col>
                                        <Col span={10} style={{ textAlign: 'center' }}>
                                            <Radio value={2} style={{ color: authState == 2 ? '#3983d7' : '' }}>企业商户认证</Radio>
                                        </Col>
                                    </Radio.Group>
                                </Row>
                            </React.Fragment>
                        }
                        {
                            step == 2 && <p style={{ textAlign: 'center' }}>
                                确认要将此商户认证为{authState == 1 ? '个人' : '企业'}商户？
                            </p>
                        }

                        <div style={{ marginTop: 20, color: '#919191', fontSize: 12 }}>
                            <p>注意：</p>
                            <ol style={{
                                listStyleType: 'decimal',
                                marginBlockStart: '1em',
                                marginBlockEnd: '1em',
                                marginInlineStart: '0px',
                                marginInlineEnd: '0px',
                                paddingInlineStart: '40px',
                            }}>
                                <li>商户主体确认后不可更改，请慎重选择</li>
                                <li>个人实名认证的商户如果交给他人使用且产生纠纷时，平台方不予负责</li>
                                <li>如企业使用的账号进行个人实名认证，在人员变动交接账号或账号下财产出现纠纷时，平台方不予负责</li>
                            </ol>
                        </div>
                    </Modal>
                }
                {
                    (cfgs.clientId !== '10000084'&& showAuthMerchant && AuthMerchants.length > 0 && AuthMerchants[0].authenticationType == '3') &&
                    <MerchantAuthSecond
                        close={() => this.setState({ showAuthMerchant: false })}
                        authMerchants={AuthMerchants}
                        history={this.props.history}
                    />
                } */}
            </div>
        );
    }
}

MyHeader.propTypes = {
    toggle: PropTypes.func,
    authApps: PropTypes.array,
    allApps: PropTypes.array,
    cfgs: PropTypes.object,
};

export default MyHeader;