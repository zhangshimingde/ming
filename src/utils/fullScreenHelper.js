function isFullscreen() {
    const explorer = window.navigator.userAgent.toLowerCase();
    if (explorer.indexOf('chrome') > 0) { // webkit
        return document.body.scrollHeight === window.screen.height
      && document.body.scrollWidth === window.screen.width;
    }
    // IE 9+  fireFox
    return window.outerHeight === window.screen.height
    && window.outerWidth === window.screen.width;
}

function fullScreen() {
    const el = document.getElementsByTagName('html')[0];
    const rfs = el.requestFullScreen
        || el.webkitRequestFullScreen
        || el.mozRequestFullScreen
        || el.msRequestFullScreen;
    let wscript = null;
    if (typeof rfs !== 'undefined' && rfs) {
        rfs.call(el);
        return;
    }
    if (typeof window.ActiveXObject !== 'undefined') {
        wscript = new window.ActiveXObject('WScript.Shell');
        if (wscript) {
            wscript.SendKeys('{F11}');
        }
    }
}

function exitFullScreen() {
    const el = document;
    const cfs = el.cancelFullScreen
        || el.webkitCancelFullScreen
        || el.mozCancelFullScreen
        || el.exitFullScreen;
    let wscript = null;

    if (typeof cfs !== 'undefined' && cfs) {
        cfs.call(el);
        return;
    }

    if (typeof window.ActiveXObject !== 'undefined') {
        wscript = new window.ActiveXObject('WScript.Shell');
        if (wscript != null) {
            wscript.SendKeys('{F11}');
        }
    }
}

export default isFullscreen;

export {
    fullScreen,
    exitFullScreen,
};
