
var dateTimePicker = require('../../utils/datePicker');
const {addleavingInfo} =require('../../apis/leavingInfo.js');
const user = require('../../apis/user');
var app = getApp()
Page({

    data: {
        arrayPretext:['病假','事假'],
        leavingInfo:{},
        showEnterTime:'',
        showLeavingTime:'',
        minDate:'',
        maxDate:'',
        address:'请选择地址',
        detailAddress:'',
        userInfo:'',
        leavingDateStart:'',
        leavingDateEnd:'',
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
        }
    },
    pickerPretext(event){
        this.setData({
            ['leavingInfo.pretext']:this.data.arrayPretext[event.detail.value]
        })
        wx.setStorageSync('leavingApplication', this.data.leavingInfo)
    },
    submit(){
        if(!this.data.leavingDateStart){
          wx.showToast({
            title: '请选择开始时间',
            icon:'none'
          })
        }else if(!this.data.leavingDateEnd){
          wx.showToast({
            title: '请选择结束时间',
            icon:'none'
          })
        }else if(!this.data.leavingInfo.pretext){
          wx.showToast({
            title: '请选择事由类型',
            icon:'none'
          })
        }else if(!this.data.leavingInfo.leavingAddress){
          wx.showToast({
            title: '请选择外出地址',
            icon:'none'
          })
       }else{
          let leavingInfo = this.data.leavingInfo
          leavingInfo.leavingDate =this.data.leavingDateStart+'至'+this.data.leavingDateEnd
          leavingInfo.leavingStatus='待审核'
          leavingInfo.number = this.data.userInfo.number
          console.log(leavingInfo);
          addleavingInfo(leavingInfo).then((res)=>{
            console.log(res);
            if(res.status===200){
              wx.showToast({
                title: '提交成功',
                icon:'success'
              })    
              app.sendSocketMessage({msg:'add leavingInfo'})
              console.log(app.globalData);
     
              wx.removeStorageSync('leavingApplication')
            }else{
              wx.showToast({
                title: '提交失败',
                icon:'none'
              })
            }
          })
          
        }
        
      },
    onConfirm(event){
        console.log(event.detail);
        this.setData({
          showEnterTime:false,
          leavingDateStart:dateTimePicker.timeFormatSecondss(event.detail)
          
        })
   
        this.setData({
            ['leavingInfo.leavingDate']:this.data.leavingDateStart+'至'+this.data.leavingDateEnd
        })
        console.log(dateTimePicker.timeFormatSecondss(event.detail));
        wx.setStorageSync('leavingApplication', this.data.leavingInfo)
      },
    onConfirmLeaving(event){
        this.setData({
          showLeavingTime:false,
          leavingDateEnd:dateTimePicker.timeFormatSecondss(event.detail)
        })
    
        this.setData({
            ['leavingInfo.leavingDate']:this.data.leavingDateStart+'至'+this.data.leavingDateEnd
        })
        wx.setStorageSync('leavingApplication', this.data.leavingInfo)
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

    getDetailAddress(e){
         this.setData({
             detailAddress:e.detail.value
         })
     
       
            this.setData({
                ['leavingInfo.leavingAddress']:this.data.address+''+e.detail.value
            })
            wx.setStorageSync('leavingApplication', this.data.leavingInfo)
    },
    addressSelecter(e){
    console.log(e.detail[0])
    this.setData({
        address:e.detail[0]
    })

    this.setData({
        ['leavingInfo.leavingAddress']:this.data.address+','+this.data.detailAddress
    })
    wx.setStorageSync('leavingApplication', this.data.leavingInfo)
    }, 
    back(){
       wx.reLaunch({
         url: '/pages/mine/mine',
       })
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
    
    onLoad(options) {

    },

   
    onReady() {

    },

  
    onShow() {
        let that =this
        let userInfo = wx.getStorageSync('userInfo')
        let leavingInfo = wx.getStorageSync('leavingApplication')||{number:userInfo.number}
 
        that.setData({
            minDate:new Date().getTime(),
            maxDate:new Date(2040,12,12).getTime(),
            userInfo:userInfo,
            leavingInfo:leavingInfo,
            leavingDateStart:leavingInfo.leavingDate?leavingInfo.leavingDate.split('至')[0]:'',
            leavingDateEnd:leavingInfo.leavingDate?leavingInfo.leavingDate.split('至')[1]:'',
            address:leavingInfo.leavingAddress?leavingInfo.leavingAddress.split(',')[0]+leavingInfo.leavingAddress.split(',')[1]+leavingInfo.leavingAddress.split(',')[2]:'请选择地址',
            detailAddress:leavingInfo.leavingAddress?leavingInfo.leavingAddress.split(',')[3]:''
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