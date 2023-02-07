// pages/Cate/Cate.js

const db = wx.cloud.database()
const _ = db.command
wx.cloud.init({
  env:'test1-fqr'
})
Page({
    /**
     * 页面的初始数据
     */
    data: {
        fenlei1: [],
        fenlei2: []
    },
    // 点击左分类事件
    getCate(e) {
        console.log(e);
        let cate = e.currentTarget.dataset.cate
        let that = this
        db.collection('cate').where({
            cateName: cate
        }).get({
            success: function (res) {
                console.log("分类获取成功", res);
                that.setData({
                    fenlei2: res.data[0]
                })
                console.log(that.data.fenlei2);
            },
            fail: function (res) {
                console.log("分类获取失败", res);
            }
        })
    },

    // 点击右分类
    getShopName(e) {
        console.log(e);
        let that = this
        let cateName = e.currentTarget.dataset.catename
        // wx.redirectTo({
        //     url: '../productDetail/productDetail?searchText=' + cateName.trim()
        // })
        console.log(cateName);
        wx.redirectTo({
            url: '/pages/goods/pages/productDetail/productDetail?searchText=' + cateName.trim()
        })
        // db.collection('product').where(_.or([{
        //     shopcate: db.RegExp({
        //       regexp: '.*' + cateName + '.*',
        //       options: 'i',
        //     })
        //   },
        //   {
        //     name: db.RegExp({
        //       regexp: '.*' + cateName + '.*',
        //       options: 'i',
        //     })
        //   }
        // ])).get({
        //   success: res => {
        //     console.log(res)
        //   },
        //   fail: err => {
        //     console.log(err)
        //   }
        // })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        wx.cloud.init({
          env:'test1-fqr'
        })
        db.collection('cate').get({
            success: function (res) {
                console.log("分类获取成功", res);
                that.setData({
                    fenlei1: res.data,
                    fenlei2: res.data[0],
                })
                console.log(that.data.fenlei1);
                console.log(that.data.fenlei2);
            },
            fail: function (res) {
                console.log("分类获取失败", res);
            }
        })
        console.log(that.data.fenlei1);
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