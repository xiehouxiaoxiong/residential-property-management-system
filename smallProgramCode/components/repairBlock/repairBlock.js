
const {getUserInfoDetail} = require('../../apis/user')
Component({

 
    properties: {
        repairItem:{
            type:Object,
            value:{}
        },
        tabCur:{
            type:Number,
            value:0
        }
    },
     
   
    data: {
       role:''
    },
    

    methods: {

    },
    lifetimes: {
        attached() {
            console.log(this.data.repairItem);
            let role = wx.getStorageSync('role')
            let that = this
            that.setData({
                role:role
            })
          
        }
    }
})