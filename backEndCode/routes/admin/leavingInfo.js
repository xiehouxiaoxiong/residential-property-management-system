var express = require('express')
var connection = require('../../server')
var formatDate = require('../../utils/formatDate')
let { getLeavingInfoDatabase } = require('../../utils/admin/getLeavingInfo')
var router = express.Router()
router.post('/admin/leaveInfo', (req, res) => {
    let sqlStr = 'insert into leaveinfo(number,leavingDate,pretext,leavingAddress,leavingStatus) value(?,?,?,?,?)'
    let { number, leavingDate, pretext, leavingAddress, leavingStatus } = req.body
    
    if (typeof leavingDate==='string'){
        leavingDate = leavingDate.split("至")
    }
    
     
    
    let dateLeavingDate = leavingDate[0]+'至'+leavingDate[1]
    
    connection.query(sqlStr, [number, dateLeavingDate, pretext, leavingAddress, leavingStatus], (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: {

                },
                message: '新增成功'
            })
        }

    })
})

router.get('/admin/leaveInfo/list', async (req, res) => {
    let pageSize = parseInt(req.query["pageSize"]) || 10
   
    let pageNum = parseInt(req.query["pageNum"]) || 1
   
    const { userName, number,leavingStatus } = req.query
    if (isNaN(pageNum) || isNaN(pageSize) || pageSize < 1 || pageNum < 1) {
        res.send({
            status: 400,
            body: '无效分页参数'
        })
    }
    const startIndex = (pageNum - 1) * pageSize
   
    try {
        await getLeavingInfoDatabase(userName, number, leavingStatus, startIndex, pageSize, res)
    } catch (error) {
        res.send({
            status: 500,
            body: 'Internal Server Error'
        })
    }

})
router.get('/admin/leaveInfo/:id', (req, res) => {
    let sqlStr = 'select * from leaveinfo where id=?'
    let id = req.params.id
    connection.query(sqlStr, [id], (error, result) => {
        if (error) {
            res.send(error)
        } else {
     
            res.send({
                status: 200,
                data: result[0],
                message: '获得请假记录成功'
            })
        }
    })
})
router.put('/admin/leaveInfo/:id', (req, res) => {
    let id = req.params.id
    let { number, leavingDate, pretext, leavingAddress, leavingStatus } = req.body

  
  
    let sqlStr = "update leaveinfo set number=?,leavingDate=?,pretext=?,leavingAddress=?,leavingStatus=? where id=?"

    connection.query(sqlStr, [number, leavingDate, pretext, leavingAddress, leavingStatus, id], (error, result) => {
        if (error) {
            res.send(error)
        } else {
   
            res.send({
                status: 200,
                data: result[0],
                message: '更新请假记录成功'
            })
        }
    })
})
router.delete('/admin/leaveInfo/:id', (req, res) => {
    let id = req.params.id
    let sqlStr = "delete from leaveinfo where id=?"
    connection.query(sqlStr, id, (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: result,
                message: '删除请假记录成功'
            })
        }
    })
})
module.exports = router;