var express = require('express');
var connection = require('../../server')
var router = express.Router();
var { login, register, updatePwd, updateProfile, getProfile, updatePwdByNumber, updatePwdByPhoneNumber } = require('../../utils/user/employee')




router.post('/user/login', function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');

   
    const userInfo = req.body


    if (userInfo.phoneNumber == '' || userInfo.password == '') {
        return res.send({
            status: 1,
            msg: '手机号和密码不能为空'
        })
    }

    login(req, res)


})

router.post('/user/register', function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
  

    const userInfo = req.body


    if (userInfo.phoneNumber == '' || userInfo.password == '') {
        return res.send({
            status: 1,
            msg: '手机号和密码不能为空'
        })
    }

    register(req, res)
  

})

router.put('/user/modifyPwd', function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');


    const userInfo = req.body
   
 
    if (userInfo.username == '' || userInfo.password == '') {
        return res.send({
            status: 1,
            msg: '用户名和密码不能为空'
        })
    }

    updatePwd(req, res)


})

router.put('/user/modifyPwdByPhoneNumber', function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');


   
    const userInfo = req.body


    if (userInfo.phoneNumber == '' || userInfo.password == '') {
        return res.send({
            status: 1,
            msg: '手机号和密码不能为空'
        })
    }

    updatePwdByPhoneNumber(req, res)


})

router.put('/user/modifyPwdByNumber', function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
 

    const userInfo = req.body


    if (userInfo.number == '' || userInfo.password == '') {
        return res.send({
            status: 1,
            msg: '员工ID和密码不能为空'
        })
    }

    updatePwdByNumber(req, res)


})

router.put('/user/:id', function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
 



    updateProfile(req, res)


})

router.get('/user/:id', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    getProfile(req, res)

});

module.exports = router;
