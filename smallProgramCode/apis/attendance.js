const axios = require('../utils/axios')
module.exports={
	addAttendance(data){
		return axios.post('/absenceInfo/admin/absenceInfo',data,1)
	},
	updateAttendance(number,data){
		return axios.put(`/absenceInfo/admin/absenceInfo/${number}`,data,1)
	},
	getAttendance(number){
		return axios.get(`/absenceInfo/admin/absenceInfo/${number}`,'',1)
	}
}