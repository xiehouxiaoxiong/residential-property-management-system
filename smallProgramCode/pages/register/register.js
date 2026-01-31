const {
  registerApi
} = require('../../apis/user')
const {
  sendSms,
  sendSmsRonglianyun
} = require('../../apis/sendSms')
Page({


  data: {
    Num: 60,
    RandomPhoneCode: '',
    telephone: '',
    password: '',
    telephoneEdit: false,
    verificationPassword: '',
    verificationCode: '',
    verificationCodeConfirm: '',
    code: '',
    countDown: 60,
    isSendCode: false,
    timer: null,
    pwdType: 'password',
    pwdType1: 'password'
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
  back() {
    wx.navigateBack()
  },
  onLoad: function (options) {
    wx.login({
      success: (res) => {
        this.setData({
          code: res.code
        })
      }
    })
  },
  pwdTypeEvent() {
    this.setData({
      pwdType: this.data.pwdType == 'password' ? 'text' : 'password'
    })
  },
  pwdTypeEvent1() {
    this.setData({
      pwdType1: this.data.pwdType1 == 'password' ? 'text' : 'password'
    })
  },
  checkPhone() {
    var pattern_mobile = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
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

  setTelephone(e) {
    this.setData({
      telephone: e.detail.value
    })
  },

  setCode(e) {
    this.setData({
      verificationCode: e.detail.value
    })
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

  sendCode() {
    var phone = this.data.telephone
    let that = this
    if (phone.length != 11) {
      wx.showToast({
        title: '请输入11位手机号码',
        icon: "none"
      })
      return
    }
    this.countDown()


    sendSms(this.data.telephone).then((res) => {
      console.log(res);
      that.setData({
        RandomPhoneCode: res.data.zyzy
      })
    })

  },

  setPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },


  setPassword1(e) {
    this.setData({
      verificationPassword: e.detail.value
    })
  },

  vertyPassword() {
    if (this.data.verificationPassword != this.data.password) {
      wx.showToast({
        icon: 'none',
        title: '密码不一致',
      })
      return false
    }
    return true
  },


  async register() {

    if (!this.checkPhone()) {
      return false
    }

    if (this.data.password == '') {
      wx.showToast({
        title: '密码为空',
        icon: 'error'
      })
      return false
    }
    if (this.data.verificationCode == '') {
      wx.showToast({
        title: '验证码为空',
        icon: 'error'
      })
      return false
    }

    if (!this.vertyPassword()) {
      return false
    }
    if (this.data.verificationCode !== this.data.RandomPhoneCode) {
      wx.showToast({
        title: '验证码输入错误',
        icon: 'error'
      })
      return false
    }
    try {
      wx.getUserProfile({
        desc: '用于完善业主资料',
        success: (res) => {
          console.log(res)
          var nickName = res.userInfo.nickName
          var avatarUrl = res.userInfo.avatarUrl
          let data = {
            phoneNumber: this.data.telephone,
            password: this.data.password,
            userName: nickName,
            avatar: avatarUrl
          }
          registerApi(data).then((res) => {
            console.log(res);
            if (res.status == 200) {
              wx.showToast({
                title: '注册成功',
                success(res) {
                  wx.navigateBack()
                }
              })
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'error'
              })
            }
          })

        }
      })
    } catch (error) {
      wx.showModal({
        content: JSON.stringify(error)
      })
    }
  },
})