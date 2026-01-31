var express = require('express')
var connection = require('../../server')
let { getComplaintInfoDatabase, getComplaintInfoUserIdDatabase } = require('../../utils/admin/getComplaintInfo')
var router = express.Router()

router.post('/admin/ComplaintInfo', (req, res) => {
    let sqlStr = 'insert into complaintinfo(complaintType,complaintUserName,complaintPhoneNumber,textareaContent,complaintTime,complaintStatus,complaintResult,userId) value(?,?,?,?,?,?,?,?)'
    const { complaintType, complaintUserName, complaintPhoneNumber, textareaContent, complaintTime, complaintStatus, complaintResult, userId } = req.body
   
    connection.query(sqlStr, [complaintType, complaintUserName, complaintPhoneNumber, textareaContent, complaintTime, complaintStatus, complaintResult,userId], (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: {

                },
                message: '新增投诉建议成功'
            })
        }

    })
})

router.get('/admin/ComplaintInfo/list', async (req, res) => {
    let pageSize = parseInt(req.query["pageSize"]) || 10
   
    let pageNum = parseInt(req.query["pageNum"]) || 1
   
    const { userName, complaintStatus, complaintType,userId } = req.query
    if (isNaN(pageNum) || isNaN(pageSize) || pageSize < 1 || pageNum < 1) {
        res.send({
            status: 400,
            body: '无效分页参数'
        })
    }
    const startIndex = (pageNum - 1) * pageSize
   
    try {
        await getComplaintInfoDatabase(userName, complaintStatus, complaintType,userId, startIndex, pageSize, res)
    } catch (error) {
        res.send({
            status: 500,
            body: 'Internal Server Error'
        })
    }

})

router.get('/admin/ComplaintInfo/:id', (req, res) => {
    let sqlStr = 'select * from complaintinfo where id=?'
    let id = req.params.id
    connection.query(sqlStr, [id], (error, result) => {
        if (error) {
            res.send(error)
        } else {
            
            res.send({
                status: 200,
                data: result[0],
                message: '获得投诉咨询信息成功'
            })
        }
    })
})
router.put('/admin/ComplaintInfo/:id', (req, res) => {
    let id = req.params.id
    let { complaintStatus, complaintResult } = req.body

    let sqlStr = "update complaintinfo set complaintStatus=?,complaintResult=? where id=?"

    connection.query(sqlStr, [complaintStatus, complaintResult, id], (error, result) => {
        if (error) {
            res.send(error)
        } else {
            
            res.send({
                status: 200,
                data: result[0],
                message: '更新投诉咨询信息成功'
            })
        }
    })
})
router.delete('/admin/ComplaintInfo/:id', (req, res) => {
    let id = req.params.id
    let sqlStr = "delete from complaintinfo where id=?"
    connection.query(sqlStr, id, (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: result,
                message: '删除投诉咨询信息成功'
            })
        }
    })
})
module.exports = router;