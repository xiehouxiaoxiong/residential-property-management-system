const {
    getNoticeInfoList
} = require('../../apis/noticeInfo')
var app = getApp()
Page({


    data: {
        noticeList: []
    },


    onLoad(options) {

    },
    back() {
        wx.reLaunch({
            url: '/pages/mine/mine',
        })
    },

    onReady() {

    },


    onShow() {
        let that = this
        getNoticeInfoList().then((res) => {
            that.setData({
                noticeList: res.data.rows
            })
        })
        app.globalData.callback = function (msg) {
            that.onShow()
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