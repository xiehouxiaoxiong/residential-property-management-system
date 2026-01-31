var express = require('express');
var connection = require('../server')
var router = express.Router();
const { randomCode, sendCode} = require('../utils/sendSmsRonglianyun')
router.post('/ronglianyun',function (req,res,next) {
    res.header('Access-Control-Allow-Origin', '*');
    let {telephone} = req.body
    console.log(telephone);

    let randomCode1 = randomCode(8)
    console.log(randomCode1);
    sendCode(telephone,randomCode1,function(result){
        if (result) {
            res.send("短信验证码已发送");
        } else {
            res.send("短信验证码发送失败");
        }
    })
})
module.exports = router;