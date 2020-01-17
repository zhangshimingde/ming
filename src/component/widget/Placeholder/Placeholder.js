import React from 'react';
import PropTypes from 'prop-types';
import './less/placeholder.less';

const Placeholder = (props) => {
    const {
        className, icon, slogan, description, extra,
    } = props;
    return (
        <div className={`placeholder ${className}`}>
            <div className="placeholder-inner">
                <div className="placeholder-icon">{icon}</div>
                <h3>{slogan}</h3>
                {description !== null ? <p>{description}</p> : null}
                {extra}
            </div>
        </div>
    );
};

Placeholder.propTypes = {
    className: PropTypes.string,
    slogan: PropTypes.string,
    icon: PropTypes.string,
    description: PropTypes.string,
    extra: PropTypes.element,
};

Placeholder.defaultProps = {
    className: 'placeholder-default',
    slogan: '占位标语',
    icon: null,
    description: null,
    extra: null,
};

export default Placeholder;
