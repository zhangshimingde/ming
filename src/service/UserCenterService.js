import Remote from '../utils/Remote';
import BaseService from './BaseService';

export default class UserCenterService extends BaseService {
    getUserInfo() {
        return Remote.get(`${this.commonApi}/api/organize/users/current`);
    }
}
