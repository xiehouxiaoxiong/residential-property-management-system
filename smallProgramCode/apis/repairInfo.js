const axios=require("../utils/axios")
module.exports={

  addRepairInfo(data){
	  console.log(data);
    return axios.post('/repairInfo/admin/repairInfo',data,1)
  },
  updateRepairInfo(id,data){
	  return axios.put(`/repairInfo/admin/repairInfo/${id}`,data,1)
  },
  getRepairInfoList(data){
    return axios.get('/repairInfo/admin/repairInfo/list',data,1)
  },
  getRepairInfoDetail(id){
    return axios.get(`/repairInfo/admin/repairInfo/${id}`,'',1)
  }
 
}
