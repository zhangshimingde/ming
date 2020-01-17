import React from 'react';
import { Menu, Dropdown, message, Icon, Tree } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import url from 'url';
import _ from 'lodash';
import { AppIcon } from '../../widget';
import Search from './Search';
import fold from './images/fold.svg';
import arrow from './images/arrow.svg';
import { Service } from '../../../annotation';
import { compose } from '../../../utils/Tools';
import FuluIcon from '../../widget/FuluIcon';
import { checkSubRoutePath, isPathEqual } from '../../../utils';
import './less/index.less';

const { TreeNode } = Tree;

@Service('AsideMenuService')
class AsideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appList: [],
      menuList: [],
      companyList: [],
      selectAppId: '',
      selectAppName: '',
      currentProject: null,
      currentCompany: {},
      openKeys: [],
      selectedKeys: [],
    };
    this.handleAppClick = this.handleAppClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuOpenChange = this.handleMenuOpenChange.bind(this);
    this.getChildrenNodes = this.getChildrenNodes.bind(this);
    this.renderMenuList = this.renderMenuList.bind(this);
    this.menuItemList = []; // 应用对应的所有子菜单列表
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentMenu && nextProps.currentMenu.moduleId !== this.props.currentMenu.moduleId) {
      this.setState({
        selectedKeys: [nextProps.currentMenu.moduleId],
      });
    }
  }
  componentWillMount() {
    this.initFetchData();
  }
  componentDidUpdate() {
    const { visableChangeApp } = this.props;
    const newAppList = this.state.appList.slice();
    const _index = _.findIndex(newAppList, (item) => {
      return item.appId === visableChangeApp.appId && item.isCustomerShow !== visableChangeApp.isShow;
    });
    if (_index > -1) {
      newAppList[_index].isCustomerShow = visableChangeApp.isShow;
      this.setState({
        appList: newAppList,
      });
    }
  }
  async initFetchData() {
    const { fetchAsideMenuCb, handleLoadingStatus } = this.props;
    const appData = await this.props.service.fetchAppList();
    const menuData = await this.props.service.fetchMenuList();
    const { data: { list: appList } } = appData;
    const { data: { list: menuList } } = menuData;
    if (Array.isArray(appList)) {
      const urlQuery = url.parse(window.location.href, true).query;
      const currentApp = appList.find((item) => item.appId === (urlQuery.appid || window.configs.clientId));
      // 过滤菜单权限
      const xAuthAppIds = _.uniq(menuList.map(each => each.appId));
      const authApps = appList.filter(each => xAuthAppIds.indexOf(each.appId) >= 0);

      const newState = {
        appList: authApps,
        currentApp,
      };
      if (Array.isArray(menuList)) {
        newState.menuList = menuList;
        this.setDefaultActiveApp(menuList, currentApp);
      }
      this.setState({
        ...newState,
      });
      this.execFn(fetchAsideMenuCb, {
        apps: authApps,
        menus: menuList,
        currentApp,
      });
    }
    if (window.configs.clientId !== '10000160') { // 不是项目研发管理平台
      // 公司列表
      const { data: companyData } = await this.fetchCompanyList();
      const companyList = this.getListFromData(companyData);
      this.setState({
        companyList,
      });
      const { currentUser, dispatch } = this.props;
      let organizes = companyList;
      if (currentUser && currentUser.organizeIds && !currentUser.isSystem) {
        organizes = companyList.filter(each => each.category === 2 && currentUser.organizeIds.indexOf(each.id) >= 0);
          this.execFn(fetchAsideMenuCb, {
            companyList: organizes,
          });
      } else {
          this.execFn(fetchAsideMenuCb, {
            companyList,
          });
      }
      dispatch({
          type: 'publicLayout/updateState', 
          payload: { organizes },
      });
    }
    // 收藏
    const { data: favsData } = await this.fetchFavsList();
    this.execFn(fetchAsideMenuCb, {
      favs: this.getListFromData(favsData),
    });
    this.execFn(handleLoadingStatus, true);
  }
  execFn(f, params) {
    if (typeof f === 'function') {
      return f(params);
    }
  }
  /**
   * @desc 获取公司列表
   */
  async fetchCompanyList() {
    const response = await this.props.service.fetchCompanyList();
    return response;
  }
  /**
   * @desc 获取用户收藏列表
   */
  async fetchFavsList() {
    const response = await this.props.service.fetchFavsList();
    return response;
  }
  getListFromData(data) {
    return Array.isArray(data) ? data : data && data.list;
  }
  getMenuByModuleId(moduleId) {
    const { menuList } = this.state;
    return menuList.find((item) => {
      return item.moduleId === moduleId;
    });
  }
  /**
   * @desc 设置当前应用选中状态
   */
  setDefaultActiveApp(menuList = [], currentApp) {
    const { location = {}, expandMenu, basePath } = this.props;
    const menu = location.query;
    if (menu && menu.moduleId) {
      this.props.handleSetActiveMenu(menu);
    } else {
      const { pathname } = window.location;
      // 当前应用对象
      if (currentApp) {
        this.setState({
          selectAppId: currentApp.appId,
          selectAppName: currentApp.fullName,
          openKeys: expandMenu ? this.getDefaultOpenKeys(currentApp.appId, menuList) : [],
        });
        const menus = menuList.filter((each) => {
          return each.appId === currentApp.appId;
        });
        const xMenu = menuList.find((each) => {
          let tmpUrl = each.urlAddress;
          if (each.urlAddress) {
            tmpUrl = each.urlAddress && each.urlAddress.indexOf('?') > 0 ? each.urlAddress.slice(0, each.urlAddress.indexOf('?')) : each.urlAddress;
          }
          return (tmpUrl === pathname || pathname === `/iframe/${each.moduleId}`) // iframepage 使用/iframe/moduleId作路由
          && each.appId === currentApp.appId;
        });
        this.props.handleSetAppMenus({
          menus,
        });
        if (pathname === '/settings' || pathname === '/info' || pathname === '/') {
          this.props.handleSetActiveMenu({
            urlAddress: pathname,
          });
          return;
        }
        // 当前默认选中的菜单项
        if (xMenu && xMenu.moduleId) {
          this.props.handleSetActiveMenu(xMenu);
          this.setState({
            selectedKeys: [xMenu.moduleId],
          });
          return;
        }
      }
      if (pathname.indexOf('/iframe') == 0 || pathname.split('/').length < 1) {
        window.location.href = '/403';
        return;
      }
      const p = pathname.split('/');
      if (_.last(p) === 'detail') {
        p.pop();
      }
      const xUrl = p.join('/');
      let isSubRoutePath = false;
      let tMenu = menuList.find((item) => {
        let tempUrl = item.urlAddress || '';
        const searchIndex = tempUrl.indexOf('?');
        tempUrl = searchIndex > 0 ? tempUrl.slice(0, searchIndex) : tempUrl;
        if (tempUrl.indexOf('/') !== 0) {
          tempUrl = `/${tempUrl}`;
          item.urlAddress = tempUrl;
        }
        if (!Object.hasOwnProperty.call(item, 'search')) {
          let tempUrl = item.urlAddress || '';
          const searchIndex = tempUrl.indexOf('?');
          if (searchIndex > 0) {
            item.search = tempUrl.slice(searchIndex);
          }
        }
        if (xUrl.indexOf(tempUrl) >= 0) {
          // 判断是否是多级路由
          if (!isSubRoutePath) {
            isSubRoutePath = checkSubRoutePath(item, tempUrl, xUrl, currentApp, basePath);
          }
          return isPathEqual(tempUrl, xUrl, basePath) && item.appId === currentApp.appId;
        }
      });
      if (isSubRoutePath) {
        tMenu = Object.assign({}, tMenu, { urlAddress: xUrl }, { isSubRoutePath });
      }
      if (tMenu) {
        this.props.handleSetActiveMenu(tMenu);
      } else {
        window.location.href = '/403';
      }
    }
  }
  getDefaultOpenKeys(selectAppId, menuList) {
    const defaultOpenKeys = [];
    menuList.forEach((item) => {
      if (item.appId === selectAppId && this.getChildrenNodes(item, false, menuList).length > 0) {
        defaultOpenKeys.push(item.moduleId);
      } 
    });
    return defaultOpenKeys;
  }
  /**
   * @desc  筛选出可以显示的列表
   * @param {Array} appList 
   */
  filterAppList(appList = []) {
    return appList.filter(item => item.isCustomerShow);
  }
  /**
   * @desc 根据appId获取app对象
   * @param {string} appId 
   */
  filterAppById(appId) {
    return this.state.appList.filter(item => item.appId === appId)[0] || {};
  }
  handleAppClick(e) {
    e.stopPropagation();
    const target = e.target.nodeName.toLowerCase() === 'a' ? e.target : e.target.parentNode;
    const appId = target.getAttribute('data-key'),
      hostUrl = target.getAttribute('data-host') || '';
    // 当前应用
    if (appId === window.configs.clientId || hostUrl === window.location.href) {
      if (this.state.selectAppId !== appId) {
        this.setState({
          selectAppId: appId,
          selectAppName: this.filterAppById(appId).fullName,
        });
      }
      // 菜单面板折叠
      if (this.props.panelCollapsed) {
        this.props.onTogglePanel();
      }
    } else {
      window.location.href = `${hostUrl}?appid=${appId}`;
    }
  }
  handleMenuOpenChange(openKeys) {
    this.setState({
      openKeys,
    });
  }
  handleMenuClick(selectedKeys, treeNodeObj) {
    const key = selectedKeys[0] || treeNodeObj.node.props.eventKey;
    const _openKeys = this.state.openKeys.slice();
    const newState = {
      selectedKeys: [key],
    };
    if (_openKeys.indexOf(key) < 0) {
        _openKeys.push(key);
    } else {
        _openKeys.splice(_openKeys.indexOf(key), 1);
    }
    newState.openKeys = _openKeys;
    const selectMenu = this.getMenuByModuleId(key);
    let searchStr = '';
    if (selectMenu && selectMenu.urlAddress) {
      if (selectMenu.urlAddress.indexOf('/') !== 0) {
        selectMenu.urlAddress = `/${selectMenu.urlAddress}`;
      }
      if (selectMenu.urlAddress.indexOf('?') > 0) {
        searchStr = selectMenu.urlAddress.slice(selectMenu.urlAddress.indexOf('?'));
        if (!Object.hasOwnProperty.call(selectMenu, 'search')) {
          selectMenu.search = searchStr;
        }
        selectMenu.urlAddress = selectMenu.urlAddress.slice(0, selectMenu.urlAddress.indexOf('?'));
      }
      const xPath = selectMenu.openMode === 'iframe' ?
      `/iframe/${selectMenu.moduleId}` : selectMenu.urlAddress;
      this.props.history.push({ pathname: xPath, query: selectMenu, search: selectMenu.search });
      this.props.handleSetActiveMenu(selectMenu);
    }
    this.setState({
        ...newState,
    });
  }
  /**
   * @desc 切换公司主体
   */
  async handleSwitchCompany(item) {
    if(!item.id) {
      return message.error('请选择需要切换的公司');
    }
    const response = await this.props.service.switchCompany(item.id);
    if (response.code != '0') {
      return message.error(response.message || '切换公司失败');
    }
    window.location.reload();
    this.setState({
      currentCompany: item,
    });
  }
  renderAppList() {
    const { appList, currentApp } = this.state;
    return this.filterAppList(appList).map((item) => {
      const { fullName, appId, hostUrl, logoUrl } = item;
      // 判断是否选中状态
      const cls = currentApp && currentApp.appId === appId ? 'active' : '';
      return (
        <li
          key={`app-${appId}`}
          className={`app-item ${cls}`}
        >
          <span className="icon-box">
          {
            logoUrl && logoUrl.match(/^https?:\/\//) ? <FuluIcon width="16" height="16" src={logoUrl} /> : <AppIcon
              className="icon anole-menu-item-icon"
              type={logoUrl}
            />   
          }
                     
          </span>
          <a
            className="app-link"
            data-key={appId}
            data-host={hostUrl}
            onClick={this.handleAppClick}
          >
            <span
              title={fullName}
              className="app-name"
            >
              {fullName}
            </span>
          </a>
        </li>
      );
    });
  }
  /**
   * @desc 渲染应用菜单
   * @param {object} parentNode 
   */
  renderMenuList(parentNode) {
    if (!parentNode) {
      return null;
    }
    if (Array.isArray(parentNode)) {
      return parentNode.map((item) => {
        return this.renderMenuList(item);
      });
    }
    const childrenNodes = _.sortBy(this.getChildrenNodes(parentNode), 'sortCode');
    // 是否有子菜单
    const hasChildren = childrenNodes.length > 0;
    if (hasChildren) {
      return (
        <TreeNode
          key={parentNode.moduleId}
          title={parentNode.fullName}
        >
          {
            this.renderMenuList(childrenNodes)
          }
        </TreeNode>
      );
    } else {
      const isAdded = _.findIndex(this.menuItemList, (item) => {
        return item.moduleId === parentNode.moduleId;
      });
      if (!~isAdded) {
        this.menuItemList.push(Object.assign({}, parentNode));
      }
      return (
        <TreeNode
          key={parentNode.moduleId}
          title={parentNode.fullName}
        >
          {
            (parentNode.openMode === 'self' || parentNode.openMode === 'iframe') ?
              <span
                className='anole-menu-item-text'
                title={parentNode.fullName}
              >
                {parentNode.fullName}
              </span>
              :
              <span className='anole-menu-item-text'>
                {parentNode.fullName}
              </span>
            }
          </TreeNode>
      );
    };
  }
  /**
   * @desc 根据父节点获取子菜单
   * @param {object} parentNode 
   */
  getChildrenNodes(parentNode, topMenu = false, menuList = this.state.menuList) {
    const childrenNodes = menuList.reduce((childrenArr, item) => {
      // 一级菜单
      if (topMenu && item.parentId === '0' && item.appId === parentNode.appId) {
        childrenArr.push(item);
      } else if (item.parentId === parentNode.moduleId) {
        childrenArr.push(item);
      }
      return childrenArr;
    }, []);
    if (topMenu) {
      return _.sortBy(childrenNodes, 'sortCode');
    }
    return childrenNodes;
  }
  renderCompanyList() {
    const { companyList } = this.state;
    return (
      <Menu>
        {
          this.renderCompanyMenuItems(companyList.filter(each => each.category === 2))
        }
      </Menu>
    );
  }
  renderCompanyMenuItems = (organizes) => {
    const { currentUser } = this.props;

    if (!currentUser || !currentUser.organizeIds || currentUser.isSystem) {
      return null;
    }

    return organizes.filter(each => currentUser.organizeIds.indexOf(each.id) >= 0).map((item) => {
        return (
          <Menu.Item>
            <a
              href="javascript:void(0);"
              onClick={() => {
                this.handleSwitchCompany(item);
              }}
            >
              {item.shortName}
            </a>
          </Menu.Item>
        );
    });
  }
  renderProjectList() {
    const { projectList = [], onTopProject, onSwitchProject } = this.props;
    // const { currentUser } = this.props;
    // if (!currentUser || !currentUser.organizeIds || currentUser.isSystem) {
    //   return null;
    // }
    return (
      <Menu className="fl-project-list">
        {
          projectList.slice(0, 6).map((item) => {
            return (
              <Menu.Item key={item.id}>
                <a
                  href="javascript:void(0);"
                  className="project-item"
                  onClick={() => {
                    onSwitchProject && onSwitchProject(item);
                  }}
                >
                  {item.name}
                  {/* <Icon
                    type="pushpin"
                    title="置顶"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTopProject && onTopProject(item);
                    }}
                  /> */}
                </a>
              </Menu.Item>
            );
          })
        }
        <Menu.Item className="link-create-project">
          <a onClick={() => { this.props.history.push('/#cr'); }}>+&nbsp;创建项目</a>
        </Menu.Item>
        <Menu.Item className="link-project-list">
          <a className="project-item" onClick={() => { this.props.history.push('/'); }}>
            查看所有项目
            <Icon type="right" style={{ color: '#BFBFBF', fontSize: '10px' }} />
          </a>
        </Menu.Item>
      </Menu>
    );
  }
  renderSiderBarContent() {
    const { companyList, currentCompany } = this.state;
    const { currentProject } = this.props;
    const { clientId } = window.configs;
    if (clientId === '10000160') { // 研发项目管理
      const projectName = currentProject && currentProject.name;
      return (
        <Dropdown overlay={this.renderProjectList()}>
          <a className="company-dropdown-link" href="javascript:void(0);">
            <span className="company-name current-project-name" title={projectName}>
              {projectName}
            </span>
            <Icon
              component={arrow}
              style={{ color: '#fff' }}
            />
          </a>
      </Dropdown>
      );
    }
    const { userOrganizeId } = this.props;
    const defaultCompany = Object.keys(currentCompany).length > 0 ? currentCompany : companyList.find((item) => {
      return userOrganizeId && item.id === userOrganizeId;
    });
    const companyName = defaultCompany && defaultCompany.shortName;
    if (window.configs.clientId === '10000021' || window.configs.clientId === '10000033') {
      return (
        <Dropdown overlay={this.renderCompanyList()}>
          <a className="company-dropdown-link" href="javascript:void(0);">
            <span className="company-name">
              {companyName}
            </span>
            <Icon
              component={arrow}
              style={{ color: '#fff' }}
            />
          </a>
        </Dropdown>
      );
    }
    return (<div className="show-company-name">{companyName}</div>);
  }
  render() {
    const {
      selectAppId,
      selectAppName,
      // companyList,
      // currentCompany,
      openKeys,
      selectedKeys,
    } = this.state;
    // const { userOrganizeId } = this.props;
    // const defaultCompany = Object.keys(currentCompany).length > 0 ? currentCompany : companyList.find((item) => {
    //   return userOrganizeId && item.id === userOrganizeId;
    // });
    // const companyName = defaultCompany && defaultCompany.shortName;
    return (
      <div className="sidebar-box">
        <div className="sidebar-header">
          <a href="/" className="logo"></a>
          {this.renderSiderBarContent()}
        </div>
        <ul className="app-list">
          <Search
            menuItemList={this.menuItemList}
          />
          <Scrollbars
            autoHide
            autoHeight
            autoHeightMax={document.body.clientHeight - 90}
            autoHideTimeout={1000}
            autoHideDuration={200}
            renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" />}
            renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
          >
            {
              this.renderAppList()
            }
          </Scrollbars>
        </ul>
        <div className="app-menu-box">
          <div className="menu-header">
            {selectAppName}
          </div>
          <div style={{
            position: 'absolute',
            overflow: 'hidden',
            top: '70px',
            bottom: '0',
            width: '100%',
            backgroundColor: '#eaedf1',
          }}>
            <Scrollbars
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" />}
              renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
            >
              <Tree
                onSelect={this.handleMenuClick}
                onOpenChange={this.handleMenuOpenChange}
                expandedKeys={openKeys}
                selectedKeys={selectedKeys}
              >
                {
                  compose(this.renderMenuList, this.getChildrenNodes)({ appId: selectAppId }, true)
                }
              </Tree>
            </Scrollbars>
          </div>
          <a
            href="javascript:;"
            className="toggle"
            onClick={this.props.onTogglePanel}
          >
            <Icon className="icon" component={fold} />
          </a>
        </div>
      </div>
    );
  }
}

export default AsideMenu;
