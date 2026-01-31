const axios = require('../utils/axios')
module.exports={
	getParkingId(parkingName,parkingNumber){
		return axios.get('/parkingInfo/admin/parkingInfo/getParkingNumber',{parkingName,parkingNumber},1)
	},
	getParkingNumber(parkingName){
        return axios.get('/parkingInfo/admin/parkingInfo/getParkingNumber',{parkingName},1)
	},
	getParkingInfoDetail(id){
		return axios.get(`/parkingInfo/admin/parkingInfo/${id}`,'',1)
	},
	updateParkingInfo(id,data){
		return axios.put(`/parkingInfo/admin/parkingInfo/${id}`,data,1)
	}
}