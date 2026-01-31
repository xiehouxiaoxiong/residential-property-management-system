var express = require('express');
var connection = require('../../server')
var router = express.Router();
var { login, register, updatePwd, updateProfile, getProfile, updatePwdByUserId, updatePwdByPhoneNumber, getProfileByPhoneNumber } = require('../../utils/user/propietor')




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

router.put('/user/modifyPwdByUserId', function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');


    const userInfo = req.body


    if (userInfo.userId == '' || userInfo.password == '') {
        return res.send({
            status: 1,
            msg: '用户ID和密码不能为空'
        })
    }

    updatePwdByUserId(req, res)


})

router.put('/user/:id', function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');

    updateProfile(req, res)


})
const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access Denied!');
    console.log('token-----------------');
    console.log(token);
    jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token.');


        req.user = decoded;
        next();
    });
}

router.get('/user/:id', verifyToken, function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    getProfile(req, res)

});
router.get('/user/isRegister/:phoneNumber', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    let phoneNumber = req.params.phoneNumber
    getProfileByPhoneNumber(phoneNumber, req, res)
})
module.exports = router;
