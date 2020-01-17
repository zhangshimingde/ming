import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
import dva from 'dva';
import { Switch, Route, routerRedux } from 'dva/router';
import createHistory from 'history/createBrowserHistory';
// import createLoading from 'dva-loading';
import dynamic from 'dva/dynamic';
import Flayout from '../component/fulu';
import config from './config';
import Page403 from '../component/fulu/error/Page403';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

const { ConnectedRouter } = routerRedux;

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
            <div>authen</div>
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
// 1. Initialize
const app = dva({
    history: createHistory(),
    onError(e, dispatch) {
        message.error(e.message, 3);
    },
});
// app.use(createLoading());
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
