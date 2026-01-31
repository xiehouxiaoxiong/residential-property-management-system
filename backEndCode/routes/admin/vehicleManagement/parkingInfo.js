var express = require('express')
var connection = require('../../../server')
let {getParkingInfoDatabase} = require('../../../utils/admin/getParkingInfo')
var router = express.Router()


router.get('/admin/parkingInfo/list',async (req,res)=>{
    let pageSize = parseInt(req.query["pageSize"])||1
    
    let pageNum = parseInt(req.query["pageNum"])||1
 
    const { parkingName, parkingNumber, parkingStatus } = req.query
    if(isNaN(pageNum)||isNaN(pageSize)||pageSize<1||pageNum<1){
        res.send({
            status:400,
            body:'无效分页参数'
        })
    }
    const startIndex = (pageNum-1)*pageSize
   
    try{        
        await getParkingInfoDatabase(parkingName, parkingNumber, parkingStatus,startIndex,pageSize,res)  
    }catch(error){
        res.send({
            status:500,
            body:'Internal Server Error'
        })
    }
   
})
router.get('/admin/parkingInfo/getParkingNumber', async (req, res) => {
   
    const { parkingName,parkingNumber } = req.query
 
    let sqlStr = "select * from parkinginfo"
    let queryParams=[]
    if(parkingName||parkingNumber){
        sqlStr+=' where'
        if(parkingName){
            sqlStr+=' parkingName=?'
            queryParams.push(parkingName)
        }
        if(parkingNumber){
            if(parkingName){
                sqlStr+=' and'
            }
            sqlStr+=' parkingNumber=?'
            queryParams.push(parkingNumber)
        }

    }
    connection.query(sqlStr, queryParams, (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: result,
                message: '获得停车场id或车位号成功'
            })
        }
    })

})
router.get('/admin/parkingInfo/:id', async (req, res) => {
    let id = req.params.id
    let sqlStr = "select * from parkinginfo where id=?"
    connection.query(sqlStr, [id], (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: result[0],
                message: '获得停车场信息'
            })
        }
    })

})
router.put('/admin/parkingInfo/:id', async (req, res) => {
    let id = req.params.id
    let sqlStr = "update parkinginfo set parkingStatus=? where id=?"
    let {parkingStatus} = req.body
    
    connection.query(sqlStr, [parkingStatus,id], (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: result[0],
                message: '更新停车场信息'
            })
        }
    })

})
module.exports = router;