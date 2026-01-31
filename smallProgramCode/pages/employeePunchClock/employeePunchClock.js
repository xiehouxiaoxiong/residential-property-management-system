
const util = require('../../utils/util')
const getDistance = require('../../utils/getDistance')

var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
const app = getApp()
import { setWatcher } from '../../utils/watch';

const qqmapsdk= new QQMapWX({
  key: 'Z2VBZ-DMK65-QI4IY-I744Z-SO6BE-BAFEF' 
})
const {addAttendance,updateAttendance,getAttendance} = require('../../apis/attendance')

Page({


  data: {
    time:'',
    flag:0,
    userInfo:'',
    attendanceInfo:'',
    markers: '',
    poi: {
      latitude: '',
      longitude: ''
    },
    addressName: '',
    time: '',
    timer: '',
    timer2: '',  
    canClick: true,
    patrolForm:{
      checkaddress:'',
      searchtime:'',
      searchuser:'',
      latandlon:'',
    }
  },
 
  getAddress(e) {
    var that = this;

    qqmapsdk.reverseGeocoder({
 
      success: function(res) {
 
        that.setData({
          addressName: res.result.address
        })
        var res = res.result;
        var mks = [];
        mks.push({ 
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: '../../images/location/myPosition.png', 
          width: 21,
          height: 28,
      
        });
        that.setData({ 
          markers: mks,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          }
        });
        let distance = getDistance.getDistance(res.location.lat,res.location.lng,30,104)
        console.log(distance);
        that.setData({
          distance:distance
        })
     
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  },
  getTime: function () {
    let that = this
    let time = that.data.time
    that.setData({
      timer: setInterval(function () {
        time = util.formatTime(new Date())
        that.setData({
          time: time.substr(-8)
        });
        if (time == 0) {
         
          clearInterval(that.data.timer)
        }
      }, 1000)
    })
  },
  rePosition: function () {
    console.log('用户点了重新定位')
    this.getAddress()
  },
  checkIn: function () {
 
    console.log('用户点击了签到')

    
    var that = this
    var nowTime = util.formatTime(new Date())
    wx.showModal({
      title: '请确认打卡信息',
 
      content: `地点：${this.data.addressName}\n时间：${nowTime}`, 
      confirmText: '确认',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let distance = that.data.distance
          if(distance<=300){
            console.log('ok qiandao');
      
            that.realyCheckIn()
           
          }else if(distance>300){
            wx.showToast({
              title: '距离超过300米',
              icon:'none'
            })
            that.setData({
              canClick: true
            })
          }
         
          
        } else if (res.cancel) {
          console.log('用户点击取消')
          that.setData({
            canClick: true
          })
        }
      }
    })
  },
  realyCheckIn: function() {
    var that = this
    var patrolForm = that.data.patrolForm 

    console.log(that.data)

    patrolForm.checkaddress = this.data.addressName
    patrolForm.searchtime = util.formatTime(new Date())
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return
    }else{
      patrolForm.searchuser = userInfo.number

      patrolForm.latandlon = this.data.poi.longitude + "," + this.data.poi.latitude
      console.log(patrolForm)
      console.log("↑ 签到提交的post参数")

      wx.showToast({
        title: '签到成功',
      })
      let flag = that.data.flag
      console.log(flag);
      if(flag){
        let clockInDays
        getAttendance(that.data.userInfo.number).then((res)=>{
          clockInDays = res.data.clockInDays
          console.log(clockInDays);
          updateAttendance(that.data.userInfo.number,{clockInDays:clockInDays+1}).then((res)=>{
            console.log(res);
            if(res.status===200){
              that.setData({
                canClick:false
              })
              app.sendSocketMessage({msg:'update punchClock'})
            }
          })
        })
        
      
      }else{
        let data={number:that.data.userInfo.number,clockInDays:1,absenceDays:0}
        addAttendance(data).then((res)=>{
          console.log(res);
          if(res.status===200){
            that.setData({
              canClick:false
            })
            app.sendSocketMessage({msg:'update punchClock'})
          }
        })
        that.setData({
          flag:1
        })
      }
    }

    
    

  
  
      
 
  },
  back(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  onLoad: function (options) {
    var that = this
    that.getTime()
    that.getAddress()
    setWatcher(that);
    that.setData({
      canClick: true, 
      timer2: setInterval(function () {
        that.getAddress()
      }, 20000),  
      time:new Date().getTime()
    })
  },


  onUnload: function () {
    clearInterval(this.data.timer)
    clearInterval(this.data.timer2)
    console.log("定时器已被清除")
  },


  onReady: function () {

  },
  watch:{
       time:{
          handler(v,o){
              if(v==='0:00:00'||v==='00:00:00'){
                this.setData({
                  canClick:true
                })
              }
          },
          deep:true
       }
  },

  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo')
    let that = this
    getAttendance(userInfo.number).then((res)=>{
      console.log(res);
      if(res.data){
          that.setData({
            flag:1,
            userInfo:userInfo,
            attendanceInfo:res.data
          })
      }else{
        that.setData({
          flag:0,
          userInfo:userInfo
        })
        console.log(")))))");
      }
    })
  },


  onHide: function () {

  },


  onPullDownRefresh: function () {

  },


  onReachBottom: function () {

  },

  
  onShareAppMessage: function () {

  }
})