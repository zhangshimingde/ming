import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { Layout, Menu, Icon } from 'antd';
import IconMap from '../Icons';
import Logo from '../Logo';
import WebMonitor from '../../widget/WebMonitor';
import FuluIcon from '../../widget/FuluIcon';
import Bradge from '../Bradge';
import service from '../utils/service';

import "./index.less";
import { Set } from 'core-js';

const { Sider } = Layout;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const allowPollingApps = ["10000101", "10000084", "10000071"];
const IndexMenu = {
    fullName: '首页',
    urlAddress: '/',
};
window.updateMenuBadge = function () {
    this.getClientMessage();
}

class MySlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectKeys: [],
            selectMenu: null,
            customerNotify: {},
            defaultOpenKeys: [],
            pollingTime: props.pollingTime, // 轮询间隔时间
        }
        window.updateMenuBadge = window.updateMenuBadge.bind(this);
        this.getClientMessage = this.getClientMessage.bind(this);
        this.startPolling = this.startPolling.bind(this);
        this.errPollCount = 0; // 轮询异常次数
        this.isCollectDefaultPath = false; // 收集应用初次打开的路由信息的标识
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const { pollingTime } = nextProps;
        if (pollingTime !== prevState.pollingTime) {
            return {
                pollingTime,
            };
        }
        return null;
    }
    componentDidMount() {
        const { config: { clientId }, initPath = '' } = this.props;
        // 工单系统或者pop，执行轮询查询
        if (allowPollingApps.indexOf(clientId) >= 0) {
            // 执行轮询查询开关
            const { menuBradgeLoop = true } = this.props;
            if (menuBradgeLoop) {
                this.startPolling();
            } else {
                this.getClientMessage();
            }
        }
        if (initPath && this.props.history.location.pathname === '/') {
            this.props.history.push(initPath);
        }
    }
    componentDidUpdate() {
        const { menus, history, currentMenu } = this.props;
        const pathname = history.location.pathname;
        if (window.monitorOpen && !this.isCollectDefaultPath) { // 开启了埋点收集功能，但是还没有完成初始路由信息的收集
            if (pathname === currentMenu.urlAddress || pathname === '/') {
                let _currentMenu = currentMenu;
                this.isCollectDefaultPath = true;
                if (!currentMenu.urlAddress) {
                    _currentMenu = IndexMenu;
                }
                WebMonitor.sendPageView(_currentMenu);
            }
        }
        if (Array.isArray(menus) && menus.length > 0) {
            if (pathname !== '/') {
                if (Object.keys(currentMenu).length > 0) {
                    this.handleDefaultOpenMenu();
                    this.handleExpandAllMenu();
                    this.handleAutoOpenFirstMenu();
                    this.handleAutoFoldUnclickMenu();
                }
            } else {
                this.handleDefaultOpenMenu();
                this.handleExpandAllMenu();
                this.handleAutoOpenFirstMenu();
                this.handleAutoFoldUnclickMenu();
            }
        }
    }
    componentWillUnmount() {
        clearTimeout(this.pollingTimer);
        this.pollingTimer = null;
        this.errPollCount = 0;
    }
    startPolling() {
        const { menuBradgeLoop = true } = this.props;
        if (!menuBradgeLoop) {
            return;
        }
        // 执行初始化查询
        if (!this.pollingTimer) {
            this.pollingTimer = {};
            this.getClientMessage();
        } else {
            const delay = this.getPollingTime();
            this.pollingTimer = setTimeout(this.getClientMessage, delay);
        }
    }
    getPollingTime() {
        const pollingTime = parseFloat(this.state.pollingTime);
        // 时间参数类型错误或者隔太小
        if (isNaN(pollingTime) || pollingTime <= 5000) {
            return 30000;
        };
        return pollingTime;
    }
    getClientMessage() {
        const { menuBradgeUrl } = this.props;
        service.getCustomerNotify(menuBradgeUrl).then(res => {
            if (res.code == '0') {
                this.setState({
                    customerNotify: res.data || {},
                });
            }
            this.startPolling();
        }).catch(() => {
            this.errPollCount += 1;
            // 如果调用失败超过5次，将停止调用
            if (this.errPollCount <= 5) {
                this.startPolling();
            }
        });
    }

    // 点击末级菜单
    clickMenu = (e) => {
        const m = this.props.listMenu.find(item => item.moduleId === e.key);
        if (m && m.urlAddress) {
            WebMonitor.sendPageView(m, this.getCurrentMenu());
            this.props.history.push(m.urlAddress);
            this.setState({
                selectKeys: [e.key],
                selectMenu: m,
            })
        }
    }
    getCurrentMenu() {
        let menu = this.state.selectMenu || this.props.currentMenu;
        if (Object.keys(menu).length === 0) {
            menu = IndexMenu;
        }
        return menu;
    }
    isShowBradge(menu) {
        const { menuBradges = {} } = this.props;
        return menuBradges && menuBradges.hasOwnProperty(menu.urlAddress);
    }
    renderMenuItem = (menu, icon) => {
        const { hiddenMenus = [], menuBradges = {} } = this.props;
        if (menu.urlAddress && ~hiddenMenus.indexOf(menu.urlAddress)) {
            return null;
        }
        if (this.isShowBradge(menu)) {
            const { customerNotify = {} } = this.state;
            const dataKey = menuBradges[menu.urlAddress];
            return (
                <MenuItem key={menu.moduleId || menu.appId}>
                    {menu.parentId == '0' && icon}
                    <Bradge count={customerNotify[dataKey]}>
                        <span className="fulu-menu-name">{menu.fullName}</span>
                    </Bradge>
                </MenuItem>
            );
        }
        return (
            <MenuItem key={menu.moduleId || menu.appId}>
                {menu.parentId == '0' && icon}
                <span className="fulu-menu-name">{menu.fullName}</span>
            </MenuItem>
        );
    }
    renderMenu = (menus) => {
        let ele = [];
        for (let i = 0; i < menus.length; i++) {
            let menu = menus[i];

            let iconX = <Icon type="setting" />;

            if (IconMap[menu.icon]) {
                iconX = IconMap[menu.icon].el;
            }
            else if (menu.icon) {
                iconX = menu.icon.match(/^https?:\/\//) ? <FuluIcon width="18" height="18" src={menu.icon} iconType="menu" /> :<Icon type={menu.icon} />
            }
            if (menu.children.length > 0) { // 拥有子菜单
                if (menu.parentId == '0') {
                    ele.push(
                        <SubMenu
                            key={menu.moduleId || menu.appId}
                            title={<span>{iconX}<span className="fulu-menu-name">{menu.fullName}</span></span>}
                        >
                            {this.renderMenu(menu.children)}
                        </SubMenu>
                    )
                }
                else {
                    ele.push(
                        <SubMenu key={menu.moduleId || menu.appId}>
                            {this.renderMenu(menu.children)}
                        </SubMenu>
                    )
                }
            }
            else {
                ele.push(this.renderMenuItem(menu, iconX));
            }
        }
        return ele;
    }

    handleSelectMenu = (item) => {
        this.setState({
            selectedKeys: item.selectedKeys,
        })
    }
    /**
     * @desc 展开默认打开的一级菜单，其中包括默认打开的路由菜单和配置的菜单
     */
    handleDefaultOpenMenu = () => {
        const { currentMenu, defaultOpenMenu = [] } = this.props;
        if (!this.initDefaultOpenMenu) {
            this.initDefaultOpenMenu = true;
            const menuSet = new Set(defaultOpenMenu);
            const allTopMenu = document.querySelectorAll('.ant-menu-root .ant-menu-submenu');
            if (currentMenu.moduleId) {
                if (this.state.selectKeys.length === 0) {
                    setTimeout(() => {
                        allTopMenu.forEach((subMenu) => {
                            if (subMenu.classList.contains('ant-menu-submenu-selected')) {
                                const subMenuTitle = subMenu.querySelector('.ant-menu-submenu-title');
                                if (subMenuTitle.getAttribute('aria-expanded') !== 'true') {
                                    subMenuTitle.click();
                                }
                            }
                        });
                    }, 0);
                }
            } else {
                setTimeout(() => {
                    allTopMenu.forEach((subMenu) => {
                        const subMenuTitle = subMenu.querySelector('.ant-menu-submenu-title');
                        const menuName = subMenuTitle.querySelector('.fulu-menu-name');
                        if (menuName && menuSet.has(menuName.innerText)) {
                            subMenuTitle.click();
                        }
                    });
                }, 0);
            }
        }
    }
    handleAutoOpenFirstMenu() {
        const { config, autoOpenFirstMenu } = this.props;
        if (!this.initAutoOpenFirstMenu && autoOpenFirstMenu && config) {
            setTimeout(() => {
                document.querySelectorAll('.ant-menu-root .ant-menu-submenu-title').forEach((menu) => {
                    menu.addEventListener('click', (e) => {
                        if (menu.nextSibling.nodeName.toLowerCase() !== 'ul') {
                            setTimeout(() => {
                                menu.nextSibling.querySelector('.ant-menu-item').click();
                            }, 0);
                        } else if (menu.getAttribute('aria-expanded') === 'false') {
                            menu.nextSibling.querySelector('.ant-menu-item').click();
                        }
                    }, false);
                });
            }, 0);
            this.initAutoOpenFirstMenu = true;
        }
    }
    handleAutoFoldUnclickMenu() {
        const { config, autoFoldUnclickMenu } = this.props;
        if (!this.initAutoFoldUnclickMenu && autoFoldUnclickMenu && config) {
            setTimeout(() => {
                document.querySelectorAll('.ant-menu-root>.ant-menu-submenu>.ant-menu-submenu-title').forEach((menu) => {
                    menu.addEventListener('click', (e) => {
                        // 一级菜单展开
                        if (menu.getAttribute('aria-expanded') === 'false') {
                            // 其他一级菜单收起
                            this.handleFoldTopMenu(menu);
                        }
                    }, false);
                });
            }, 0);
            this.initAutoFoldUnclickMenu = true;
        }
    }
    handleFoldTopMenu(expandMenu) {
        document.querySelectorAll('.ant-menu-root>.ant-menu-submenu>.ant-menu-submenu-title').forEach((menu) => {
            if (expandMenu !== menu && menu.getAttribute('aria-expanded') !== 'false') {
                menu.click();
            }
        });
    }
    /**
     * @desc 展开所有菜单
     */
    handleExpandAllMenu = () => {
        const hasDefaultOpenMenu = Array.isArray(this.props.defaultOpenMenu) && this.props.defaultOpenMenu.length > 0;
        if (!this.initExpandMenu && this.props.openAllMenu && !hasDefaultOpenMenu) {
            this.initExpandMenu = true;
            setTimeout(() => {
                document.querySelectorAll('.ant-menu-root .ant-menu-submenu-title').forEach((item) => {
                    if (item.getAttribute('aria-expanded') !== 'true') {
                        item.click();
                    }
                }); 
            }, 0);
        }
    }
    render() {
        const { collapsed, appName, currentMenu, hostUrl, menus } = this.props;
        let { selectKeys } = this.state;
        let defaultSelectedKeys = [];
        let defaultOpenKeys = [];
        if (currentMenu.moduleId) {
            defaultSelectedKeys.push(currentMenu.moduleId);
            defaultOpenKeys.push(currentMenu.parentId);
            selectKeys = [currentMenu.moduleId];
        }
        else {
            selectKeys = [];
        }
        return (
            <Sider
                className="myslider"
                width={200}
                collapsedWidth={64}
                style={{ background: "#192632" }}
                trigger={null}
                collapsible
                collapsed={collapsed}
            >
                <Logo hostUrl={hostUrl} collapsed={collapsed} appName={appName} />
                <div className="menu-container">
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={defaultSelectedKeys}
                        defaultOpenKeys={defaultOpenKeys}
                        mode="inline"
                        style={{ background: "#192632" }}
                        onClick={this.clickMenu}
                        selectedKeys={selectKeys}
                    >
                        {
                            this.renderMenu(menus)
                        }
                    </Menu>
                    <Icon
                        className="trigger menu-expand-btn"
                        type={collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.props.toggle}
                    />
                </div>
            </Sider>
        );
    }
}

MySlider.propTypes = {
    collapsed: PropTypes.bool,
    menus: PropTypes.array,     // 转换成树结构的菜单
    listMenu: PropTypes.array,  // 数组格式的菜单
    appName: PropTypes.string,
    currentMenu: PropTypes.object,
}

MySlider.defaultTypes = {
    collapsed: false,
    menus: [],
    listMenu: [],
    appName: "",
    currentMenu: {},
}

export default withRouter(MySlider);