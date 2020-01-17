import React from 'react';
import { Switch, Route, Router } from 'react-router';
import createBrowserHistory from "history/createBrowserHistory";
import  { ContentPage, IframePage } from 'component/page';
import { PageForbidden } from 'component/exception';
import { RouteWithLayout } from 'component/layout';
import BasicInformation from 'component/layout/FLayout/BasicInformation';
import TestPage from 'component/page/TestPage';

const history = createBrowserHistory();

// const userCenterConfig = {
//     changeTheme: false,
//     customPage: false,
//     editUserInfo: false,
// };
const userCenterConfig = {};

const AppRouter = () => {
    return (
        <Router history={history}>
            <Switch>
                <RouteWithLayout
                    exact
                    path="/"
                    component={ContentPage}
                    userCenterConfig={userCenterConfig}
                />
                <RouteWithLayout exact path="/info" component={BasicInformation} />
                <RouteWithLayout path="/iframe/:moduleId" component={IframePage} />
                <RouteWithLayout path="/open/ProjectManager/PM_Project/Index" component={TestPage} />
                <RouteWithLayout exact path="/settings" />
                <RouteWithLayout exact path="/messageList" component={TestPage} />
                
                <RouteWithLayout exact path="/activity/times" component={TestPage} />
                <Route exact path="/403" component={PageForbidden} />
            </Switch>
        </Router>
    );
};

export default AppRouter;
