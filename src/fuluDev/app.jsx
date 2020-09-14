import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
import dva from 'dva';
import { Switch, Route, routerRedux } from 'dva/router';
import createHistory from 'history/createBrowserHistory';
// import createLoading from 'dva-loading';
import dynamic from 'dva/dynamic';
import Flayout from '../component/fulu';
import config from '../../src/component/fulu/cfg';
import Page403 from '../component/fulu/error/Page403';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

const { ConnectedRouter } = routerRedux;
window.configs = config;
const RouterWrapper = ({ history, app }) => {
    const CustomManageZone = dynamic({
        app,
        models:() => [
            import('./CustomManageZoneModel')
        ],
        component: () => { return import('./CustomManageZone'); },
    });
    const JoinTeam = (props) => {
        return (
            <div>
                <p>haha</p>
                <a onClick={() => {
                    props.history.push('/authen');
                }}>link</a>
            </div>
        );
    };
    const Authen = () => {
        return (
        <div>authen, {a}</div>
        );
    };
    const Home = () => {
        return (
            <div>home page</div>
        );
    };
    return (
        <ConnectedRouter history={history}>
            <Flayout
                appName="福禄商户控制台"
                config={config}
                defaultOpenMenu={['个人资料', '应用管理']}
                autoFoldUnclickMenu
                autoOpenFirstMenu
                openAllMenu
                noHeaderMsg
                menuBradges={{
                    '/account': 'ghyc',
                }}
                hiddenMenus={['/authen']}
                // initPath="/account"
                menuBradgeUrl=""
                menuBradgeLoop={false}
                // JoinTeamZone={JoinTeam}
            >
                <LocaleProvider locale={zh_CN}>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/403" component={Page403} msg={window.errMsg} />
                        <Route exact path="/account" component={JoinTeam} />
                        <Route exact path="/authen" component={Authen} />
                    </Switch>
                </LocaleProvider>
            </Flayout>
        </ConnectedRouter>
    );
};
window.monitorOpen = true; // 开启埋点
window.monitorConfig = { // 不必填
    selectors: ['.ant-btn-primary', 'button'], // 自定义的选择器，命中这些选择器的节点数据会上报
    menuVisit: true, // 是否收集菜单点击事件，默认为true
    errorCatch: true, // 是否收集异常信息，包括接口、资源加载、js运行异常，默认为true
};
const app = dva({
    history: createHistory(),
    onError(e) {
        message.error(e.message, 3);
    },
});
app.router(RouterWrapper);
app.start('#app');

// const App = () => {
//     return (
//         <BrowserRouter>
//             <Flayout
//                 appName="商户控制台"
//                 config={config}
//                 showSlider={false}
//                 CustomManageZone={CustomManageZone}
//             >
//                 <Switch>
//                     <Route path="/" exact component={Page403} />
//                     <Route
//                         path="/applyApp"
//                         exact
//                         render={() => {
//                             return (<h1>applyApp123</h1>);
//                         }}
//                     />
//                     <Route
//                         path="/authorityManagement"
//                         exact
//                         render={() => {
//                             return (<h1> applyApp123</h1>);
//                         }}
//                     />
//                 </Switch>
//             </Flayout>
//         </BrowserRouter>
//     );
// };

// ReactDOM.render(<App />, document.getElementById('app'));
