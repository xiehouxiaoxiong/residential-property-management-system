const app = getApp();
var id = 11;
const {
  getAllCarLicenseNumber,
  deleteVehicleInfo
} = require('../../apis/vehicleInfo')
Page({


  data: {
    info: [],
    show: false
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  showIDCard() {
    this.setData({
      show: true
    })
  },
  removeCar(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除提示',
      content: '该操作不可逆，是否继续',
      success(res) {
        if (res.confirm) {
          deleteVehicleInfo(id).then((res) => {
            console.log(res);
            if (res.status === 200) {
              that.onShow()
              app.sendSocketMessage({
                msg: 'delete mycarInfo'
              })
            } else {
              console.log('请求失败', err);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onShow() {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo')
    getAllCarLicenseNumber(userInfo.userId).then((res) => {
      console.log(res);
      that.setData({
        info: res.data
      })
    })
    app.globalData.callback = function (msg) {

      console.log(msg);
      that.onShow()
    }
  },
  back() {
    wx.reLaunch({
      url: '/pages/mine/mine',
    })
  },
  clickAddCarDetail: function () {

    wx.navigateTo({

      url: '../add_car/add_car',

      success: function (res) {
        console.log("跳转成功" + res)

      },

      fail: function (res) {
        console.log("跳转失败" + res)

      },

    })

  }
})