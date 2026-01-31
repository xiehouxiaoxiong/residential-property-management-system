const axios = require('../utils/axios')
module.exports={
	getNoticeInfoList(){
       return axios.get('/announcement/admin/public-announcement/list','',1)
	},
	getNewestNotice(sum){
		return axios.get(`/announcement/admin/public-announcement/newest/${sum}`,'',1)
	}
}