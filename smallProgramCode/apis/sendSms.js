const axios = require('./../utils/axios')
module.exports={

	sendSms(tele){
		return axios.post('/sendSms/yzm',{tele:tele},1)
	},

	sendSmsRonglianyun(tele){
		return axios.post('/sendSmsRonglianyun/ronglianyun',{telephone:tele},1)
	}
}