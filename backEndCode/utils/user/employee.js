var connection = require('../../server')
const jwt = require('jsonwebtoken')

const config = require('../../config')


const bcrypt = require('bcryptjs')


let login = (req, res) => {
    

   
    const userInfo = req.body
    const { number } = userInfo
  
    
    const sql = 'select * from staff where number=?'
    
    connection.query(sql, [number], (err, result) => {
      
        
        if (err) return res.send(err)
        
        if (result.length !== 1) return res.send({
            status:401,
            message:'用户名不存在'})
        
        const newPwd = bcrypt.hashSync(result[0].password, 10)
        
       
        
        const comRes = bcrypt.compareSync(userInfo.password, newPwd)
       
        if (!comRes) return res.send({
            message: '工号或密码错误',
            status: 401
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
            message: '员工登录成功！！！',
        })
    })
}
let register = (req, res) => {
    

    
    const userInfo = req.body
    const { phoneNumber, password, userName, avatar } = req.body
    const sql = 'select * from staff where phoneNumber=?'
    new Promise((resolve, reject) => {
       
        const sex = "未知"
        const number = (Math.random() + new Date().getTime()).toString(32).slice(0, 8)
        
        const sql = 'insert into staff(userName,password,avatar,phoneNumber,sex,number) value(?,?,?,?,?,?)'
        
        connection.query(sql, [userName, password, avatar, phoneNumber, sex, number], (err, result) => {
         
            
            if (err) return res.send(err)
        })
        resolve()
    }).then(

        
        connection.query(sql, [phoneNumber], (err, result) => {
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
let updatePwd = (req, res) => {
    const sqlStr = 'update staff set password=? where userName=?'
    const userInfo = req.body
   
    const { password, userName } = userInfo
    connection.query(sqlStr, [password, userName], (error, result) => {
        if (error) return res.send("更新失败")
      
        const user = {
            ...result[0], 
            password: '', 
        }
        
        res.send({
            status: 0,
            data: {
                user: user
            },
            message: '更新密码成功！！！',
        })
    })
}
let updatePwdByPhoneNumber = (req, res) => {
    const sqlStr = 'update staff set password=? where phoneNumber=?'
    const userInfo = req.body

    const { password, phoneNumber } = userInfo
    connection.query(sqlStr, [password, phoneNumber], (error, result) => {
        if (error) return res.send("更新失败")
       
        const user = {
            ...result[0], 
            password: '', 
        }
        
        res.send({
            status: 0,
            data: {
                user: user
            },
            message: '更新密码成功！！！',
        })
    })
}
let updatePwdByNumber = (req, res) => {
    const sqlStr = 'update staff set password=? where number=?'
    const userInfo = req.body
    
    const { password, number } = userInfo
    connection.query(sqlStr, [password, number], (error, result) => {
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
    const sqlStr = 'update staff set password=? where number=?'
    const userInfo = req.body
    
    const { number } = userInfo
    const password = '123456'
    connection.query(sqlStr, [password, number], (error, result) => {
        if (error) return res.send("更新失败")
       
        const user = {
            ...result[0], 
            password: '', 
        }
        
        res.send({
            status: 0,
            data: {
                user: user
            },
            message: '更新密码成功！！！',
        })
    })
}
let updateProfile = (req, res) => {
    
    const sqlStr = 'update staff set avatar=?,userName=?,sex=?,phoneNumber=? where number=?'
    const { avatar, userName, sex, phoneNumber } = req.body
   
    const number = req.params.id
  
    connection.query(sqlStr, [avatar, userName, sex, phoneNumber, number], (error, result) => {
       
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
    const sqlStr = 'select * from staff where number=?'
    const number = req.params.id
  
    connection.query(sqlStr, [number], (error, result) => {
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
module.exports.login = login
module.exports.updatePwdByNumber = updatePwdByNumber
module.exports.register = register
module.exports.updatePwd = updatePwd
module.exports.updatePwdByPhoneNumber = updatePwdByPhoneNumber
module.exports.resetPwd = resetPwd
module.exports.updateProfile = updateProfile
module.exports.getProfile = getProfile