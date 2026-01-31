import {
  updateProfile,
  getUserInfoDetail
} from '../../apis/user'
import {
  updateEmployee,
  getEmployeeByNumber
} from '../../apis/employ'

const app = getApp()
Page({


  data: {
    role: '',
    value: '',
    showUserName: false,
    userInfo: {
      userName: '11',
      avatar: '/images/parking.png',
      sex: '女',
      userId: '1312311',
      phoneNumber: '124124213516'
    },
    arraySex: ['男', '女'],

  },
  onCloseUserName() {
    this.setData({
      showUserName: false
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        console.log(res.tempFilePaths)
        this.setData({
          imgList: res.tempFilePaths,
        })
        let userInfo = this.data.userInfo
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
            console.log();
            userInfo.avatar = 'http://localhost:3000/' + JSON.parse(res.data).data
            let role = wx.getStorageSync('role')

            if (role === '员工') {
              updateEmployee(userInfo.number, userInfo).then((res) => {
                console.log(res);
                if (res.status === 200) {
                  wx.showToast({
                    title: '修改成功',
                    icon: 'success'
                  })
                  app.sendSocketMessage({
                    msg: 'update personalInfoEmployee'
                  })

                  wx.setStorageSync('userInfo', userInfo)
                  that.setData({
                    userInfo: userInfo
                  })
                } else {
                  wx.showToast({
                    title: '修改失败',
                    icon: 'none'
                  })
                }
              })
            } else if (role === '业主') {
              updateProfile(userInfo.userId, userInfo).then((res) => {
                console.log(res);
                if (res.status === 200) {
                  wx.showToast({
                    title: '修改成功',
                    icon: 'success'
                  })
                  app.sendSocketMessage({
                    msg: 'update personalInfoUser'
                  })
                  wx.setStorageSync('userInfo', userInfo)
                  that.setData({
                    userInfo: userInfo
                  })
                } else {
                  wx.showToast({
                    title: '修改失败',
                    icon: 'none'
                  })
                }
              })
            }

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
      url: '/pages/mine/mine',
    })
  },
  onChange(event) {

    console.log(event.detail);
    this.setData({
      value: event.detail
    })
  },
  PickerChange(e) {

    let userInfo = this.data.userInfo
    userInfo.sex = this.data.arraySex[e.detail.value]
    let role = wx.getStorageSync('role')
    let that = this
    if (role === '员工') {
      updateEmployee(userInfo.number, userInfo).then((res) => {
        console.log(res);
        if (res.status === 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
          app.sendSocketMessage({
            msg: 'update personalInfoEmployee'
          })
          wx.setStorageSync('userInfo', userInfo)
          that.setData({
            userInfo: userInfo
          })
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none'
          })
        }
      })
    } else if (role === '业主') {
      updateProfile(userInfo.userId, userInfo).then((res) => {
        console.log(res);
        if (res.status === 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
          app.sendSocketMessage({
            msg: 'update personalInfoUser'
          })
          wx.setStorageSync('userInfo', userInfo)
          this.setData({
            userInfo: userInfo
          })
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none'
          })
        }
      })
    }
  },
  confirmUserName() {
    this.setData({
      showUserName: false,
    })
    let userInfo = this.data.userInfo
    userInfo.userName = this.data.value
    let role = wx.getStorageSync('role')
    let that = this
    if (role === '员工') {
      updateEmployee(userInfo.number, userInfo).then((res) => {
        console.log(res);
        if (res.status === 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
          app.sendSocketMessage({
            msg: 'update personalInfoEmployee'
          })
          wx.setStorageSync('userInfo', userInfo)
          that.setData({
            userInfo: userInfo
          })
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none'
          })
        }
      })
    } else if (role === '业主') {
      updateProfile(userInfo.userId, userInfo).then((res) => {
        console.log(res);
        if (res.status === 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
          app.sendSocketMessage({
            msg: 'update personalInfoUser'
          })
          wx.setStorageSync('userInfo', userInfo)
          this.setData({
            userInfo: userInfo
          })
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none'
          })
        }
      })
    }
  },
  cancelUserName() {
    this.setData({
      showUserName: false
    })
  },
  onClick() {
    let that = this
    wx.showModal({
      title: '修改用户名',
      content: '是否确认要修改用户名',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            showUserName: true
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  onLoad(options) {


  },


  onReady() {

  },


  onShow() {
    let userInfo = wx.getStorageSync('userInfo')
    let role = wx.getStorageSync('role')

    this.setData({
      userInfo: userInfo,
      role: role
    })
    let that = this
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