import request from '@/utils/httpNodejs.js'

export const loginAPI = async (userName,password) => {
    return request({
        url: "/sysUser/system/user",
        method: 'POST',
        data:{
            userName,password
        }

    })
}


export const updatePassword = ({password,userName})=>{
  return request({
    url:'/sysUser/system/user/modifyPwd',
    method:'PUT',
    data:{
      password,
      userName
    
    }
  })
}

export const resetPassword = ( userId) => {
    return request({
        url: '/sysUser/system/user/resetPwd',
        method: 'PUT',
        data: {
           userId

        }
    })
}

export const UpdateUser = (id,formData)=>{
    return request({
        url:`/sysUser/system/user/${id}`,
        method:'PUT',
        data:formData
    })
   

}

export const UserDetailById = (id)=>{
    return request({
        url:`/sysUser/system/user/${id}`,
        method:'GET',
    })
   

}


export const getUserInfoList = async (userId,sex,pageSize,pageNum)=>{
    return request({
        url:`/sysUser/system/user/list/?pageSize=${pageSize}&&pageNum=${pageNum}`,
        method:'GET',
        params:{
            userId,sex
        }
    })
}

export const deleteUser = (id)=>{
    return request({
        url:`/sysUser/system/user/deleteUser/?id=${id}`,
        method:'DELETE'
    })
}

export const addUser = (formData) => {
    return request({
        url: "/sysUser/system/user/addUser",
        method: 'POST',
        data:formData
    })
}