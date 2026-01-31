const { use } = require('../../routes/admin/complaintInfo')
var connection = require('../../server')
async function getPaymentDatabase(payType, userName, payStatus,startIndex, pageSize, res) {
    try {
        let sqlStr = 'SELECT payment.id,payment.userId,propietor.userName,payment.payType,payment.money,payment.payTime FROM payment JOIN propietor on payment.userId=propietor.userId'
      
        let queryParams = []
        sqlStr += ' WHERE payment.payStatus=?'
        queryParams.push(payStatus)
        if (payType || userName) {
            sqlStr+=' and'
            if (payType) {
                sqlStr += ' payment.payType=?'
                queryParams.push(payType)
            }
            if (userName) {
                if (payType) {
                    sqlStr += ' and'
                }
                console.log("userName");
                console.log(userName);
                sqlStr += ' propietor.userName=?'
                queryParams.push(userName)
            }
         

        }
        
        let ss = sqlStr
        sqlStr += ' LIMIT ?,?'
      

        let total
        new Promise((resolve, reject) => {
            console.log(ss, queryParams);
            connection.query(ss, queryParams, (error, result) => {
                console.log("result----------");
                console.log(result);
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
async function getPaymentUserIdDatabase(userId, payStatus,payType,startIndex, pageSize, res) {
    try {
        let sqlStr = 'SELECT * from payment'
       
        let queryParams = []
        if (userId) {
            sqlStr += ' WHERE userId=?'
            queryParams.push(userId)
        }
   
        if(payStatus=='全部'){
            payStatus=''
        }
        if (payStatus){
            if(userId){
                sqlStr+=' and'
            }
            sqlStr +=' payStatus=?'
            queryParams.push(payStatus)
        }
        if(payType){
            if (userId||payStatus) {
                sqlStr += ' and'
            }
            sqlStr += ' payType=?'
            queryParams.push(payType)
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
module.exports.getPaymentDatabase = getPaymentDatabase
module.exports.getPaymentUserIdDatabase = getPaymentUserIdDatabase
