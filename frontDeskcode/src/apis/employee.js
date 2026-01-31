import request from '@/utils/httpNodejs.js'
export const AddEmployee = (announcementItem)=>{
    return request({
         url:'/employee/admin/employee',
         method:'POST',
         data:announcementItem
    })
}

export const getEmployeeList = async(userName,employeeType,sex,pageSize,pageNum)=>{
    return request({
        url:`/employee/admin/employee/list/?pageSize=${pageSize}&&pageNum=${pageNum}`,
        method:'GET',
        params:{
          userName,employeeType,sex
        }
    })
   

}
export const getEmployeeNumberList = async () => {
    return request({
        url: '/employee/admin/employee/allEmployeeId',
        method: 'GET'
    })


}
export const EmployeeDetail = (id)=>{
    return request({
         url:`/employee/admin/employee/${id}`,
         method:'GET'
    })
}
export const updateEmployee = (id,formdata)=>{
    return request({
         url:`/employee/admin/employee/${id}`,
         method:'PUT',
         data:formdata
    })
}
export const deleteEmployee = (id)=>{
    return request({
         url:`/employee/admin/employee/${id}`,
         method:'DELETE'
    })
}