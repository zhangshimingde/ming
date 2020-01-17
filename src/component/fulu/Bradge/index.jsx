import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "./index.less";

class Bradge extends Component {
    render() {

        if (this.props.count > 0) {
            return (
                <span >
                    {this.props.children} <span className="bradge">{this.props.count > 100 ? '99+' : this.props.count}</span>
                </span>
            );
        }
        else {
            return (
                <span >
                    {this.props.children}
                </span>
            );
        }

    }
}

Bradge.propTypes = {
    count: PropTypes.number
};

export default Bradge;