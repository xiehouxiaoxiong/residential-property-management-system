import request from '@/utils/httpNodejs.js'


export const getPaymentList = async (payType, userName, pageSize, pageNum) => {
    return request({
        url: `/payment/admin/payment/list/?pageSize=${pageSize}&&pageNum=${pageNum}`,
        method: 'GET',
        params: {
            payType,userName
        }
    })


}

export const getUserPayment =(userId)=>{
    return request({
        url: `/proprietor/admin/proprietor/userInfo/${userId}`,
        method:'GET'
    })
}

export const getUserPaymentByUserId = (userId,payType) => {
    return request({
        url: `/payment/admin/payment/payList/${userId}`,
        method: 'GET',
        params:{
            payType:payType
        }
    })
}

export const addPayment = (formData) => {
    return request({
        url: `/payment/admin/payment/addPayment`,
        method: 'POST',
        data: formData
    })


}
export const deletePayment = (id) => {
    return request({
        url: `/payment/admin/payment/${id}`,
        method: 'DELETE'
    })
}
export const updateAllMoney=(userId,data)=>{
    return request({
        url:`/proprietor/admin/proprietor/${userId}`,
        method:'PUT',
        data:data
    })
}
