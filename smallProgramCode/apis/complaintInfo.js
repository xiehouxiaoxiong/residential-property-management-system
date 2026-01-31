const axios = require('../utils/axios')
module.exports={
	addComplaintInfo(data){
		return axios.post('/ComplaintInfo/admin/ComplaintInfo',data,1)
	},
	getComplaintList(userId,complaintStatus){
		return axios.get('/ComplaintInfo/admin/ComplaintInfo/list',{userId:userId,complaintStatus:complaintStatus},1)
	},
	deleteComplaintInfo(id){
		return axios.delete(`/ComplaintInfo/admin/ComplaintInfo/${id}`,'',1)
	}
}