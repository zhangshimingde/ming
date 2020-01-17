import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import { DropPanel } from '../../widget';
import arrow from './images/arrow.svg';
import avatar from './images/avatar.svg';
import setting from './images/setting.svg';
import refresh from './images/refresh.svg';
import custom from './images/custom.svg';
import fullscreen from './images/fullscreen.svg';
import restore from './images/restore.svg';
import skin from './images/skin.svg';
import exit from './images/exit.svg';
import { isFullscreen as handleFullScreen } from '../../../utils';
import Favs from './Favs';
import getUserCenterUrl from '../../../configs/UserCenterUrl';
import './less/usercenter.less';
import Service from '../../../annotation/Service';

@Service('UserCenterService')
class UserCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTheme: false,
            userInfo: {},
            barData: [
                {
                    theme: 'yellow',
                    isActive: true,
                },
                {
                    theme: 'dark',
                    isActive: false,
                },
                {
                    theme: 'light',
                    isActive: false,
                },
                {
                    theme: 'red',
                    isActive: false,
                },
                {
                    theme: 'green',
                    isActive: false,
                },
                {
                    theme: 'blue',
                    isActive: false,
                },
                {
                    theme: 'purple',
                    isActive: false,
                },
                {
                    theme: 'pink',
                    isActive: false,
                },
            ],
        };
        this.handleToggleThemePanel = this.handleToggleThemePanel.bind(this);
        this.renderThemeBar = this.renderThemeBar.bind(this);
    }

    componentWillMount() {
        const { service, setUserOrganizeId, dispatch } = this.props;
        service.getUserInfo().then(({ data }) => {
            this.setState({
                userInfo: data,
            });
            dispatch({ type: 'publicLayout/getUserinfo', payload: { userinfo: data } });

            if (typeof setUserOrganizeId === 'function') {
                setUserOrganizeId(data.currentOrganizeId, data);
            }
        });
        // 获取当前主题色，更新bar选中的样式
        const nowTheme = localStorage.getItem('theme') || 'dark';
        const { barData } = this.state;
        if (nowTheme) {
            for (let i = 0, len = barData.length; i < len; i++) {
                if (barData[i].theme === nowTheme) {
                    barData[i].isActive = true;
                } else {
                    barData[i].isActive = false;
                }
            }
            this.setState({ barData });
        }
    }

    handleFullScreen = () => {
        const { onFullScreen } = this.props;
        if (!handleFullScreen()) { // 进入全屏,多重短路表达式
            this.fullScreen();
            if (onFullScreen) {
                onFullScreen(true);
            }
        } else { // 退出全屏,三目运算符
            this.exitFullScreen();
            if (onFullScreen) {
                onFullScreen(false);
            }
        }
    }

    handleRefresh = () => {
        const xContainer = document.querySelector('.tab-page-container');
        for (let i = 0; i < xContainer.length; i += 1) {
            if (xContainer[i].css('left') === '0px') {
                const xFrame = xContainer[i].find('iframe');

                const src = xFrame.attr('src');
                xFrame.attr('src', src);

                return;
            }
        }
    }

    handleLogout = () => {
        if (document.getElementsByClassName('LRADMS_iframe').length > 0) {
            if (document.getElementsByClassName('LRADMS_iframe')[0].src
                && document.getElementsByClassName('LRADMS_iframe')[0].src.split('?')) {
                const targetOrigin = document.getElementsByClassName('LRADMS_iframe')[0].src.split('?')[0];
                document.getElementsByClassName('LRADMS_iframe')[0].contentWindow.postMessage('logout', targetOrigin);
            }
        }
        const redirectUrl = window.location.origin;
        const logoutUrl = `${window.configs.host.passport.auth}/oauth/authorize?client_id=${window.configs.authorId || window.configs.clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=get_user_info&state=xyz`;
        window.location.href = `${window.configs.host.passport.auth}/user/logout?returnurl=${encodeURIComponent(logoutUrl)}`;
    }

    handleThemeChange = (theme, index) => {
        const { onThemeChange } = this.props;
        onThemeChange(theme);
        const { barData } = this.state;
        for (let i = 0, len = barData.length; i < len; i++) {
            barData[i].isActive = false;
        }
        barData[index].isActive = true;
        this.setState({ barData });
    }

    /**
    * @desc 显示/隐藏主题变换修改面板
    */
    handleToggleThemePanel() {
        const { showTheme } = this.state;
        this.setState({
            showTheme: !showTheme,
        });
    }

    fullScreen() {
        const el = document.getElementsByTagName('html')[0];
        const rfs = el.requestFullScreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
            || el.msRequestFullScreen;
        let wscript = null;
        if (typeof rfs !== 'undefined' && rfs) {
            rfs.call(el);
            return;
        }
        if (typeof window.ActiveXObject !== 'undefined') {
            wscript = new window.ActiveXObject('WScript.Shell');
            if (wscript) {
                wscript.SendKeys('{F11}');
            }
        }
    }

    exitFullScreen() {
        const el = document;
        const cfs = el.cancelFullScreen
            || el.webkitCancelFullScreen
            || el.mozCancelFullScreen
            || el.exitFullScreen;
        let wscript = null;

        if (typeof cfs !== 'undefined' && cfs) {
            cfs.call(el);
            return;
        }

        if (typeof window.ActiveXObject !== 'undefined') {
            wscript = new window.ActiveXObject('WScript.Shell');
            if (wscript != null) {
                wscript.SendKeys('{F11}');
            }
        }
    }

    renderRefresh(isIframe = false) {
        if (isIframe) {
            return (
                <li className="user-grid-item" onClick={this.handleRefresh}>
                    <a href="#">
                        <Icon className="icon" component={refresh} />
                        <span>刷新</span>
                    </a>
                </li>
            );
        }
        return null;
    }

    renderThemeBar(barData) {
        return barData.map((v, i) => {
            return (
                <button
                    className={
                        v.isActive
                            ? 'theme-bar-item bar-on'
                            : 'theme-bar-item'
                    }
                    onClick={() => {
                        return this.handleThemeChange(
                            v.theme, i,
                        );
                    }}
                    key={`theme-${i + 1}`}
                >
                    <p className={`bar-inner bar-${v.theme}`} />
                </button>
            );
        });
    }

    render() {
        const {
            currentMenu,
            isFullscreen,
            favs,
            userCenterConfig,
        } = this.props;
        const isIframe = currentMenu && currentMenu.openMode === 'iframe';
        const { showTheme, barData, userInfo } = this.state;
        const realName = userInfo && userInfo.realName;
        const {
            changeTheme = true,
            customPage = true,
            editUserInfo = true,
        } = userCenterConfig || {};
        return (
            <div className="user-center">
                <ul className="user-center-inner">
                    <li>
                        {
                            window.configs.host.backold &&
                            <a
                                className="backOld"
                                href={`${window.configs.host.backold}?token=${localStorage.getItem('access_token')}`}
                            >
                                回到旧版
                        </a>
                        }
                    </li>
                    <li className="user-center-item">
                        <Favs favs={favs} />
                    </li>
                    <li className="user-center-item ">
                        <DropPanel
                            className="anole-droppanel"
                            header={(
                                <div className="anole-droppanel-trigger">
                                    <span>{realName}</span>
                                    <Icon className="icon" component={arrow} />
                                </div>
                            )}
                        >
                            <div className="anole-droppanel-content">
                                <div className="user">
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            <Icon className="icon" component={avatar} />
                                        </div>
                                        <div className="user-name">{realName}</div>
                                        {
                                            editUserInfo
                                                ? (
                                                    <div className="user-setting">
                                                        <a href={getUserCenterUrl()} target="_blank">
                                                            <Icon className="icon" component={setting} />
                                                        </a>
                                                    </div>
                                                ) : null
                                        }
                                    </div>
                                    <ul className="user-grid">
                                        {this.renderRefresh(isIframe)}
                                        <li className="user-grid-item" onClick={this.handleFullScreen}>
                                            {isFullscreen ? (
                                                <a href="javascript:void(0)">
                                                    <Icon className="icon" component={restore} />
                                                    <span>退出全屏</span>
                                                </a>
                                            ) : (
                                                    <a href="javascript:void(0)">
                                                        <Icon className="icon" component={fullscreen} />
                                                        <span>全屏</span>
                                                    </a>
                                                )}
                                        </li>
                                        {
                                            customPage
                                                ? (
                                                    <li className="user-grid-item">
                                                        <Link to="/settings">
                                                            <Icon className="icon" component={custom} />
                                                            <span>自定义主页</span>
                                                        </Link>
                                                    </li>
                                                ) : null
                                        }
                                        {
                                            changeTheme
                                                ? (
                                                    <li
                                                        className="user-grid-item theme-control"
                                                    >
                                                        <a
                                                            href="#"
                                                            className={showTheme ? 'theme-on' : ''}
                                                            onClick={this.handleToggleThemePanel}
                                                        >
                                                            <Icon
                                                                component={skin}
                                                                className={showTheme ? 'theme-on icon' : 'icon'}
                                                            />
                                                            <span className={showTheme ? 'theme-on' : ''}>
                                                                换肤
                                                            </span>
                                                        </a>
                                                        {showTheme
                                                            && (
                                                                <div
                                                                    className="theme-bar"
                                                                    style={{ left: '-209px' }}
                                                                >
                                                                    <div className="theme-bar-content">
                                                                        {
                                                                            this.renderThemeBar(barData)
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        {showTheme
                                                            && <p className="triangle-border" />
                                                        }
                                                        {showTheme
                                                            && <p className="triangle-body" />
                                                        }
                                                    </li>
                                                ) : null
                                        }
                                        <li className="user-grid-item">
                                            <a
                                                href="javascript:void(0)"
                                                onClick={this.handleLogout}
                                                className="app-exit"
                                            >
                                                <Icon className="icon" component={exit} />
                                                <span>退出</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </DropPanel>
                    </li>
                </ul>
            </div>
        );
    }
}

UserCenter.propTypes = {
    service: PropTypes.object,
    setUserOrganizeId: PropTypes.func,
    onFullScreen: PropTypes.func,
    onThemeChange: PropTypes.func,
    currentMenu: PropTypes.object,
    isFullscreen: PropTypes.bool,
    favs: PropTypes.array,
    userCenterConfig: PropTypes.object,
};

UserCenter.defaultProps = {
    service: {},
    setUserOrganizeId: () => { },
    onFullScreen: () => { },
    onThemeChange: () => { },
    currentMenu: {},
    isFullscreen: false,
    favs: [],
    userCenterConfig: {},
};

export default UserCenter;
