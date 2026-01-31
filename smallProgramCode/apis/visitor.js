const axios = require('../utils/axios')
module.exports={
	getVisitor(){
		return axios.get('/visitorInfo/admin/visitorInfo/list','',1)
	},
	addvisitorInfo(data){
		return axios.post('/visitorInfo/admin/visitorInfo',data,1)
	},
	deleteVisitorInfo(id){
		return axios.delete(`/visitorInfo/admin/visitorInfo/${id}`,'',1)
	}
}