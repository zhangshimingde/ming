
export default class BaseService {
    constructor() {
        this.host = window.configs.host;
        this.commonApi = this.host.common;
        this.passportApi = this.host.passport;
        this.webApi = this.host.webapi;
        this.apiHost = this.host.apiHost;
    }
}
