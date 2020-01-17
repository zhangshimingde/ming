/**
 * 是否是占位的假数据
 * @param {*} data 
 */
const isFakeData = (data) => {
    return !!data.isFake;
}
const isFunction = (f) => {
    return typeof f === 'function';
}

const compose = (...fns) => {
    return fns.reduce((a, b) => {
        return (...args) => {
            return a(b(...args));
        }
    });
};

/**
 * @desc 判断行是否正在编辑
 * @param {*} record 
 */
const isEditing = function(record) {
    const { rowKey } = this.props;
    if (this.state.editingKey && record && rowKey) {
        const editKey = isFunction(rowKey) ? rowKey(record) : record[rowKey];
        return editKey === this.state.editingKey && !isFakeData(record);
    }
    return false;
};

export {
    isFakeData,
    isEditing,
    isFunction,
    compose,
};