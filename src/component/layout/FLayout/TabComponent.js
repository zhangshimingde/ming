import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

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
        const { component, isShow, companyList, projectList,
            hash, currentProject, projectLoading } = this.props;
        if (component !== nextProps.component) {
            return true;
        }
        if (hash !== nextProps.hash) {
            return true;
        }
        if (isShow !== nextProps.isShow) {
            return true;
        }
        if (projectList !== nextProps.projectList) {
            return true;
        }
        if (currentProject !== nextProps.currentProject) {
            return true;
        }
        if (projectLoading !== nextProps.projectLoading) {
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
                {React.cloneElement(component, { ...restProps, isShow })}
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
