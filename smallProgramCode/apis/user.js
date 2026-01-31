const axios=require("../utils/axios")
module.exports={
  loginApi(data){
	  console.log(data);
    return axios.post('/userInfo/user/login',data,1)
  },
  updateProfile(userId,data){
	  return axios.put(`/userInfo/user/${userId}`,data,1)
  },
  getUserInfoDetail(userId){
    return axios.get(`/proprietor/admin/proprietor/userInfo/${userId}`,'',1)
  },
  updatePwdByUserId(data){
    return axios.put('/userInfo/user/modifyPwdByUserId',data,1)
  },
  updatePwdByPhoneNumber(data){
    return axios.put('/userInfo/user/modifyPwdByPhoneNumber',data,1)
  },
  registerApi(data){
     return axios.post('/userInfo/user/register',data,1)
  },
  isAreadyRegister(tele){
    return axios.get(`/userInfo/user/isRegister/${tele}`,'',1)
  }
}
