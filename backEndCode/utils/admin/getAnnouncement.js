var connection = require('../../server')
async function getAnnouncementDatabase(title,announcementType,announcementStatus,releaseTime,startIndex,pageSize,res){
    try {
        let sqlStr = 'SELECT * FROM announcement'
    
        let queryParams = []
        if(title||announcementType||announcementStatus||releaseTime){
            sqlStr+=' WHERE'
            if(title){
                sqlStr+=' title=?'
                queryParams.push(title)
            }
            if(announcementType){
                if(title){
                  sqlStr+=' and'
                }
                sqlStr+=' announcementType=?'
                queryParams.push(announcementType)
            }
            if(announcementStatus){
                if(title||announcementType){
                    sqlStr+=' and'
                }
                sqlStr+=' announcementStatus=?'
                queryParams.push(announcementStatus)
            }
            if(releaseTime){
                if(title||type||announcementStatus){
                    sqlStr+=' and'
                }
                sqlStr+=' Date(releaseTime)=?'
                queryParams.push(releaseTime)
            }
            
        }
         let ss = sqlStr
         sqlStr+=' LIMIT ?,?'    
         console.log("total");
  
         
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

module.exports.getAnnouncementDatabase = getAnnouncementDatabase
