var connection = require('../../server')
const jwt = require('jsonwebtoken')

const config = require('../../config')


const bcrypt = require('bcryptjs')



let login = (req, res) => {
 
    const userInfo = req.body
	const {userName} = req.body
	
	const sql = 'select * from admininfo where userName=?'

	connection.query(sql, [userName], (err, result) => {
		
		if (err) return res.send(err)
		
		if (result.length !== 1) return res.send({
			message: '用户名不存在',
			status: 401
		})
	
        const newPwd = bcrypt.hashSync(result[0].password,10)
	
		const comRes = bcrypt.compareSync(userInfo.password,newPwd )
    
		if (!comRes) return res.send({
			message: '密码错误',
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
			message: '登录成功！！！',
		})
	})
}
let updatePwd = (req,res)=>{
	const sqlStr = 'update admininfo set password=? where userName=?'
    const userInfo = req.body
	
	const {password,userName} = userInfo
    connection.query(sqlStr,[password,userName],(error,result)=>{
          if(error) return res.send("更新失败")
         
		  const user = {
			...result[0], 
			password: '',
		}
		
		  res.send({
				status: 0,
				data:{
					user:user
				},
				message: '更新密码成功！！！',
		  })
	})
}
let resetPwd = (req, res) => {
	const sqlStr = 'update admininfo set password=? where userId=?'
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
			status: 0,
			data: {
				user: user
			},
			message: '更新密码成功！！！',
		})
	})
}
let updateProfile = (req,res)=>{
	
	const sqlStr = 'update admininfo set avatar=?,userName=?,sex=?,number=?,phoneNumber=? where userId=?'
    const {avatar,userName,sex,number,phoneNumber} = req.body
	
    
	const userId = req.params.id
	
	connection.query(sqlStr, [avatar, userName, sex, number, phoneNumber,userId],(error,result)=>{
          if(error) return res.send("更新失败")
		  
		  const user = {
			...result[0], 
			password: '', 
		  }
        
	
		  res.send({
				status: 0,
				data:{
					user:user
				},
				message: '更新信息成功！！！',
		  })
	})
}
let getProfile = (req,res)=>{
	const sqlStr = 'select * from admininfo where userId=?'
    const userId = req.params.id

    connection.query(sqlStr,[userId],(error,result)=>{
          if(error) return res.send("获得失败")
       
		
		  const user = {
			...result[0], 
			password: '', 
		  }
		  res.send({
				status: 0,
				data:{
                   user:user
				},
				message: '获得信息成功！！！',
		  })
	})
}

async function getUserList(userId, sex, startIndex, pageSize, res) {
		try {
			let sqlStr = 'SELECT * FROM admininfo'
		
			let queryParams = []
			if (userId ||sex) {
				sqlStr += ' WHERE'
				if (userId) {
					sqlStr += ' userId=?'
					queryParams.push(userId)
				}
				if (sex) {
					if (userId) {
						sqlStr += ' and'
					}
					sqlStr += ' sex=?'
					queryParams.push(sex)
				}
				

			}
			let ss = sqlStr
			sqlStr += ' LIMIT ?,?'
		    

			let total
			new Promise((resolve, reject) => {
				
				connection.query(ss, queryParams, (error, result) => {
					total = result !== undefined ? result.length : 0

				})
				resolve()
			}).then(() => {
				queryParams.push(startIndex, pageSize)
				connection.query(sqlStr, queryParams, (error, result) => {
				
					res.send({
						status: 201,
						data: {
							rows: result
						},
						total: total
					})


				})

			})




		} catch (error) {
			console.log(error, '数据库查询失败');
		}
	}
module.exports.login = login
module.exports.updatePwd = updatePwd
module.exports.resetPwd = resetPwd
module.exports.updateProfile = updateProfile
module.exports.getProfile = getProfile
module.exports.getUserList = getUserList