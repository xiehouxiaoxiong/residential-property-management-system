var express = require('express')
var connection = require('../../server')
let {getProprietorDatabase} = require('../../utils/admin/getProprietor')
var router = express.Router()
router.post('/admin/proprietor',(req,res)=>{
    let sqlStr = 'insert into propietor(userName,sex,phoneNumber,parkingArrearage,wuyeArrearage) value(?,?,?,?,?)'
    const { userName, sex, phoneNumber, parkingArrearage, wuyeArrearage } = req.body
    connection.query(sqlStr, [userName, sex, phoneNumber, parkingArrearage, wuyeArrearage],(error,result)=>{
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
router.get('/admin/proprietor/list',async (req,res)=>{
    let pageSize = parseInt(req.query["pageSize"])||1
  
    let pageNum = parseInt(req.query["pageNum"])||1

    const {userName,sex} = req.query
    if(isNaN(pageNum)||isNaN(pageSize)||pageSize<1||pageNum<1){
        res.send({
            status:400,
            body:'无效分页参数'
        })
    }
    const startIndex = (pageNum-1)*pageSize

    try{
        await getProprietorDatabase(userName,sex,startIndex,pageSize,res)            
    }catch(error){
        res.send({
            status:500,
            body:'Internal Server Error'
        })
    }
   
})
router.get('/admin/proprietor/:id',(req,res)=>{
   let sqlStr = 'select * from propietor where id=?'
   let id = req.params.id
   connection.query(sqlStr,[id],(error,result)=>{
    if(error){
      res.send(error)
    }else{
      
     res.send({
        status:200,
        data:result[0],
        message:'获得业主信息成功'
     })
    }
   })
})
router.get('/admin/proprietor/userInfo/:userId', (req, res) => {
    let sqlStr = 'select * from propietor where userId=?'
    let userId = req.params.userId
    connection.query(sqlStr, [userId], (error, result) => {
        if (error) {
            res.send(error)
        } else {
        
            res.send({
                status: 200,
                data: result[0],
                message: '获得业主信息成功'
            })
        }
    })
})
router.put('/admin/proprietor/:userId',(req,res)=>{
    let userId = req.params.userId
    let {userName,sex,phoneNumber,parkingArrearage,wuyeArrearage,money} = req.body
    console.log(userName, sex, phoneNumber, parkingArrearage, wuyeArrearage, money)
    let sqlStr = "update propietor set parkingArrearage=?,wuyeArrearage=?,money=?"
    let queryParams = []
    queryParams.push(parkingArrearage, wuyeArrearage, money)
    
    if (userName || sex || phoneNumber) {
        if (userName) {
            sqlStr += ',userName=?'
            queryParams.push(userName)
        }
        if (sex) {
            if (userName) {
                sqlStr += ','
            }
            sqlStr += ' sex=?'
            queryParams.push(sex)
        }
        if (phoneNumber) {
            if (userName || sex) {
                sqlStr += ','
            }
            sqlStr += ' phoneNumber=?'
            queryParams.push(phoneNumber)
        }
        
    }
    /* if (userName||sex|| phoneNumber||parkingArrearage|| wuyeArrearage|| money){
        if (userName){
            sqlStr+=' userName=?'
            queryParams.push(userName)
        }
        if(sex){
            if(userName){
                sqlStr+=','
            }
            sqlStr += ' sex=?'
            queryParams.push(sex)
        }
        if(phoneNumber){
            if (userName||sex) {
                sqlStr += ','
            }
            sqlStr += ' phoneNumber=?'
            queryParams.push(phoneNumber)
        }
        if(parkingArrearage){
            if (userName || sex || phoneNumber) {
                sqlStr += ','
            }
            sqlStr += ' parkingArrearage=?'
            queryParams.push(parkingArrearage)
        }
        if(wuyeArrearage){
            if (userName || sex || phoneNumber || parkingArrearage) {
                sqlStr += ','
            }
            sqlStr += ' wuyeArrearage=?'
            queryParams.push(wuyeArrearage)
        }
        if(money){
            if (userName || sex || phoneNumber || parkingArrearage || wuyeArrearage) {
                sqlStr += ','
            }
            sqlStr += ' money=?'
            queryParams.push(money)
        }
    } */
    sqlStr +=' where userId=?'
    queryParams.push(userId)
    connection.query(sqlStr,queryParams,(error,result)=>{
        if(error){
             res.send(error)
        }else{
           
             res.send({
                status:200,
                data:result[0],
                message:'更新业主信息成功'
             })
        }
    })
})

router.delete('/admin/proprietor/:id',(req,res)=>{
    let id = req.params.id
    let sqlStr = "delete from propietor where id=?"
    connection.query(sqlStr,id,(error,result)=>{
        if(error){
             res.send(error)
        }else{
            res.send({
                status:200,
                data:result,
                message:'删除业主信息成功'
            })
        }
    })
})
module.exports = router;