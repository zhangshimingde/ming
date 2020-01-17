import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, routerRedux } from 'dva/router';
import dynamic from 'dva/dynamic';
import { RouteWithLayout } from '../component/layout';

const { ConnectedRouter } = routerRedux;

const RouterWrapper = ({ history, app }) => {
    const PageForbidden = dynamic({
        app,
        component: () => { return import('../component/exception/PageForbidden'); },
    });

    const PublicLayout = dynamic({
        app,
        component: () => { return import('../component/layout/FLayout'); },
    });

    const TestPage = dynamic({
        app,
        component: () => { return import('../component/page/TestPage'); },
    });

    const EditPage = dynamic({
        app,
        component: () => { return import('../component/page/EditPage'); },
    });

    const SubRouterPage = dynamic({
        app,
        component: () => { return import('../component/page/SubRouterPage'); },
    });

    const FormPage = dynamic({
        app,
        component: () => { return import('../component/page/FormPage'); },
    });

    const ContentPage = dynamic({
        app,
        component: () => { return import('../component/page/ContentPage'); },
    });

    const IframePage = dynamic({
        app,
        component: () => { return import('../component/page/IframePage'); },
    });

    const SearchFormPage = dynamic({
        app,
        component: () => { return import('../component/page/SearchFormPage'); },
    });
    const UsePage = dynamic({
        app,
        models: () => { return [import('../model/UsePage.js')]; },
        component: () => { return import('../component/page/UsePage'); },
    });
    const UsePageAddForm = dynamic({
        app,
        models: () => { return [import('../model/UsePage.js')]; },
        component: () => { return import('../component/page/UsePage/AddForm.js'); },
    });
    const HsTestPage = dynamic({
        app,
        component: () => { return import('../component/page/HsTestPage'); },
    });

    return (
        <ConnectedRouter history={history}>
            <Switch>
                <RouteWithLayout
                    layout={PublicLayout}
                    path="/open/ProjectManager/PM_Project/Index"
                    component={TestPage}
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    exact
                    path="/open/ProjectManager/PM_Project/Index/:id"
                    component={EditPage}
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    exact
                    path="/open/ProjectManager/PM_Project/Index/:id/:name"
                    component={SubRouterPage}
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    exact
                    path="/open/ProjectManager/PM_Api/Index"
                    component={FormPage}
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    exact
                    path="/usePage"
                    component={UsePage}
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    exact
                    path="/usePage/searchFormPage"
                    component={SearchFormPage}
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    exact
                    path="/usePage"
                    component={UsePage}
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    exact
                    path="/usePage/usePageAddForm"
                    component={UsePageAddForm}
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    exact
                    path="/hsTestPage"
                    component={HsTestPage}
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    exact
                    component={TestPage}
                    path="/open/ProjectManager/PM_Role/Index"
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    exact
                    component={TestPage}
                    path="/open/ProjectManager/PM_ProjectModule/Index"
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    exact
                    component={TestPage}
                    path="/open/ProjectManager/PM_Versions/Index"
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    exact
                    component={TestPage}
                    path="/open/ProjectManager/PM_Log/Index"
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    path="/iframe/:moduleId"
                    component={IframePage}
                />
                <RouteWithLayout
                    layout={PublicLayout}
                    exact
                    path="/"
                    component={ContentPage}
                />
                <RouteWithLayout layout={PublicLayout} path="/fav" />
                <Route exact path="/403" component={PageForbidden} />
            </Switch>
        </ConnectedRouter>
    );
};

RouterWrapper.propTypes = {
    history: PropTypes.object,
    app: PropTypes.object,
};

RouterWrapper.defaultProps = {
    history: {},
    app: {},
};

export default RouterWrapper;
