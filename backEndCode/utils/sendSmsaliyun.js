const Core = require('@alicloud/pop-core'); 
var express = require('express');
var connection = require('../server')
var router = express.Router();

const client = new Core({
    accessKeyId: '',
    accessKeySecret: '',
    endpoint: '', 
    apiVersion: '' 
});


const templateId = '';
const signName = '小区物业系统';


function zymcode() {
    let str = ""
    for (let i = 0; i < 5; i++) {
        str += Math.floor(Math.random() * 10)
    }
    return str
}





async function sendSmsVerificationCode(phoneNumber, code) {
    try {
        
        const params = {
            PhoneNumbers: phoneNumber,
            SignName: signName,
            TemplateCode: templateId,
            TemplateParam: JSON.stringify({ "code": code }) 
        };
        
        const response = await client.request('SendSms', params);
        if (response && response.Code === 'OK') {
            console.log('短信发送成功');
            return true;
        } else {
            console.error('短信发送失败:', response);
            return false;
        }
    } catch (err) {
        console.error('发送短信时发生错误:', err);
        return false;
    }
}


router.post("/yzm", (req, res) => {
    
    
    let tel = req.body.tele
    
    const phoneNumbers = tel;
    const code = zymcode();
    let rr = sendSmsVerificationCode(phoneNumbers, code)

    if (rr) {
        res.send({
            code: 200,
            message: "暂无数据",
            data: {
                zyzy: code
            }
        })
    } else {
        res.send({
            code: 401,
            message: "验证码发送失败",
            data: {}
        })
    }
})
module.exports = router