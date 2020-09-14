/**
 * @desc 导出按钮
 * @author zhangkegui@fulu.com
 * @date 2019-08-14
 * @version 1.0
 */
import React from 'react';
import { Button, message } from 'antd';
import './index.less';

class ExportButton extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        this.onClick = this.onClick.bind(this);
        this.onToggleLoading = this.onToggleLoading.bind(this);
    }
    concatExportUrl(url, params) {
        const formData = encodeURIComponent(Object.entries(params || {}).reduce((arr, item) => {
            arr.push(item.join('=')); return arr;
        }, []).join('&'));
        if (url.indexOf('?') > 0) {
            return `${url}&${formData}`;
        }
        return `${url}?${formData}`;
    }
    onToggleLoading() {
        this.setState({
            loading: !this.state.loading,
        });
    }
    onClick() {
        const { beforeClick } = this.props;
        const { loading } = this.state;
        if (loading) {
            return;
        }
        if (typeof beforeClick === 'function') { // 执行下载前的回调函数
            const validateResult = beforeClick();
            if (!validateResult) { // 校验回调返回false，停止执行
                return;
            }
        }
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            message.warn('获取token失败');
            return;
        }
        const { url, params = {}, method = 'POST', merchantId, fileName, fileType= 'xlsx' } = this.props;
        let exportFileName = fileName;
        let reponseFilename = ''; // 服务端返回的文件名
        const exportMethod = method.toUpperCase();
        if (!url) {
            message.warn('请配置导出接口地址');
            return;
        }
        const exportUrl = exportMethod === 'GET' ? this.concatExportUrl(url, params) : url;
        const xhr = new XMLHttpRequest();
        xhr.open(exportMethod, exportUrl, true);
        xhr.responseType = "blob";
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
        if (merchantId) {
            xhr.setRequestHeader('MerchantId', merchantId);
        } else if (localStorage.getItem('MerchantId')) {
            xhr.setRequestHeader('MerchantId', localStorage.getItem('MerchantId'));
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status !== 200) {
                    const blob = xhr.response;
                    if (Object.prototype.toString.call(blob) === '[object Blob]') {
                        const fileReader = new FileReader();
                        fileReader.readAsText(blob);
                        fileReader.onload = function (e) {
                            const { message } = JSON.parse(e.target.result);
                            message.error(message);
                        };
                    } else {
                        message.error(xhr.statusText || '网络错误，请求失败');
                    }
                    this.onToggleLoading();
                } else if (xhr.status === 200) {
                    const headers = xhr.getAllResponseHeaders();
                    const headersArr = headers.trim().split(/[\r\n]+/);
                    const headerMap = {};
                    headersArr.forEach(function (line) {
                        const parts = line.split(': ');
                        const header = parts.shift();
                        const value = parts.join(': ');
                        headerMap[header] = value;
                    });
                    if (Object.hasOwnProperty.call(headerMap, 'content-disposition')) {
                        const contentDisposition = headerMap['content-disposition'];
                        contentDisposition.split(';').forEach((item) => {
                            if (item.indexOf('filename') && item.indexOf('=')) {
                                reponseFilename = item.split('=')[1];
                            }
                        });
                        if (reponseFilename) {
                            reponseFilename = reponseFilename.indexOf("UTF-8''") >=0 ?
                                decodeURIComponent(reponseFilename.slice(reponseFilename.indexOf("UTF-8''") + 7)) : reponseFilename;
                        }
                    }
                    exportFileName = reponseFilename || `${exportFileName || Date.now()}.${fileType}`;
                    const blob = xhr.response;
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(blob);
                    fileReader.onload = (e) => {
                        const exportLink = document.createElement('a');
                        exportLink.style = 'visibility: hidden';
                        exportLink.download = exportFileName;
                        exportLink.href = e.target.result;
                        document.body.appendChild(exportLink);
                        exportLink.click();
                        document.body.removeChild(exportLink);
                        this.onToggleLoading();
                    }
                }
            }
        };
        xhr.send(exportMethod === 'POST' ? JSON.stringify(params) : null);
        this.onToggleLoading();
    }
    render() {
        const { loading } = this.state;
        const { merchantId, fileName, linkTag = false, ...rest } = this.props;
        if (linkTag) {
            return (
                <a {...rest} onClick={this.onClick}>
                    {this.props.children}
                </a>
            );
        }
        return (
            <Button {...rest} onClick={this.onClick} loading={loading}>
                {this.props.children}
            </Button>
        );
    }
}

export default ExportButton;