import Remote from '../utils/Remote';
import BaseService from './BaseService';

export default class FLayoutService extends BaseService {
    auth(params) {
        // if (window.location.search.indexOf('appid=10000065')) {
        //     return Remote.get(`${this.passportApi.authCode}/api/authorization_code`, params);
        // }
        return Remote.post(`${this.passportApi.authCode}/api/authorization_code`, params);
    }

    fetchProjectList() {
        return Remote.get(`${this.apiHost}/api/Project/GetList`);
    }

    topProject(payload) {
        return Remote.post(`${this.apiHost}/api/Project/UpdateSortId`, payload);
    }

    fetchUserInfo() {
        return Remote.post(`${this.passportApi.getUserInfo}/api/passport/getuserinfo`);
    }
}
