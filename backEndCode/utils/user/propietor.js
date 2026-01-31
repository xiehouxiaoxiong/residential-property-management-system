var connection = require('../../server')
const jwt = require('jsonwebtoken')

const config = require('../../config')


const bcrypt = require('bcryptjs')



let login = (req, res) => {
    


    const userInfo = req.body
    const { phoneNumber } = userInfo
  

    
    const sql = 'select * from propietor where phoneNumber=?'
    
    connection.query(sql, [phoneNumber], (err, result) => {
        
        
        if (err) return res.send(err)
        
        if (result.length !== 1) return res.send({
            status: 401, 
            message:'登录失败！'})
        
        const newPwd = bcrypt.hashSync(result[0].password, 10)
        
       
        
        const comRes = bcrypt.compareSync(userInfo.password, newPwd)
      
        if (!comRes) return res.send({
            message:'手机号或密码错误',
            status:401
        })
        
        const user = {
            ...result[0], 
            password: '', 
        }
        
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: config.expiresIn 
        })
        
        res.send({
            status: 200,
            data: {
                user: user,
                token: tokenStr,
            },
            message: '登录成功！！！',
        })
    })
}
/**
 * POST 登录的回调函数
 * @param phoneNumber  手机号
 * @param password  用户密码
 */
let register = async(req, res) => {
    
    
   
    const userInfo = req.body
    const { phoneNumber,password,userName,avatar } = req.body
    new Promise((resolve,reject)=>{
         
        const sqlStr = 'select * from propietor where phoneNumber=?'
        let flag
        connection.query(sqlStr, [phoneNumber], (error, result) => {
            if (error) return res.send("获得失败")

            console.log(result.length);
            if (result.length > 0) {
                flag = true
                console.log('1111');
            } else {
                flag = false
                console.log('2222');
            }
            console.log(flag);

            resolve(flag)
        })
    }).then((flag)=>{
  
        console.log(phoneNumber);
        if (flag) {
            res.send({
                data:{
                    message: '该手机号已注册'
                }

            })
            return
        } else {
            const sql = 'select * from propietor where phoneNumber=?'
            new Promise((resolve, reject) => {
                
                const sex = "未知"
                const userId = (Math.random() + new Date().getTime()).toString(32).slice(0, 8)
                
                const sql = 'insert into propietor(userName,password,avatar,phoneNumber,sex,userId) value(?,?,?,?,?,?)'
                
                connection.query(sql, [userName, password, avatar, phoneNumber, sex, userId], (err, result) => {

                    
                    if (err) return res.send(err)
                })
                resolve()
            }).then(

                
                connection.query(sql, [phoneNumber], (error, result) => {
                    if (error) return res.send(error)
                    if (result.length == 1) {
                        
                        const user = {
                            ...result[0], 
                            password: '', 
                        }
                        
                        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
                            expiresIn: config.expiresIn 
                        })
                        
                        res.send({
                            status: 200,
                            data: {
                                user: user,
                                token: tokenStr,
                            },
                            message: '登录成功！！！',
                        })
                    }
                })
            )
        }
    })
     

    
    
}
let updatePwd = (req, res) => {
    const sqlStr = 'update propietor set password=? where userName=?'
    const userInfo = req.body
 
    const { password, userName } = userInfo
    connection.query(sqlStr, [password, userName], (error, result) => {
        if (error) return res.send("更新失败")
    
        const user = {
            ...result[0], 
            password: '', 
        }
        
        res.send({
            status: 200,
            data: {
                user: user
            },
            message: '更新密码成功！！！',
        })
    })
}
let updatePwdByPhoneNumber = (req, res) => {
    const sqlStr = 'update propietor set password=? where phoneNumber=?'
    const userInfo = req.body
  
    const { password, phoneNumber } = userInfo
    connection.query(sqlStr, [password, phoneNumber], (error, result) => {
        if (error) return res.send("更新失败")

        const user = {
            ...result[0], 
            password: '', 
        }
        
        res.send({
            status: 200,
            data: {
                user: user
            },
            message: '更新密码成功！！！',
        })
    })
}
let updatePwdByUserId = (req, res) => {
    const sqlStr = 'update propietor set password=? where userId=?'
    const userInfo = req.body

    const { password, userId } = userInfo
    connection.query(sqlStr, [password, userId], (error, result) => {
        if (error) return res.send("更新失败")

        const user = {
            ...result[0], 
            password: '', 
        }
        
        res.send({
            status: 200,
            data: {
                user: user
            },
            message: '更新密码成功！！！',
        })
    })
}
let resetPwd = (req, res) => {
    const sqlStr = 'update propietor set password=? where userId=?'
    const userInfo = req.body
  
    const { userId } = userInfo
    const password = '123456'
    connection.query(sqlStr, [password, userId], (error, result) => {
        if (error) return res.send("更新失败")

        const user = {
            ...result[0], 
            password: '', 
        }
        
        res.send({
            status: 200,
            data: {
                user: user
            },
            message: '更新密码成功！！！',
        })
    })
}
let updateProfile = (req, res) => {

    const sqlStr = 'update propietor set avatar=?,userName=?,sex=?,phoneNumber=? where userId=?'
    const { avatar, userName, sex,phoneNumber } = req.body

    const userId = req.params.id

    connection.query(sqlStr, [avatar, userName, sex,phoneNumber, userId], (error, result) => {

        if (error) return res.send("更新失败")
        const user = {
            ...result[0], 
            password: '', 
        }
      
        
        res.send({
            status: 200,
            data: {
                user: user
            },
            message: '更新信息成功！！！',
        })
    })
}
let getProfile = (req, res) => {
    const sqlStr = 'select * from propietor where userId=?'
    const userId = req.params.id

    connection.query(sqlStr, [userId], (error, result) => {
        if (error) return res.send("获得失败")
   
        
        const user = {
            ...result[0], 
            password: '', 
        }
        res.send({
            status: 200,
            data: {
                user: user
            },
            message: '获得信息成功！！！',
        })
    })
}
let getProfileByPhoneNumber =  (phoneNumber,req,res) => {

    const sqlStr = 'select * from propietor where phoneNumber=?'

    connection.query(sqlStr, [phoneNumber], (error, result) => {
        if (error) return res.send({
            message:"获得失败"})
        if(result.length>0){
            res.send({
                status: 200,
                message: '该账号已注册'
            })
        }else if(result.length==0){
            res.send({
                status: 200,
                message: '该账号未注册'
            })
        }
        
    })
}
module.exports.getProfileByPhoneNumber = getProfileByPhoneNumber
module.exports.login = login
module.exports.register = register
module.exports.updatePwd = updatePwd
module.exports.updatePwdByUserId = updatePwdByUserId
module.exports.resetPwd = resetPwd
module.exports.updateProfile = updateProfile
module.exports.getProfile = getProfile
module.exports.updatePwdByPhoneNumber = updatePwdByPhoneNumber