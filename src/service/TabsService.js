import Remote from '../utils/Remote';
import BaseService from './BaseService';

export default class TabsService extends BaseService {
    fetchFavsList() {
        return Remote.get(`${this.commonApi}/api/organize/usercollects`);
    }

    deleteFavs(id) {
        return Remote.delete(`${this.commonApi}/api/organize/usercollects/${id}`);
    }

    addFavs(favs) {
        return Remote.post(`${this.commonApi}/api/organize/usercollects`, favs);
    }
}
