import request from '@/utils/httpNodejs'
export const AddParkingApplication = (ParkingApplicationItem) => {
    return request({
        url: '/ParkingApplication/admin/ParkingApplication',
        method: 'POST',
        data: ParkingApplicationItem
    })
}
export const getParkingApplicationList = async (userId, auditResult, pageSize, pageNum) => {
    return request({
        url: `/ParkingApplication/admin/ParkingApplication/list/?pageSize=${pageSize}&&pageNum=${pageNum}`,
        method: 'GET',
        params: {
            userId, auditResult
        }
    })


}

export const ParkingApplicationDetailById = (id) => {
    return request({
        url: `/ParkingApplication/admin/ParkingApplication/${id}`,
        method: 'GET',
    })


}

export const UpdateParkingApplication = (id, formData) => {
    return request({
        url: `/ParkingApplication/admin/ParkingApplication/${id}`,
        method: 'PUT',
        data: formData
    })


}

export const deleteParkingApplication = (id) => {
    return request({
        url: `/ParkingApplication/admin/ParkingApplication/${id}`,
        method: 'DELETE',
    })
}
