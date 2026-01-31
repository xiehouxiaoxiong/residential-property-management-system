
const {updatePwdByPhoneNumber} =require('../../apis/user')
const {changePasswordEmployee} = require('../../apis/employ')
Page({

    data: {
       confirmPwd:'',
       newPwd:'',
       phoneNumber:''
    },
    getConfirmPwd(e){
        this.setData({
            confirmPwd:e.detail.value
        })
    },
    confirm(){
       if(this.data.newPwd===''){
           wx.showToast({
             title: '请输入新密码',
             icon:'none'
           })
        return
       }
       if(this.data.confirmPwd==''){
        wx.showToast({
            title: '请再次输入密码',
            icon:'none'
          })
          return 
       }
       if(this.data.newPwd!==this.data.confirmPwd){
        wx.showToast({
            title: '两次密码不一致',
            icon:'none'
          })
          return
       }
       console.log({phoneNumber:this.data.phoneNumber,password:this.data.confirmPwd});
       if(this.data.phoneNumber!==0){
        updatePwdByPhoneNumber({phoneNumber:this.data.phoneNumber,password:this.data.confirmPwd}).then((res)=>{
          console.log(res);
            if(res.status===200){
                wx.showToast({
                  title: '重置密码成功',
                })
                wx.redirectTo({
                  url: '/pages/login/login',
                })
            }else{
             wx.showToast({
                 title: '重置密码失败',
                 icon:'error'
               })
            }
        })
       }else{
        changePasswordEmployee({number:this.data.number,password:this.data.confirmPwd}).then((res)=>{
          console.log(res);
            if(res.status===200){
                wx.showToast({
                  title: '重置密码成功',
                })
                wx.redirectTo({
                  url: '/pages/login/login',
                })
            }else{
             wx.showToast({
                 title: '重置密码失败',
                 icon:'error'
               })
            }
        })
       }
       
    },
    back(){
      wx.navigateTo({
        url: '/pages/forgetPassword/forgetPassword',
      })
    },
    setNewPwd(e){
        this.setData({
            newPwd:e.detail.value
        })

    },

    onLoad(options) {
        let phoneNumber = options.phoneNumber||0
        let number = options.number||0
        console.log(phoneNumber);
        this.setData({
            phoneNumber:phoneNumber,
            number:number
        })
    },

    
    onReady() {

    },

    
    onShow() {
      
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