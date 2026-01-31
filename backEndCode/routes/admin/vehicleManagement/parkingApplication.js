var express = require('express')
var connection = require('../../../server')
let {getParkingApplicationDatabase} = require('../../../utils/admin/getParkingApplication')
var router = express.Router()


router.post('/admin/parkingApplication',(req,res)=>{
    let sqlStr = 'insert into parkingapplication(applicationUserName,applicationPhoneNumber,licenseNumber,parkingStartTime,parkingEndTime,auditResult,auditOpinion,userId,parkingId) value(?,?,?,?,?,?,?,?,?)'
    const { applicationUserName, applicationPhoneNumber,licenseNumber,parkingStartTime, parkingEndTime, auditResult, auditOpinion, userId, parkingId } = req.body
   
    connection.query(sqlStr, [applicationUserName, applicationPhoneNumber,licenseNumber,parkingStartTime, parkingEndTime, auditResult, auditOpinion, userId, parkingId],(error,result)=>{
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
router.get('/admin/parkingApplication/list',async (req,res)=>{
    let pageSize = parseInt(req.query["pageSize"])||10
  
    let pageNum = parseInt(req.query["pageNum"])||1
   
    
    const {userId,auditResult} = req.query
   
    if(isNaN(pageNum)||isNaN(pageSize)||pageSize<1||pageNum<1){
        res.send({
            status:400,
            body:'无效分页参数'
        })
    }
    const startIndex = (pageNum-1)*pageSize
   
    try{        
        await getParkingApplicationDatabase(userId, auditResult,startIndex,pageSize,res)  
    }catch(error){
        res.send({
            status:500,
            body:'Internal Server Error'
        })
    }
   
})
router.get('/admin/parkingApplication/:id',(req,res)=>{
    let sqlStr = 'SELECT parkingapplication.id as id,parkingStartTime,parkingEndTime,auditResult,auditOpinion,parkingName,parkingNumber,parkingId,userId FROM parkingapplication JOIN parkinginfo on parkingapplication.parkingId=parkinginfo.id where parkingapplication.id=?'
   let id = req.params.id
   connection.query(sqlStr,[id],(error,result)=>{
    if(error){
      res.send(error)
    }else{
       
     res.send({
        status:200,
        data:result[0],
        message:'获得车位申请信息成功'
     })
    }
   })
})
router.put('/admin/parkingApplication/:id',(req,res)=>{
    let id = req.params.id
    let { parkingStartTime, parkingEndTime, auditResult, auditTime, auditOpinion, userId, parkingId } = req.body
    console.log(parkingStartTime, parkingEndTime, auditResult, auditTime,auditOpinion, userId, parkingId);
    let queryParams = []
    let sqlStr = "update parkingapplication set"
    if (parkingStartTime || parkingEndTime || auditResult || auditOpinion || userId || parkingId || auditTime){
        if (parkingStartTime){
            sqlStr +=' parkingStartTime=?'
            queryParams.push(parkingStartTime)
        }
        if (parkingEndTime) {
            if (parkingStartTime){
               sqlStr+=','
            }
            sqlStr +=' parkingEndTime=?'
            queryParams.push(parkingEndTime)
        }
        if (auditResult) {
            if (parkingStartTime || parkingEndTime) {
                sqlStr += ','
            }
            sqlStr +=' auditResult=?'
            queryParams.push(auditResult)
        }

        if (auditOpinion) {
            if (parkingStartTime || parkingEndTime || auditResult) {
                sqlStr += ','
            }
            sqlStr +=' auditOpinion=?'
            queryParams.push(auditOpinion)
        }
        if (userId) {
            if (parkingStartTime || parkingEndTime || auditResult || auditOpinion) {
                sqlStr += ','
                
            }
            sqlStr +=' userId=?'
            queryParams.push(userId)
        }
        if (parkingId) {
            if (parkingStartTime || parkingEndTime || auditResult || auditOpinion || userId) {
                sqlStr += ','
            }
            sqlStr +=' parkingId=?'
            queryParams.push(parkingId)
        }
        if (auditTime) {
            if (parkingStartTime || parkingEndTime || auditResult || auditOpinion || userId || parkingId) {
                sqlStr += ','
            }
            sqlStr += ' auditTime=?'
            queryParams.push(auditTime)
        }
    }
    sqlStr +=' where id=?'
    queryParams.push(id)
    connection.query(sqlStr, queryParams,(error,result)=>{
        if(error){
             res.send(error)
        }else{
           
             res.send({
                status:200,
                data:result[0],
                message:'更新车位申请信息成功'
             })
        }
    })
})
router.delete('/admin/parkingApplication/:id',(req,res)=>{
    let id = req.params.id
    let sqlStr = "delete from parkingapplication where id=?"
    connection.query(sqlStr,id,(error,result)=>{
        if(error){
             res.send(error)
        }else{
            res.send({
                status:200,
                data:result,
                message:'删除车位申请信息成功'
            })
        }
    })
})
module.exports = router;