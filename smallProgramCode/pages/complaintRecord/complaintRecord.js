
const {getComplaintList,deleteComplaintInfo} = require('../../apis/complaintInfo')
var app = getApp()
Page({

    data: {
        tabList:['全部','待受理','受理中','已受理'],
        TabCur: 0,
        scrollLeft:0,
        complaintList:[
          
        ],
        complaintStatus:''
    },

 
    onLoad(options) {
       
    },
    getIdFunc(e){
       let id = e.currentTarget.dataset.id
     
       deleteComplaintInfo(id).then((res)=>{
           if(res.status===200){
              wx.showToast({
                title: '删除成功',
              })
              app.sendSocketMessage({msg:'delete complaintInfo'})
              let that = this
              let TabCur = that.data.TabCur
              let complaintStatus=TabCur===0?'':that.data.tabList[TabCur]
              let userInfo = wx.getStorageSync('userInfo')
              console.log(userInfo.userId,complaintStatus);
              
              getComplaintList(userInfo.userId,complaintStatus).then((res)=>{
                  console.log(res);
                  that.setData({
                      complaintList:res.data.rows
                  })
                 
              })
           }else{
              wx.showToast({
                title: '删除失败',
                icon:'error'
              })
           }
       })
       
    },
    tabSelect(e) {
        this.setData({
          TabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id-1)*60
        })
        let that = this
        let TabCur = that.data.TabCur
        let complaintStatus=TabCur===0?'':that.data.tabList[TabCur]
        that.setData({
          complaintStatus:complaintStatus
        })
        let userInfo = wx.getStorageSync('userInfo')
        console.log(userInfo.userId,complaintStatus);
     
        getComplaintList(userInfo.userId,complaintStatus).then((res)=>{
            console.log(res);
            that.setData({
                complaintList:res.data.rows
            })
           
        })
    },
    deleteList(e){
      console.log(e.currentTarget.dataset.id);
      let data = this.data.payList
      data.splice(id,1)
    },

    onReady() {

    },


    onShow() {
        let userInfo = wx.getStorageSync('userInfo')
        let that = this
        getComplaintList(userInfo.userId,'').then((res)=>{
           that.setData({
            complaintList:res.data.rows
           })
        })
        app.globalData.callback = function (msg) {
    
          console.log(msg);
          console.log(that.data.complaintStatus);
          getComplaintList(userInfo.userId,that.data.complaintStatus).then((res)=>{
            that.setData({
             complaintList:res.data.rows
            })
         })
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

    },
    back(){
        wx.reLaunch({
          url: '/pages/mine/mine',
        })
     
    }
})