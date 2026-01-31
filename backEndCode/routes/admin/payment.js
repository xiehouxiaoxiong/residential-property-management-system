var express = require('express')
var connection = require('../../server')
let { getPaymentDatabase, getPaymentUserIdDatabase } = require('../../utils/admin/getPayment')
var router = express.Router()



router.get('/admin/payment/list', async (req, res) => {
    let pageSize = parseInt(req.query["pageSize"]) || 15
   
    let pageNum = parseInt(req.query["pageNum"]) || 1

    const { payType, userName } = req.query
    const payStatus = '已完成'
    if (isNaN(pageNum) || isNaN(pageSize) || pageSize < 1 || pageNum < 1) {
        res.send({
            status: 400,
            body: '无效分页参数'
        })
    }
    const startIndex = (pageNum - 1) * pageSize
   
    try {
        await getPaymentDatabase(payType, userName,payStatus,startIndex, pageSize, res)
    } catch (error) {
        res.send({
            status: 500,
            body: 'Internal Server Error'
        })
    }

})
router.get('/admin/payment/payList/:userId', async (req, res) => {
    let pageSize = parseInt(req.query["pageSize"]) || 15

    let pageNum = parseInt(req.query["pageNum"]) || 1

    const userId  = req.params.userId
    const {payStatus,payType} =req.query
    if (isNaN(pageNum) || isNaN(pageSize) || pageSize < 1 || pageNum < 1) {
        res.send({
            status: 400,
            body: '无效分页参数'
        })
    }
    const startIndex = (pageNum - 1) * pageSize
  
    try {
        await getPaymentUserIdDatabase(userId,payStatus,payType,startIndex,pageSize,res)
    } catch (error) {
        res.send({
            status: 500,
            body: 'Internal Server Error'
        })
    }

})
router.post('/admin/payment/addPayment',(req,res)=>{
    let { payType, payTime, money, userId, payStatus } = req.body
    let sqlStr = 'insert into payment(payType,payTime,money,userId,payStatus) value(?,?,?,?,?)'
    console.log(payType, payTime, money, userId, payStatus);
    connection.query(sqlStr, [payType, payTime, money, userId, payStatus],(error,result)=>{
        if(error){
            res.send(error)
        }else{
            console.log(result);
            console.log(result[0]);
            console.log("id");
            console.log(result.insertId);
            res.send({
                status:200,
                message:'新增账单成功',
                data: result.insertId
            })
        }
    })
})
router.put('/admin/payment/:id', (req, res) => {
    let id = req.params.id
    let {payStatus} = req.body
    let sqlStr = "update payment set payStatus=? where id=?"
    connection.query(sqlStr, [payStatus,id], (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: result,
                message: '更新缴费信息状态'
            })
        }
    })
})
router.delete('/admin/payment/:id', (req, res) => {
    let id = req.params.id
    let sqlStr = "delete from payment where id=?"
    connection.query(sqlStr, id, (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: result,
                message: '删除缴费信息成功'
            })
        }
    })
})
router.get('/admin/payment/:id', (req, res) => {
    let id = req.params.id
    let sqlStr = "select * from payment where id=?"
    connection.query(sqlStr, id, (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: result,
                message: '获得缴订单信息成功'
            })
        }
    })
}) 
module.exports = router;