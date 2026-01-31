let socketMsgQueue = []
let isLoading = false

App({
  globalData: {
    userInfo: null,
    localSocket: {},
    callback: function () {}
  },
  onLaunch: function (options) {

    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      updateManager.applyUpdate()
    })
    let that = this


    wx.login({
      success: res => {

      }
    })

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {

          wx.getUserInfo({
            success: res => {

              this.globalData.userInfo = res.userInfo


              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  hideLoad() {
    wx.hideLoading()
    isLoading = false
  },
  initSocket() {
    let that = this
    that.globalData.localSocket = wx.connectSocket({

      url: 'ws://localhost:8080'
    })

    that.globalData.localSocket.onOpen(function (res) {
      console.log('WebSocket连接已打开！readyState=' + that.globalData.localSocket.readyState)
      that.hideLoad()
      while (socketMsgQueue.length > 0) {
        var msg = socketMsgQueue.shift();
        that.sendSocketMessage(msg);
      }
    })
    that.globalData.localSocket.onMessage(function (res) {
      console.log(res);

      that.globalData.callback(res)
    })
    that.globalData.localSocket.onError(function (res) {
      console.log('readyState=' + that.globalData.localSocket.readyState)
    })
    that.globalData.localSocket.onClose(function (res) {
      console.log('WebSocket连接已关闭！readyState=' + that.globalData.localSocket.readyState)
      that.initSocket()
    })
  },
  sendSocketMessage: function (msg) {
    console.log(this.globalData);
    if (this.globalData.localSocket.readyState === 1) {
      console.log(msg);
      this.globalData.localSocket.send({
        data: JSON.stringify(msg)
      })
    } else {
      socketMsgQueue.push(msg)
    }
  },
  onShow: function (options) {
    if (this.globalData.localSocket.readyState !== 0 && this.globalData.localSocket.readyState !== 1) {
      console.log('开始尝试连接WebSocket！readyState=' + this.globalData.localSocket.readyState)
      this.initSocket()
    }
  }
})