const {
  getParkingApplcation,
  updateParkingApplicationOne,
  getParkingApplcationOne
} = require('../../apis/parkingApplication')
const {
  getParkingInfoDetail
} = require('../../apis/parkingInfo')
const {
  getVehicleInfoDetail,
  getVehicleInfoLicenseNumberDetail
} = require('../../apis/vehicleInfo')
var {
  timeFormatSecondssA
} = require('../../utils/datePicker')
var {
  compareDate
} = require('../../utils/compareDate')
var moment = require('../../utils/moment')
var {
  updateParkingInfo
} = require('../../apis/parkingInfo')
const app = getApp()
Page({

  data: {
    parkingAList: [

    ],
    timer: '',
    timeNow: ''
  },
  back() {
    wx.reLaunch({
      url: '/pages/mine/mine',
    })
  },

  onLoad(options) {
    let parkingAId = options.parkingAId
    console.log(parkingAId);
    if (parkingAId) {
      updateParkingApplicationOne(parkingAId, {
        auditResult: '申请成功'
      }).then((res) => {
        console.log(res);
        getParkingApplcationOne(parkingAId).then((res) => {
          console.log(res);
          updateParkingInfo(res.data.parkingId, {
            parkingStatus: '在用车位'
          }).then((res) => {
            console.log(res);
          })
        })

      })
    }
    this.setData({
      timeNow: new Date()
    })
  },
  onReady() {

  },
  onShow() {
    let userInfo = wx.getStorageSync('userInfo')
    let that = this
    getParkingApplcation(userInfo.userId).then((res) => {
      let data = res.data.rows
      var timer = setInterval(() => {
        data.forEach((item) => {


          getVehicleInfoLicenseNumberDetail(item.licenseNumber).then((ress) => {
            item.cardType = ress.data.carType
            item.carBrand = ress.data.carBrand
            item.carColor = ress.data.carColor
            if (item.auditResult == '通过') {
              var Num = 15
              let nowTime = new Date()

              let lastTime = new Date(new Date(timeFormatSecondssA(item.auditTime)).getTime() + (1 / 60) * Num * 3600 * 1000)
              console.log(item);
              console.log(nowTime);
              console.log(lastTime);
              console.log(flag);
              let flag = compareDate(lastTime, nowTime)

              if (flag > 0) {
                let tim = moment(flag).format('mm,ss')

                item.time = {
                  min: parseInt(tim.split(',')[0]),
                  second: parseInt(tim.split(',')[1])

                }

              } else {
                item.time = {
                  min: 0,
                  second: 0
                }

                clearInterval(timer)

                that.setData({
                  timer: null
                })
                updateParkingApplicationOne(item.id, {
                  auditResult: '已失效'
                }).then((res) => {
                  console.log(res);
                  app.sendSocketMessage({
                    msg: 'update parkingA'
                  })
                })

              }
            }
          })
        })

        that.setData({
          parkingAList: data
        })
      }, 1000)
      that.setData({
        timer: timer
      })
    })
    app.globalData.callback = function (msg) {

      console.log(msg);
      that.repaintH()
    }

  },
  repaintH() {
    let userInfo = wx.getStorageSync('userInfo')
    let that = this
    getParkingApplcation(userInfo.userId).then((res) => {
      let data = res.data.rows

      data.forEach((item) => {

        console.log(item);
        getVehicleInfoLicenseNumberDetail(item.licenseNumber).then((ress) => {
          item.cardType = ress.data.carType
          item.carBrand = ress.data.carBrand
          item.carColor = ress.data.carColor

        })
      })

      that.setData({
        parkingAList: data
      })

    })
  },
  onHide() {
    clearInterval(this.data.timer)
    this.setData({
      timer: null
    })
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