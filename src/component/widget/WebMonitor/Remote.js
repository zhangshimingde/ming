const timeout = 30000;

const handleException = (error, reject, xhr) => {
    reject(error);
    xhr = null;
};

const httpRequest = (url, data, method = 'get') => {
    let sendData = data;
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
        return;
    }
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method.toUpperCase(), url, true);
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
        if (typeof sendData !== 'undefined') {
            xhr.setRequestHeader('Content-type', 'application/json');
            sendData = JSON.stringify(sendData);
        }
        xhr.timeout = timeout;
        xhr.withCredentials = true;
        xhr.onreadystatechange = function handleLoad() {
            if (!xhr || xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 0 && !(xhr.responseURL && xhr.responseURL.indexOf('file:') === 0)) {
                return;
            }
            resolve(xhr.response);
            xhr = null;
        };
        xhr.onerror = function handleError(error) {
            handleException(error, reject, xhr);
        };
        xhr.ontimeout = function handleTimeout(error) {
            handleException(error, reject, xhr);
        };
        xhr.send(sendData);
    });
};

class Remote {
    static get(url, params) {
        return httpRequest(url, params);
    }
    static post(url, params) {
        return httpRequest(url, params, 'post');
    }
}

export default Remote;
