// index.js
wx.cloud.init({
  env:'test1-fqr'
})
const db = wx.cloud.database()
Page({
  data: {
    banner: [],
    navCate: [],
    shopList: [],
    newShopList: [],
    search: [],
    searchText: "",
    num: 0,
    // useArr:[],
    // mathArr:[]
  },
  catagroy(e){
    console.log(e.currentTarget.dataset.goods);
    wx.navigateTo({
  url: '/pages/goods/pages/productDetail/productDetail?searchText=' + e.currentTarget.dataset.goods.substr(0,1).trim()
    })
    this.setData({
      searchText: ""
    })
  },
  // 具体搜索
  // search1(e) {
  //   let that = this
  //   console.log(e);
  //   db.collection('product').where({
  //     name: e.detail.value
  //   }).get({
  //     success: function (res) {
  //       console.log("搜索" + e.detail.value + "获取成功", res);
  //       that.setData({
  //         search: res.data
  //       })
  //       if (that.data.search == "") {
  //         wx.showToast({
  //           title: '未找到商品',
  //           icon: "none"
  //         })
  //       }
  //     },
  //     fail: function (res) {
  //       console.log("搜索" + e.detail.value + "获取失败", res);
  //     }
  //   })
  // },
  // 模糊搜索
  search(e) {
    let that = this
    console.log(e);
    wx.navigateTo({
      url: '/pages/goods/pages/productDetail/productDetail?searchText=' + e.detail.value.trim()
    })
    this.setData({
      searchText: ""
    })
  },

  goDetail(e){
    console.log(e);
    if(e.currentTarget.dataset.type == 0){
      wx.navigateTo({
        url: '/pages/goods/pages/shopDetail/shopDetail?sid=0448022461a99a9c002f7a930b019079',
      })
    }else if(e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: '/pages/goods/pages/shopDetail/shopDetail?sid=381d149061a88f37000356555282dd14',
      })
    }else {
      wx.navigateTo({
        url: '/pages/goods/pages/shopDetail/shopDetail?sid=287a53aa61a99a1f00294d4215e83739',
      })
    }
  },

  onLoad() {
    wx.cloud.init({
      env:'test1-fqr'
    })
    let that = this
    // 轮播图图片获取
    db.collection('swiper').get({
      success: function (res) {
        console.log("轮播图获取成功", res);
        that.setData({
          banner: res.data
        })
      },
      fail: function (res) {
        console.log("轮播图获取失败", res);
      }
    })
    // 导航栏图片获取
    db.collection('navCate').get({
      success: function (res) {
        console.log("导航栏图片获取成功", res);
        that.setData({
          navCate: res.data
        })
      },
      fail: function (res) {
        console.log("导航栏图片获取失败", res);
      }
    })

    // 首页商品列表
    db.collection('product').skip(that.data.num).limit(10).get({
      success: function (res) {
        console.log("商品列表获取成功", res);
        that.setData({
          shopList: res.data
        })
        for (let i = 0,len=that.data.shopList.length; i <len ; i++) {
          let currentRandom = parseInt(Math.random() * (that.data.shopList.length - 1));
          console.log(currentRandom);
          let current = that.data.shopList[i];
          that.data.shopList[i] = that.data.shopList[currentRandom];
          that.data.shopList[currentRandom] = current;
        }
        that.setData({
          shopList: that.data.shopList
        })
      },
      fail: function (res) {
        console.log("商品列表获取失败", res);
      }
    })
  },
  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      duration: 1000
    })
    that.setData({
      num: (that.data.num + 10)
    })
    console.log(that.data.num);
    db.collection('product').skip(that.data.num).limit(10).get({
      success: function (res) {
        console.log("商品列表获取成功", res);
        that.setData({
          shopList: that.data.shopList.concat(res.data)
        })
        console.log(that.data.shopList.length);
        console.log(that.data.num);
        console.log(parseInt(Math.random() * (that.data.shopList.length - 1)+that.data.num));
        for (let i = that.data.num,len=that.data.shopList.length; i <len ; i++) {
          let currentRandom = parseInt(Math.random() * (that.data.shopList.length - 1-that.data.num)+that.data.num);
          let current = that.data.shopList[i];
          that.data.shopList[i] = that.data.shopList[currentRandom];
          that.data.shopList[currentRandom] = current;
        }
        that.setData({
          shopList: that.data.shopList
        })
      },
      fail: function (res) {
        console.log("商品列表获取失败", res);
      }
    })
  },


})
