import request from '@/utils/httpNodejs'
export const AddAbsence = (AbsenceItem) => {
    return request({
        url: '/absenceInfo/admin/absenceInfo',
        method: 'POST',
        data: AbsenceItem
    })
}
export const getAbsenceList = async (userName, number, pageSize, pageNum) => {
    return request({
        url: `/absenceInfo/admin/absenceInfo/list/?pageSize=${pageSize}&&pageNum=${pageNum}`,
        method: 'GET',
        params: {
            userName, number
        }
    })


}

export const AbsenceDetailById = (id) => {
    return request({
        url: `/absenceInfo/admin/absenceInfo/${id}`,
        method: 'GET',
    })


}


export const updateAbsence = (id, formData) => {
    return request({
        url: `/absenceInfo/admin/absenceInfo/${id}`,
        method: 'PUT',
        data: formData
    })


}

export const deleteAbsence = (id) => {
    return request({
        url: `/absenceInfo/admin/absenceInfo/${id}`,
        method: 'DELETE',
    })
}
