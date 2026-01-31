var express = require('express');
var connection = require('../../server')
var router = express.Router();
var { login, updatePwd, resetPwd, updateProfile, getProfile, getUserList } = require('../../utils/admin/sysUser')

/* GET home page. */
router.get('/system/user/list', async (req, res) => {
  let pageSize = parseInt(req.query["pageSize"]) || 1

  let pageNum = parseInt(req.query["pageNum"]) || 1

  const { userId, sex } = req.query
  if (isNaN(pageNum) || isNaN(pageSize) || pageSize < 1 || pageNum < 1) {
    res.send({
      status: 400,
      body: '无效分页参数'
    })
  }
  const startIndex = (pageNum - 1) * pageSize

  try {
    await getUserList(userId, sex, startIndex, pageSize, res)
  } catch (error) {
    res.send({
      status: 500,
      body: 'Internal Server Error'
    })
  }

})
router.delete('/system/user/deleteUser', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  let id = req.query.id
  let sqlStr = "delete from admininfo where id=?"
  connection.query(sqlStr, id, (error, result) => {
    if (error) {

      res.send(error)
    } else {

      res.send({
        status: 200,
        data: result,
        message: '删除管理员账号成功'
      })
    }
  })
}
)

router.post('/system/user', function (req, res, next) {

  res.header('Access-Control-Allow-Origin', '*');


  const userInfo = req.body


  if (userInfo.userName == '' || userInfo.password == '') {
    return res.send({
      status: 1,
      msg: '用户名和密码不能为空'
    })
  }

  login(req, res)


})

router.put('/system/user/modifyPwd', function (req, res, next) {

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

router.put('/system/user/resetPwd', function (req, res, next) {

  res.header('Access-Control-Allow-Origin', '*');



  const userInfo = req.body


  if (userInfo.username == '' || userInfo.password == '') {
    return res.send({
      status: 1,
      msg: '用户名和密码不能为空'
    })
  }

  resetPwd(req, res)


})

router.put('/system/user/:id', function (req, res, next) {

  res.header('Access-Control-Allow-Origin', '*');

  updateProfile(req, res)


})
const jwt = require('jsonwebtoken')
const config = require('../../config')

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied!');
  console.log('token-----------------');
  console.log(token);
  jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
    console.log(err);
    if (err) return res.status(500).send('Failed to authenticate token.');
    req.user = decoded;
    next();
  });
}

router.get('/system/user/:id', verifyToken, function (req, res, next) {

  res.header('Access-Control-Allow-Origin', '*');
  getProfile(req, res)

});


router.post('/system/user/addUser', (req, res) => {
  let sqlStr = 'insert into admininfo(userName,avatar,sex,password,number,userId,phoneNumber) value(?,?,?,?,?,?,?)'
  const { userName, avatar, sex, password, number, userId, phoneNumber } = req.body
  connection.query(sqlStr, [userName, avatar, sex, password, number, userId, phoneNumber], (error, result) => {
    if (error) {
      res.send(error)
    } else {
      res.send({
        status: 200,
        data: {

        },
        message: '新增成功'
      })
    }

  })
})

module.exports = router;
