import Remote from '../utils/Remote';
import BaseService from './BaseService';

export default class BasicInfoService extends BaseService {
    modifyUserinfo(params) {
        return Remote.put(`${this.commonApi}/api/BaseSystem/BaseUser/modifyUserinfo`, params);
    }

    modifyPassword(params) {
        return Remote.post(`${this.passportApi.getUserInfo}/api/passport/changepwd`, params);
    }
}
