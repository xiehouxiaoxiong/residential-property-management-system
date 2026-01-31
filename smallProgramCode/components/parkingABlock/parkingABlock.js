const {getPayment,addPayment} = require('../../apis/payment')
var moment = require('../../utils/moment')
var {timeFormatSecondssA,timeFormatSecondss} =  require('../../utils/datePicker')
var {updateParkingInfo} = require('../../apis/parkingInfo')
var { compareDate} = require('../../utils/compareDate')
var {updateParkingApplicationOne} = require('../../apis/parkingApplication')
var app = getApp()
moment.locale('en', {
  longDateFormat : {
      l: "YYYY-MM-DD",
      L: "YYYY-MM-DD HH:mm"
  }
});
Component({

   
    properties: {
        parkingAItem:{
            type:Object,
            value:{}
        }
    },
  

    data: {
       userInfo:''
    },
    lifetimes:{
       detached(){
             clearInterval(this.data.timer)
             this.setData({
                 timer:null
             })
             },
       attached(){
           let userInfo = wx.getStorageSync('userInfo')
           this.setData({
              userInfo:userInfo
           })
    

       
        
       }
    },

    methods: {
        goToPay(){
            let nowTime = moment(new Date()).format('yyyy/MM/DD HH:mm:ss')
            let that =this
            console.log(nowTime);
            console.log(this.data.parkingAItem);
     
            let year =new Date(this.data.parkingAItem.parkingEndTime).getFullYear()-new Date(this.data.parkingAItem.parkingStartTime).getFullYear()
            let mon = new Date(this.data.parkingAItem.parkingEndTime).getMonth()-new Date(this.data.parkingAItem.parkingStartTime).getMonth()
            console.log(year,mon);
            let parkingATime = year*12+mon
            console.log(parkingATime);
            let money1 = 70*parkingATime
            let dataPayment={payType:'停车费',payTime:nowTime,money:money1,userId:that.data.userInfo.userId,payStatus:'待支付'}
           
              addPayment(dataPayment).then((res)=>{
               console.log(res);
               let payId = res.data
               getPayment(payId).then((res)=>{
                console.log(res);
                let payItem = res.data[0]
                let parkingAId = that.data.parkingAItem.id
                wx.navigateTo({
                    url: `/pages/payDaiFuKuan/payDaiFuKuan?parkingAId=${parkingAId}&payItem=`+encodeURIComponent(JSON.stringify(payItem)),
                  })
              })
               
              })
          
            
         
    }
  }
})