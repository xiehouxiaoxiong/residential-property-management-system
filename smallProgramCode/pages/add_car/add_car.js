const {addVehicleInfo} = require('../../apis/vehicleInfo')
var app = getApp()
Page({
  data: {
    cars:['大众','宝马',"奥迪","比亚迪","劳斯莱斯"],
    carTypeList:['轿车','货车'],
    vehicleinfo:{},
  },
  onShow(){
     let userInfo = wx.getStorageSync('userInfo')
     let data = wx.getStorageSync('vehicleinfo')||{carColor:'',
     licenseNumber: '',
     carType:'请选择车辆类型',
     userId:userInfo.userId,
     carBrand:'请选择爱车品牌',
     carPicture:'',
     drivingLicense:''}
     this.setData({
       vehicleinfo:data
     })
  },
  back(){
      wx.redirectTo({
        url: '/pages/myCar/myCar',
      })
  },
  DelImgCp(e) {
    let data = wx.getStorageSync('vehicleinfo')
    this.setData({
      ['vehicleinfo.carPicture']: ""
    })
    data.carPicture=''
    wx.setStorageSync('vehicleinfo', data)
  },
  ViewImageCp(e) {
    wx.previewImage({
      urls: [this.data.vehicleinfo.carPicture],
      current: e.currentTarget.dataset.url
    });
  },
  DelImgDl(e) {
    let data = wx.getStorageSync('vehicleinfo')
    this.setData({
      ['vehicleinfo.drivingLicense']: ""
    })
    data.drivingLicense=''
    wx.setStorageSync('vehicleinfo', data)
  },
  ViewImageDl(e) {
    wx.previewImage({
      urls: [this.data.vehicleinfo.drivingLicense],
      current: e.currentTarget.dataset.url
    });
  },
  ChooseImageCp() {
    wx.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'], 
      sourceType: ['album'], 
      success: (res) => {     
        console.log(res.tempFilePaths)
          this.setData({
            imgList: res.tempFilePaths,     
          })
          let vehicleinfo = this.data.vehicleinfo
        
          let that = this
          
          wx.uploadFile({
            filePath: res.tempFilePaths[0],
            name: 'file',
            header:{
              "Content-Type":"multipart/form-data"
            },
            url: 'http://localhost:3000/imageG/uploadG',
            formData:res,
            method:'post',
            success:function(res){
               console.log('11111');
               console.log(res);
               console.log(JSON.parse(res.data).data);
               vehicleinfo.carPicture = 'http://localhost:3000/'+JSON.parse(res.data).data
               
               that.setData({
                vehicleinfo:vehicleinfo
              })
              wx.setStorageSync('vehicleinfo', vehicleinfo)
            },
            fail:function(res){
               console.log(res);
               wx.showToast({
                title: '上传图片失败',
                icon:'none'
              })
            }
          })
       
        }
      
    });
  },
  ChooseImageDl() {
    wx.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'], 
      sourceType: ['album'], 
      success: (res) => {     
        console.log(res.tempFilePaths)
          this.setData({
            imgList: res.tempFilePaths,     
          })
          let vehicleinfo = this.data.vehicleinfo
        
          let that = this
          
          wx.uploadFile({
            filePath: res.tempFilePaths[0],
            name: 'file',
            header:{
              "Content-Type":"multipart/form-data"
            },
            url: 'http://localhost:3000/imageG/uploadG',
            formData:res,
            method:'post',
            success:function(res){
               console.log('11111');
               vehicleinfo.drivingLicense = 'http://localhost:3000/'+JSON.parse(res.data).data
               that.setData({
                vehicleinfo:vehicleinfo
              })
              wx.setStorageSync('vehicleinfo', vehicleinfo)
            },
            fail:function(res){
               console.log(res);
               wx.showToast({
                title: '上传图片失败',
                icon:'none'
              })
            }
          })
       
        }
      
    });
  },
  CarsChangeBrand(e) {
    console.log(e)
    this.setData({
      ['vehicleinfo.carBrand']:this.data.cars[e.detail.value||0]
    })
    wx.setStorageSync('vehicleinfo', this.data.vehicleinfo)
  },
  CarsChangeType(e) {
    console.log(e)
    this.setData({
      ['vehicleinfo.carType']:this.data.carTypeList[e.detail.value||0]
    })
    wx.setStorageSync('vehicleinfo', this.data.vehicleinfo)
  },
  getCarNo(e) {
    this.setData({
      ['vehicleinfo.licenseNumber']:e.detail.value
    })
    wx.setStorageSync('vehicleinfo', this.data.vehicleinfo)
  },
  getCarColor(e){
    this.setData({
      ['vehicleinfo.carColor']:e.detail.value
    })
    wx.setStorageSync('vehicleinfo', this.data.vehicleinfo)
  },
  confirm() {
    var that = this
    console.log(that.data.vehicleinfo.carBrand);
    console.log(that.data.vehicleinfo.licenseNumber);
    if (that.data.vehicleinfo.carBrand==='请选择爱车品牌') {
      wx.showToast({
        title: '未选择爱车品牌',
        icon:'none'
      })
      return
    }
    if (that.data.vehicleinfo.licenseNumber==='') {
      wx.showToast({
        title: '未填写车牌号',
        icon:'none'
      })
      return
    }
    if (that.data.vehicleinfo.carColor==='') {
      wx.showToast({
        title: '未填写车辆颜色',
        icon:'none'
      })
      return
    }
    if (that.data.vehicleinfo.carType==='请选择车辆类型') {
      wx.showToast({
        title: '未选择车辆类型',
        icon:'none'
      })
      return
    }
    if (that.data.vehicleinfo.carPicture==='') {
      wx.showToast({
        title: '未上传车辆图片',
        icon:'none'
      })
      return
    }
    if (that.data.vehicleinfo.drivingLicense==='') {
      wx.showToast({
        title: '未上传行驶证',
        icon:'none'
      })
      return
    }
    let vehicleinfo = that.data.vehicleinfo
    addVehicleInfo(vehicleinfo).then((res)=>{
      console.log(res);
      if(res.status===200){
        wx.showToast({
          title: '保存成功',
          icon:"success"
        })
        app.sendSocketMessage({msg:'add carInfo'})
        wx.removeStorageSync('vehicleinfo')
      }else{
        wx.showToast({
          title: '保存失败',
          icon:"error"
        })
      }
    })
   
     
  }


})