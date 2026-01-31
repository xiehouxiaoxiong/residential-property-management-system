const user = require("../../apis/user");
const {getNewestNotice} = require('../../apis/noticeInfo')

Page({
	data:{
		userInfo:'',
		newNotice:'这里是最新通知',
		cardCur: 0,
		backgroundList:['linear-gradient(45deg, rgb(94, 167, 236), rgb(210, 233, 240) 100%)','linear-gradient(45deg, rgb(94, 98, 236), rgb(210, 243, 240) 100%)','linear-gradient(45deg, rgb(240, 167, 236), rgb(242, 243, 245) 100%)','linear-gradient(45deg, rgb(239, 241, 117),rgb(240, 243, 240) 100%)'],
		swiperList: [],
		IndexEventList:[]
	},
	toggle(e) {
		console.log(e);
		var anmiaton = e.currentTarget.dataset.class;
		var index= e.currentTarget.dataset.index||0
		var that = this;
		that.setData({
		  animation: anmiaton
		})
		setTimeout(function() {
		  that.setData({
			animation: ''
		  })
		}, 1000)
		wx.redirectTo({
		  url: that.data.IndexEventList[index].page,
		})
	  },
	DotStyle(e) {
		this.setData({
		  DotStyle: e.detail.value
		})
	  },
	onLoad() {
		this.towerSwiper('swiperList');
		
		
	  },
	onShow(){
	   let that =this
	   getNewestNotice(1).then((res)=>{
		   console.log(res);
         that.setData({
			newNotice:res.data[0].title
		 })
	   })
	   getNewestNotice(2).then((res)=>{
		    console.log(res);
			that.setData({
				swiperList:res.data
			})
		})
	   let role=wx.getStorageSync('role')
	   let userInfo = wx.getStorageSync('userInfo')
	   this.setData({
		   userInfo:userInfo
	   })
	   if(role==='业主'){
        this.setData({
			IndexEventList:[
				{
					name:'报修',
					picture:'./images/repair.png',
					page:'/pages/repairPage/repairPage'
				},
				{
					name:'车位申请',
					picture:'./images/parking.png',
					page:'/pages/parkingApplication/parkingApplication'
				},
				{
					name:'投诉咨询',
					picture:'./images/complaint.png',
					page:'/pages/complaintPage/complaintPage'
				},
				{
					name:'生活缴费',
					picture:'./images/payment.png',
					page:'/pages/payment/payment'
				}
			]
		})
	   }else if(userInfo.employeeType==='维修工'){
		this.setData({
			IndexEventList:[
				{
					name:'出勤打卡',
					picture:'./images/punch.png',
					page:'/pages/employeePunchClock/employeePunchClock'
				},
				{
					name:'工单管理',
					picture:'./images/work.png',
					page:'/pages/employeeWorkOrderManagement/employeeWorkOrderManagement'
				}
			]
		})
	   }else if(userInfo.employeeType==='保安'){
		this.setData({
			IndexEventList:[
				{
					name:'出勤打卡',
					picture:'./images/punch.png',
					page:'/pages/employeePunchClock/employeePunchClock'
				},
				{
					name:'访客登记',
					picture:'./images/people.png',
					page:'/pages/employeeVisitor/employeeVisitor'
				}
			]
		})
	   }
	},
	  
  
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
	})
   },
    
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
})
