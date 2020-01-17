import { message } from 'antd';
import authBtn from '../service/PublicLayoutService';

export default {
    namespace: 'publicLayout',
    state: {
        menus: [],
    },
    effects: {
        * setCurrentMenu(action, { call, put }) {
            const menu = action.payload || {};
            yield put({
                type: 'updateState',
                payload: {
                    currentMenu: menu,
                    authBtns: [],
                },
            });
            if (menu.moduleId) {
                const res = yield call(authBtn, { moduleid: menu.moduleId });
                if (res.code !== '0' || !res.data) {
                    return message.error(res.message || '获取页面按钮权限失败');
                }
                yield put({
                    type: 'updateState',
                    payload: {
                        authBtns: res.data.list || [],
                    },
                });
            } else {
                yield put({
                    type: 'updateState',
                    payload: {
                        authBtns: [],
                    },
                });
            }
            return true;
        },
        * setAppMenus({ payload }, { put }) {
            yield put({
                type: 'updateState',
                payload,
            });
        },
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        },
        getUserinfo(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
