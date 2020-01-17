/**
 * @desc 身份验证组件，用于核心业务流程身份校验，根据验证方式配置不同显示对应的验证逻辑
 * @author zhangkegui@fulu.com
 * @date 2019/10/17
 * @version 1.0
 */
import React from 'react';
import { Spin, Button, Input } from 'antd';
import Remote from '../../../utils/Remote';
import './index.less';

const IT = '//it-api-passport.suuyuu.cn';
const PRE = '//pre.api.passport.fulu.com';
const PROD = '//api.passport.fulu.com';
const DEV = 'http://10.0.0.138:8087';

class TradeValidateWrap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: null,
            validateType: null,
        };
    }
    componentWillMount() {
        this.onFetchTradeConfig();
    }
    onSendSmsCode() {
        if (this.state.secondsLoop) {
            return;
        }
        this.setState({
            secondsLoop: true,
        }, () => {
            this.startLoop();
        });
    }
    /**
     * @desc 开启60s倒计时
     */
    startLoop() {
        const { seconds } = this.state;
        if (seconds > 0) {
            setTimeout(() => {
                this.setState({
                    seconds: this.state.seconds - 1,
                }, () => {
                    this.startLoop();
                });
            }, 1000);
        } else {
            this.setState({
                secondsLoop: false,
                seconds: 60,
            });
        }
    }
    /**
     * @desc检查当前站点与配置站点是否匹配
     * @param {array|string} url
     */
    isHostEqual(url) {
        if (Array.isArray(url)) {
            return ~b.indexOf(location.origin); // 如果配置站点是数组类型，则严格匹配站点域名
        }
        if (url) {
            return `://${location.host}` === url.slice(url.indexOf(':')); // 兼容协议不同，host相同的情况
        }
        return false;
    }
    getHost() {
        const { env = {} } = this.props;
        const { prod, it, pre } = env;
        if (this.isHostEqual(prod)) { // 正式环境
            return `${location.protocol}${PROD}`;
        } else if (this.isHostEqual(it)) { // it环境
            return `${location.protocol}${IT}`;
        } else if (this.isHostEqual(pre)) { // pre环境
            return `${location.protocol}${this.getPreHost()}`;
        }
        const { host: { passport: { authCode = '' } } } = window.configs || {};
        if (/^http(s)?:\/\/it\S+/.test(authCode)) {
            return `${location.protocol}${IT}`;
        }
        return DEV;
    }
    getPreHost() {
        return location.protocol.toLowerCase() === 'https:' ? '//pre-api-passport.suuyuu.cn' : PRE;
    }
    onFetchTradeConfig() {
        const { phoneNo } = this.props;
        const search = phoneNo ? `phoneNo=${phoneNo}` : `userId=${window.userinfo && window.userinfo.userId}`;
        Remote.get(`${this.getHost()}/api/passport/GetBindingStatus?${search}`).then((result = {}) => {
            const { code, data } = result;
            if (code == '0') {
                let validateType;
                const { bindingStatus, validateModePriority } = data;
                if (bindingStatus === 0) { // 未绑定
                    validateType = 0;
                } else if (bindingStatus === 1) { // 已绑定
                    validateType = validateModePriority;
                }
                this.setState({
                    loading: false,
                    validateType,
                });
            } else {
                this.setState({
                    loading: false,
                    error: result,
                });
            }
        }).catch((e) => {
            this.setState({
                loading: false,
                error: e,
            });
        });
    }
    onOk() {
        if (this.validateCode()) {
            this.onCancel();
        }
    }
    validateCode() {
        const { code } = this.state;
        let err = '';
        if (!code) {
            err = '请输入验证码';
        } else if (!/^\d{6}$/.test(code)) {
            err = '请输入6位整数';
        }
        if (err || (!err && this.state.err)) {
            this.setState({
                err,
            });
        }
        return err ? '' : code;
    }
    onCancel() {
        this.setState({
            code: '',
        });
        this.initFetch = false;
    }
    onChange(e) {
        this.setState({
            code: e.target.value,
        }, this.validateCode);
    }
    renderInpt() {
        const { err } = this.state;
        return (
            <span className="inpt-box">
                <Input
                    className={ err ? 'inpt err': 'inpt' }
                    placeholder="6位数字"
                    maxLength={6}
                    onChange={this.onChange}
                />
                <span className="err-tips">{err}</span>
            </span>
        );
    }
    renderValidate() {
        const { secondsLoop, seconds, mode } = this.state;
        // 短信验证
        if (mode === 'sms') {
            const btnText = secondsLoop && seconds >= 0 ? `${seconds}s` : '获取短信验证码';
            return (
                <div className="sms-box">
                    <p>
                        <span className="label">手机号:</span>
                        <span className="cellphone">13114014539</span>
                        <Button className="btn-hidden btn-send-sms">获取短信验证码</Button>
                    </p>
                    <p>
                        <span className="label">验证码:</span>
                        {this.renderInpt()}
                        <Button
                            className="btn-send-sms"
                            type="primary"
                            onClick={this.onSendSmsCode}
                        >
                            {btnText}
                        </Button>
                    </p>
                </div>
            );
        } else {
            return (
                <div className="token-box">
                    <div className="guide">请在手机中打开Google Authenticator，请输入6位电子口令</div>
                    <p>
                    <span className="label">电子口令:</span>
                    {this.renderInpt()}
                    </p>
                </div>
            );
        }
    }
    renderContent() {
        const { loading, error, validateType } = this.state;
        const { renderSpin } = this.props;
        if (loading) {
            return typeof renderSpin === 'function' ? renderSpin() : (<Spin spinning={loading} />);
        } else {
            return this.props.children({ validateType, error });
        }
    }
    render() {
        const { loading } = this.state;
        const { block = false } = this.props;
        return (
            <div className={ loading && block ? 'trade-validate-wrap wrap-loading' : 'trade-validate-wrap' }>
                {this.renderContent()}
            </div>
        );
    }
}

export default TradeValidateWrap;