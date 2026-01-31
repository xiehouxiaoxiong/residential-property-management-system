const {getUserInfoDetail} = require("../../apis/user")
const {deletePaymentInfo,addPayment,updatePayment,updateMoney,updateMoneyAll} = require('../../apis/payment') 
var {timeFormatSecondss} =  require('../../utils/datePicker')
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
       userInfo:'',
       money:'',
       time:'',
       payId:'',
       paySixpassword:['','','','','',''],
       payItem:{},
       parkingAId:''
    },
    back(){
      wx.navigateBack()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
       let payItem = options.payItem
       console.log(options.parkingAId);
        let parkingAId = options.parkingAId
    
    
       this.setData({
           payItem:JSON.parse(decodeURIComponent(payItem)),
           parkingAId:parkingAId
       })
       console.log(JSON.parse(decodeURIComponent(payItem)).money);
    },
    pay(){
        wx.showLoading({
            title: '请稍后...',
          })
          setTimeout(()=>{
              wx.hideLoading()
            this.setData({
                showPassword:true
            })
          },500)
         
   
    },
    getSix(e){
        console.log(e);
        let value = e.detail.value
        let index = e.currentTarget.dataset.index
        this.setData({
            ['paySixpassword['+index+']']:value
        }) 
        
        if(this.checkAllSix()){
            this.setData({
                showPassword:false
            })
        }

    },
    checkAllSix(){
        let data  = this.data.paySixpassword
        let count=0
        data.forEach((item)=>{
            if(item===''){
              return false
            }
            count++
        })
         if(count==data.length){
             this.pay1()
             return true
         }
    },
    pay1(){
        let that = this
      
          setTimeout(()=>{
            
            getUserInfoDetail(this.data.userInfo.userId).then((res)=>{
                let sum1=0
                console.log(res);
                sum1+=res.data.money
                console.log(sum1);
                sum1+=this.data.payItem.money
                console.log(sum1);
                let jiaoMoney = this.data.payItem.money
                if(this.data.payItem.payType==='充值'){
                    updateMoney(this.data.userInfo.userId,sum1).then((res)=>{
                        console.log(res);
                        if(res.status==200){
                            wx.hideLoading()
                            wx.showToast({
                              title: '付款成功',
                            })
                          
                        
                          
                        }
                    })
                }else{
                    let parkingArrearage = res.data.parkingArrearage
                    let wuyeArrearage = res.data.wuyeArrearage
                    
                    if(this.data.payItem.payType==='停车费'){
                          parkingArrearage = parkingArrearage>=this.data.payItem.money?parkingArrearage-this.data.payItem.money:0
                    }
                    if(this.data.payItem.payType==='物业费'){
                        wuyeArrearage = wuyeArrearage>=this.data.payItem.money?wuyeArrearage-this.data.payItem.money:0
                    }
                    let moneyList = {money:res.data.money,parkingArrearage:parkingArrearage,wuyeArrearage:wuyeArrearage}
                    updateMoneyAll(this.data.userInfo.userId,moneyList).then((res)=>{
                        console.log(res);
                    })
                    let pages = getCurrentPages(); 
                    let prevPage = pages[pages.length - 2]; 
                    console.log(prevPage.route) 
                    if(prevPage.route==='pages/parkingRecord/parkingRecord'){
                        let parkingAId = that.data.parkingAId
                        console.log(parkingAId);
                        wx.navigateTo({
                          url: `/pages/parkingRecord/parkingRecord?parkingAId=${parkingAId}`,
                        })
                    }
                }
                this.setData({
                    showPay:false
                })
               
                updatePayment(that.data.payItem.id,{payStatus:'已完成'}).then((res)=>{
                    console.log(res);
                })
            })
            
          
          },1000)
          
    },
    getClosePassword(){
        this.setData({
            showPassword:false
        })
        let pages = getCurrentPages(); 
        let prevPage = pages[pages.length - 2]; 
       
        if(prevPage.route==='/pages/payRecord/payRecord'){
            wx.navigateTo({
                url: '/pages/paying/paying?payItem='+encodeURIComponent(JSON.stringify(this.data.payItem)),
              })
        }
        
     },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
       let userInfo = wx.getStorageSync('userInfo')
       this.setData({
           userInfo:userInfo
       })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})