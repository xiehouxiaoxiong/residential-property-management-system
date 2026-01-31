const axios = require('../utils/axios')
module.exports={
	getPaymentInfo(userId,payStatus){
        return axios.get(`/payment/admin/payment/payList/${userId}`,{payStatus:payStatus},1)
	},
	deletePaymentInfo(id){
		return axios.delete(`/payment/admin/payment/${id}`,'',1)
	},
	updateMoney(userId,money){
		return axios.put(`/proprietor/admin/proprietor/${userId}`,{money:money},1)
	},
	updatePayment(id,data){
        return axios.put(`/payment/admin/payment/${id}`,data,1)
	},
	updateMoneyAll(userId,data){
		return axios.put(`/proprietor/admin/proprietor/${userId}`,data,1)
	},
	addPayment(data){
		return axios.post('/payment/admin/payment/addPayment',data,1)
	},
	getPayment(id){
		return axios.get(`/payment/admin/payment/${id}`,'',1)
	},
	
}