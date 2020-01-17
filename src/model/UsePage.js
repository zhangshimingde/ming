import * as UsePageService from '../service/UsePageService';

export default {
    namespace: 'usePage',
    state: {},
    effects: {
        * usePageAdd({ payload }, { call, put }) {
            const result = yield call(UsePageService.usePageAdd, payload);
            yield put({
                type: 'success',
                payload: {
                    usePageAddResult: result,
                },
            });
            return result;
        },
        * usePageDetail({ payload }, { call, put }) {
            const result = yield call(UsePageService.usePageDetail, payload);
            yield put({
                type: 'success',
                payload: {
                    usePageDetailResult: result,
                },
            });
            return result;
        },
        * usePageEdit({ payload }, { call, put }) {
            const result = yield call(UsePageService.usePageEdit, payload);
            yield put({
                type: 'success',
                payload: {
                    usePageEditResult: result,
                },
            });
            return result;
        },
        * usePageGetList({ payload }, { call, put }) {
            const result = yield call(UsePageService.usePageGetList, payload);
            yield put({
                type: 'success',
                payload: {
                    usePageGetListResult: result,
                },
            });
            return result;
        },
        * usePageEnable({ payload }, { call, put }) {
            const result = yield call(UsePageService.usePageEnable, payload);
            yield put({
                type: 'success',
                payload: {
                    usePageEnableResult: result,
                },
            });
            return result;
        },
        * usePageDelete({ payload }, { call, put }) {
            const result = yield call(UsePageService.usePageDelete, payload);
            yield put({
                type: 'success',
                payload: {
                    usePageDeleteResult: result,
                },
            });
            return result;
        },
    },
    reducers: {
        success(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
