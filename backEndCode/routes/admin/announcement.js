var express = require('express')
var connection = require('../../server')
let {getAnnouncementDatabase,getAnnouncementTotal} = require('../../utils/admin/getAnnouncement')
var router = express.Router()


router.post('/admin/public-announcement',(req,res)=>{
    let sqlStr = 'insert into announcement(title,content,announcementType,announcementStatus,releaseTime,userName,avatar,picture) value(?,?,?,?,?,?,?,?)'
    const {title,content,announcementType,announcementStatus,releaseTime,userName,avatar,picture} = req.body
    console.log(title, content, announcementType, announcementStatus, releaseTime, userName, avatar, picture);
    connection.query(sqlStr,[title,content,announcementType,announcementStatus,releaseTime,userName,avatar,picture],(error,result)=>{
           if(error){
             res.send(error)
           }else{
             res.send({
                status:200,
                data:{
                   
                },
                message:'新增成功'
             })
           }
           
    })
})
router.get('/admin/public-announcement/list',async (req,res)=>{
    let pageSize = parseInt(req.query["pageSize"])||10
    let pageNum = parseInt(req.query["pageNum"])||1
    const {title,announcementType,announcementStatus,releaseTime} = req.query
    if(isNaN(pageNum)||isNaN(pageSize)||pageSize<1||pageNum<1){
        res.send({
            status:400,
            body:'无效分页参数'
        })
    }
    const startIndex = (pageNum-1)*pageSize
   
    try{        
           await getAnnouncementDatabase(title,announcementType,announcementStatus,releaseTime,startIndex,pageSize,res)  
    }catch(error){
        res.send({
            status:500,
            body:'Internal Server Error'
        })
    }
   
})
router.get('/admin/public-announcement/newest/:sum', async (req, res) => {
    let sum = req.params.sum
    let sqlStr = 'SELECT * FROM announcement ORDER BY id DESC LIMIT '+sum
    
   connection.query(sqlStr,(error,result)=>{
        if(error){
            res.send(error)
        }else{
            res.send({
                message:'获得最新的信息成功',
                status:200,
                data:result
            })
        }
   })

})
router.get('/admin/public-announcement/:id',(req,res)=>{
   let sqlStr = 'select * from announcement where id=?'
   let id = req.params.id
   connection.query(sqlStr,[id],(error,result)=>{
    if(error){
      res.send(error)
    }else{
       
     res.send({
        status:200,
        data:result[0],
        message:'获得公告信息成功'
     })
    }
   })
})
router.put('/admin/public-announcement/:id',(req,res)=>{
    let id = req.params.id
    let {title,content,announcementType,announcementStatus,releaseTime,userName,avatar,picture} = req.body
    
    let sqlStr = "update announcement set title=?,content=?,announcementType=?,announcementStatus=?,releaseTime=?,userName=?,avatar=?,picture=? where id=?"
    
    connection.query(sqlStr,[title,content,announcementType,announcementStatus,releaseTime,userName,avatar,picture,id],(error,result)=>{
        if(error){
             res.send(error)
        }else{
          
             res.send({
                status:200,
                data:result[0],
                message:'更新公告信息成功'
             })
        }
    })
})
router.delete('/admin/public-announcement/:id',(req,res)=>{
    let id = req.params.id
    let sqlStr = "delete from announcement where id=?"
    connection.query(sqlStr,id,(error,result)=>{
        if(error){
             res.send(error)
        }else{
            res.send({
                status:200,
                data:result,
                message:'删除公告成功'
            })
        }
    })
})
module.exports = router;