// pages/shopDetail/shopDetail.js
// 商品详情页
wx.cloud.init({
  env:'test1-fqr'
})
const db = wx.cloud.database()
// 命令代码
const _ = db.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchResult: null,
    sid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.sid);
    let that = this
    if (options.sid) {
      db.collection('product').where({
        _id: {
          $regex: '.*' + options.sid,
          $options: 'i'
        }
      }).get({
        success: (res) => {
          console.log("搜索" + options.sid + "获取成功", res);
          that.setData({
            searchResult: res.data[0],
            sid: res.data[0]._id
          })
        },
        fail: function (res) {
          console.log("搜索" + options.sid + "获取失败", res);
        }
      })
    }
  },
  goCar(){
    wx.switchTab({
      url: '/pages/tabBar/car/car',
    })
  },
  // 加入购物车
  inCar() {
    let that = this
    console.log(that.data.sid);
    // console.log(that.data);
    db.collection('shopCar').where({
      productId: that.data.sid
    }).get({
      success: (res) => {
        console.log("购物车获取成功", res);
        // 添加
        if (res.data == "") {
          db.collection("shopCar").add({
            data: {
              productSrc: that.data.searchResult.src,
              productName: that.data.searchResult.name,
              productChecked:true,
              productNum: 1,
              productPrice: that.data.searchResult.price,
              productShopCate: that.data.searchResult.shopcate,
              productId: that.data.sid
            }, success(res) {
              console.log("商品成功加入购物车", res);
              wx.showToast({
                title: '加入成功',
              })
            }, fail(res) {
              console.log("商品加入购物车失败", res);
            }
          })
        }else {
          wx.showToast({
            title: '已有这个商品',
            icon: "none"
          })
        }
      },fail: function (res) {
        console.log("购物车获取失败", res);
      }
    })
  },
  // 收藏
  collection(){
    let that = this
    db.collection('shopCollection').where({
      productId: that.data.sid
    }).get({
      success: (res) => {
        console.log("收藏获取成功", res);
        // 添加
        if (res.data == "") {
          db.collection("shopCollection").add({
            data: {
              productId: that.data.sid
            }, success(res) {
              console.log("商品成功加入收藏夹", res);
              wx.showToast({
                title: '收藏成功',
              })
            }, fail(res) {
              console.log("商品加入收藏夹失败", res);
            }
          })
        }else {
          wx.showToast({
            title: '已收藏',
            icon: "none"
          })
        }
      },fail: function (res) {
        console.log("购物车获取失败", res);
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})