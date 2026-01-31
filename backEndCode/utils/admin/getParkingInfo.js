var connection = require('../../server')
async function getParkingInfoDatabase(parkingName, parkingNumber, parkingStatus,startIndex,pageSize,res){
    try {
        let sqlStr = 'SELECT * FROM parkinginfo'
      
        let queryParams = []
        if (parkingName||parkingNumber||parkingStatus){
            sqlStr+=' WHERE'
            if (parkingName){
                sqlStr +=' parkingName=?'
                queryParams.push(parkingName)
            }
            if(parkingNumber){
                if (parkingName){
                  sqlStr+=' and'
                }
                sqlStr +=' parkingNumber=?'
                queryParams.push(parkingNumber)
            }
            if(parkingStatus){
                if (parkingName || parkingNumber){
                    sqlStr+=' and'
                }
                sqlStr+=' parkingStatus=?'
                queryParams.push(parkingStatus)
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

module.exports.getParkingInfoDatabase = getParkingInfoDatabase
