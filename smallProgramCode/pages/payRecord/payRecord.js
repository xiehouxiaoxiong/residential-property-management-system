const {
    getPaymentInfo,
    deletePaymentInfo,
    getPayment,
    updatePayment
} = require('../../apis/payment')
var {
    timeFormatSecondssA
} = require('../../utils/datePicker')
var {
    compareDate
} = require('../../utils/compareDate')
const moment = require("../../utils/moment")
moment.locale('en', {
    longDateFormat: {
        l: "YYYY-MM-DD",
        L: "YYYY-MM-DD HH:mm"
    }
});
var app = getApp()
Page({


    data: {
        tabList: ['待支付', '进行中', '已完成', '已取消'],
        TabCur: 0,
        scrollLeft: 0,
        payList: [],
        payStatus: '待支付',
        nowTime: '',
        shengyuList: [],
        timer: null
    },

    onLoad(options) {
        let time = new Date()
        this.setData({
            nowTime: time
        })

    },
    searchIcon(e) {
        let key = e.detail.value.toLowerCase();
        let list = wx.getStorageSync('payList')
        if (key) {
            let data = []
            for (let i = 0; i < list.length; i++) {
                let a = key;
                let b = list[i].payType.toLowerCase();
                if (b.search(a) != -1) {
                    data.push(list[i])
                }
            }
            this.setData({
                payList: data
            })
        } else {


            this.setData({
                payList: list
            })
        }

    },

    tabSelect(e) {
        let that = this
        clearInterval(this.data.timer)
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60,

        })
        let TabCur = that.data.TabCur
        let payStatus = that.data.tabList[TabCur]
        that.setData({
            payStatus: payStatus
        })
        let userInfo = wx.getStorageSync('userInfo')
        console.log(payStatus);
        if (payStatus === '进行中') {
            getPaymentInfo(userInfo.userId, payStatus).then((res) => {

                let data = res.data.rows
                console.log(payStatus);
                console.log(data);
                if (data.length > 0) {
                    var timer = setInterval(() => {
                        data.forEach((item, index) => {

                            getPayment(item.id).then((res) => {
                                var Num = 15 //min
                                let nowTime = new Date()
                                let lastTime = new Date(new Date(timeFormatSecondssA(item.create_time)).getTime() + (1 / 60) * Num * 3600 * 1000)
                                let flag = compareDate(lastTime, nowTime)
                                if (flag > 0) {
                                    let tim = moment(flag).format('mm,ss');
                                    item.time = {
                                        min: parseInt(tim.split(',')[0]),
                                        second: parseInt(tim.split(',')[1])
                                    }
                                } else {
                                    item.time = {
                                        min: 0,
                                        second: 0
                                    }
                                    clearInterval(timer)

                                    updatePayment(item.id, {
                                        payStatus: '已取消'
                                    }).then((res) => {
                                        app.sendSocketMessage({
                                            msg: 'update payInfo'
                                        })
                                    })
                                }
                            })


                        }, 1000)
                        that.setData({
                            payList: data
                        })

                    })
                    this.setData({
                        timer: timer
                    })
                } else {
                    clearInterval(that.data.timer)
                    that.setData({
                        payList: []
                    })
                }

                wx.setStorageSync('payList', data)
            })

        } else {
            clearInterval(that.data.timer)
            console.log(userInfo.userId, payStatus);
            getPaymentInfo(userInfo.userId, payStatus).then((res) => {
                that.setData({
                    payList: res.data.rows
                })
                console.log(res.data.rows);
            })
        }

        console.log('11');
    },


    onReady() {

    },


    onShow() {
        let userInfo = wx.getStorageSync('userInfo')
        let that = this
        console.log(userInfo.userId, that.data.payStatus);
        getPaymentInfo(userInfo.userId, that.data.payStatus).then((res) => {
            console.log(res);
            let data = res.data.rows
            if (that.data.payStatus == '进行中' && data.length > 0) {
                var timer = setInterval(() => {
                    data.forEach((item, index) => {

                        getPayment(item.id).then((res) => {

                            var Num = 15 //min
                            let nowTime = new Date()
                            let lastTime = new Date(new Date(timeFormatSecondssA(res.data[0].create_time)).getTime() + (1 / 60) * Num * 3600 * 1000)
                            let flag = compareDate(lastTime, nowTime)
                            console.log(flag);
                            if (flag > 0) {

                                let tim = moment(flag).format('mm,ss');

                                item.time = {
                                    min: parseInt(tim.split(',')[0]),
                                    second: parseInt(tim.split(',')[1])
                                }

                            } else {


                                item.time = {
                                    min: 0,
                                    second: 0
                                }

                                clearInterval(timer)

                                updatePayment(item.id, {
                                    payStatus: '已取消'
                                }).then((res) => {

                                    app.sendSocketMessage({
                                        msg: 'update payInfo'
                                    })
                                })

                            }
                        })






                    }, 1000)
                    that.setData({
                        payList: data
                    })

                })
                that.setData({
                    timer: timer
                })

            }

            that.setData({
                payList: data
            })
            console.log(data);


            wx.setStorageSync('payList', data)
        })
        app.globalData.callback = function (msg) {

            clearInterval(that.data.timer)

            console.log(that.data.payStatus);
            that.onShow()

        }
    },
    repaintPay() {
        let userInfo = wx.getStorageSync('userInfo')
        let that = this
        console.log(userInfo.userId, that.data.payStatus);
        getPaymentInfo(userInfo.userId, that.data.payStatus).then((res) => {
            console.log(res);
            let data = res.data.rows
            data.forEach((item, index) => {})
            that.setData({
                payList: data
            })
            wx.setStorageSync('payList', data)
        })

    },

    onHide() {
        clearInterval(this.data.timer)
        this.data.timer = null


    },

    onUnload() {

    },


    onPullDownRefresh() {

    },


    onReachBottom() {

    },

    onShareAppMessage() {

    },
    back() {
        wx.navigateBack({
            delta: 1
        })
    }
})