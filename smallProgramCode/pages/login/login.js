const app = getApp()
const {loginApi} =require("../../apis/user")
const {loginEmployee} = require('../../apis/employ')
Page({
  data: {
    telephone: '',
    password: '',
    checked: false,
    inputType: 'password',
    role:'业主'
  },
  
  setPhone(e) {
    if(this.data.role===''){
      wx.showToast({
        title: '请先选择身份',
        icon:'none'
      })
      return
    }else{
      this.setData({
        telephone: e.detail.value
      })
    }
    
  },
  bindchange(e){
    console.log(e);
    this.setData({
      role:e.detail.value,
      telephone:'',
      password:''
    })
    
 },
  back() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  
  showPwd() {
    this.setData({
      inputType: this.data.inputType == 'password' ? 'text' : 'password'
    })
  },
  
  checkboxChange(e) {
    this.setData({
      checked: !this.data.checked
    })
  },
  
  checkPhone: function () {
    var pattern_mobile = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
    if (!this.data.phone) {
      this.remind('手机号不能为空');
    }
    
    
    
    else if (pattern_mobile.test(this.data.phone)) {
      return true
    } else {
      this.remind('请输入正确的手机号');
    }
  },

  
  setPwd(e) {
    if(this.data.role===''){
      wx.showToast({
        title: '请先选择身份',
        icon:'none'
      })
      return
    }else{
      this.setData({
        password: e.detail.value
      })
    }
   
  },
  checkPhone() {
    var pattern_mobile = /^((\+?86)|(\(\+86\)))?1[3578]\d{9}$/;
    if (!this.data.telephone) {
      wx.showToast({
        icon: 'none',
        title: '手机号不能为空',
      })
      return false;
    } else if (!pattern_mobile.test(this.data.telephone)) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的手机号',
      })
      return false
    }
    return true
  },
  test() {
    console.log(11)
  },
  
  async login() {
    console.log(this.data.role);
    
    if(this.data.role===''){
      wx.showToast({
        title: '请选择身份',
        icon:'none'
      })
      return
    }
    if(this.data.role==='员工'){
      if(this.data.telephone===''){
        wx.showToast({
          title: '请填写工号',
          icon:'none'
        })
        return
      }
      if(this.data.password===''){
        wx.showToast({
          title: '请填写密码',
          icon:'none'
        })
        return
      }
      loginEmployee({number:this.data.telephone,password:this.data.password}).then((res)=>{
        console.log(res);
        if(res.status===200){
          wx.setStorageSync('userInfo', res.data.user)
          wx.setStorageSync('token', res.data.token)
          wx.showToast({
            title: res.message,
            icon: 'success'
          })
          wx.setStorageSync('role', '员工')
          wx.reLaunch({
            url: '/pages/index/index',
          })
          
        }else{
          wx.showToast({
            title: res.message,
            icon:'error'
          })
        }
      })
    }else{
      if(this.data.telephone===''){
        wx.showToast({
          title: '请填写手机号',
          icon:'none'
        })
        return
      }
    if (this.checkPhone()) {
      try {
        if(this.data.password===''){
          wx.showToast({
            title: '请填写密码',
            icon:'none'
          })
          return
        }
        
        let userInfo = {"phoneNumber":this.data.telephone,"password":this.data.password}
   
        loginApi(userInfo).then((res)=>{
          console.log(res);
          
          if (res.status === 200) {
            wx.setStorageSync('role', '业主')
            wx.setStorageSync('userInfo', res.data.user)
            wx.setStorageSync('token', res.data.token)
            wx.showToast({
              title: res.message,
              icon: 'success'
            })
          
            wx.reLaunch({
              url: '/pages/index/index',
            })

          } else {
            wx.showToast({
              title: res.message,
              icon:'none'
            })
          }
        })
        
      
      } catch (error) {
        wx.showToast({
          icon: 'none',
          title: error.message || '请求异常',
        })
      }
    }
  }
  },
  onShow(){
    let that = this
    app.globalData.callback = function (msg) {
      
      console.log(msg);
      that.login()
   }
  }
})