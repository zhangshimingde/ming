// import React from 'react';
// import ReactDOM from 'react-dom';
import dva from 'dva';
import { message } from 'antd';
import createHistory from 'history/createBrowserHistory';
import PublicLayout from './model/PublicLayout';
// import AppRouter from './router';

// import 'babel-runtime/core-js/map';
// import 'babel-runtime/core-js/set';
import './assets/less/common.less';
// import './assets/less/antd/entry.less';

// window.Promise = Promise;

window.monitorOpen = true;
const history = createHistory();
const app = dva({
    history,
    onError(e) {
        message.error(e.message, 3);
    },
});
app.model(PublicLayout);

app.router(require('./router/RouterDev'));

app.start('#app');
// window.monitorConfig = {
//     selectors: ['.ant-btn-primary', 'button'],
//     menuVisit: false,
// };

// ReactDOM.render(<AppRouter />, document.querySelector('#app'));
