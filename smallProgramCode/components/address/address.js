var util = require("../../utils/util.js")
var address = require('../../utils/city.js')

Component({

  properties: {
   address:{
     type: String,
     value: '点击选择地址'
   },

  },


  data: {
    animation: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    address: '',
  },

  lifetimes:{
    attached: function () {
      let id = address.provinces[0].id
      this.setData({
        provinces: address.provinces,
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    },
  },


  methods: {

    selectDistrict: function (e) {
      var that = this
      if (that.data.addressMenuIsShow) {
        return
      }
      that._startAddressAnimation(true)
    },


    cityCancel: function (e) {
      this._startAddressAnimation(false)
    },

  
    citySure: function (e) {
      var that = this
      let value = that.data.value
      that._startAddressAnimation(false)

      let address_now = that.data.provinces[value[0]].name +
       ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
      console.log(address_now)
      that.setData({
        address: address_now
      })
      that.triggerEvent('select', [address_now, that.data.provinces[value[0]].name,
        that.data.citys[value[1]].name, that.data.areas[value[2]].name])
    },


    _startAddressAnimation: function (isShow) {
      var that = this
      if (isShow) {
        that.animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
        }),
        that.animation.translateY(0 + 'vh').step()
      } else {
        that.animation.translateY(40 + 'vh').step()
      }
      that.setData({
        animationAddressMenu: that.animation.export(),
        addressMenuIsShow: isShow,
      })
    },


    _hideCitySelected: function (e) {
      this._startAddressAnimation(false)
    },



    _cityChange: function (e) {
      let value = e.detail.value
      let provinces = this.data.provinces
      let citys = this.data.citys
      let areas = this.data.areas
      let provinceNum = value[0]
      let cityNum = value[1]
      let countyNum = value[2]

      if (this.data.value[0] != provinceNum) {
        let id = provinces[provinceNum].id
        this.setData({
          value: [provinceNum, 0, 0],
          citys: address.citys[id],
          areas: address.areas[address.citys[id][0].id],
        })
      } else if (this.data.value[1] != cityNum) {

        let id = citys[cityNum].id
        this.setData({
          value: [provinceNum, cityNum, 0],
          areas: address.areas[citys[cityNum].id],
        })
      } else {

        this.setData({
          value: [provinceNum, cityNum, countyNum]
        })
      }
    },

  }
})

