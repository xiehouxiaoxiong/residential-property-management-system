var express = require('express')
var connection = require('../../server')
let {getEmployDatabase} = require('../../utils/admin/getEmploy')

var router = express.Router()


router.post('/admin/employee',(req,res)=>{
    let sqlStr = 'insert into staff(avatar,number,userName,employeeType,sex,phoneNumber,address) value(?,?,?,?,?,?,?)'
    const {avatar,number,userName,employeeType,sex,phoneNumber,address} = req.body
    connection.query(sqlStr,[avatar,number,userName,employeeType,sex,phoneNumber,address],(error,result)=>{
           if(error){
             res.send(error)
           }else{
             res.send({
                status:200,
                data:{
                   
                },
                message:'新增成功'
             })
           }
           
    })
})
router.get('/admin/employee/allEmployeeId', (req, res) => {
    let sqlStr = 'select staff.number from staff'

    connection.query(sqlStr, (error, result) => {
       
  
        res.send({
            status: 200,
            data: {
                result
            }
        })
    })
   
})
router.get('/admin/employee/list',async (req,res)=>{
    let pageSize = parseInt(req.query["pageSize"])||1
    
    let pageNum = parseInt(req.query["pageNum"])||1
   
    const {userName,employeeType,sex} = req.query
    if(isNaN(pageNum)||isNaN(pageSize)||pageSize<1||pageNum<1){
        res.send({
            status:400,
            body:'无效分页参数'
        })
    }
    const startIndex = (pageNum-1)*pageSize
   
    try{        
           await getEmployDatabase(userName,employeeType,sex,startIndex,pageSize,res)  
    }catch(error){
        res.send({
            status:500,
            body:'Internal Server Error'
        })
    }
   
})
router.get('/admin/employee/:id',(req,res)=>{
   let sqlStr = 'select * from staff where id=?'
   let id = req.params.id
   connection.query(sqlStr,[id],(error,result)=>{
    if(error){
      res.send(error)
    }else{
      
     res.send({
        status:200,
        data:result[0],
        message:'获得员工信息成功'
     })
    }
   })
})
router.get('/admin/employee/userInfoByNumber/:number', (req, res) => {
    let sqlStr = 'select * from staff where number=?'
    let number = req.params.number
    connection.query(sqlStr, [number], (error, result) => {
        if (error) {
            res.send(error)
        } else  if(result.length>0){

            res.send({
                status: 200,
                data: result[0],
                message: '获得员工信息成功'
            })
        }else{
            res.send({
                status: 401,
                message: '没有该员工'
            })
        }
    })
})
router.put('/admin/employee/:id',(req,res)=>{
    let id = req.params.id
    let {avatar,userName,employeeType,sex,phoneNumber,address} = req.body
    
    let sqlStr = "update staff set userName=?,employeeType=?,sex=?,phoneNumber=?,address=?,avatar=? where id=?"
    
    connection.query(sqlStr,[userName,employeeType,sex,phoneNumber,address,avatar,id],(error,result)=>{
        if(error){
             res.send(error)
        }else{
           
             res.send({
                status:200,
                data:result[0],
                message:'更新员工信息成功'
             })
        }
    })
})

router.put('/admin/employee/updateProfile/:number', (req, res) => {
    let number = req.params.number
    let { avatar, userName, employeeType, sex, phoneNumber, address } = req.body
   
    let sqlStr = "update staff set userName=?,employeeType=?,sex=?,phoneNumber=?,address=?,avatar=? where number=?"

    connection.query(sqlStr, [userName, employeeType, sex, phoneNumber, address, avatar, number], (error, result) => {
        if (error) {
            res.send(error)
        } else {
    
            res.send({
                status: 200,
                data: result[0],
                message: '更新员工信息成功'
            })
        }
    })
})



router.delete('/admin/employee/:id',(req,res)=>{
    let id = req.params.id
    let sqlStr = "delete from staff where id=?"
    connection.query(sqlStr,id,(error,result)=>{
        if(error){
             res.send(error)
        }else{
            res.send({
                status:200,
                data:result,
                message:'删除员工信息成功'
            })
        }
    })
})
module.exports = router;