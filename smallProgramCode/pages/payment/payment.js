const {
  getUserInfoDetail
} = require('../../apis/user')
const {
  updateMoneyAll
} = require('../../apis/payment')
var app = getApp()
Page({
  data: {
    content: '',
    payInfo: [{
        name: '余额',
        money: 0
      },
      {
        name: '物业费',
        money: 0
      },
      {
        name: '停车费',
        money: 0
      },
    ]
  },

  onLoad(options) {

  },
  back() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  goToPayRecord() {
    wx.navigateTo({
      url: '/pages/payRecord/payRecord',
    })
  },

  onReady() {

  },


  onShow() {
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
    let that = this
    getUserInfoDetail(userInfo.userId).then((res) => {
      that.setData({
        payInfo: res.data
      })
      let parkingArrearage = res.data.parkingArrearage
      let wuyeArrearage = res.data.wuyeArrearage

      let money = res.data.money
      console.log(parkingArrearage, wuyeArrearage, money);

      if (parkingArrearage > 0 || wuyeArrearage > 0) {

        this.setData({
          content: '当前已欠费，请尽快充值'
        })
        wx.showModal({
          title: '检测到有欠费',
          content: '是否跳转至账单记录进行缴费',
          complete: (res) => {
            if (res.cancel) {

            }

            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/payRecord/payRecord',
              })
            }
          }
        })
      } else {
        this.setData({
          content: '当前未欠费'
        })
      }
    })
    app.globalData.callback = function (msg) {
      that.onShow()
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

  },
  goTopayCenter() {
    wx.navigateTo({
      url: '/pages/payCenter/payCenter',
    })
  },

})