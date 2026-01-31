var connection = require('../../server')
async function getAttendanceInfoDatabase(userName, number, startIndex, pageSize, res) {
    try {
        let sqlStr = 'SELECT attendanceinfo.id,attendanceinfo.number,staff.userName,attendanceinfo.clockInDays,attendanceinfo.absenceDays FROM attendanceinfo JOIN staff on attendanceinfo.number=staff.number'
     
        let queryParams = []
        if (userName || number) {
            sqlStr += ' WHERE'
            if (userName) {
                sqlStr += ' staff.userName=?'
                queryParams.push(userName)
            }
            if (number) {
                if (userName) {
                    sqlStr += ' and'
                }
                sqlStr += ' attendanceinfo.number=?'
                queryParams.push(number)
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
                    status: 200,
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

module.exports.getAttendanceInfoDatabase = getAttendanceInfoDatabase
