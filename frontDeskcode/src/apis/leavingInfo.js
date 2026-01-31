import request from '@/utils/httpNodejs'
export const AddLeaveInfo = (LeaveInfoItem) => {
    return request({
        url: '/leaveInfo/admin/leaveInfo',
        method: 'POST',
        data: LeaveInfoItem
    })
}
export const getLeaveInfoList = async (userName, number, leavingStatus, pageSize, pageNum) => {
    return request({
        url: `/leaveInfo/admin/leaveInfo/list/?pageSize=${pageSize}&&pageNum=${pageNum}`,
        method: 'GET',
        params: {
            userName, number, leavingStatus
        }
    })


}
//by id
export const leaveInfoDetailById = (id) => {
    return request({
        url: `/leaveInfo/admin/leaveInfo/${id}`,
        method: 'GET',
    })


}

//更新
export const updateLeaveInfo = (id, formData) => {
    return request({
        url: `/leaveInfo/admin/leaveInfo/${id}`,
        method: 'PUT',
        data: formData
    })


}
//删除
export const deleteLeaveInfo = (id) => {
    return request({
        url: `/leaveInfo/admin/leaveInfo/${id}`,
        method: 'DELETE',
    })
}
