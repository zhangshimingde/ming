import React from 'react';

export default ({ iframeSrc, moduleId }) => {
    const access_token = localStorage.getItem('access_token');
    if (iframeSrc && iframeSrc.indexOf('/') === 0) {
        iframeSrc = iframeSrc.slice(1);
    }
    const queryTag = iframeSrc.indexOf('?') > 0 ? '&' : '?';
    const tempIframeSrc = `${iframeSrc}${queryTag}access_token=${access_token}&moduleid=${moduleId}`;
    return (
        <iframe
            name="innerIframe"
            id="innerIframe"
            src={tempIframeSrc}
            frameBorder="0"
            align="left"
            width="100%"
            height="100%"
            id={`iframe-${moduleId}`}
        >
        </iframe>
    );
};