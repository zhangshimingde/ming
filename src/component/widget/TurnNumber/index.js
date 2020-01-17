import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.less';

class TurnNumber extends PureComponent {
    constructor(props) {
        super(props);
        const value = `${props.value}`;
        this.state = {
            cur: value,
            next: value,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { value } = nextProps;
        if (`${value}` !== prevState.next) {
            return {
                next: `${value}`,
            };
        }
        return null;
    }

    componentDidUpdate() {
        const { cur, next } = this.state;
        if (cur !== next) {
            setTimeout(() => {
                this.setState({
                    cur: next,
                });
            }, 600);
        }
    }

    render() {
        const { cur, next } = this.state;
        return (
            <div className={cur === next ? "turn-box" : 'turn-box runing' }>
                <div className="next card">
                    <span className="half-top">{next}</span>
                    <span className="half-bottom">{next}</span>
                </div>
                <div className="cur card">
                    <span className="half-top">{cur}</span>
                    <span className="half-bottom">{cur}</span>
                </div>
            </div>
        );
    }
}

TurnNumber.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

TurnNumber.defaultProps = {
    value: '',
    height: 0,
};

export default TurnNumber;
