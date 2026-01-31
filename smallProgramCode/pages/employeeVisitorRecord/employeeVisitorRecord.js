
const {getVisitor} = require('../../apis/visitor')
var app = getApp()
Page({

 
    data: {
        visitorList:[]
    },

   
    onLoad(options) {
      this.createSocketServer()
    },

    createSocketServer(){
      
        wx.connectSocket({url: 'ws://localhost:8080'})
   
        wx.onSocketOpen(()=>{ })
     
        wx.onSocketMessage((msg)=>{
         
            console.log(msg.data);
         
        })
    
    
      },
    back(){
      wx.reLaunch({
        url: '/pages/mine/mine',
      })
    },

    onReady() {

    },


    onShow() {
        let that = this
        getVisitor().then((res)=>{
            console.log(res);
            that.setData({
                visitorList:res.data.rows
            })
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