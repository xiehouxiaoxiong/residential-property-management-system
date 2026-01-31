import {
  updateProfile,
  getUserInfoDetail
} from '../../apis/user'
import {
  updateEmployee,
  getEmployeeByNumber
} from '../../apis/employ'

const user = require("../../apis/user")
var app = getApp()
Page({
  data: {
    active: 4,

    userInfo: {
      nickName: '暂未登录'
    },
    role: '',
    BackgroudImgUrl: "/pages/mine/images/container_backgroundImage.png",
    "LevelIconUrl": "/pages/mine/icons/level_icon.png",
    "LevelDegree": "5 级",
    "SettingIconUrl": "/pages/mine/icons/setting_icon.svg",


    "steps": [{
        text: '申请',
        desc: '',
      },
      {
        text: '受理',
        desc: '',
      },
      {
        text: '派工',
        desc: '',
      },
      {
        text: '完工',
        desc: '',
      },
      {
        text: '评价',
        desc: '',
      },
    ],
    "menuList": [],
    recordList: [{
        name: '报修记录',
        icon: '/icons/repairRecord.png',
        page: '/pages/repairRecord/repairRecord'
      },
      {
        name: '车位申请记录',
        icon: './icons/parkingRecord.png',
        page: '/pages/parkingRecord/parkingRecord'
      },
      {
        name: '账单记录',
        icon: './icons/paymentRecord.png',
        page: '/pages/payRecord/payRecord'
      },
      {
        name: '投诉记录',
        icon: './icons/compliantRecord.png',
        page: '/pages/complaintRecord/complaintRecord'
      }
    ]
  },
  goToRecord(e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: this.data.recordList[index].page,
    })
  },
  goToPersonal() {
    wx.redirectTo({
      url: '/pages/personalInfo/personalInfo',
    })
  },
  goToSetting() {
    wx.redirectTo({
      url: '/pages/settings/settings',
    })
  },
  goToMenu(e) {
    var index = e.currentTarget.dataset.index
    wx.redirectTo({
      url: this.data.menuList[index].page,
    })
  },
  onShow() {
    var that = this
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      })
    }
    var token = wx.getStorageSync('token')
    var userInfo = wx.getStorageSync('userInfo')
    var role = wx.getStorageSync('role')
    app.globalData.callback = function (msg) {

      console.log(msg);
      if (role === '员工') {
        getEmployeeByNumber(userInfo.number).then((res) => {
          console.log(res);
          wx.setStorageSync('userInfo', res.data)
          that.onShow()
        })

      } else if (role === '业主') {
        getUserInfoDetail(userInfo.userId).then((res) => {
          console.log(res);
          wx.setStorageSync('userInfo', res.data)
          that.onShow()
        })

      }
    }
    if (!token) {
      wx.navigateTo({
        url: '../login/login',
      })
      return;
    }
    if (token) {
      that.setData({
        userInfo: userInfo
      })

    }
    var role = wx.getStorageSync('role')
    that.setData({
      role: role
    })
    if (role === '业主') {
      that.setData({
        "menuList": [{
            url: './icons/personalInfo.png',
            name: '个人信息',
            page: '/pages/personalInfo/personalInfo'
          },
          {
            url: './icons/orders.png',
            name: '投诉记录',
            page: '/pages/complaintRecord/complaintRecord'
          },
          {
            url: './icons/archive.png',
            name: '爱车档案',
            page: '/pages/myCar/myCar'
          },
          {
            url: './icons/notice.png',
            name: '通知',
            page: '/pages/noticePage/noticePage'
          }
        ],
      })
    } else if (role === '员工' && userInfo.employeeType == '维修工') {
      that.setData({
        "menuList": [{
            url: './icons/personalInfo.png',
            name: '个人信息',
            page: '/pages/personalInfo/personalInfo'
          },
          {
            url: './icons/leaving.png',
            name: '请假申请',
            page: '/pages/employeeLeaving/employeeLeaving'
          },
          {
            url: './icons/leavingRecord.png',
            name: '请假记录',
            page: '/pages/employeeLeavingRecord/employeeLeavingRecord'
          }, {}
        ]
      })
    } else if (role === '员工' && userInfo.employeeType == '保安') {
      that.setData({
        "menuList": [{
            url: './icons/personalInfo.png',
            name: '个人信息',
            page: '/pages/personalInfo/personalInfo'
          },
          {
            url: './icons/leaving.png',
            name: '请假申请',
            page: '/pages/employeeLeaving/employeeLeaving'
          },
          {
            url: './icons/leavingRecord.png',
            name: '请假记录',
            page: '/pages/employeeLeavingRecord/employeeLeavingRecord'
          },
          {
            url: './icons/visitor.png',
            name: '访客记录',
            page: '/pages/employeeVisitorRecord/employeeVisitorRecord'
          }, {}
        ]
      })
    }
  }
})