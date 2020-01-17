import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Card, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import { Service } from '../../../annotation';
import { AppIcon } from '../../widget';
import './less/customSettings.less';

@Service('CustomSettingService')
@withRouter
class CustomSettings extends React.Component {
    constructor(props) {
        super(props);
        this.renderCardTitle = this.renderCardTitle.bind(this);
    }

    handleSetCustomApps = (app, callBack) => {
        const { service } = this.props;
        const isShow = !app.isCustomerShow;
        const { appId } = app;
        service.updateSetting(appId, isShow).then(() => {
            if (typeof callBack === 'function') {
                callBack({ appId, isShow });
            }
        });
    }

    initApps = (apps, toggleAppVisable) => {
        const xApps = _.chain(apps).values().sortBy('sortCode').value();
        return xApps.map((o) => {
            return (
                <li
                    key={o.appId}
                    className={!o.isCustomerShow ? 'settings-item-info disabled' : 'settings-item-info'}
                >
                    <AppIcon
                        type={o.logoUrl}
                        className="icon"
                        style={{ fontSize: 50 }}
                    />
                    <span className="settings-item-name">
                        {o.fullName}
                    </span>
                    <span
                        className="settings-item-opt"
                        onClick={() => {
                            this.handleSetCustomApps(o, toggleAppVisable);
                        }}
                    >
                        {!o.isCustomerShow ? '添加' : '隐藏'}
                    </span>
                </li>
            );
        });
    }

    handleGoBack = () => {
        const { history } = this.props;
        history.go(-1);
    }

    renderCardTitle() {
        return (
            <span>
                <b
                    style={{
                        fontSize: '14px',
                        height: '32px',
                        lineHeight: '32px',
                        color: '#525252',
                    }}
                >
                    自定义主页
                </b>
                <Button
                    onClick={this.handleGoBack}
                    style={{ float: 'right' }}
                >
                    返回
                </Button>
            </span>
        );
    }

    render() {
        const { FLayoutContext } = this.props;
        const { Consumer } = FLayoutContext;
        return (
            <Consumer>
                {
                    ({ apps, toggleAppVisable }) => {
                        return (
                            <Card
                                className="custom-settings-container"
                                style={{
                                    margin: '20px',
                                    position: 'absolute',
                                }}
                                title={this.renderCardTitle()}
                            >
                                <ul className="custom-settings-content">
                                    <li>
                                        <p
                                            className="custom-settings-classtitle"
                                            style={{ display: 'none' }}
                                        >
                                            <span className="custom-settings-item">
                                                订制子应用
                                            </span>
                                        </p>
                                        <ul>
                                            {this.initApps(apps, toggleAppVisable)}
                                        </ul>
                                    </li>
                                </ul>
                            </Card>
                        );
                    }
                }
            </Consumer>
        );
    }
}

CustomSettings.propTypes = {
    service: PropTypes.object,
    history: PropTypes.object,
    FLayoutContext: PropTypes.object,
};

CustomSettings.defaultProps = {
    service: {},
    history: {},
    FLayoutContext: {},
};

export default CustomSettings;
