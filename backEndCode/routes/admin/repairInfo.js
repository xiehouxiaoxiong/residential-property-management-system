var express = require('express')
var connection = require('../../server')
let { getRepairInfoDatabase } = require('../../utils/admin/getRepairInfo')
var router = express.Router()

router.post('/admin/repairInfo', (req, res) => {
    let sqlStr = 'insert into repairinfo(repairAddress,repairDate,repairPicture,auditStatus,repairEmployeeId,repairProgress,repairEvent,repairDetail,applicationtime,userId) value(?,?,?,?,?,?,?,?,?,?)'
    const { repairAddress, repairDate, repairPicture, auditStatus, repairEmployeeId, repairProgress, repairEvent, repairDetail, applicationtime, userId } = req.body
    connection.query(sqlStr, [repairAddress, repairDate, repairPicture, auditStatus, repairEmployeeId, repairProgress, repairEvent, repairDetail, applicationtime, userId], (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: {

                },
                message: '新增维修单成功'
            })
        }

    })
})

router.get('/admin/repairInfo/list', async (req, res) => {
    let pageSize = parseInt(req.query["pageSize"]) || 10
   
    let pageNum = parseInt(req.query["pageNum"]) || 1

    const { userId, auditStatus, repairProgress,repairEmployeeId } = req.query
    if (isNaN(pageNum) || isNaN(pageSize) || pageSize < 1 || pageNum < 1) {
        res.send({
            status: 400,
            body: '无效分页参数'
        })
    }
    const startIndex = (pageNum - 1) * pageSize

    try {
        await getRepairInfoDatabase(userId, auditStatus, repairProgress, repairEmployeeId, startIndex, pageSize, res)
    } catch (error) {
        res.send({
            status: 500,
            body: 'Internal Server Error'
        })
    }

})
router.get('/admin/repairInfo/:id', (req, res) => {
    let sqlStr = 'select * from repairinfo where id=?'
    let id = req.params.id
    connection.query(sqlStr, [id], (error, result) => {
        if (error) {
            res.send(error)
        } else {
            
            res.send({
                status: 200,
                data: result[0],
                message: '获得维修信息成功'
            })
        }
    })
})
router.put('/admin/repairInfo/:id', (req, res) => {
    let id = req.params.id
    let { degreeOfSat,evaluation,repairEmployeeId, repairProgress, auditStatus } = req.body
    console.log(degreeOfSat, evaluation, repairEmployeeId, repairProgress, auditStatus);
    if(auditStatus=='通过'){
        repairProgress='派工'
    }
    let sqlStr = "update repairinfo set "
    let queryParams=[]
    if (repairEmployeeId || repairProgress || auditStatus || evaluation || degreeOfSat){
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
            queryParams.push(auditStatus)
        }
        if (degreeOfSat) {
            if (repairEmployeeId || repairProgress || auditStatus) {
                sqlStr += ','
            }
            sqlStr += 'degreeOfSat=?'
            queryParams.push(degreeOfSat)
        }
        if (evaluation) {
            if (repairEmployeeId || repairProgress || auditStatus || degreeOfSat) {
                sqlStr += ','
            }
            sqlStr += 'evaluation=?'
            queryParams.push(evaluation)
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
                message: '更新维修信息成功'
            })
        }
    })
})

router.delete('/admin/repairInfo/:id', (req, res) => {
    let id = req.params.id
    let sqlStr = "delete from repairinfo where id=?"
    connection.query(sqlStr, id, (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: result,
                message: '删除维修信息成功'
            })
        }
    })
})

module.exports = router;