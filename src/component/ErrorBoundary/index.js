/**
 * @desc 错误边界处理容器视图
 * @author  zhangkegui@fulu.com
 * @version 1.0
 * @date 2020-08-10
 */
import React from 'react';
import Button from 'antd/lib/button';
import { withRouter } from 'react-router-dom';
import './index.less';

@withRouter
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            showErrorLog: false,
            error: null,
        };
        this.onToggleShowErrorLog = this.onToggleShowErrorLog.bind(this);
    }
  
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }
    onToggleShowErrorLog() {
        this.setState({
            showErrorLog: !this.state.showErrorLog,
        });
    }
    componentDidCatch(error, errorInfo) {
    //   console.log(error, errorInfo);
    }
    componentDidUpdate(prevProps) {
        const { refreshByRouter, location } = this.props;
        const { hasError } = this.state;
        if (refreshByRouter && hasError) {
            if (location.pathname !== prevProps.location.pathname) {
                this.setState({
                    hasError: false,
                    error: null,
                });
            }
        }
    }
    renderErrorLog() {
        const { error, showErrorLog } = this.state;
        if (showErrorLog) {
            return (
                <div className="error-log-box">
                    {error && error.stack}
                </div>
            );
        }
        return null;
    }
    render() {
        const { hasError } = this.state;
        if (hasError) {
            return (
                <div className="error-boundary-wrapper">
                    <div className="tips-box">
                        <div className="error-bg" />
                        <div>
                            <span className="tips">页面崩溃了，点击查看</span>
                            <Button onClick={this.onToggleShowErrorLog}>
                                错误日志
                            </Button>
                        </div>
                    </div>
                    {this.renderErrorLog()}
                </div>
            );
        }
        return this.props.children; 
    }
  }

  export default ErrorBoundary;