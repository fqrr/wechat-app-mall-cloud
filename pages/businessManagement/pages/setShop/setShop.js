// pages/setShop/setShop.js
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
        res: null,
        num: 0
    },
    goSet(e) {
        console.log(e);
        wx.navigateTo({
            url: '/pages/businessManagement/pages/setShopDetail/setShopDetail?sid=' + e.currentTarget.dataset.sid
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        db.collection('product').get({
            success: function (res) {
                console.log("商品获取成功", res);
                that.setData({
                    res: res.data,
                })
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
        let that = this
        wx.showLoading({
            title: '刷新中',
            duration: 1000
        })
        that.setData({
            num: (that.data.num + 20)
        })

        db.collection('product').skip(that.data.num).limit(20).get({
            success: function (res) {
                console.log("商品列表获取成功", res);
                that.setData({
                    res: that.data.res.concat(res.data)
                })
            },
            fail: function (res) {
                console.log("商品列表获取失败", res);
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})