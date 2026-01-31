const {
  getAllCarLicenseNumber
} = require('../../apis/vehicleInfo')
const {
  addParkingApplication
} = require('../../apis/parkingApplication')
const {
  getParkingId,
  getParkingNumber,
  getParkingInfoDetail
} = require('../../apis/parkingInfo')
const app = getApp()
Page({


  data: {
    indexparkingName: '',
    userName: '',
    disabled: true,
    arrayparkingName: ['东区', '西区', '南区', '北区'],
    arrayLicenseNumber: [],
    arrayparkingNumber: [],
    parkingName: '',
    parkingNumber: '',
    parkingApplication: {
      parkingStartTime: '2024-04-01',
      parkingEndTime: '2024-05-01',
      auditResult: '',
      auditOpinion: '',
      userId: '',
      parkingId: '',
      licenseNumber: '',
      applicationUserName: '',
      applicationPhoneNumber: ''
    },

    selectValue: '',
  },
  goToNumber() {
    if (this.data.parkingName === '') {
      this.setData({
        disabled: true
      })
      wx.showToast({
        title: '请先选择停车场',
        icon: 'none'
      })
    }
  },
  PickerChangelicenseNumber(e) {
    console.log(e);
    this.setData({
      ['parkingApplication.licenseNumber']: this.data.arrayLicenseNumber[e.detail.value]
    })
    wx.setStorageSync('parkingApplication', this.data.parkingApplication)
  },
  PickerChangeParking(e) {
    console.log(e);
    if(this.data.parkingName!==this.data.arrayparkingName[e.detail.value]){
      this.setData({
        parkingNumber:''
      })
    }
    this.setData({
      parkingName: this.data.arrayparkingName[e.detail.value],
      disabled: false,
  
    })
    let that = this
    if (this.data.parkingName !== '' && this.data.parkingNumber !== '') {
      getParkingId(this.data.parkingName, this.data.parkingNumber).then((res) => {
        console.log(res);
        that.setData({
          ['parkingApplication.parkingId']: res.data.id
        })
        wx.setStorageSync('parkingApplication', that.data.parkingApplication)
      })
    } 
      console.log(that.data.parkingName);
      getParkingNumber(that.data.parkingName).then((res) => {
        console.log(res);
        let data = res.data.map((item) => {
          return item.parkingNumber + '号-----------' + item.parkingStatus
        })
        that.setData({
          arrayparkingNumber: data,
        
        })
      })

    

  },
  PickerChangeNumber(e) {
    this.setData({
      parkingNumber: this.data.arrayparkingNumber[e.detail.value]
    })
    let that = this
    if (that.data.parkingName !== '' && that.data.parkingNumber !== '') {
      getParkingId(that.data.parkingName, that.data.parkingNumber.split('号')[0]).then((res) => {
        console.log(res);
        that.setData({
          ['parkingApplication.parkingId']: res.data[0].id
        })
        wx.setStorageSync('parkingApplication', that.data.parkingApplication)
      })
    }
  },
  getApplicationUserName(e) {
    this.setData({
      ['parkingApplication.applicationUserName']: e.detail.value
    })
    wx.setStorageSync('parkingApplication', this.data.parkingApplication)
  },
  getApplicationPhoneNumber(e) {
    this.setData({
      ['parkingApplication.applicationPhoneNumber']: e.detail.value
    })
    wx.setStorageSync('parkingApplication', this.data.parkingApplication)
  },
  DateStartChange(e) {
    this.setData({
      ['parkingApplication.parkingStartTime']: e.detail.value
    })
  },
  DateEndChange(e) {
    console.log(e.detail);
    if (e.detail.value.split('-')[2] !== this.data.parkingApplication.parkingStartTime.split('-')[2]) {
      wx.showToast({
        title: '只能整月申请',
        icon: 'error'
      })
    }
    let value = e.detail.value.split('-')[0] + '-' + e.detail.value.split('-')[1] + '-' + this.data.parkingApplication.parkingStartTime.split('-')[2]
    console.log(value);
    this.setData({
      ['parkingApplication.parkingEndTime']: value
    })
  },

  onLoad: function (options) {

  },
  submit() {
    console.log(this.data.parkingApplication);

    if (this.data.parkingApplication.licenseNumber === '') {
      wx.showToast({
        title: '请选择车牌号',
        icon: 'none'
      })
      return
    }
    if (this.data.parkingName === '') {
      wx.showToast({
        title: '请选择停车场',
        icon: 'none'
      })
      return
    }
    if (this.data.parkingNumber === '' || this.data.parkingNumber.indexOf('空闲') === -1) {
      wx.showToast({
        title: '请填写车位号或选择空闲车位',
        icon: 'none'
      })
      return
    }
    if (this.data.parkingApplication.applicationUserName === '') {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return
    }
    if (this.data.parkingApplication.applicationPhoneNumber === '') {
      wx.showToast({
        title: '请填写联系方式',
        icon: 'none'
      })
      return
    }
    if (this.data.parkingApplication.parkingStartTime === '') {
      wx.showToast({
        title: '请选择车位开始使用时间',
        icon: 'none'
      })
      return
    }
    if (this.data.parkingApplication.parkingEndTime === '') {
      wx.showToast({
        title: '请选择车位结束使用时间',
        icon: 'none'
      })
      return
    }
    console.log(this.data.parkingApplication);
    addParkingApplication(this.data.parkingApplication).then((res) => {
      console.log(res);
      if (res.status === 200) {
        wx.showToast({
          title: '提交成功'
        })
        app.sendSocketMessage({
          msg: 'add parkingAInfo'
        })
        wx.removeStorageSync('parkingApplication')
      } else {
        wx.showToast({
          title: '提交失败',
          icon: 'error'
        })
      }

    })

  },
  back() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },


  onReady: function () {

  },

  onShow: function () {
    let that = this
    let time = Date.parse(new Date())
    let date = new Date(time)
    let Y = date.getFullYear();
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    let Mtor = (date.getMonth() + 2 < 10 ? '0' + (date.getMonth() + 2) : date.getMonth() + 2)
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let nowDay = Y + '-' + M + '-' + D
    let nextMonth = Y + '-' + Mtor + '-' + D
    console.log(nowDay);
    that.setData({
      nowDay: nowDay,
    })
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
    getAllCarLicenseNumber(userInfo.userId).then((res) => {
      console.log(res);
      let license = res.data.map((item) => {
        return item.licenseNumber
      })
      that.setData({
        arrayLicenseNumber: license
      })
    })

    let parkingApplication = wx.getStorageSync('parkingApplication') || {
      parkingStartTime: nowDay,
      parkingEndTime: nextMonth,
      auditResult: '待审核',
      auditOpinion: '',
      userId: userInfo.userId,
      parkingId: '',
      licenseNumber: '',
      applicationUserName: '',
      applicationPhoneNumber: ''
    }
    console.log(parkingApplication.parkingId);
    if (parkingApplication.parkingId) {
      getParkingInfoDetail(parkingApplication.parkingId).then((res) => {
        console.log(parkingApplication.parkingId);
        console.log(res);
        that.setData({
          parkingName: res.data.parkingName,
          parkingNumber: res.data.parkingNumber + '号-----------' + res.data.parkingStatus
        })
      })
    }

    that.setData({
      parkingApplication: parkingApplication
    })
    app.globalData.callback = function (msg) {
      that.onShow()
    }
  },


  onHide: function () {

  },


  onUnload: function () {

  },


  onPullDownRefresh: function () {

  },


  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})