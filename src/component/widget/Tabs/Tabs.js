import React from 'react';
import { message, Icon } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './less/tabs.less';
import { Service } from '../../../annotation';
import close from './images/close.svg';
import collect from './images/collect.svg';

@Service('TabsService')
class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.requestAnimationFramePolyfill();
        this.handleCollect = this.handleCollect.bind(this);
        this.execDeleteAnim = this.execDeleteAnim.bind(this);
    }

    setTabClass = (key) => {
        const { activeTabKey } = this.props;
        return classNames('anole-tabs-tab', { 'anole-tabs-tab-active': activeTabKey === key });
    }

    /**
     * @desc 根据菜单路径判断是否被收藏
     */
    getFavInfo = (xMenu) => {
        const { apps, favs } = this.props;
        if (!Array.isArray(apps) || !Array.isArray(favs)) {
            return null;
        }
        if (!xMenu) {
            return null;
        }
        const xApp = apps.find((each) => { return each.appId === xMenu.appId; });
        if (!xApp) {
            return null;
        }
        return favs.find((each) => {
            return xApp.hostUrl === each.host
            && (each.collectSrc === xMenu.urlAddress || each.collectSrc === `/iframe/${xMenu.moduleId}`);
        });
    }

    getDeleteTabDom() {
        const { pathname } = this.deleteTabObj;
        this.deleteTab = this.deleteTab || document.getElementById(pathname);
        return this.deleteTab;
    }

    findAncestors = (menu, ancestors) => {
        const { menus } = this.props;
        if (!menus || !menus.length || menu.parentId === 0) {
            return;
        }
        const p = menus.find((each) => { return each.moduleId === menu.parentId; });
        if (p) {
            ancestors.unshift(p);
            this.findAncestors(p, ancestors);
        }
    }

    isInnerPage = (pathname) => {
        const innerPage = {
            '/': '首页',
            '/settings': '自定义主页',
            '/fav': '收藏',
            '/info': '个人信息',
        };
        return innerPage[pathname] || '';
    }

    handleClose = (tab) => {
        const { onClose } = this.props;
        onClose(tab);
    }

    handleClick = (tab) => {
        const { activeTabKey, onChange } = this.props;
        if (activeTabKey !== tab.pathname) {
            onChange(tab);
        }
    }

    requestAnimationFramePolyfill() {
        if (!window.requestAnimationFrame) {
            let lastTime = 0;
            window.requestAnimationFrame = (callback) => {
                const currTime = new Date().getTime();
                const timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                const id = window.setTimeout(() => {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
    }

    async handleCollect(favInfo, menu) {
        const { service, updateFavs, apps } = this.props;
        // 取消收藏
        if (favInfo) {
            const response = await service.deleteFavs(favInfo.id);
            if (response.code !== '0' || !response.data) {
                return message.error(response.message || '取消收藏失败');
            }
            message.success('取消收藏成功');
            updateFavs(favInfo);
            return null;
        }
        const xMenu = JSON.parse(JSON.stringify(menu));
        const ancestors = [xMenu];
        this.findAncestors(xMenu, ancestors);
        const xApp = apps.find((each) => { return each.appId === xMenu.appId; });
        if (!xApp) {
            return message.error('添加收藏失败');
        }
        ancestors.unshift(xApp);
        xMenu.fullName = ancestors.map((each) => { return each.fullName; }).join('-');
        xMenu.host = xApp.hostUrl || window.location.origin;
        const favs = {
            collectModId: xMenu.moduleId,
            collectTitle: xMenu.fullName,
            collectSrc: xMenu.urlAddress,
            host: xMenu.host,
        };
        if (xMenu.openMode === 'iframe') {
            favs.collectSrc = `/iframe/${xMenu.moduleId}`;
        }
        const response = await service.addFavs(favs);
        if (response.code !== '0' || !response.data) {
            return message.error(response.message || '收藏失败');
        }
        message.success('收藏成功');
        // 重新查询收藏列表
        const { data } = await service.fetchFavsList();
        const favsList = Array.isArray(data.list) ? data.list : [];
        updateFavs(favsList);
        return null;
    }

    execDeleteAnim() {
        const targetTab = this.getDeleteTabDom();
        if (!targetTab) {
            return;
        }
        let currWidth = 160;
        if (targetTab.style.width !== '') {
            currWidth = Number.parseInt(targetTab.style.width, 10);
        }
        if (currWidth > 0) {
            targetTab.style.width = `${currWidth - 16}px`;
            window.requestAnimationFrame(this.execDeleteAnim);
        } else {
            this.handleClose(this.deleteTabObj);
            this.deleteTab = null;
            this.deleteTabObj = null;
        }
    }

    render() {
        const { dataSource } = this.props;
        return (
            <div className="anole-tabs anole-tabs-main">
                <div className="anole-tabs-bar">
                    <ul className="anole-tabs-nav">
                        {
                            Array.isArray(dataSource) ? dataSource.filter((each) => {
                                return !!each.pathname && each.currentMenu;
                            }).map((each) => {
                                const favInfo = this.getFavInfo(each.currentMenu);
                                const collectClass = classNames('icon', 'anole-tabs-tab-collect',
                                    { 'anole-tabs-tab-collect-active': !!favInfo });
                                return (
                                    <li
                                        className={this.setTabClass(each.pathname)}
                                        key={each.pathname}
                                        id={each.pathname}
                                    >
                                        {!this.isInnerPage(each.pathname)
                                            && (
                                                <Icon
                                                    className={collectClass}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={this.handleCollect.bind(this, favInfo, each.currentMenu)}
                                                    component={collect}
                                                />
                                            )
                                        }
                                        <span
                                            onClick={this.handleClick.bind(this, each)}
                                        >
                                            {each.currentMenu.fullName}
                                        </span>
                                        {each.pathname !== '/'
                                            && (
                                                <Icon
                                                    onClick={() => {
                                                        this.deleteTabObj = each;
                                                        this.execDeleteAnim();
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                    className="icon anole-tabs-tab-close"
                                                    component={close}
                                                />
                                            )
                                        }
                                    </li>
                                );
                            }) : null
                        }
                    </ul>
                </div>
                <div className="anole-tabs-content" />
            </div>
        );
    }
}

Tabs.propTypes = {
    onClose: PropTypes.func,
    onChange: PropTypes.func,
    activeTabKey: PropTypes.string,
    menus: PropTypes.array,
    apps: PropTypes.array,
    favs: PropTypes.array,
    service: PropTypes.object,
    updateFavs: PropTypes.func,
    dataSource: PropTypes.array,
};

Tabs.defaultProps = {
    onClose: () => {},
    onChange: () => {},
    activeTabKey: '',
    menus: [],
    apps: [],
    favs: [],
    service: {},
    updateFavs: () => {},
    dataSource: [],
};

export default Tabs;
