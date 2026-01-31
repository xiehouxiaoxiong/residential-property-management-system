const user = require("../../apis/user")
const {loginApi,updatePwdByUserId} = require('../../apis/user')
const {loginEmployee,changePasswordEmployee,updateEmployee} =require('../../apis/employ')

Page({


    data: {
       phoneNumber:'',
       userId:'',
       beforePassword:'',
       password:'',
       confirmPassword:''
    },

 
    onLoad(options) {

    },
    submit(){
      let that = this
      if(that.data.beforePassword===''){
        wx.showToast({
          title: '请输入原密码',
          icon:'none'
        })
        return
      }
      if(that.data.password===''){
        wx.showToast({
          title: '请输入新密码',
          icon:'none'
        })
        return
      }
      if(that.data.confirmPassword===''){
        wx.showToast({
          title: '请输入确认密码',
          icon:'none'
        })
        return
      }
      if(that.data.password!==that.data.confirmPassword){
        wx.showToast({
          title: '新密码和确认密码不一致',
          icon:'none'
        })
        return
      }
      let role = wx.getStorageSync('role')
 
      if(role==='业主'){
        loginApi({phoneNumber:that.data.phoneNumber,password:that.data.beforePassword}).then((res)=>{
          console.log(res);
          if(res.status===401){
            wx.showToast({
              title: '原密码错误',
              icon:'error'
            })
          }
          if(res.status===200){
            updatePwdByUserId({userId:that.data.userId,password:that.data.confirmPassword}).then((res)=>{
              console.log(res);
              if(res.status===200){
                wx.showToast({
                  title: '修改密码成功',
                })
              }else{
                wx.showToast({
                  title: '修改密码失败',
                  icon:'error'
                })
              }
            })
            
          }
        })
      }else{
        loginEmployee({number:that.data.userId,password:that.data.beforePassword}).then((res)=>{
          console.log(res);
          if(res.status===401){
            wx.showToast({
              title: '原密码错误',
              icon:'error'
            })
          }
          if(res.status===200){
            changePasswordEmployee({number:that.data.userId,password:that.data.confirmPassword}).then((res)=>{
              console.log(res);
              if(res.status===200){
                wx.showToast({
                  title: '修改密码成功',
                })
              }else{
                wx.showToast({
                  title: '修改密码失败',
                  icon:'error'
                })
              }
            })
            
          }
        })
      }
      
      
      
      
    },
    back(){
      wx.redirectTo({
        url: '/pages/settings/settings',
      })
    },
    getConfirmPassword(e){
      this.setData({
        confirmPassword:e.detail.value
      })
    },
    getBeforePassword(e){
      this.setData({
        beforePassword:e.detail.value
      })
    },
    getPassword(e){
      this.setData({
        password:e.detail.value
      })
    },

    onReady() {

    },

    onShow() {
        let userInfo = wx.getStorageSync('userInfo')
        let role=wx.getStorageSync('role')
        if(role==='业主'){
          this.setData({
            userId:userInfo.userId,
            phoneNumber:userInfo.phoneNumber
          })
        }else{
          this.setData({
            userId:userInfo.number,
            phoneNumber:userInfo.phoneNumber
          })
        }
        
    },

    
    onHide() {

    },


    onUnload() {

    },

    onPullDownRefresh() {

    },

    onReachBottom() {

    },
    onShareAppMessage() {

    }
})