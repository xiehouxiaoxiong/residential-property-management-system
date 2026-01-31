const axios = require('../utils/axios')
module.exports={
	addVehicleInfo(data){
		return axios.post('/vehicleInfo/admin/vehicleInfo',data,1)
	},
	getAllCarLicenseNumber(userId){
		return axios.get(`/vehicleInfo/admin/vehicleInfo/licenseNumber/${userId}`,'',1)
	},
	getVehicleInfoDetail(id){
		return axios.get(`/vehicleInfo/admin/vehicleInfo/${id}`,'',1)
	},
	
    getVehicleInfoLicenseNumberDetail(licenseNumber){
		return axios.get(`/vehicleInfo/admin/vehicleInfo/vehicleInfo/${licenseNumber}`,'',1)
	},
	deleteVehicleInfo(id){
       return axios.delete(`/vehicleInfo/admin/vehicleInfo/${id}`,'',1)
	}
}