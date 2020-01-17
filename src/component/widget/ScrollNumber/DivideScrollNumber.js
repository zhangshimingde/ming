import React from 'react';
import ScrollNumber from './index';

const DivideScrollNumber = ({ value, ...resetProps }) => {
    const valueStr = `${value}`;
    return (
        <React.Fragment>
            {
                valueStr.split('').map((char, i) => {
                    return (
                        <ScrollNumber value={char}  key={`scroll-number-${i}`} {...resetProps} />
                    );
                })
            }
        </React.Fragment>
    );
};

export default DivideScrollNumber;
