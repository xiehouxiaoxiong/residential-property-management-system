
const {sendSms,sendSmsRonglianyun} = require('../../apis/sendSms')
const {isAreadyRegister} = require('../../apis/user')
const {getEmployeeByNumber} =require('../../apis/employ')
Page({

    data: { 
      role:'业主',
        infoSms:'获取验证码',
        telephoneEdit:false,
        RandomPhoneCode:'',
        Num: 60,  
        forgetPassword:{
            inputCode:'',
            telephone:'',
        }
    },
    checkPhone() {
        var pattern_mobile = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
        if (!this.data.forgetPassword.telephone) {
          wx.showToast({
            icon: 'none',
            title: '手机号不能为空',
          })
          return false;
        } else if (!pattern_mobile.test(this.data.forgetPassword.telephone)) {
          wx.showToast({
            icon: 'none',
            title: '请输入正确的手机号',
          })
          return false
        }
        return true
      },

  
    onLoad(options) {
       
    },
    bindchange(e){
      console.log(e);
      this.setData({
        role:e.detail.value
      })
      
   },
 
    onReady() {

    },
      
  generateMixed(n) {
    let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let res = "";
    for (var i = 0; i < n; i++) {
      var id = Math.ceil(Math.random() * 9);
      res += chars[id];
    }
    return res;
  },
    
    countDown: function () {
        var that = this
        var Num = that.data.Num
        var timer = setInterval(function () {
          Num -= 1;
          that.setData({
            Num: Num,
          })
          if (Num <= -1) {
            clearInterval(timer)
            that.setData({
              Num: 60,
            })
          }
        }, 1000)
      },
      
  setTelephone(e) {
    this.setData({
      ['forgetPassword.telephone']: e.detail.value
    })
    
    wx.setStorageSync('forgetPassword',this.data.forgetPassword )
  },
      
      getCode(e) {
        this.setData({
          ['forgetPassword.inputCode']: e.detail.value
        })
        
        wx.setStorageSync('forgetPassword',this.data.forgetPassword )
      },
    
  sendCode() {
    
    let employPhoneNumber
    if(this.data.role==='业主'){
      var phone = this.data.forgetPassword.telephone
      if (phone.length != 11) {
        wx.showToast({
          title: '请输入11位手机号码',
          icon: "none"
        })
        return
      }
      if(!this.checkPhone()){
        wx.showToast({
            title: '请输入正确格式的手机号码',
            icon: "none"
          })
          return
    }
    this.countDown()
    let that = this
    sendSms(phone).then((res)=>{
      console.log(res);
      that.setData({
        RandomPhoneCode:res.data.zyzy
      })
    }) 
    }else if(this.data.role==='员工'){
      console.log(this.data.forgetPassword.telephone);
      getEmployeeByNumber(this.data.forgetPassword.telephone).then((res)=>{
        console.log(res);
        if(res.status===200){
          employPhoneNumber = res.data.phoneNumber
          this.countDown()
          let that = this
          sendSms(employPhoneNumber).then((res)=>{
            console.log(res);
            that.setData({
              RandomPhoneCode:res.data.zyzy
            })
          }) 
        }else{
          wx.showToast({
            title: '工号填写错误',
            icon:'error'
          })
          return
        }
             })
    }
    
   
   
   
     

  },
  checkPhone() {
    var pattern_mobile = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
    if (!this.data.forgetPassword.telephone) {
      wx.showToast({
        icon: 'none',
        title: '手机号不能为空',
      })
      return false;
    } else if (!pattern_mobile.test(this.data.forgetPassword.telephone)) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的手机号',
      })
      return false
    }
    return true
  },
  confirm(){
   
    if(this.data.role==='业主'){
      if (!this.checkPhone()) {
        return
      }
    }else if(this.data.role==='员工'){
     
    }
    

        if(this.data.forgetPassword.inputCode===''){
          wx.showToast({
            title: '请填写验证码',
            icon:'none'
          })
          return
        }
     
        if(this.data.RandomPhoneCode===this.data.forgetPassword.inputCode){
          let phoneNumber = this.data.forgetPassword.telephone
          console.log(phoneNumber);
          if(this.data.role==='业主'){
            isAreadyRegister(phoneNumber).then((res)=>{
              console.log(res);
              let message = res.message
              if(message.indexOf('已注册')!==-1){
                 wx.navigateTo({
                 url: '/pages/for_changePassword/for_changePassword?phoneNumber='+phoneNumber,
                 })
              }else if(message.indexOf('未注册')!==-1){
               
                wx.showModal({
                  title: '该账号未注册，是否跳转至注册页面',
                  content: '',
                  complete: (res) => {
                    if (res.cancel) {
                       
                    }
                
                    if (res.confirm) {
                        wx.navigateTo({
                          url: '/pages/register/register',
                        })
                    }
                  }
                })
              }
         })
          }else if(this.data.role==='员工'){
            wx.navigateTo({
              url: '/pages/for_changePassword/for_changePassword?number='+this.data.forgetPassword.telephone,
              })
          }
        
         
        }else{
          wx.showToast({
            title: '验证码错误',
            icon:'error'
          })
        }
       
  },
    back(){
        wx.redirectTo({
          url: '/pages/login/login',
        })
    },
 
    onShow() {
      let data = wx.getStorageSync('forgetPassword')
      if(data){
          this.setData({
            forgetPassword:data
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