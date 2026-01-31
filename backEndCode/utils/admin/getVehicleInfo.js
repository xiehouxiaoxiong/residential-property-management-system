var connection = require('../../server')
async function getVehicleInfoDatabase(licenseNumber, carBrand, userName,startIndex,pageSize,res){
    try {
        let sqlStr = 'SELECT vehicleinfo.id,propietor.userName,propietor.phoneNumber,vehicleinfo.licenseNumber,vehicleinfo.carType,vehicleinfo.carBrand,vehicleinfo.carColor FROM vehicleinfo JOIN propietor ON vehicleinfo.userId = propietor.userId'

        let queryParams = []
        if (licenseNumber||carBrand|| userName){
            sqlStr+=' WHERE'
            if(licenseNumber){
                sqlStr +=' vehicleinfo.licenseNumber=?'
                queryParams.push(licenseNumber)
            }
            if(carBrand){
                if(licenseNumber){
                  sqlStr+=' and'
                }
                sqlStr +=' vehicleinfo.carBrand=?'
                queryParams.push(carBrand)
            }
            if (userName){
                if(licenseNumber||carBrand){
                    sqlStr+=' and'
                }
                sqlStr +=' propietor.userName=?'
                queryParams.push(userName)
            }
            
        }
         let ss = sqlStr
         sqlStr+=' LIMIT ?,?'    
       
         let total
         new Promise((resolve,reject)=>{
              console.log(ss, queryParams);
                connection.query(ss,queryParams,(error,result)=>{
                    console.log("result");
                    console.log(result);
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

module.exports.getVehicleInfoDatabase = getVehicleInfoDatabase
