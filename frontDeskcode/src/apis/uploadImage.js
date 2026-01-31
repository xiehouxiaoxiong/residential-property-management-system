import request from '@/utils/httpNodejs.js'


export const uploadOne = (formdata)=>{
    return request({
        url:`/image/upload`,
        method:'POST',
        headers:{
           "Content-Type":"multipart/form-data"
        },
        data:formdata,
        async:false

    })
}

export const uploadG = (formdata)=>{
    return request({
        url: `/imageG/uploadG`,
        method: 'POST',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: formdata,
        async: false

    })
}