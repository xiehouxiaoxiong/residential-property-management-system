const {getRepairInfoList} = require('../../apis/repairInfo')
const {getUserInfoDetail} = require('../../apis/user')
var app = getApp()
Page({


    data: {
      tabList:['我的工单','工单评价'],
      TabCur: 0,
      scrollLeft:0,
      workOrderList:[]
    },
    tabSelect(e) {
      let that = this
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id-1)*60,
        
      })
      let TabCur = that.data.TabCur
      let userInfo = wx.getStorageSync('userInfo')
      if(TabCur===0){
        let data = {repairEmployeeId:userInfo.number,repairProgress:'派工'}
        getRepairInfoList(data).then((res)=>{
            console.log(res);
            let data =res.data.rows
         
             
             
              that.setData({
                workOrderList:data
         
              })  
              console.log(data);
       
           
        })
      }else{
        let data1 = {repairEmployeeId:userInfo.number,repairProgress:'完工'}
        let data2 = {repairEmployeeId:userInfo.number,repairProgress:'评价'}
        
  
          let dataList = []
          getRepairInfoList(data1).then((res)=>{
            console.log(res);
            dataList=res.data.rows
          })
          getRepairInfoList(data2).then((res)=>{
            console.log(res);
            dataList=[...dataList,...res.data.rows]
            that.setData({
              workOrderList:dataList
            })
           
          })

         
      }
      
     
  },
  goToDetail(e){
    let id = e.currentTarget.dataset.id
    console.log(id);
    wx.navigateTo({
      url: '/pages/repairDetail/repairDetail?id='+id,
    })
  },
    back(){
        wx.reLaunch({
          url: '/pages/index/index',
        })
      },
  
    onLoad(options) {

    },

 
    onReady() {

    },


    onShow() {
      let that = this
      let TabCur = that.data.TabCur
      let userInfo = wx.getStorageSync('userInfo')
      console.log(TabCur);
      if(TabCur===0){
        let data = {repairEmployeeId:userInfo.number,repairProgress:'派工'}
        getRepairInfoList(data).then((res)=>{
            console.log(res);
            let data =res.data.rows
              that.setData({
                workOrderList:data
         
              })  
              console.log(data);
       
           
        })
        app.globalData.callback = function (msg) {
          
          console.log(msg);
          that.onShow()
       }
      }else{
        let data1 = {repairEmployeeId:userInfo.number,repairProgress:'完工'}
        let data2 = {repairEmployeeId:userInfo.number,repairProgress:'评价'}
        let dataList = []
        getRepairInfoList(data1).then((res)=>{
            console.log(res);
            dataList=res.data.rows
        })
        getRepairInfoList(data2).then((res)=>{
          console.log(res);
          dataList=[...dataList,...res.data.rows]
          that.setData({
            workOrderList:dataList
          })
          console.log(dataList);
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

    }
})