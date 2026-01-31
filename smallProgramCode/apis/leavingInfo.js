const axios = require('../utils/axios')
module.exports={
	addleavingInfo(data){
		return axios.post('/leaveInfo/admin/leaveInfo',data,1)
	},
	updateLeaving(number,data){
		return axios.put(`/leaveInfo/admin/leaveInfo/${number}`,data,1)
	},
	getLeaving(number){
		return axios.get(`/leaveInfo/admin/leaveInfo/${number}`,'',1)
	},
	getLeavingList(data){
		return axios.get("/leaveInfo/admin/leaveInfo/list",data,1)
	}
}