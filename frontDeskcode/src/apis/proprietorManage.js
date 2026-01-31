import request from '@/utils/httpNodejs'
export const AddProprietor = (ProprietorItem)=>{
    return request({
        url:'/proprietor/admin/proprietor',
        method:'POST',
        data:ProprietorItem
    })
}
export const getProprietorList = async(userName,sex,pageSize,pageNum)=>{
    return request({
        url:`/proprietor/admin/proprietor/list/?pageSize=${pageSize}&&pageNum=${pageNum}`,
        method:'GET',
        params:{
            userName,sex
        }
    })
   

}

export const ProprietorDetailById = (id)=>{
    return request({
        url:`/proprietor/admin/proprietor/${id}`,
        method:'GET',
    })
   

}

export const ProprietorDetailByProprietorName = ({userName})=>{
    return request({
        url:`/proprietor/admin/proprietor/username/${userName}`,
        method:'GET',
    })
   

}

export const UpdateProprietor = (id,formData)=>{
    return request({
        url:`/proprietor/admin/proprietor/${id}`,
        method:'PUT',
        data:formData
    })
   

}

export const deleteProprietor = (id)=>{
     return request({
        url:`/proprietor/admin/proprietor/${id}`,
        method:'DELETE',
     })
}
