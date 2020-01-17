import Remote from '../utils/Remote';
import BaseService from './BaseService';

export default class CustomSettingService extends BaseService {
    updateSetting(appId, isShow) {
        return Remote.put(`${this.webApi}/api/Apps/${appId}/${isShow}`);
    }
}
