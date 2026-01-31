const { use } = require('../../routes/admin/complaintInfo');
var connection = require('../../server')
async function getComplaintInfoDatabase(userName, complaintStatus, complaintType, userId,startIndex, pageSize, res) {
    try {
        let sqlStr = 'SELECT * FROM complaintinfo'
      
        let queryParams = []
        if (userName || complaintStatus || complaintType||userId) {
            sqlStr += ' WHERE'
            if (userName) {
                sqlStr += ' userName=?'
                queryParams.push(userName)
            }
            if (complaintStatus) {
                if (userName) {
                    sqlStr += ' and'
                }
                sqlStr += ' complaintStatus=?'
                queryParams.push(complaintStatus)
            }
            if (complaintType) {
                if (userName || complaintStatus) {
                    sqlStr += ' and'
                }
                sqlStr += ' complaintType=?'
                queryParams.push(complaintType)
            }
            if(userId){
                if (userName || complaintStatus || complaintType){
                    sqlStr+=' and'
                }
                sqlStr+=' userId=?'
                queryParams.push(userId)
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

module.exports.getComplaintInfoDatabase = getComplaintInfoDatabase

