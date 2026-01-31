 
const express = require("express");
const router = express.Router();
var connection = require('../../server')

const multer = require("multer")
const fs=require("fs")


router.post(
    "/upload",
    multer({
    
      dest: "public/images",
    }).array("file", 1),
    function (req, res, next) {

      let files = req.files;
      let file = files[0];
      let fileInfo = {};
      file.originalname = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      let path = "public/images/" + Date.now().toString() + file.originalname;
      fs.renameSync("./public/images/" + file.filename, path);
  
      let avatar = path.substring(7)
      let userName = 'admin'
      connection.query('update personalInfo set avatar=? where userName=?',[avatar,userName],(error,result)=>{
        if(error){
            res.send({
              status: 110,
              data: {
                error:error
              },
              message: '更新头像失败',
            })
      
        }


          res.send({
            status: 0,
            fileName:avatar,
            message: '更新头像成功！！！',
          })
        

      })
 
   
      fileInfo.type = file.mimetype;
      fileInfo.name = file.originalname;
      fileInfo.size = file.size;
      fileInfo.path = path;
     
    }
)
 
 
module.exports = router;