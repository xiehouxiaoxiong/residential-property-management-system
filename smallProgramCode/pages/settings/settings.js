Page({

  data: {

  },
  back() {
    wx.reLaunch({
      url: '/pages/mine/mine',
    })
  },
  logOut() {
    wx.clearStorageSync()
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },
  changePassword() {
    wx.redirectTo({
      url: '/pages/changePassword/changePassword',
    })
  },

  onLoad(options) {

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