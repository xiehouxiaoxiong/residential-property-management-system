var connection = require('../../server')
async function getProprietorDatabase(userName,sex,startIndex,pageSize,res){
    try {
        let sqlStr = 'SELECT * FROM propietor'
   
        let queryParams = []
        if(userName||sex){
            sqlStr+=' WHERE'
            if(userName){
                sqlStr+=' userName=?'
                queryParams.push(userName)
            }
            if(sex){
                if(userName){
                  sqlStr+=' and'
                }
                sqlStr+=' sex=?'
                queryParams.push(sex)
            }
        }
        let total
        new Promise((resolve,reject)=>{
            
            connection.query(sqlStr,queryParams,(error,result)=>{
                total = result !== undefined ? result.length : 0
            })
            sqlStr+=' LIMIT ?,?'
            queryParams.push(startIndex,pageSize)
            resolve()
        }).then(
             connection.query(sqlStr,queryParams,(error,result)=>{
               
                res.send({
                        status:200,
                        data:{
                        rows: result
                        },
                        total:total
                })
        })
        )
       
        
    } catch (error) {
        console.log(error,'数据库查询失败');
    }
}
module.exports.getProprietorDatabase = getProprietorDatabase