// pages/collection/collection.js
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
        result: []
    },
    goDetail(e) {
        console.log(e.currentTarget.dataset.did);
        wx.navigateTo({
            url: '/pages/goods/pages/shopDetail/shopDetail?sid=' + e.currentTarget.dataset.did
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.setData({
            res: null,
            result: []
        })
        let that = this
        db.collection('shopCollection').get({
            success: function (res) {
                console.log("收藏获取成功", res);
                that.setData({
                    res: res.data
                })
                for (let i = 0; i < that.data.res.length; i++) {
                    db.collection('product').doc(that.data.res[i].productId).get({
                        success: function (res) {
                            console.log("收藏商品获取成功", res);
                            that.setData({
                                result: that.data.result.concat(res.data)
                            })
                            console.log(that.data.result);
                        },
                        fail: function (res) {
                            console.log("收藏商品获取失败", res);
                        }
                    })
                }
            },
            fail: function (res) {
                console.log("收藏获取失败", res);
            }
        })
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