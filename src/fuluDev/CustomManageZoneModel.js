export default {
    namespace: 'customManage',
    state: {
        list: [],
    },
    effects: {
        *fetchList({ payload }, { call, put }) {
            yield put({
                type: 'updateState',
                payload: {
                    list: [{ id: 1, name: 'a' }],
                }
            })
        }
    },
    reducers: {
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        }
    },
};
