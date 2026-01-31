const repairInfo = require('../../apis/repairInfo');
const {
  addRepairInfo
} = require('../../apis/repairInfo');
var app = getApp()
Page({


  data: {
    flagSelect: 0,
    showDate: false,
    show: false,
    userInfo: '',
    repairInfo: {
      repairAddress: '',
      repairDate: '',
      repairPicture: '',
      repairEvent: '',
      userName: '',
      repairDetail: '',
      phoneNumber: '',
      applicationtime: ''
    },
    code: '',
    checkContent: '',
    cascaderValueAddress: '',
    cascaderValueEvent: '',
    selectValue: '',
    citys: {},
    fieldNames: {
      text: 'name',
      value: 'code',
      children: 'items',
    },
    optionsAddress: [{
      name: '1-5栋',
      code: '1-5栋',
      items: [{
        name: '1栋',
        code: '1栋',
        items: [{
          name: '101',
          code: '101'
        }, {
          name: '102',
          code: '102'
        }, {
          name: '103',
          code: '103'
        }, ],
      }, {
        name: '2栋',
        code: '2栋',
        items: [{
          name: '201',
          code: '201'
        }, {
          name: '202',
          code: '202'
        }, {
          name: '203',
          code: '203'
        }],

      }],
    }, {
      name: '居住区外',
      code: '居住区外',
      items: [{
        name: '东区',
        code: '东区'
      }, {
        name: '西区',
        code: '西区'
      }, {
        name: '南区',
        code: '南区'
      }, {
        name: '北区',
        code: '北区'
      }]
    }],

    optionsEvent: [{
        name: '楼宇内',
        code: '楼宇内',
        items: [{
            name: '公共门厅',
            code: '公共门厅',
          }, {
            name: '公共走廊',
            code: '公共走廊',
          }, {
            name: '公共楼梯间',
            code: '公共楼梯间',
          },

        ]
      },
      {
        name: '共用设施设备',
        code: '共用设施设备',
        items: [{
          name: '上下水管道',
          code: '上下水管道'
        }, {
          name: '落水管',
          code: '落水管'
        }, {
          name: '公用照明',
          code: '公用照明'
        }, {
          name: '天线',
          code: '天线'
        }, {
          name: '电梯',
          code: '电梯'
        }, {
          name: '楼内消防设施设备',
          code: '楼内消防设施设备',
        }, ],

      },
      {
        name: '附属建筑物',
        code: '附属建筑物',
        items: [{
          name: '充电桩',
          code: '充电桩',
        }, {
          name: '停车场',
          code: '停车场',
        }, ]
      }
    ],
    ColorList: [{
        title: '取消',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '确认',
        name: 'green',
        color: '#39b54a'
      },
    ],
    columns: [{
        values: ['nowDay', 'tomorrowDay'],
        className: 'column1',
      },
      {
        values: [''],
        className: 'column2',
        defaultIndex: 2,
      },
    ],
    columnsDate: [],
    selectDay: [],


  },
  onChangeDate(event) {
    this.setData({
      flagSelect: 1
    })
    let {
      picker
    } = event.detail
    let res = picker.getIndexes()
    console.log(res);
    let day = Object.keys(this.data.columnsDate)[res[0]]
    console.log(day);
    let columns = this.data.columnsDate
    console.log(columns);
    this.setData({
      ['repairInfo.repairDate']: this.data.selectDay[res[0] || 0] + '' + columns[day][res[1] || 0]
    })
    console.log(day);
    wx.setStorageSync('repairApplication', this.data.repairInfo)
  },
  selectDate() {
    this.setData({
      showDate: true
    })
  },
  onLoad: function (options) {

  },
  onChangeRepairDetail(e) {
    this.setData({
      ['repairInfo.repairDetail']: e.detail.value
    })
    wx.setStorageSync('repairApplication', this.data.repairInfo)
  },
  onChangeUserName(e) {
    this.setData({
      ['repairInfo.userName']: e.detail.value
    })
    wx.setStorageSync('repairApplication', this.data.repairInfo)
  },
  onChangePhoneNumber(e) {
    this.setData({
      ['repairInfo.phoneNumber']: e.detail.value
    })
    wx.setStorageSync('repairApplication', this.data.repairInfo)
  },
  submit() {
    console.log(this.data.repairInfo.repairAddress);
    if (!this.data.repairInfo.repairAddress) {
      wx.showToast({
        title: '请选择报修地址',
        icon: 'none'
      })
    } else if (!this.data.repairInfo.repairDate) {
      wx.showToast({
        title: '请选择预约维修时间',
        icon: 'none'
      })
    } else if (!this.data.repairInfo.repairEvent) {
      wx.showToast({
        title: '请选择维修项目',
        icon: 'none'
      })
    } else if (!this.data.repairInfo.repairDetail) {
      console.log(this.data.repairInfo.repairDetail);
      wx.showToast({
        title: '请填写报修详情',
        icon: 'none'
      })
    } else if (!this.data.repairInfo.userName) {
      wx.showToast({
        title: '请填写报修人',
        icon: 'none'
      })
    } else if (!this.data.repairInfo.phoneNumber) {
      wx.showToast({
        title: '请填写联系方式',
        icon: 'none'
      })
    } else if (!this.data.repairInfo.repairPicture) {
      wx.showToast({
        title: '请上传细节图片',
        icon: 'none'
      })
    } else {

      let dateTime = new Date()
      let Y = dateTime.getFullYear();
      let M = (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1)
      let D = dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate()
      let hh = dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours()
      let mm = dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes()
      let ss = dateTime.getSeconds() < 10 ? '0' + dateTime.getSeconds() : dateTime.getSeconds()
      let time1 = Y + '-' + M + '-' + D + ' ' + hh + ":" + mm + ":" + ss
      this.setData({
        ['repairInfo.applicationtime']: time1
      })
      wx.setStorageSync('repairApplication', this.data.repairInfo)
      console.log(time1);
      let repairInfo = this.data.repairInfo
      addRepairInfo(repairInfo).then((res) => {
        console.log(res);
        if (res.status === 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
          app.sendSocketMessage({
            msg: 'add repairInfo'
          })
          wx.removeStorageSync('repairApplication')
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none'
          })
        }
      })

    }

  },
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        console.log(res.tempFilePaths)
        this.setData({
          imgList: res.tempFilePaths,
        })
        let repairInfo = this.data.repairInfo

        let that = this

        wx.uploadFile({
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          url: 'http://localhost:3000/imageG/uploadG',
          formData: res,
          method: 'post',
          success: function (res) {
            console.log('11111');
            repairInfo.repairPicture = 'http://localhost:3000/' + JSON.parse(res.data).data
            that.setData({
              repairInfo: repairInfo
            })
            wx.setStorageSync('repairApplication', repairInfo)
          },
          fail: function (res) {
            console.log(res);
            wx.showToast({
              title: '上传图片失败',
              icon: 'none'
            })
          }
        })

      }

    });
  },
  back() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  onClick() {

    this.setData({
      show: true,
      checkContent: '报修地点'
    })

  },
  onClickEvent() {

    this.setData({
      show: true,
      checkContent: '报修项目'
    })

  },
  onClose() {
    this.setData({
      show: false
    })
  },
  onCloseDate(e) {
    this.setData({
      showDate: false
    })
    console.log(e);
    let index = e.currentTarget.dataset.select
    if (index === 0&&this.data.flagSelect == 0) {
      this.setData({
        ['repairInfo.repairDate']: ''
      })
    }else{
      console.log(this.data.flagSelect);

        let day = Object.keys(this.data.columnsDate)[0]
        let columns = this.data.columnsDate
  
        this.setData({
          ['repairInfo.repairDate']: this.data.selectDay[0] + ',' + columns[day][0]
        })
      
    }
   

  },
  confirmDate(e) {
    this.setData({
      repairDate: e.detail
    })
  },
  onFinishAddress(e) {
    const {
      selectedOptions,
      value
    } = e.detail;
    const repairAddress = selectedOptions
      .map((option) => option.text || option.name)
      .join('/');
    console.log(e.detail);
    this.setData({
      ['repairInfo.repairAddress']: repairAddress,
      cascaderValueAddress: value
    })
    wx.setStorageSync('repairApplication', this.data.repairInfo)


  },
  onFinishEvent(e) {
    const {
      selectedOptions,
      value
    } = e.detail;
    const repairAddress = selectedOptions
      .map((option) => option.text || option.name)
      .join('/');
    console.log(e.detail);
    this.setData({
      ['repairInfo.repairEvent']: repairAddress,
      cascaderValueEvent: value
    })
    wx.setStorageSync('repairApplication', this.data.repairInfo)


  },

  onReady: function () {

  },


  onShow: function () {
    let that = this
    let time = Date.parse(new Date())
    let tomorrow = new Date()
    tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000)
    let date = new Date(time)
    let Y = date.getFullYear();
    let YY = tomorrow.getFullYear()
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let MM = (tomorrow.getMonth() + 1 < 10 ? '0' + (tomorrow.getMonth() + 1) : tomorrow.getMonth() + 1)
    let DD = tomorrow.getDate() < 10 ? '0' + tomorrow.getDate() : tomorrow.getDate()
    let nowDay = Y + '/' + M + '/' + D
    let tomorrowDay = YY + '/' + MM + '/' + DD
    let columnsDate = {
      "nowDay": ['9:00-11:00', "11:00-13:00", "14:00-16:00", "16:00-18:00"],
      "tomorrowDay": ['9:00-11:00', "11:00-13:00", "14:00-16:00", "16:00-18:00"],
    }
    let selectDay = [nowDay, tomorrowDay]
    let col = that.data.columns
    col[0].values = [nowDay, tomorrowDay]
    col[1].values = columnsDate["nowDay"]
    let repairApplication = wx.getStorageSync('repairApplication') || {
      applicationtime: ''
    }
    let userInfo = wx.getStorageSync('userInfo')
    repairApplication.auditStatus = '待审核'
    repairApplication.repairProgress = '申请'
    repairApplication.repairEmployeeId = ''
    repairApplication.userId = userInfo.userId
    if(repairApplication.repairPicture===''){
      repairApplication.repairPicture = './images/Upload.png'
    }
   
    that.setData({
      columns: col,
      columnsDate: columnsDate,
      selectDay: selectDay,
      repairInfo: repairApplication
    })
    wx.setStorageSync('repairApplication', repairApplication)


    if (!userInfo) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }



  },


  onHide: function () {

  },


  onUnload: function () {

  },


  onPullDownRefresh: function () {

  },


  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})