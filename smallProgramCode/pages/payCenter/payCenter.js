const user = require("../../apis/user");
const {getUserInfoDetail} = require('../../apis/user')
const {updateMoney,addPayment} = require('../../apis/payment')
const {timeFormatSecondss} = require('../../utils/datePicker')

Page({

    /**
     * 页面的初始数据
     */
    data: {
       money:'',
       moneyList:[20,30,50,100,200,500],
       arrayPayMethod:['微信','支付宝'],
       arrayIocn:['/images/weixin.png','/images/zfb.png'],
       payMethod:0,
       showPay:false,
       showPassword:false,
       paySixpassword:['','','','','','']
    },
    confirm(){
        if(this.data.money>0){
            this.setData({
                showPay:true
            })
        }else{
            wx.showToast({
              title: '请输入金额',
              icon:'error'
            })
        }
       
    },
    close(){
       this.setData({
           showPay:false
       })
    },
    getPickerMethod(e){
        this.setData({
           payMethod:e.detail.value
        })
    },
    getClosePassword(){
       this.setData({
           showPassword:false
       })
       
       
       wx.navigateTo({
         url: '/pages/paying/paying?money='+this.data.money
       })
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
    pay1(){
    
          setTimeout(()=>{
            
            getUserInfoDetail(this.data.userInfo.userId).then((res)=>{
                let sum1=0
                console.log(res);
                sum1+=res.data.money
                sum1+=this.data.money
                let jiaoMoney = this.data.money
                updateMoney(this.data.userInfo.userId,sum1).then((res)=>{
                    console.log(res);
                    if(res.status==200){
                        wx.hideLoading()
                        wx.showToast({
                          title: '付款成功',
                        })
                        this.setData({
                            showPay:false
                        })
                        let nowTime = timeFormatSecondss(new Date())
                        let data={payType:'充值',payTime:nowTime,money:jiaoMoney,userId:this.data.userInfo.userId,payStatus:'已完成'}
                        console.log(data);
                        addPayment(data).then((res)=>{
                            console.log(res);
                        })
                    }
                })
            })
            
          
          },1000)
          
    },
    back(){
       wx.navigateBack()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
                showPassword:false,
                showPay:false
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
    getMoney(e){
     this.setData({
         money:parseInt(e.detail.value)
     })
    },
    getMoneyNumber(e){
        console.log(e.currentTarget);
        this.setData({
            money:e.currentTarget.dataset.number
        })
       },
    clearInput(){
        console.log('111');
      this.setData({
          money:''
      })
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