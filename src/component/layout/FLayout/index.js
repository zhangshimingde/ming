/**
 * @desc    布局容器组件
 * @author  zhangkegui
 * @date    2018-12-18
 * @version 1.0.0
 */
import React from 'react';
import _ from 'lodash';
import url from 'url';
import { connect } from 'react-redux';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import classNames from 'classnames';
import { LocaleProvider, message } from 'antd';
import NProgress from 'nprogress';
import { AsideMenu } from '../../menu';
import { Tabs, Loading } from '../../widget';
import TabComponent from './TabComponent';
import { ContentPage } from '../../page';
import UserCenter from './UserCenter';
import { auth, isFullscreen, checkSubRoutePath, isPathEqual } from '../../../utils';
import { Service } from '../../../annotation';
import 'nprogress/nprogress.css';
import './less/flayout.less';

const FLayoutContext = React.createContext({
  apps: [],
  toggleAppVisable: () => { },
  basicInfo: {},
});

NProgress.configure({
  parent: '#app',
  showSpinner: false
});

@Service('FLayoutService')
class FLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: localStorage.getItem('theme') || 'dark',
      panelCollapsed: false, // 应用子菜单判断折叠开关
      curComponent: null,  // 当前路由子组件
      userInfo: '',
      authCode: '',
      tabPages: [],
      globalLoading: false,
      menuLoading: false,
      authLoading: false,
      projectLoading: false,
      apps: [],
      menus: [],
      favs: [], // 收藏列表
      userOrganizeId: '', // 当前用户组织机构编号
      currentMenu: {}, // 当前选中菜单
      currentProject: null,
      projectList: [],
    };
    this.visableChangeApp = {};
    this.onTopProject = this.onTopProject.bind(this);
    this.onSwitchProject = this.onSwitchProject.bind(this);
    this.handleUpdateFavs = this.handleUpdateFavs.bind(this);
    this.fetchAsideMenuCb = this.fetchAsideMenuCb.bind(this);
    this.fetchProjectList = this.fetchProjectList.bind(this);
    this.handleSetAppMenus = this.handleSetAppMenus.bind(this);
    this.handleSetActiveMenu = this.handleSetActiveMenu.bind(this);
    this.handleToggleAppVisable = this.handleToggleAppVisable.bind(this);
    this.handleSetUserOrganizeId = this.handleSetUserOrganizeId.bind(this);
  }
  /* 登录逻辑
    1.跳转到登录页
    2.登录成功后会跳转回当前应用并携带code和state
    3.通过code获取access_token，设置axios的headers 并将access_token存入localStorage
    4.通过access_token获取用户信息
  */
  componentWillMount() {
    const { code, state } = url.parse(window.location.href, true).query;
    const oldCode = localStorage.getItem('code');
    if (oldCode && code && oldCode === code) {
        auth();
        return;
    }
    localStorage.setItem('code', code);
    // 没有获取到access_token
    if (code && !localStorage.getItem('access_token')) {
      this.fetchAuthCode({
        code,
        state,
        redirect_uri: localStorage.getItem('redirectUrl'),
      });
    } else if (code && localStorage.getItem('access_token')
      && state && localStorage.getItem('passportState') === state) {
      this.fetchUserInfo();
    } else {
      // 重定向
      auth();
    }
    this.handleLoadingStatus();
  }
  /**
   * @desc 添加默认欢迎页面
   */
  initDefaultPage() {
    const payload = {
      pathname: '/',
      currentMenu: { urlAddress: '/', fullName: '首页' },
    }

    if (React.homePage) {
      payload.component = React.createElement(React.homePage);
    }
    else {
      payload.component = React.createElement(ContentPage);
    }
    
    this.addTabPage(payload);
  }
  /**
   * @desc 获取授权码
   * @param {object} params 
   */
  fetchAuthCode(params) {
    this.props.service.auth(params).then(({ data, code }) => {
      if (code != '0') {
        return auth();
      }
      this.setState({
        authCode: data,
      });
      localStorage.setItem('authCount', 0);
      localStorage.setItem('access_token', data && data.access_token);
      localStorage.removeItem('passportState');
      this.fetchUserInfo();
    }).catch(() => {
      auth();
    });
  }
  /**
   * @desc 获取当前用户信息
   */
  fetchUserInfo() {
    this.props.service.fetchUserInfo().then(({ data, code }) => {
      if (!data && data.code != '0') {
        localStorage.setItem('access_token', '');
        return auth();
      }
      this.setState({
        userInfo: data,
      });
      if (window.configs.clientId === '10000160') { // 项目研发管理平台，不切换公司主体，而是切换项目
        this.fetchProjectList();
      }
    }).catch(() => {
      localStorage.setItem('access_token', '');
      auth();
    });
  }
  fetchAsideMenuCb(datas) {
    this.setState({
      ...datas,
    });
  }
  async fetchProjectList() {
    this.setState({
      projectLoading: true,
    });
    try {
      const { data: projectData } = await this.props.service.fetchProjectList();
      const projectList = projectData && Array.isArray(projectData.list) ? projectData.list : [];
      const { currentProject: cp } = this.state;
      this.setState({
        projectList,
        projectLoading: false,
        currentProject: cp ? cp : Array.isArray(projectList) && projectList.length > 0 ? projectList[0] : null,
      });
    } catch(e) {
      this.setState({
        projectList: [],
        projectLoading: false,
        currentProject: null,
      });
    }
  }
  /**
   * @desc 置顶项目
   */
  async onTopProject(projectObj) {
    this.setState({
      projectLoading: true,
    });
    try {
      const response = await this.props.service.topProject({projectId: projectObj.id, sortId: 0});
      if (response) {
        if (response.code === '0') {
          message.success('项目置顶成功');
          const { projectList = [] } = this.state;
          projectObj.sortId = 0;
          const newProjectList = [projectObj].concat(projectList.reduce((arr, item) => {
            if (item.id !== projectObj.id) {
              arr.push(item);
            }
            return arr;
          }, []));
          this.setState({
            projectList: newProjectList,
            projectLoading: false,
          });
          return;
        } else if (response.message) {
          message.error(response.message);
        }
      }
      this.setState({
        projectLoading: false,
      });
    } catch(e) {
      this.setState({
        projectLoading: false,
      });
    }
  }
  onSwitchProject(project) {
    this.setState({
      currentProject: project,
    });
  }
  componentDidMount() {
    this.initDefaultPage();
    window.onresize = () => {
      this.setState({
        isFullscreen: isFullscreen(),
      });
    };
  }
  componentWillUnmount() {
    window.onresize = null;
  }
  componentDidUpdate() {
    const { currentMenu, tabPages } = this.state;
    if (currentMenu && currentMenu.urlAddress) {
      const _index = _.findIndex(tabPages, (item) => {
        // iframe方式打开
        if (currentMenu.openIframe) {
          return item.pathname === `/iframe/${currentMenu.moduleId}`;
        }
        return this.checkTabIsExist(currentMenu, currentMenu.urlAddress, item, this.props.basePath);
      });
      // 当前路由没有加入到tabs
      if (!~_index) {
        this.handleAddTabPage(this.props, currentMenu);
      }
    }
  }
  isOpenIframe({ openMode, target }) {
    if (openMode === 'iframe' && target === 'iframe') {
      return true;
    }
    return false;
  }
  handleLoadingStatus(loadFinish = false) {
    !loadFinish ? NProgress.start() : NProgress.done();
  }
  componentWillReceiveProps(nextProps) {
    // 路由切换
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.handleAddTabPage(nextProps, nextProps.location.query);
    }
  }
  handleSetActiveMenu(menu) {
    this.setState({
      currentMenu: menu,
    });
    if (menu && menu.isMenu) {
      this.dispatchTabChangeEvent();
      this.props.dispatch({ type: 'publicLayout/setCurrentMenu', payload: menu });
    }
  }
  handleSetAppMenus(menus) {
    this.props.dispatch({ type: 'publicLayout/setAppMenus', payload: menus });
  }
  handleAddTabPage = (nextProps, menu) => {
    if (!menu) {
      const { tabPages } = this.state;
      const mIndex = _.findIndex(tabPages, (item) => {
        return item.pathname === nextProps.location.pathname;
      });
      if (~mIndex) {
        menu = tabPages[mIndex].currentMenu;
      }
    }
    if (!menu) {
      // 当前新路由地址
      const xUrl = nextProps.location.pathname;
      let isSubRoutePath = false;
      const { menus, currentApp } = this.state;
      const tMenu = menus.find((item) => {
        let tempUrl = item.urlAddress || '';
        const searchIndex = tempUrl.indexOf('?');
        if (searchIndex > 0) {
          item.search = tempUrl.slice(searchIndex);
          tempUrl = tempUrl.slice(0, searchIndex);
        }
        if (tempUrl.indexOf('/') !== 0) {
          tempUrl = `/${tempUrl}`;
          item.urlAddress = tempUrl;
        }
        if (xUrl.indexOf(tempUrl) >= 0 || nextProps.basePath) {
          // 判断是否是多级路由
          if (!isSubRoutePath) {
            isSubRoutePath = checkSubRoutePath(item, tempUrl, xUrl, currentApp, nextProps.basePath);
          }
          return isPathEqual(tempUrl, xUrl, nextProps.basePath) && item.appId === currentApp.appId;
        }
      });
      menu = Object.assign({}, tMenu, { isSubRoutePath });
    }
    if (menu && !Object.hasOwnProperty.call(menu, 'search')) {
      let tempUrl = menu.urlAddress || '';
      const searchIndex = tempUrl.indexOf('?');
      if (searchIndex > 0) {
        menu.search = tempUrl.slice(searchIndex);
      }
    }
    const { xc } = nextProps;
    const x = React.createElement(xc, { ...nextProps });
    const innerPage = this.isInnerPage();
    if (innerPage) {
      menu = {
        fullName: innerPage,
        pathname: window.location.pathname,
        urlAddress: window.location.pathname,
      };
    }
    const payload = {
      pathname: nextProps.location.pathname,
      currentMenu: menu || {},
      search: menu && menu.search,
      component: x,
      basePath: nextProps.basePath,
    };
    this.addTabPage(payload);
  }
  addTabPage(payload) {
    const openIframe = this.isOpenIframe(payload.currentMenu);
    if (openIframe) {
      payload.currentMenu.openIframe = true;
      payload.currentMenu.pathname = `/iframe/${payload.currentMenu.moduleId}`;
    }
    const { tabPages } = this.state;
    // 是否已经存在tabs里面
    const _index = _.findIndex(tabPages, (item) => {
      // iframe方式打开
      if (payload.currentMenu.openIframe) {
        return item.pathname === `/iframe/${payload.currentMenu.moduleId}`;
      }
      const isExist = this.checkTabIsExist(payload.currentMenu, payload.pathname, item, payload.basePath);
      if (isExist) {
        item.pathname = payload.pathname;
        item.component = payload.component;
      }
      return isExist;
    });
    if (!~_index) {
      tabPages.push(payload);
    }
    // 清空路由对应的不是菜单 而是编辑、添加等子页面 的tabPages数据
    const newTabPages = tabPages.map(item => {
      if (_.isEmpty(item.currentMenu) && payload.pathname !== item.pathname) {
        item = {};
      }
      return item;
    }).filter((item) => !!item.pathname && !_.isEmpty(item.currentMenu));
    if (newTabPages.length > 6) {
      var index = _.findIndex(newTabPages, item => item.pathname && item.pathname !== '/');
      newTabPages[index] = {};
    }
    this.setState({
      tabPages: newTabPages,
      activeTabKey: payload.pathname,
      activeTabSearch: payload.search,
      curComponent: payload,
      currentMenu: payload.currentMenu,
    });
  }
  delTabPage(payload) {
    const { tabPages, activeTabKey } = this.state;
    const newTabPages = tabPages.reduce((arr, item) => {
      if (item.pathname !== payload.deleteTabKey) {
        arr.push(Object.assign({}, item));
      }
      return arr;
    }, []).map(item => {
      if (_.isEmpty(item.currentMenu) && payload.pathname !== item.pathname) {
        item = {};
      }
      return item;
    });
    const newState = {
      tabPages: newTabPages,
    };
    const isDeleteCurrTab = payload.deleteTabKey === activeTabKey;
    if (isDeleteCurrTab) {
      newState.activeTabKey = '/';
      newState.currentMenu = {
        urlAddress: '/',
        fullName: '首页',
      };
    }
    this.setState({
      ...newState,
    }, () => {
      if (isDeleteCurrTab) {
        this.props.history.push('/');
      }
    });
  }
  handleTogglePanel = () => {
    const { panelCollapsed } = this.state;
    this.setState({
      panelCollapsed: !panelCollapsed
    })
  }
  isInnerPage = (pathname) => {
    pathname = pathname || window.location.pathname;
    const innerPage = {
      '/': '首页',
      '/settings': '自定义主页',
      '/fav': '收藏',
      '/info': '个人信息'
    }
    return innerPage[pathname] || '';
  }
  isAbsoluteUrl = (url) => {
    return /^http(s)?:/.test(url);
  }
  renderTabContent = () => {
    const { curComponent, tabPages, activeTabKey = '', companyList = [],
      currentProject, projectLoading } = this.state;
    const { location }  = this.props;
    const { hash } = location;
    const { currentMenu } = curComponent;
    if (!tabPages.length) {
      return '';
    }
    const tabs = [];
    let propsObj = null;
    if (currentMenu && curComponent.pathname !== '/') {
      propsObj = {
        key: curComponent.pathname || Math.random() + '',
        pathname: curComponent.pathname,
        tabMenu: currentMenu,
        isShow: activeTabKey === curComponent.pathname,
        component: curComponent.component,
        FLayoutContext: FLayoutContext,
        onSwitchProject: this.onSwitchProject,
        fetchProjectList: this.fetchProjectList,
        companyList,
        currentProject,
        hash,
        projectLoading,
      };
      if (currentMenu.openIframe) {
        let iframeSrc = currentMenu.urlAddress;
        // 不是绝对地址
        if (!this.isAbsoluteUrl(iframeSrc)) {
          iframeSrc = `${currentMenu.host || ''}${currentMenu.urlAddress}`;
        }
        propsObj.iframeSrc = iframeSrc;
        propsObj.moduleId = currentMenu.moduleId;
      }
    }
  
    const renderPages = tabPages.map((each) => {
      if (each.pathname === '/') {
        const welcomePropsObj = {
          key: tabPages[0].pathname || Math.random() + '',
          pathname: tabPages[0].pathname,
          tabMenu: tabPages[0].currentMenu,
          isShow: activeTabKey === tabPages[0].pathname,
          component: tabPages[0].component,
          FLayoutContext: FLayoutContext,
          onSwitchProject: this.onSwitchProject,
          fetchProjectList: this.fetchProjectList,
          companyList,
          hash,
          currentProject,
          projectLoading,
        };
        return (
          <TabComponent {...welcomePropsObj} />
        );
      } else {
          const pathname = each.pathname;
          if (!each.component) {
            return null;
          }
          return (<TabComponent
            key={pathname || Math.random() + ''}
            pathname={pathname}
            hash={hash}
            tabMenu={each.currentMenu}
            isShow={activeTabKey ===  each.pathname}
            component={each.component}
            FLayoutContext={FLayoutContext}
            fetchProjectList={this.fetchProjectList}
            onSwitchProject={this.onSwitchProject}
            companyList={companyList}
            currentProject={currentProject}
            projectLoading={projectLoading}
          />);
      }
    });
    tabs.push(...renderPages);
    return tabs;
  }
  checkTabIsExist(currentMenu, activeTabKey, item, basePath) {
    if (activeTabKey === item.pathname || activeTabKey === '/') {
      return true;
    }
    if (item.pathname !== '/') {
      return isPathEqual(item.pathname, activeTabKey, basePath);
    }
    return false;
  }
  handleTabChange = (tab) => {
    this.setState({
      activeTabKey: tab.pathname,
      activeTabSearch: tab.search,
      currentMenu: tab.currentMenu,
    }, () => {
      this.dispatchTabChangeEvent();
      const activeUrlObj = {
        pathname: tab.pathname,
      };
      if (tab.search) {
        activeUrlObj.search = tab.search;
      }
      this.props.history.push(activeUrlObj);
      if (tab.currentMenu && tab.currentMenu.isMenu) {
        this.props.dispatch({ type: 'publicLayout/setCurrentMenu', payload: tab.currentMenu });
      }
    });
  }
  dispatchTabChangeEvent(menu) {
    if (CustomEvent && typeof CustomEvent === 'function') {
      const tabChangeEvent = new CustomEvent('tabChange', { detail: { ...menu } });
      document.dispatchEvent(tabChangeEvent);
    }
  }
  handleTabClose = (tab) => {
    this.delTabPage({
      deleteTabKey: tab.pathname,
    });
  }
  handleUpdateFavs(favInfo) {
    const { favs } = this.state;
    // 取消收藏
    if (favInfo && favInfo.id) {
      const newFavs = favs.reduce((arr, item) => {
        if (item.id !== favInfo.id) {
          arr.push(Object.assign({}, item));
        }
        return arr;
      }, []);
      this.setState({
        favs: newFavs,
      });
    } else if (Array.isArray(favInfo)) {
      this.setState({
        favs: favInfo,
      });
    }
  }
  handleThemeChange = (theme) => {
    localStorage.setItem('theme', theme);
    this.setState({
      theme
    });
  }
  handleSetUserOrganizeId(userOrganizeId, basicInfo = {}) {
    this.setState({
      userOrganizeId,
      basicInfo,
    });
  }
  /**
   * 应用菜单隐藏显示切换事件
   * @param {object} app 
   */
  handleToggleAppVisable(app) {
    this.visableChangeApp = app;
    const newApps = this.state.apps.reduce((arr, item) => {
      if (item.appId === app.appId) {
        item.isCustomerShow = app.isShow;
      }
      arr.push(item);
      return arr;
    }, []);
    this.setState({
      apps: newApps,
    });
  }
  render() {
    const { xc, userCenterConfig = {}, expandMenu = true, basePath, publicLayout = {} } = this.props;
    const currentUser = publicLayout.userinfo;
    const {
      userInfo,
      authCode,
      panelCollapsed,
      theme,
      tabPages,
      apps,
      menus,
      favs,
      userOrganizeId,
      activeTabKey,
      activeTabSearch,
      isFullscreen,
      currentMenu,
      projectList = [],
      currentProject,
    } = this.state;
    const panelFloded = !panelCollapsed ? 'menu-panel-folded' : 'menu-panel-unfolded';
    if (userInfo && authCode) {
      return (
        <LocaleProvider locale={zhCN}>
          <div className={classNames('app', `app-${theme}`, panelFloded, { fullscreen: this.state.isFullscreen })}>
            <AsideMenu
              onTogglePanel={this.handleTogglePanel}
              location={this.props.location}
              currentUser={currentUser}
              handleSetActiveMenu={this.handleSetActiveMenu}
              handleSetAppMenus={this.handleSetAppMenus}
              handleLoadingStatus={this.handleLoadingStatus}
              fetchAsideMenuCb={this.fetchAsideMenuCb}
              userOrganizeId={userOrganizeId}
              currentMenu={currentMenu}
              panelCollapsed={panelCollapsed}
              visableChangeApp={this.visableChangeApp}
              history={this.props.history}
              expandMenu={expandMenu}
              basePath={basePath}
              projectList={projectList}
              onSwitchProject={this.onSwitchProject}
              onTopProject={this.onTopProject}
              currentProject={currentProject}
              dispatch={this.props.dispatch}
            />
            <div
              style={{
                marginLeft: '230px',
                minHeight: '100%',
              }}
            >
              <div className="topbar">
                <Tabs
                  dataSource={tabPages}
                  apps={apps}
                  menus={menus}
                  favs={favs}
                  updateFavs={this.handleUpdateFavs}
                  activeTabKey={activeTabKey}
                  activeTabSearch={activeTabSearch}
                  onChange={this.handleTabChange}
                  onClose={this.handleTabClose}
                />
                <UserCenter
                  isFullscreen={isFullscreen}
                  onThemeChange={this.handleThemeChange}
                  setUserOrganizeId={this.handleSetUserOrganizeId}
                  userCenterConfig={userCenterConfig}
                  favs={favs}
                  dispatch={this.props.dispatch}
                />
              </div>
              <div
                className="container"
                style={{
                  position: 'relative',
                  overflowX: 'hidden',
                }}
              >
                <FLayoutContext.Provider
                  value={{
                    apps: this.state.apps,
                    projectList,
                    onTopProject: this.onTopProject,
                    toggleAppVisable: this.handleToggleAppVisable,
                    basicInfo: this.state.basicInfo,
                  }}
                >
                  {this.renderTabContent()}
                </FLayoutContext.Provider>
              </div>
            </div>
          </div>
        </LocaleProvider>
      );
    }
    return <Loading />;
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  };
}

export default connect(mapStateToProps)(FLayout);