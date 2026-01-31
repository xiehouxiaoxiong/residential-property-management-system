var connection = require('../../server')
async function getLeavingInfoDatabase(userName, number, leavingStatus, startIndex, pageSize, res) {
    try {
        let sqlStr = 'SELECT leaveinfo.id,staff.userName,staff.number,leaveinfo.leavingDate,leaveinfo.pretext,leaveinfo.leavingAddress,leaveinfo.leavingStatus FROM leaveinfo JOIN staff ON leaveinfo.number = staff.number'
     
        let queryParams = []
        if (userName || number || leavingStatus) {
            sqlStr += ' WHERE'
            if (userName) {
                sqlStr += ' staff.userName=?'
                queryParams.push(userName)
            }
            if (number) {
                if (userName) {
                    sqlStr += ' and'
                }
                sqlStr += ' staff.number=?'
                queryParams.push(number)
            }
            if (leavingStatus) {
                if (userName || number) {
                    sqlStr += ' and'
                }
                sqlStr += ' leaveinfo.leavingStatus=?'
                queryParams.push(leavingStatus)
            }

        }
     
        new Promise((resolve, reject) => {

            connection.query(sqlStr, queryParams, (error, result) => {
                total = result !== undefined ? result.length : 0
            })
            sqlStr += ' LIMIT ?,?'
            queryParams.push(startIndex, pageSize)
            resolve()
        }).then(
            connection.query(sqlStr, queryParams, (error, result) => {
              
                res.send({
                    status: 200,
                    data: {
                        rows: result
                    },
                    total: total
                })
            })
        )


    } catch (error) {
        console.log(error, '数据库查询失败');
    }
}
module.exports.getLeavingInfoDatabase = getLeavingInfoDatabase