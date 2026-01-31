import request from '@/utils/httpNodejs'

export const getParkingInfoList = async (parkingName,parkingNumber,parkingStatus, pageSize, pageNum) => {
    return request({
        url: `/parkingInfo/admin/parkingInfo/list/?pageSize=${pageSize}&&pageNum=${pageNum}`,
        method: 'GET',
        params: {
            parkingName, parkingNumber, parkingStatus
        }
    })


}

export const updateParkingInfo = (id, parkingInfo) => {
    return request({
        url: `/parkingInfo/admin/parkingInfo/${id}`,
        method: 'PUT',
        data: parkingInfo
    })
}



