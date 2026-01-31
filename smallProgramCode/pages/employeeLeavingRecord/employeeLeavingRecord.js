
const {getLeavingList} = require('../../apis/leavingInfo.js')
var app = getApp()
Page({

  
    data: {
        leavingRecordList:[]
    },
    back(){
      wx.reLaunch({
        url: '/pages/mine/mine',
      })
    },
 
    onLoad(options) {

    },


    onReady() {

    },


    onShow() {
        let userInfo = wx.getStorageSync('userInfo')
        let that = this
        console.log(userInfo.number);
        getLeavingList({number:userInfo.number}).then((res)=>{
            console.log(res);
            console.log(res.data.rows);
             that.setData({
                leavingRecordList:res.data.rows
             })
        })
        console.log(app.globalData)
        console.log(app);

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