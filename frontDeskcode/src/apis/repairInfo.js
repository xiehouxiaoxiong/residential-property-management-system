import request from '@/utils/httpNodejs.js'


export const getRepairInfoList = async (userId, auditStatus, repairProgress, pageSize, pageNum) => {
    return request({
        url: `/repairInfo/admin/repairInfo/list/?pageSize=${pageSize}&&pageNum=${pageNum}`,
        method: 'GET',
        params: {
            userId, auditStatus, repairProgress
        }
    })


}
export const RepairInfoDetailById = (id) => {
    return request({
        url: `/repairInfo/admin/repairInfo/${id}`,
        method: 'GET'
    })
}
export const UpdateRepairInfo = (id, formdata) => {
    return request({
        url: `/repairInfo/admin/repairInfo/${id}`,
        method: 'PUT',
        data: formdata
    })
}
export const deleteRepairInfo = (id) => {
    return request({
        url: `/repairInfo/admin/repairInfo/${id}`,
        method: 'DELETE'
    })
}