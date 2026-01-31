
const express = require("express");
const router = express.Router();


const multer = require("multer")
const fs = require("fs")


router.post(
    "/uploadG",
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

        let pic = path.substring(7)
        
        fileInfo.type = file.mimetype;
        fileInfo.name = file.originalname;
        fileInfo.size = file.size;
        fileInfo.path = path;
        res.send({
            status:200,
            data:pic,
            message:'上传照片成功'
        })
    }
)


module.exports = router;