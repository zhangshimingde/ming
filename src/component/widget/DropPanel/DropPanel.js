import React from 'react';
import PropTypes from 'prop-types';
import './less/droppanel.less';

const DropPanel = (props) => {
    const {
        bodyStyle, headerStyle, header, children, align, style,
    } = props;
    return (
        <span className="drop-panel-container" style={{ ...style }}>
            <div className="panel-header" style={{ ...headerStyle }}>
                {header}
            </div>
            <div className="panel-body" style={{ ...bodyStyle, [align]: 0 }}>
                {children}
            </div>
        </span>
    );
};

DropPanel.propTypes = {
    header: PropTypes.element,
    children: PropTypes.element,
    align: PropTypes.string, // panel对齐
    style: PropTypes.object,
    headerStyle: PropTypes.object,
    bodyStyle: PropTypes.object,
};

DropPanel.defaultProps = {
    header: null,
    children: null,
    align: 'right',
    style: {},
    headerStyle: {},
    bodyStyle: {},
};

export default DropPanel;
