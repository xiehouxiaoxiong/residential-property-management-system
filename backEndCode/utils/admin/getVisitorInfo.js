var connection = require('../../server')
async function getVisitorInfoDatabase(userName,startIndex, pageSize, res) {
    try {
        let sqlStr = 'SELECT visitorinfo.id,visitorinfo.securityEmployeeId,visitorinfo.userName visitorUserName,visitorinfo.phoneNumber,visitorinfo.credentialsType,visitorinfo.credentials,visitorinfo.sex,visitorinfo.visitorReason,visitorinfo.interviewee,visitorinfo.enterTime,visitorinfo.accompanyingNumber,visitorinfo.leavingTime,staff.userName staffUserName,staff.number from visitorinfo JOIN staff ON visitorinfo.securityEmployeeId=staff.number'
   
        let queryParams = []
        if (userName){
            sqlStr +=' where visitorinfo.userName=?'
            queryParams.push(userName)
        }
        let ss = sqlStr
        sqlStr += ' LIMIT ?,?'
     
         
        let total
        new Promise((resolve, reject) => {
            
            connection.query(ss, queryParams, (error, result) => {
            
                total = result!==undefined?result.length:0

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

module.exports.getVisitorInfoDatabase = getVisitorInfoDatabase
