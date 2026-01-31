var connection = require('../../server')
async function getRepairInfoDatabase(userId, auditStatus, repairProgress, repairEmployeeId,startIndex, pageSize, res) {
    try {
        let sqlStr = 'SELECT repairinfo.applicationtime,propietor.userId,repairinfo.repairPicture,repairinfo.id,repairinfo.repairEmployeeId,repairinfo.auditStatus,propietor.avatar,propietor.userName,repairinfo.repairDetail,repairinfo.repairAddress,repairinfo.repairDate,repairinfo.repairEvent,repairinfo.repairProgress FROM repairinfo JOIN propietor ON repairinfo.userId=propietor.userId'
       
        let queryParams = []
        if (userId || auditStatus || repairProgress || repairEmployeeId) {
            sqlStr += ' WHERE'
            if (userId) {
                sqlStr += ' repairinfo.userId=?'
                queryParams.push(userId)
            }
            if (auditStatus) {
                if (userId) {
                    sqlStr += ' and'
                }
                sqlStr += ' auditStatus=?'
                queryParams.push(auditStatus)
            }
            if (repairProgress) {
                if (userId || auditStatus) {
                    sqlStr += ' and'
                }
                sqlStr += ' repairProgress=?'
                queryParams.push(repairProgress)
            }
            if (repairEmployeeId) {
                if (userId || auditStatus||repairProgress) {
                    sqlStr += ' and'
                }
                sqlStr += ' repairEmployeeId=?'
                queryParams.push(repairEmployeeId)
            }

        }
        let ss = sqlStr
        sqlStr += ' LIMIT ?,?'

        let total
        new Promise((resolve, reject) => {
          
            connection.query(ss, queryParams, (error, result) => {
                total = result !== undefined ? result.length : 0

            })
            resolve()
        }).then(() => {
            queryParams.push(startIndex, pageSize)
            connection.query(sqlStr, queryParams, (error, result) => {
             
                res.send({
                    status: 201,
                    data: {
                        rows: result
                    },
                    total: total
                })


            })

        })




    } catch (error) {
        console.log(error, '数据库查询失败');
    }
}

module.exports.getRepairInfoDatabase = getRepairInfoDatabase
