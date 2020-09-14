/**
 * @desc 前端监控组件，收集浏览器信息，行为事件
 * @author zhangkegui@fulu.com
 * @date  2020-04-27
 * @version 1.0
 */

import Remote from './Remote';
import getTime from '../../../utils/Common';
const TYPE_PAGE = '0'; // 页面跳转
const TYPE_CLICK = '1'; // 点击事件
const TYPE_KEYBORAD = '2'; // 键盘输入
const TYPE_ERROR = '3'; // 页面异常
const TYPE_PERFORMANCE = '4'; // 页面性能
const version = '1.1';
const isObject = (objLike) => {
    return Object.prototype.toString.call(objLike) === '[object Object]';
};
// const CODE_REGX = /^(4\d\d|5\d\d)$/;

const WebMonitor = (function WebMonitor() {
    let _configs = null;
    let isStart = false;
    let currentMenu = null;
    // const failArr = []; // 存放发送失败的数据
    const injectErrorCatch = () => {
        // var oldXHR = window.XMLHttpRequest;
        // function newXHR() {
        //   const realXHR = new oldXHR();
        //   realXHR.addEventListener('load', function(e) {
        //     if (statusCodeError(e.target.status)) {
        //         sendData({
        //             actionTime: getTime(),
        //             info: `请求'${e.target.responseURL}'异常:${e.target.statusText}`,
        //         });
        //     }
        //   }, false);
        //   return realXHR;
        // }
        // window.XMLHttpRequest = newXHR;
        window.addEventListener("error", onError, true);
		window.addEventListener("unhandledrejection", onUnhandledrejection, false);
    };
    // const statusCodeError = (code) => {
    //     return CODE_REGX.test(code);
    // };
    const onError = (err) => {
        let info = '';
        if (err.srcElement && err.srcElement !== window) { // 捕获静态资源记载异常
            info = `${err.srcElement.nodeName}标签加载${err.srcElement.src || err.srcElement.href}异常`;
        } else {
            info = err.error.stack || err.message;
        }
        sendData({
            actionTime: getTime(),
            actionType: TYPE_ERROR,
            info,
        });
    };
    // 捕获promise异常
    const onUnhandledrejection = (err) => {
        sendData({
            actionTime: getTime(),
            actionType: TYPE_ERROR,
            info: err.reason || err.message,
        });
    };
    // 监听交互事件，这里主要是click事件
    const injectUIEvent = () => {
        let _selectors = [];
        if (isObject(_configs)) {
            const { selectors = [] } = _configs;
            if (Array.isArray(selectors)) {
                _selectors = selectors.slice();
            } else if (selectors) {
                _selectors.push(selectors);
            }
        }
        window.addEventListener('click', (e) => {
            const mid =  e.target.getAttribute('data-mid');
            const minfo = e.target.getAttribute('data-minfo');
            const info = `点击元素(${e.target.innerText})${minfo ? `/(${minfo})` : ''}`;
            if (mid) { // 拥有data-mid属性，表示被监控目标对象
                sendData({
                    itemId: mid,
                    actionTime: getTime(),
                    actionType: TYPE_CLICK,
                    info,
                });
            } else if (_selectors.length > 0) {
                const curTarget = _selectors.find((item) => {
                    if (item.startsWith('.')) {
                        return e.target.classList.contains(item.slice(1));
                    } else if (item.startsWith('#') && e.target.id) {
                        return `#${e.target.id}` === item;
                    } else if (e.target.nodeName){
                        return e.target.nodeName.toLowerCase() === item.toLowerCase();
                    }
                });
                if (curTarget) {
                    sendData({
                        itemId: e.target.id || '',
                        actionTime: getTime(),
                        actionType: TYPE_CLICK,
                        info,
                    });
                }
            }
        }, true);
    };
    // 生成收集数据对象
    const createCollectData = (initData) => {
        const baseData = {
            actionId: '803b2133-e24a-4e6f-8478-95dab6e8f0b3',
            reportTime: getTime(),
            sdkVersion: version,
        };
        if (!Object.hasOwnProperty.call(initData || {}, 'modelId') && currentMenu) {
            baseData.modelId = currentMenu.modelId || currentMenu.moduleId;
        }
        return Object.assign(baseData, initData, getBrowserInfo());
    };
    // 获取站点环境
    const getEnvType = () => {
        const { host = {} } = window.configs || {};
        const { monitorHost = '' } = host;
        if (monitorHost) {
            if (monitorHost.indexOf(`${location.protocol}//`) >= 0) {
                return monitorHost;
            }
            return `${location.protocol}${monitorHost.slice(monitorHost.indexOf(':') + 1)}`;
        }
    };
    /**
     * @desc 发送页面加载性能数据
     */
    const sendPerformance = () => {
        const performance =window.performance;
        if (!performance) {
            return;
        }
        const t = performance.timing;
        const obj = {};
        obj.http = t.responseEnd - t.navigationStart;
        obj.ws = t.domContentLoadedEventStart - t.navigationStart;
        obj.onload = t.domContentLoadedEventEnd - t.navigationStart;
        sendData({
            actionTime: getTime(),
            actionType: TYPE_PERFORMANCE, // 页面性能
            ...obj,
            info: '页面初次记载性能数据',
        });
    };
    /**
     * @desc 发送页面切换数据
     * @param {object} pageData 下一页面数据
     * @param {object} prePageData 上一页面数据
     */
    const sendPageView = (pageData, prePageData) => {
        const { monitorConfig = {} } = window;
        const { menuVisit = true } = monitorConfig;
        if (!menuVisit) {
            return;
        }
        setMenu(pageData);
        sendData({
            itemId: pageData.moduleId,
            modelId: pageData.moduleId,
            actionTime: getTime(),
            actionType: TYPE_PAGE, // 页面跳转
            fromModelId: prePageData && prePageData.moduleId,
            fromPageName: prePageData && prePageData.fullName,
            fromPageUrl: prePageData && prePageData.urlAddress,
            info: `访问页面:${pageData.fullName}(${pageData.pathname || pageData.urlAddress})`,
        });
    };
    // 提交收集数据至后台
    const sendData = (data) => {
        if (!isStart) {
            return;
        }
        const _data = createCollectData(data);
        const envHost = getEnvType();
        if (!envHost) {
            return;
        }
        Remote.post(`${envHost}/api/Base`, _data).catch(() => {});
    };
    const setMenu = (menu) => {
        currentMenu = menu;
    };
    // 获取浏览器及用户计算机信息
    const getBrowserInfo = (function() {
        let browserInfo = null;
        return function() {
            if (!browserInfo) {
                browserInfo = {
                    browserName: getBrowserName(),
                    network: navigator.connection && navigator.connection.effectiveType,
                    browserInfo: navigator.userAgent,
                    browserVer: navigator.appVersion,
                    screenWidth: screen.width,
                    screenHeight: screen.height,
                    platform: navigator.platform,
                    devicePixelRatio: window.devicePixelRatio,
                };
            }
            return browserInfo;
        };
    })();
    const getBrowserName = () => {
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf("Opera") > -1) {
            return "Opera";
        }
        if (userAgent.indexOf("Firefox") > -1) {
            return "Firefox";
        }
        if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1) {
            return "Safari";
        }
        if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1) {
            return "Chrome";
        }
        const isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
        const isEdge = userAgent.indexOf("Edge") > -1;
        if (isIE) {
            const reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            const fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 8) {
                return "IE8";
            } else if (fIEVersion == 9) {
                return "IE9";
            } else if (fIEVersion == 10) {
                return "IE10";
            } else if (fIEVersion == 11) {
                return "IE11";
            }
            return "IE";
        }
        if (isEdge) {
            return "Edge";
        }
    };
    // 启动监控，完成初始化
    const start = (configs = {}) => {
        isStart = true;
        _configs = configs;
        let errorCatch = true;
        if (isObject(_configs) && Object.hasOwnProperty.call(_configs, 'errorCatch')) {
            errorCatch = _configs.errorCatch;
        }
        if (errorCatch) {
            injectErrorCatch();
        }
        injectUIEvent();
    };
    const stop = () => {
    };
    window.sendWebData = sendData;
    return {
        start,
        sendData,
        stop,
        setMenu,
        sendPageView,
        sendPerformance,
    };
})();

export default WebMonitor;