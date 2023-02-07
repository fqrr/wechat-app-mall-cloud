// pages/productDetail/productDetail.js
wx.cloud.init({
  env:'test1-fqr'
})
const db = wx.cloud.database()
const _ = db.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchText: "",
    searchResult: []
  },
  // 在商品列表页搜索，然后自己跳自己，重新获取数据渲染页面
  shopList(e) {
    wx.navigateTo({
      url: '/pages/goods/pages/productDetail/productDetail?searchText=' + e.detail.value.trim()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 获取数据渲染页面
  onLoad: function (options) {
    let that = this
    console.log(options);
    this.setData({
      searchText: options.searchText
    })
    //  this.shopList(options.searchText)
    if (options.searchText) {
      db.collection('product').where(_.or([{
            shopcate: db.RegExp({
              regexp: '.*' + options.searchText + '.*',
              options: 'i',
            })
          },
          {
            name: db.RegExp({
              regexp: '.*' + options.searchText + '.*',
              options: 'i',
            })
          }
        ])).get({
        success: (res) => {
          console.log("搜索" + options.searchText + "获取成功", res);
          that.setData({
            searchResult: res.data
          })
        },
        // fail: function (res) {
        //   console.log("搜索" + options.searchText + "获取失败", res);
        // }
      })
    }
      if(options.searchText === '其'){
      db.collection('product').get().then(res=>{
        console.log('商品数据获取成功'+res);
        that.setData({
          searchResult: res.data
        })
      })
    }
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