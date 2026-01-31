const axios = require('../utils/axios')
module.exports={
	loginEmployee(data){
		return axios.post('/employeeAccount/user/login',data,1)
	},	
	changePasswordEmployee(data){
		return axios.put(`/employeeAccount/user/modifyPwdByNumber`,data,1)
	},
	getEmployeeByNumber(number){
        return axios.get(`/employee/admin/employee/userInfoByNumber/${number}`,'',1)
	},
	updateEmployee(number,data){
		return axios.put(`/employee/admin/employee/updateProfile/${number}`,data,1)
	},
	
}