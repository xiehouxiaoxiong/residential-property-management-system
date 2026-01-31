var connection = require('../../server')
async function getParkingApplicationDatabase(userId, auditResult,startIndex,pageSize,res){
    try {
        let sqlStr = 'SELECT parkingapplication.id ,parkingStartTime,applicationPhoneNumber,auditTime,parkingEndTime,auditResult,auditOpinion,parkingName,parkingNumber,parkingId,userId,licenseNumber,applicationUserName FROM parkingapplication JOIN parkinginfo on parkingapplication.parkingId=parkinginfo.id'
    
        let queryParams = []
        if (userId || auditResult){
            sqlStr+=' WHERE'
            if (userId){
                sqlStr+=' userId=?'
                queryParams.push(userId)
            }
            if (auditResult){
                if (userId){
                  sqlStr+=' and'
                }
                sqlStr +=' auditResult=?'
                queryParams.push(auditResult)
            }
            
        }
         let ss = sqlStr
         sqlStr+=' LIMIT ?,?'    
        
         
         let total
         new Promise((resolve,reject)=>{
            
                connection.query(ss,queryParams,(error,result)=>{
                    total = result !== undefined ? result.length : 0
                    
                })
                resolve()
          }).then(()=>{
            queryParams.push(startIndex,pageSize)
            connection.query(sqlStr,queryParams,(error,result)=>{    
                          
                            res.send({
                                status:201,
                                data:{
                                rows: result
                                },
                                total:total
                            })
                        
                    
                })
          
            })
          
        
         
        
    } catch (error) {
        console.log(error,'数据库查询失败');
    }
}

module.exports.getParkingApplicationDatabase = getParkingApplicationDatabase
