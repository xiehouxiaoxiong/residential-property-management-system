import request from '@/utils/httpNodejs.js'


export const getVisitorInfoList = async (userName, pageSize, pageNum) => {
    return request({
        url: `/visitorInfo/admin/visitorInfo/list/?pageSize=${pageSize}&&pageNum=${pageNum}`,
        method: 'GET',
        params: {
           userName
        }
    })


}
export const VisitorInfoDetailById = (id) => {
    return request({
        url: `/visitorInfo/admin/visitorInfo/${id}`,
        method: 'GET'
    })
}
export const UpdateVisitorInfo = (id, formdata) => {
    return request({
        url: `/visitorInfo/admin/visitorInfo/${id}`,
        method: 'PUT',
        data: formdata
    })
}
export const deleteVisitorInfo = (id) => {
    return request({
        url: `/visitorInfo/admin/visitorInfo/${id}`,
        method: 'DELETE'
    })
}
export const AddVisitorInfo = (visitorInfoItem) => {
    return request({
        url: '/visitorInfo/admin/visitorInfo',
        method: 'POST',
        data: visitorInfoItem
    })
}