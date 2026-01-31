import request from '@/utils/httpNodejs'
export const AddVehicleInfo = (VehicleInfoItem) => {
    return request({
        url: '/vehicleInfo/admin/vehicleInfo',
        method: 'POST',
        data: VehicleInfoItem
    })
}
export const getVehicleInfoList = async (licenseNumber, carBrand, userName, pageSize, pageNum) => {
    return request({
        url: `/vehicleInfo/admin/vehicleInfo/list/?pageSize=${pageSize}&&pageNum=${pageNum}`,
        method: 'GET',
        params: {
            licenseNumber, carBrand, userName
        }
    })


}

export const VehicleInfoDetailById = (id) => {
    return request({
        url: `/vehicleInfo/admin/vehicleInfo/${id}`,
        method: 'GET',
    })


}


export const UpdateVehicleInfo = (id, formData) => {
    return request({
        url: `/vehicleInfo/admin/vehicleInfo/${id}`,
        method: 'PUT',
        data: formData
    })


}
export const deleteVehicleInfo = (id) => {
    return request({
        url: `/vehicleInfo/admin/vehicleInfo/${id}`,
        method: 'DELETE',
    })
}
