
const {getPaymentInfo,deletePaymentInfo} = require('../../apis/payment')
var app = getApp()
Component({


    properties: {
        payItem:{
          type:Object,
          value:{}
        }, 
       
     
    },

    data: {
       payImg:''
    },

  
    methods: {
        deleteId(e){
            console.log(e.currentTarget.dataset.id);
            let id = e.currentTarget.dataset.id
   
            wx.showModal({
                title: '删除',
                content: '是否删除订单',
                complete: (res) => {
                  if (res.cancel) {
                    
                  }
              
                  if (res.confirm) {
                    
                      let that = this
                      deletePaymentInfo(id).then((res)=>{
                          console.log(res);
                          if(res.status===200){
                             
                              app.sendSocketMessage({msg:'delete payInfo'})
                                let userInfo = wx.getStorageSync('userInfo')
                                
                                getPaymentInfo(userInfo.userId).then((res)=>{
                                    console.log(res);
                                    wx.showToast({
                                      title: '删除成功',
                                    })
                                
                                    app.sendSocketMessage({msg:'update payInfo'})
                                })
                          }else{
                            wx.showToast({
                                title: '删除失败',
                              })
                          }
                      })
                  }
                }
              })
        },
        goToPay(e){
            console.log(e.currentTarget.dataset);
            if(e.currentTarget.dataset.item.payStatus==='待支付'||e.currentTarget.dataset.item.payStatus==='进行中'){
                wx.showModal({
                    title: '缴费',
                    content: '是否去缴费',
                    complete: (res) => {
                      if (res.cancel) {
                        
                      }
                  
                      if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/payDaiFuKuan/payDaiFuKuan?payItem='+encodeURIComponent(JSON.stringify(e.currentTarget.dataset.item))
                          })
                      }
                    }
                  })
                
            }else{
              
                
            }
           
    
        },
    },
    lifetimes:{
        attached:function(){
            if(this.data.payItem.payType==="停车费"){
                this.setData({
                    payImg:'/images/parking.png'
                })
            }else if(this.data.payItem.payType==="物业费"){
                this.setData({
                    payImg:'/images/wuye.png'
                })
            }
      
        }
    }
})