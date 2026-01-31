import request from '@/utils/httpNodejs.js'
export const Addannouncenment = (announcementItem)=>{
    return request({
         url:'/announcement/admin/public-announcement',
         method:'POST',
         data:announcementItem
    })
}

export const getAnnouncenmentList = async(title,announcementType,announcementStatus,releaseTime,pageSize,pageNum)=>{
    return request({
        url:`/announcement/admin/public-announcement/list/?pageSize=${pageSize}&&pageNum=${pageNum}`,
        method:'GET',
        params:{
          title,announcementType,announcementStatus,
          releaseTime
        }
    })
   

}
export const announcenmentDetail = (id)=>{
    return request({
         url:`/announcement/admin/public-announcement/${id}`,
         method:'GET'
    })
}
export const updateAnnouncenment = (id,formdata)=>{
    return request({
         url:`/announcement/admin/public-announcement/${id}`,
         method:'PUT',
         data:formdata
    })
}
export const deleteAnnouncenment = (id)=>{
    return request({
         url:`/announcement/admin/public-announcement/${id}`,
         method:'DELETE'
    })
}