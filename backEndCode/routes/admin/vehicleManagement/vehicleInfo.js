var express = require('express')
var connection = require('../../../server')
let {getVehicleInfoDatabase} = require('../../../utils/admin/getVehicleInfo')
var router = express.Router()


router.post('/admin/vehicleInfo',(req,res)=>{
    let sqlStr = 'insert into vehicleinfo(carColor,licenseNumber,carType,carBrand,carPicture,userId,drivingLicense) value(?,?,?,?,?,?,?)'
   
    const { carColor, licenseNumber, carType, carBrand, carPicture, userId, drivingLicense } = req.body
    console.log(carColor, licenseNumber, carType, carBrand, carPicture, userId, drivingLicense);
    connection.query(sqlStr, [carColor, licenseNumber, carType, carBrand, carPicture, userId, drivingLicense],(error,result)=>{
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
router.get('/admin/vehicleInfo/list',async (req,res)=>{
    let pageSize = parseInt(req.query["pageSize"])||1
  
    let pageNum = parseInt(req.query["pageNum"])||1
   
    const { licenseNumber, carBrand, userName } = req.query
    console.log("licenseNumber, carBrand, userName");
    console.log(licenseNumber, carBrand, userName);
    if(isNaN(pageNum)||isNaN(pageSize)||pageSize<1||pageNum<1){
        res.send({
            status:400,
            body:'无效分页参数'
        })
    }
    const startIndex = (pageNum-1)*pageSize
    try{        
        await getVehicleInfoDatabase(licenseNumber, carBrand, userName,startIndex,pageSize,res)  
    }catch(error){
        res.send({
            status:500,
            body:'Internal Server Error'
        })
    }
   
})
router.get('/admin/vehicleInfo/:id',(req,res)=>{
   let sqlStr = 'select * from vehicleinfo where id=?'
   let id = req.params.id
   connection.query(sqlStr,[id],(error,result)=>{
    if(error){
      res.send(error)
    }else{
       
     res.send({
        status:200,
        data:result[0],
        message:'获得车辆信息成功'
     })
    }
   })
})
router.get('/admin/vehicleInfo/vehicleInfo/:licenseNumber', (req, res) => {
    let sqlStr = 'select * from vehicleinfo where licenseNumber=?'
    let licenseNumber = req.params.licenseNumber
    connection.query(sqlStr, [licenseNumber], (error, result) => {
        if (error) {
            res.send(error)
        } else {
           
            res.send({
                status: 200,
                data: result[0],
                message: '获得车辆信息成功'
            })
        }
    })
})

router.get('/admin/vehicleInfo/licenseNumber/:userId', (req, res) => {
    let sqlStr = 'select * from vehicleinfo where userId=?'
    let id = req.params.userId
   
    connection.query(sqlStr, [id], (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: result,
                message: '获得业主所有车辆信息成功'
            })
        }
    })
})
router.put('/admin/vehicleInfo/:id',(req,res)=>{
    let id = req.params.id
    let { carColor, licenseNumber, carType, carBrand ,userId} = req.body
    
    let sqlStr = "update vehicleinfo set carColor=?,licenseNumber=?,carType=?,carBrand=?,carPicture=?,userId=? where id=?"
    
    connection.query(sqlStr, [carColor, licenseNumber, carType, carBrand,carPicture, userId,id],(error,result)=>{
        if(error){
             res.send(error)
        }else{
           
             res.send({
                status:200,
                data:result[0],
                message:'更新车辆信息成功'
             })
        }
    })
})
router.delete('/admin/vehicleInfo/:id',(req,res)=>{
    let id = req.params.id
    let sqlStr = "delete from vehicleinfo where id=?"
    connection.query(sqlStr,id,(error,result)=>{
        if(error){
             res.send(error)
        }else{
            res.send({
                status:200,
                data:result,
                message:'删除车辆信息成功'
            })
        }
    })
})
module.exports = router;