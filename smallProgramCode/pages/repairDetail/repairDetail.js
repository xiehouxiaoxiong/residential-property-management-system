const {
  getRepairInfoDetail,
  updateRepairInfo
} = require('../../apis/repairInfo')
var app = getApp()
Page({
  data: {
    show: false,
    status: '',
    role: '',
    stars: [1, 2, 3, 4, 5],
    repairItem: {
      id: 0,
      userName: '111',
      repairAddress: '111',
      repairDate: '2024-06-05 11:00:00',
      repairEvent: '11',
      repairDetail: '112213',
      phoneNumber: '44',

    },
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
    active: 0,
    showEvaluation: false,
    normalSrc: './images/star.png',
    selectedSrc: './images/stared.png',
    key: 0,
    evaluationContent: ''
  },
  getevaluationContent(e) {
    this.setData({
      evaluationContent: e.detail.value
    })
    console.log(e.detail.value);
  },
  cancelEva() {
    this.setData({
      showEvaluation: false
    })
    console.log("000");
  },
  confirmEva() {
    let that = this

    if (that.data.key === 0) {
      wx.showToast({
        title: '请打分',
        icon: 'none'
      })
      return
    }
    let key = that.data.key
    let evaluation = that.data.evaluationContent
    console.log(that.data.repairItem.id, {
      degreeOfSat: key,
      evaluation: evaluation
    });
    let status = "评价"
    updateRepairInfo(that.data.repairItem.id, {
      degreeOfSat: key,
      evaluation: evaluation,
      repairProgress: status
    }).then((res) => {
      console.log(res);
      if (res.status == 200) {
        that.setData({
          showEvaluation: false
        })
        app.sendSocketMessage({
          msg: 'update repairInfo'
        })
        wx.showToast({
          title: '评价成功',
        })

      } else {
        wx.showToast({
          title: '评价失败',
          icon: 'error'
        })
      }

    }).then(
      getRepairInfoDetail(that.data.repairItem.id).then((res) => {
        console.log(res);
        let obj = res.data
        let userInfo = wx.getStorageSync('userInfo')
        obj.userName = userInfo.userName
        that.data.steps.forEach((item, index) => {
          if (item.text === res.data.repairProgress) {
            that.setData({
              active: index,
              status: index === 3 ? '退回' : '更新状态'
            })
          }
        })
        that.setData({
          repairItem: obj
        })

      })
    )
  },
  goToEvaluation() {
    this.setData({
      showEvaluation: true
    })
  },
  back() {
    wx.navigateBack()
  },

  selectServer(e) {
    console.log(e);
    var key = e.currentTarget.dataset.index
    console.log(key);
    if (this.data.key == 1 && e.currentTarget.dataset.key == 1) {
      key = 0;
    }
    console.log("得" + key + "分")
    this.setData({
      key: key
    })
  },

  onClose() {
    this.setData({
      showEvaluation: false
    })
  },
  onClick() {
    let that = this
    let str1 = "是否确定将维修单状态从派工状态更新至完工状态"
    let str2 = "是否确定将维修单状态从完工状态退回至派工状态"
    let str = that.data.status === '更新状态' ? str1 : str2

    wx.showModal({
      title: that.data.status,
      content: str,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            active: that.data.active == 3 ? 2 : 3,
            status: that.data.status == '退回' ? '更新状态' : '退回'
          })
          let status = that.data.active === 3 ? '完工' : '派工'
          console.log(status);
          updateRepairInfo(that.data.repairItem.id, {
            repairProgress: status
          }).then((res) => {
            console.log(res);
            app.sendSocketMessage({
              msg: 'update repairInfo'
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  onLoad(options) {

    let id = options.id

    console.log(id);

    let that = this
    let userInfo = wx.getStorageSync('userInfo')
    let role = wx.getStorageSync('role')
    that.setData({
      role: role
    })
    getRepairInfoDetail(id).then((res) => {
      console.log(res);
      let obj = res.data
      obj.userName = userInfo.userName
      that.data.steps.forEach((item, index) => {
        if (item.text === res.data.repairProgress) {
          that.setData({
            active: index,
            status: index === 3 ? '退回' : '更新状态'
          })
        }
      })
      that.setData({
        repairItem: obj
      })

    })
  },


  onReady() {

  },


  onShow() {

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