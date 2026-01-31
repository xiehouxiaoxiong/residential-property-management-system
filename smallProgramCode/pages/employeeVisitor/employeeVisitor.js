const {addvisitorInfo} = require('../../apis/visitor');
var dateTimePicker = require('../../utils/datePicker');
var app = getApp()
Page({


  data: {
    dateTimeArray1: null,
    dateTime1: null,
    startYear: null,
    endYear: null,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`
      } else if (type === 'hour') {
        return `${value}时`
      } else if (type === 'minute') {
        return `${value}分`
      }else{
        console.log(value)
        return value
      }
    },
    minDate:'',
    maxDate:'',
    arrayCredentialsType:['身份证','临时身份证','护照','户口簿','港澳居民来往台湾通行证','外国人居留证','中国人民解放军军人保障卡','军官证','武警警官证','士兵证','军队学员证'],
    visitorInfo:{
      credentialsType:'',
      sex:'',
      userName:'',
      phoneNumber:''
    },
    showEnterTime:false,
    showLeavingTime:false
  },
  getEnterTime(){
    this.setData({
      showEnterTime:true,
    
    })
  },
  getLeavingTime(){
    this.setData({
      showLeavingTime:true
    })
  },
  getPhoneNumber(e){
    console.log(e);
    this.setData({
      ['visitorInfo.phoneNumber']:e.detail.value
    })
    wx.setStorageSync('visitorApplication', this.data.visitorInfo)
  },
  PickerCredentialsType(e){
    console.log(e);
    this.setData({
      ['visitorInfo.credentialsType']:this.data.arrayCredentialsType[e.detail.value]
    })
    wx.setStorageSync('visitorApplication', this.data.visitorInfo)
  },
  onClickReason(e){
    this.setData({
      ['visitorInfo.visitorReason']:e.detail.value
    })
    wx.setStorageSync('visitorApplication', this.data.visitorInfo)
  },
  getCredentials(e){
    this.setData({
      ['visitorInfo.credentials']:e.detail.value
    })
    wx.setStorageSync('visitorApplication', this.data.visitorInfo)
  },
  onChangeInterviewee(e){
    this.setData({
      ['visitorInfo.interviewee']:e.detail.value
     })
     wx.setStorageSync('visitorApplication', this.data.visitorInfo)
  },
  onChangeAccompanyingNumber(e){
     this.setData({
      ['visitorInfo.accompanyingNumber']:e.detail.value
     })
     wx.setStorageSync('visitorApplication', this.data.visitorInfo)
  },
  bindchangeSex(e){
    console.log(e);
    this.setData({
      ['visitorInfo.sex']:e.detail.value
    })
    wx.setStorageSync('visitorApplication', this.data.visitorInfo)
  },

    sendSocketMessage: function(msg) {
      let that = this
      console.log(msg);
      return new Promise((resolve, reject) => {
      app.sendSocketMessage(msg)
      app.globalData.callback = function (res) {
          console.log('收到服务器内容', res)
          resolve(res)
      }
      })
  },
  onLoad: function (options) {
   
  },
  onChangeUserName(e){
    this.setData({
      ['visitorInfo.userName']:e.detail.value
    })
    wx.setStorageSync('visitorApplication', this.data.visitorInfo)
  },
  onChangePhoneNumber(e){
    this.setData({
      ['visitorInfo.phoneNumber']:e.detail.value
    })
    wx.setStorageSync('visitorApplication', this.data.visitorInfo)
  },
  submit(){
    if(!this.data.visitorInfo.userName){
      wx.showToast({
        title: '请填写姓名',
        icon:'none'
      })
    }else if(!this.data.visitorInfo.phoneNumber){
      wx.showToast({
        title: '请填写联系方式',
        icon:'none'
      })
    }else if(!this.data.visitorInfo.sex){
      wx.showToast({
        title: '请选择性别',
        icon:'none'
      })
    }else if(!this.data.visitorInfo.credentialsType){
      wx.showToast({
        title: '请选择有效证件类型',
        icon:'none'
      })
    }else if(!this.data.visitorInfo.credentials){
      wx.showToast({
        title: '请填写证件',
        icon:'none'
      })
    }else if(!this.data.visitorInfo.visitorReason){
      wx.showToast({
        title: '请填写来访原因',
        icon:'none'
      })
    }else if(!this.data.visitorInfo.accompanyingNumber){
      wx.showToast({
        title: '请填写随行人数',
        icon:'none'
      })
    }else if(!this.data.visitorInfo.interviewee){
      wx.showToast({
        title: '请填写被访人姓名',
        icon:'none'
      })
    }else if(!this.data.visitorInfo.enterTime){
      wx.showToast({
        title: '请填写进入时间',
        icon:'none'
      })
    }else{
      let visitorInfo = this.data.visitorInfo
      console.log(visitorInfo);
      let that = this
      addvisitorInfo(visitorInfo).then((res)=>{
        console.log(res);
        if(res.status===200){
          wx.showToast({
            title: '修改成功',
            icon:'success'
          })    
          app.sendSocketMessage({msg:'add visitorInfo'})
          wx.removeStorageSync('visitorApplication')
        }else{
          wx.showToast({
            title: '修改失败',
            icon:'none'
          })
        }
      })
      
    }
    
  },
  back(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  onClick(e){

    this.setData({
     ['visitorInfo.userName']:e.detail.value
     
   })
   wx.setStorageSync('visitorApplication', this.data.visitorInfo)

  },
  onClose(){
    this.setData({
        show:false
    })
  },


  onReady: function () {
    
  },
  onCancel(){
    this.setData({
      showEnterTime:false
    })
  },
  onCancelLeaving(){
    this.setData({
      showLeavingTime:false
    })
  },
  onConfirm(event){
    this.setData({
      showEnterTime:false,
      ['visitorInfo.enterTime']:dateTimePicker.timeFormatSeconds(event.detail)
      
    })
    wx.setStorageSync('visitorApplication', this.data.visitorInfo)
  },
  
  onConfirmLeaving(event){
    this.setData({
      showLeavingTime:false,
      ['visitorInfo.leavingTime']:dateTimePicker.timeFormatSeconds(event.detail)
    })
    wx.setStorageSync('visitorApplication', this.data.visitorInfo)
  },

  onShow: function () {
    let that = this

    that.setData({
      minDate:new Date().getTime(),
      maxDate:new Date(2040,12,12).getTime()
    })

   
  
    let userInfo = wx.getStorageSync('userInfo')
   
  
    
    if(!userInfo){
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
    let data = wx.getStorageSync('visitorApplication')||{securityEmployeeId:userInfo.number}
    that.setData({
      visitorInfo:data
    })
    
    app.globalData.callback = function (msg) {
      
      console.log(msg);
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
    
  },
 
})