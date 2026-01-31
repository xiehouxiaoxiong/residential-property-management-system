const {
  getRepairInfoList
} = require('../../apis/repairInfo')
const user = require('../../apis/user')
var app = getApp()
Page({

  data: {
    repairList: [

    ]
  },
  back() {
    wx.reLaunch({
      url: '/pages/mine/mine',
    })
  },
  goToDetail(e) {
    let id = e.currentTarget.dataset.id
    console.log(id);
    wx.navigateTo({
      url: '/pages/repairDetail/repairDetail?id=' + id,
    })
  },

  onLoad(options) {

  },

  onReady() {

  },


  onShow() {
    let userInfo = wx.getStorageSync('userInfo')

    let that = this
    let data = {
      userId: userInfo.userId
    }
    getRepairInfoList(data).then((res) => {
      console.log(res);
      let data = res.data.rows
      data.forEach((item) => {
        item.userName = userInfo.userName
        item.avatar = userInfo.avatar
      })
      that.setData({
        repairList: data
      })
    })
    app.globalData.callback = function (msg) {

      console.log(msg);
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

  }
})