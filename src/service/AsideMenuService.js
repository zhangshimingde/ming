import Remote from '../utils/Remote';
import BaseService from './BaseService';

export default class AsideMenuService extends BaseService {
    fetchAppList(params = {}) {
        return Remote.get(`${this.webApi}/api/Apps`, params);
    }

    fetchMenuList() {
        return Remote.get(`${this.commonApi}/api/Module/modules/getauthlist`);
    }

    fetchCompanyList() {
        return Remote.get(`${this.commonApi}/api/organize/organizes/nameandidlist`);
    }

    fetchFavsList() {
        return Remote.get(`${this.commonApi}/api/organize/usercollects`);
    }

    switchCompany(id) {
        return Remote.put(`${this.commonApi}/api/organize/users/SwitchOrganize/${id}`);
    }
}
