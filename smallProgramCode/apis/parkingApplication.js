const axios = require('../utils/axios')
module.exports={
	addParkingApplication(data){
		return axios.post('/parkingApplication/admin/parkingApplication',data,1)
	},
	getParkingApplcation(userId,complaintStatus){
		return axios.get('/parkingApplication/admin/parkingApplication/list',{userId:userId,complaintStatus:complaintStatus},1)
	},
	updateParkingApplicationOne(id,data){
		return axios.put(`/parkingApplication/admin/parkingApplication/${id}`,data,1)
	},
	getParkingApplcationOne(id){
		return axios.get(`/parkingApplication/admin/parkingApplication/${id}`,'',1)
	}
}