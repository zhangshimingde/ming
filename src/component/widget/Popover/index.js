import React from 'react';
import { Popover } from 'antd';

const FlPopover = ({ children, content, ...rest }) => {
    return (
        <Popover {...rest} overlayClassName="fl-no-content">
            {children}
        </Popover>
    );
};

export default FlPopover;
