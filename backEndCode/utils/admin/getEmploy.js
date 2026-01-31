var connection = require('../../server')
async function getEmployDatabase(userName,employeeType,sex,startIndex,pageSize,res){
    try {
        let sqlStr = 'SELECT * FROM staff'
  
        let queryParams = []
        if(userName||employeeType||sex){
            sqlStr+=' WHERE'
            if(userName){
                sqlStr+=' userName=?'
                queryParams.push(userName)
            }
            if(employeeType){
                if(userName){
                  sqlStr+=' and'
                }
                sqlStr+=' employeeType=?'
                queryParams.push(employeeType)
            }
            if(sex){
                if(userName||employeeType){
                    sqlStr+=' and'
                }
                sqlStr+=' sex=?'
                queryParams.push(sex)
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

module.exports.getEmployDatabase = getEmployDatabase
