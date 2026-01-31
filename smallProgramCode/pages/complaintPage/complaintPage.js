
const {addComplaintInfo} = require('../../apis/complaintInfo')
var app = getApp()
Page({

    data: {
        
        complaintInfo:{
          complaintType:'',
          complaintTime:'',
          complaintUserName:'',
          complaintPhoneNumber:'',
          textareaContent:'',
          complaintStatus:'',
          complaintResult:'',
          userId:''
        }
    },

 
    onLoad(options) {
       
    },
    getComplaintUserName(e){
        this.setData({
          ['complaintInfo.complaintUserName']:e.detail.value
        })
        wx.setStorageSync('complaintInfo', this.data.complaintInfo)
    },
    getComplaintPhoneNumber(e){
      this.setData({
        ['complaintInfo.complaintPhoneNumber']:e.detail.value
      })
      wx.setStorageSync('complaintInfo', this.data.complaintInfo)
    },
    textareaContentInput(e){
      this.setData({
        ['complaintInfo.textareaContent']:e.detail.value
      })
      wx.setStorageSync('complaintInfo', this.data.complaintInfo)
    },
    bindchange(e){
       console.log(e.detail.value);
 
       this.setData({
           ['complaintInfo.complaintType']:e.detail.value
       })
       wx.setStorageSync('complaintInfo', this.data.complaintInfo)
    },
    back(){
      wx.reLaunch({
        url: '/pages/index/index',
      })
      },
    submit(){
       if(this.data.complaintInfo.complaintType===''){
         wx.showToast({
           title: '请选择投诉类型',
           icon:'none'
         })
         return
       }
       if(this.data.complaintInfo.complaintUserName===''){
        wx.showToast({
          title: '请填写姓名',
          icon:'none'
        })
        return
      }
      if(this.data.complaintInfo.complaintPhoneNumber===''){
        wx.showToast({
          title: '请填写联系方式',
          icon:'none'
        })
        return
      }
      if(this.data.complaintInfo.textareaContent===''){
        wx.showToast({
          title: '请填写投诉内容',
          icon:'none'
        })
        return
      }
      addComplaintInfo(this.data.complaintInfo).then((res)=>{
        console.log(res);
        if(res.status===200){
          wx.showToast({
            title: '提交成功',
          })
          app.sendSocketMessage({msg:'add complaintInfo'})
          wx.removeStorageSync('complaintInfo')
        }else{
          wx.showToast({
            title: '提交失败',
            icon:'error'
          })
        }
      })
    },

    onReady() {

    },

    onShow() {
      let that = this
      let time = Date.parse(new Date())
      let date = new Date(time)
      let Y = date.getFullYear();
      let M = (date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1)
      let D = date.getDate()<10?'0'+date.getDate():date.getDate()  
      let h = date.getHours()<10?'0'+date.getHours():date.getHours()
      let m = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()
      let s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds()
      let complaintTime = Y+'-'+M+'-'+D+' '+h+':'+m+':'+s
      console.log(complaintTime);
      let userInfo = wx.getStorageSync('userInfo')
      if(!userInfo){
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
      let complaintInfo = wx.getStorageSync('complaintInfo')||{
        complaintType:'',
        complaintTime:complaintTime,
        complaintUserName:'',
        complaintPhoneNumber:'',
        textareaContent:'',
        complaintStatus:'待受理',
        complaintResult:'',
        userId:userInfo.userId
      }
      this.setData({
        complaintInfo:complaintInfo
      })
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