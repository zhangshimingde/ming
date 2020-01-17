/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

class ScrollNumber extends React.PureComponent {
    constructor(props) {
        super(props);
        const curNumber = this.propertyInProps('initalValue') ? `${props.initalValue}` : `${props.value}`;
        const nextNumber = `${props.value}`;
        const startScroll = this.propertyInProps('initalValue') && this.propertyInProps('value') && nextNumber !== curNumber;
        this.state = {
            curNumber,
            nextNumber,
            startScroll, // 滚动切换数字标识符
        };
        this.init = startScroll ? -1 : 0;
        this.timer = null;
        this.animRef = React.createRef();
        this.propertyInProps = this.propertyInProps.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { value } = nextProps;
        if (!prevState.startScroll && `${value}` !== prevState.nextNumber) {
            return {
                startScroll: true,
                nextNumber: `${value}`,
            };
        }
        return null;
    }
    componentDidMount() {
        if (this.state.startScroll) {
            if (this.init === -1) {
                setTimeout(() => {
                    this.animRef.current.classList.add('runing');
                });
                this.init = 1;
            }
            const { delay, duration } = this.props;
            setTimeout(() => {
                this.animRef && this.animRef.current && this.animRef.current.classList.remove('runing');
            }, duration + delay);
            this.updateCurNumber();
        }
    }
    componentDidUpdate() {
        this.updateCurNumber();
    }

    propertyInProps(propertyKey) {
        return Object.hasOwnProperty.call(this.props, propertyKey);
    }

    updateCurNumber() {
        const { delay, duration } = this.props;
        if (this.timer) {
            return;
        }
        this.timer = setTimeout(() => {
            const { curNumber, nextNumber, startScroll } = this.state;
            if (startScroll && curNumber !== nextNumber) {
                this.setState({
                    curNumber: nextNumber,
                    startScroll: false,
                });
            }
            this.timer = null;
        }, duration + delay);
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    render() {
        const { delay, height, duration } = this.props;
        const { curNumber, nextNumber, startScroll } = this.state;
        const cls = startScroll && this.init !== -1  ? `scroll-content runing` : 'scroll-content';
        const animStyle = startScroll ? {
            transitionDuration: `${duration}ms`,
            transitionDelay: `${delay}ms`,
        } : null;
        return (
            <span className="scroll-number-box" style={{ height }}>
                <span style={animStyle} className={cls} ref={this.animRef}>
                    <span className="cur-num">{curNumber}</span><br />
                    <span className="next-num">{nextNumber}</span>
                </span>
            </span>
        );
    }
}

ScrollNumber.propTypes = {
    initalValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    delay: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    duration: PropTypes.number,
};

ScrollNumber.defaultProps = {
    value: '',
    delay: 0,
    height: 0,
    duration: 500,
};

export default ScrollNumber;
