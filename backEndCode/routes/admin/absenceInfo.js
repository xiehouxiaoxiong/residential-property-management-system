var express = require('express')
var connection = require('../../server')
let { getAttendanceInfoDatabase } = require('../../utils/admin/getAttendanceInfo')
var router = express.Router()
router.post('/admin/absenceInfo', (req, res) => {
    let sqlStr = 'insert into attendanceinfo(number,clockInDays,absenceDays) value(?,?,?)'
    const { number, clockInDays, absenceDays } = req.body
    connection.query(sqlStr, [number, clockInDays, absenceDays], (error, result) => {
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
router.get('/admin/absenceInfo/list', async (req, res) => {
    let pageSize = parseInt(req.query["pageSize"]) || 1
   
    let pageNum = parseInt(req.query["pageNum"]) || 1
  
    const { userName,number } = req.query
    if (isNaN(pageNum) || isNaN(pageSize) || pageSize < 1 || pageNum < 1) {
        res.send({
            status: 400,
            body: '无效分页参数'
        })
    }
    const startIndex = (pageNum - 1) * pageSize
   
    try {
        await getAttendanceInfoDatabase(userName, number, startIndex, pageSize, res)
    } catch (error) {
        res.send({
            status: 500,
            body: 'Internal Server Error'
        })
    }

})
router.get('/admin/absenceInfo/:number', (req, res) => {
    let sqlStr = 'select * from attendanceinfo where number=?'
    let id = req.params.number
    connection.query(sqlStr, [id], (error, result) => {
        if (error) {
            res.send(error)
        } else {
            
            res.send({
                status: 200,
                data: result[0],
                message: '获得出勤记录成功'
            })
        }
    })
})
router.put('/admin/absenceInfo/:number', (req, res) => {
    let number = req.params.number
    let {   clockInDays, absenceDays } = req.body
    let sqlStr = "update attendanceinfo set "
    let queryParams=[]
    if(clockInDays){
        sqlStr +='clockInDays=?'
        queryParams.push(clockInDays)
    } 
    if(absenceDays){
       if(clockInDays){
        sqlStr+=','
       }
        sqlStr +='absenceDays=?'
        queryParams.push(absenceDays)
    }
    sqlStr+=' where number=?'
    queryParams.push(number)
    connection.query(sqlStr, queryParams, (error, result) => {
        if (error) {
            res.send(error)
        } else {
           
            res.send({
                status: 200,
                data: result[0],
                message: '更新出勤记录成功'
            })
        }
    })
})
router.delete('/admin/absenceInfo/:id', (req, res) => {
    let id = req.params.id
    let sqlStr = "delete from attendanceinfo where id=?"
    connection.query(sqlStr, id, (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send({
                status: 200,
                data: result,
                message: '删除出勤记录成功'
            })
        }
    })
})
module.exports = router;