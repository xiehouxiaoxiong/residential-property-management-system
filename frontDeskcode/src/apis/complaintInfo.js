import request from '@/utils/httpNodejs.js'
export const AddComplaintInfo = (ComplaintInfoItem) => {
    return request({
        url: '/ComplaintInfo/admin/ComplaintInfo',
        method: 'POST',
        data: ComplaintInfoItem
    })
}

export const getComplaintInfoList = async (userName, complaintStatus, complaintType, pageSize, pageNum) => {
    return request({
        url: `/ComplaintInfo/admin/ComplaintInfo/list/?pageSize=${pageSize}&&pageNum=${pageNum}`,
        method: 'GET',
        params: {
            userName, complaintStatus, complaintType
        }
    })


}
export const ComplaintInfoDetail = (id) => {
    return request({
        url: `/ComplaintInfo/admin/ComplaintInfo/${id}`,
        method: 'GET'
    })
}
export const UpdateComplaintInfo = (id, formdata) => {
    return request({
        url: `/ComplaintInfo/admin/ComplaintInfo/${id}`,
        method: 'PUT',
        data: formdata
    })
}
export const deleteComplaintInfo = (id) => {
    return request({
        url: `/ComplaintInfo/admin/ComplaintInfo/${id}`,
        method: 'DELETE'
    })
}