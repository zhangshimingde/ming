/**
 * @desc 判断路径是否是多级路由
 */

const checkSubRoutePath = (menuItem, menuUrl, currPathName, currentApp, basePath) => {
    let isSubRoutePath = false;
    if (currPathName.indexOf(menuUrl) >= 0 || currPathName.indexOf(basePath) >= 0) {
        if (menuUrl !== currPathName) {
            isSubRoutePath = menuItem.appId === currentApp.appId;
        }
    }
    return isSubRoutePath;
};

/**
 * 判断路径是否相等
 * @param {string} aUrl
 * @param {string} bUrl
 * @param {boolean} strict 严格匹配标识
 */
const isPathEqual = (aUrl, bUrl, basePath, strict = false) => {
    if (aUrl == null || bUrl == null) {
        return false;
    }
    if (strict) {
        return aUrl === bUrl;
    }
    if (aUrl === '/' || bUrl === '/') {
        return false;
    }
    const len = basePath ? basePath.length : Math.min(aUrl.length, bUrl.length);
    return aUrl.slice(0, len) === bUrl.slice(0, len);
};
export {
    isPathEqual,
};
export default checkSubRoutePath;
