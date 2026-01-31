const axios=require("../utils/axios")
module.exports={
	uploadImg(img){
		console.log(img);
		return axios.post('/imageG/uploadG',img,2)
	}
}