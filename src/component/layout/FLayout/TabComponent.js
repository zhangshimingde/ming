import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ErrorBoundary from '../../ErrorBoundary';

@withRouter
class TabComponent extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     update: false,
        // };
        this.renderContent = null;
    }

    // componentWillReceiveProps(nextProps) {
    //     const { location } = this.props;
    //     const { search } = location;
    //     // 刷新当前页面
    //     if (search !== nextProps.location.search && nextProps.location.search
    //         && nextProps.location.search.indexOf('isforceupdate') > -1
    //         && nextProps.location.pathname === nextProps.pathname && nextProps.isShow) {
    //         this.setState({
    //             update: true,
    //         });
    //     }
    // }

    shouldComponentUpdate(nextProps) {
        const { component, isShow, companyList, commonUseAppList, menuList, 
            hash, currentComUseApp, fetchComUseAppLoading } = this.props;
        if (component !== nextProps.component) {
            return true;
        }
        if (hash !== nextProps.hash) {
            return true;
        }
        if (isShow !== nextProps.isShow) {
            return true;
        }
        if (menuList !== nextProps.menuList) {
            return true;
        }
        if (commonUseAppList !== nextProps.commonUseAppList) {
            return true;
        }
        if (currentComUseApp !== nextProps.currentComUseApp) {
            return true;
        }
        if (fetchComUseAppLoading !== nextProps.fetchComUseAppLoading) {
            return true;
        }
        if (companyList.length !== nextProps.companyList.length) {
            return true;
        }
        return false;
    }

    render() {
        const {
            isShow,
            component,
            ...restProps
        } = this.props;
        if (!component) {
            return '';
        }
        const styleObj = {
            left: isShow ? 0 : 10000,
            top: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
        };
        if (!isShow) {
            styleObj.height = '0px';
            styleObj.overflow = 'hidden';
        }
        return (
            <div
                className="tab-page-container"
                style={styleObj}
            >
                <ErrorBoundary refreshByRouter>
                    {React.cloneElement(component, { ...restProps, isShow })}
                </ErrorBoundary>
            </div>
        );
    }
}

TabComponent.propTypes = {
    component: PropTypes.element,
    location: PropTypes.object,
    isShow: PropTypes.bool,
    pathname: PropTypes.string,
};

TabComponent.defaultProps = {
    component: () => {},
    location: {},
    isShow: false,
    pathname: '',
};

export default TabComponent;
