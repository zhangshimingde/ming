import React from 'react';
import { Button, message, Tooltip } from 'antd';
import ClipBoardCopy from 'clipboard-copy';
import './index.less';

class Copy extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            copyInfo: '',
            visible: false,
        };
        this.onCopy = this.onCopy.bind(this);
    }
    onCopy() {
        const { selector } = this.props;
        const target = document.querySelector(selector);
        if (!target) {
            message.warn('请配置正确的选择器');
            return;
        }
        const newState = {};
        ClipBoardCopy(target.value || target.textContent || target.src).then(() => {
            // message.success('已成功复制');
            newState.visible = true;
            newState.copyInfo = '已成功复制';
        }).catch((e) => {
            // message.error(e);
            newState.copyInfo = '未成功复制';
            newState.visible = true;
        }).finally(() => {
            this.setState(newState);
        });
    }
    render() {
        const { copyInfo, visible } = this.state;
        const { selector, text = '复制', isButton = false, className, ...reset } = this.props;
        const cls = className ? `${btn-copy} ${className}` : 'fl-copy';
        return (
            <Tooltip
                title={copyInfo}
                visible={visible}
                onMouseLeave={() => {
                    if (visible) {
                        this.setState({
                            visible: false,
                        });
                    }
                }}
            >
                {
                    isButton ?
                        <Button {...reset} className={cls} onClick={this.onCopy}>{text}</Button> :
                        <a {...reset} className={cls} onClick={this.onCopy}>{text}</a>
                }
            </Tooltip>
        );
    }
}

export default Copy;