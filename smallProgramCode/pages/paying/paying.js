const user = require("../../apis/user")
const {
    deletePaymentInfo,
    addPayment,
    updatePayment,
    getPayment
} = require('../../apis/payment')
var {
    timeFormatSecondssA,
    timeFormatSecondss
} = require('../../utils/datePicker')
var {
    compareDate
} = require('../../utils/compareDate')
var app = getApp()
const moment = require("../../utils/moment")
moment.locale('en', {
    longDateFormat: {
        l: "YYYY-MM-DD",
        L: "YYYY-MM-DD HH:mm"
    }
});
Page({


    data: {
        userInfo: '',
        time: {
            min: -1,
            second: -1
        },
        payItem: '',
        money: '',
        payId: '',
        paySixpassword: ['', '', '', '', '', ''],
        nowTime: '',
        timer: null
    },
    back() {
        wx.navigateBack()
    },

    onLoad(options) {
        let payItem
        console.log(options.payItem);
        console.log(options.money);
        let money = options.money
        this.setData({
            money: money
        })
        if (options.payItem) {
            payItem = JSON.parse(decodeURIComponent(options.payItem))
        }


        if (payItem) {
            this.setData({
                payItem: payItem,
                payId: payItem.id,
                nowTime: new Date()
            })
            console.log(payItem);
            updatePayment(payItem.id, {
                payStatus: '进行中'
            }).then((res) => {
                console.log(res);
            })
        } else {

            let userInfo = wx.getStorageSync('userInfo')
            let nowTime = timeFormatSecondss(new Date())
            let data = {
                payType: '充值',
                payTime: nowTime,
                money: money,
                userId: userInfo.userId,
                payStatus: '进行中'
            }
            let that = this
            console.log(payItem);

            addPayment(data).then((res) => {
                console.log(res);
                that.setData({
                    payId: res.data
                })
                that.countDown(res.data)
            })


        }



    },

    getSix(e) {
        console.log(e);
        let value = e.detail.value
        let index = e.currentTarget.dataset.index
        this.setData({
            ['paySixpassword[' + index + ']']: value
        })

        if (this.checkAllSix()) {
            this.setData({
                showPassword: false
            })
        }

    },
    checkAllSix() {
        let data = this.data.paySixpassword
        let count = 0
        data.forEach((item) => {
            if (item === '') {
                return false
            }
            count++
        })
        if (count == data.length) {
            this.pay1()
            return true
        }
    },
    getClosePassword() {
        this.setData({
            showPassword: false
        })

    },
    countDown: function (id, time) {
        console.log(id);
        var that = this
        var timer = setInterval(function () {


            getPayment(id).then((res) => {

                var Num = 15
                let nowTime = new Date()
                let lastTime = new Date(new Date(timeFormatSecondssA(res.data[0].create_time)).getTime() + (1 / 60) * Num * 3600 * 1000)
                let flag = compareDate(lastTime, nowTime)

                if (flag > 0) {

                    let tim = moment(flag).format('mm,ss')

                    that.setData({
                        time: {
                            min: parseInt(tim.split(',')[0]),
                            second: parseInt(tim.split(',')[1])
                        }
                    })

                } else {
                    that.setData({
                        time: {
                            min: 0,
                            second: 0
                        }
                    })

                    clearInterval(timer)
                    updatePayment(id, {
                        payStatus: '已取消'
                    }).then((res) => {
                        console.log(res);
                        app.sendSocketMessage({
                            msg: 'update payInfo'
                        })
                    })

                }
            })
        }, 1000)
        this.setData({
            timer: timer
        })
    },

    onReady() {

    },


    onShow() {
        let userInfo = wx.getStorageSync('userInfo')
        this.setData({
            userInfo: userInfo
        })


    },


    onHide() {
        clearInterval(this.data.timer)
        this.setData({
            timer: null
        })
    },


    onUnload() {
        clearInterval(this.data.timer)
        this.setData({
            timer: null
        })
    },


    onPullDownRefresh() {

    },


    onReachBottom() {

    },

    onShareAppMessage() {

    }
})