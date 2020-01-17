import axios from '../utils/axios';

// 列表
export function usePageGetList(params) {
    return axios.get(`http://dev.sup-admin.k8s.ichnb.com/api/admin/product/GetProductPageList`, { params });
}
// 详情
export function usePageDetail(params) {
    return axios.get(`http://dev.sup-admin.k8s.ichnb.com/api/admin/product/GetProductDetail`, { params });
}

// 启用禁用
export function usePageEnable(params) {
    return axios.put(`http://dev.sup-admin.k8s.ichnb.com/api/AutoAuditProduct/DeleteEnable`, { params });
}

// 删除
export function usePageDelete(params) {
    return axios.delete(`http://dev.sup-admin.k8s.ichnb.com/api/admin/product/GetProductPageList`, { params });
}

// 新建
export function usePageAdd(params) {
    return axios.post(`http://dev.sup-admin.k8s.ichnb.com/api/admin/product/productAdd`, params);
}

// 编辑
export function usePageEdit(params) {
    return axios.put(`http://dev.sup-admin.k8s.ichnb.com/api/admin/product/productAdd`, { params });
}
