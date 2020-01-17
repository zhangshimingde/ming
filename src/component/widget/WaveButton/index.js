import React from 'react';
import { Button } from 'antd';
import './index.less';

// 动画持续时间(毫秒)
const ANIM_DELAY = 500;
const ANIM_HALF_WIDHT = 150;

class WaveButton extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.waveMaskDom = React.createRef();
    }
    onClick(e) {
        this.createAnimCircle({ x: e.pageX, y: e.pageY });
        if (this.props.onClick) {
            this.props.onClick(e);
        }
    }
    createAnimCircle({ x, y }) {
        const animEl = document.createElement('span');
        const currentDom = this.waveMaskDom.current;
        const parentPosition= currentDom.parentNode.getBoundingClientRect();
        animEl.style.left = `${x - parentPosition.x - ANIM_HALF_WIDHT}px`;
        animEl.style.top = `${y - parentPosition.y - ANIM_HALF_WIDHT}px`;
        animEl.className = 'anim-circle';
        setTimeout(() => {
            this.removeAnimCircle(animEl);
        }, ANIM_DELAY);
        currentDom.appendChild(animEl);
    }
    removeAnimCircle(animEl) {
        if (this.waveMaskDom) {
            this.waveMaskDom.current.removeChild(animEl);
        }
    }
    render() {
        const { className = '' } = this.props;
        const newClsName = `${className} wave-btn`;
        return (
            <Button {...this.props} onClick={this.onClick} className={newClsName}>
                {this.props.children}
                <span className="wave-mask-box" ref={this.waveMaskDom}></span>
            </Button>
        );
    }
}

export default WaveButton;