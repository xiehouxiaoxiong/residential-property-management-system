var express = require('express')
var connection = require('../../server')
let { getVisitorInfoDatabase } = require('../../utils/admin/getVisitorInfo')
var router = express.Router()

router.post('/admin/visitorInfo', (req, res) => {
    let sqlStr = 'insert into visitorinfo(userName,phoneNumber,credentialsType,credentials,sex,visitorReason,accompanyingNumber,interviewee,enterTime,leavingTime,securityEmployeeId) value(?,?,?,?,?,?,?,?,?,?,?)'
    const { userName, phoneNumber, credentialsType, credentials, sex, visitorReason, accompanyingNumber, interviewee, enterTime, leavingTime, securityEmployeeId } = req.body
    connection.query(sqlStr, [userName, phoneNumber, credentialsType, credentials, sex, visitorReason, accompanyingNumber, interviewee, enterTime, leavingTime, securityEmployeeId], (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: {

                },
                message: '新增访客记录成功'
            })
        }

    })
})

router.get('/admin/visitorInfo/list', async (req, res) => {
    let pageSize = parseInt(req.query["pageSize"]) || 10
    let pageNum = parseInt(req.query["pageNum"]) || 1
    const { userName } = req.query
    if (isNaN(pageNum) || isNaN(pageSize) || pageSize < 1 || pageNum < 1) {
        res.send({
            status: 400,
            body: '无效分页参数'
        })
    }
    const startIndex = (pageNum - 1) * pageSize
    try {
        await getVisitorInfoDatabase(userName,startIndex, pageSize, res)
    } catch (error) {
        res.send({
            status: 500,
            body: 'Internal Server Error'
        })
    }

})
router.get('/admin/visitorInfo/:id', (req, res) => {
    let sqlStr = 'select * from visitorinfo where id=?'
    let id = req.params.id
    connection.query(sqlStr, [id], (error, result) => {
        if (error) {
            res.send(error)
        } else {
            
            res.send({
                status: 200,
                data: result[0],
                message: '获得访客信息成功'
            })
        }
    })
})
router.put('/admin/visitorInfo/:id', (req, res) => {
    let id = req.params.id
    let { repairEmployeeId, repairProgress, auditStatus } = req.body
    
    let sqlStr = "update visitorinfo set "
    let queryParams=[]
    if (repairEmployeeId|| repairProgress|| auditStatus){
        if (repairEmployeeId){
            sqlStr +='repairEmployeeId=?'
            queryParams.push(repairEmployeeId)
        }
        if (repairProgress){
            if (repairEmployeeId){
                sqlStr+=','
            }
            sqlStr +='repairProgress=?'
            queryParams.push(repairProgress)
        }
        if (auditStatus){
            if (repairEmployeeId || repairProgress){
                sqlStr+=','
            }
            sqlStr +='auditStatus=?'
            queryParams.push(repairProgress)
        }
        sqlStr +=" where id=?"
        queryParams.push(id)
    }
   

    connection.query(sqlStr, queryParams, (error, result) => {
        if (error) {
            res.send(error)
        } else {
         
            res.send({
                status: 200,
                data: result[0],
                message: '更新访客信息成功'
            })
        }
    })
})
router.delete('/admin/visitorInfo/:id', (req, res) => {
    let id = req.params.id
    let sqlStr = "delete from visitorinfo where id=?"
    connection.query(sqlStr, id, (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: result,
                message: '删除访客信息成功'
            })
        }
    })
})
module.exports = router;