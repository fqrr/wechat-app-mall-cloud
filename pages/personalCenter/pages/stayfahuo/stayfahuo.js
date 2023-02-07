// pages/stayfahuo/stayfahuo.js
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
        result:null,
        status:"买家已付款，待发货"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this        
        db.collection('order').doc(options.did).get({
            success: function (res) {
                console.log("单个订单获取成功", res);
                that.setData({
                    result: res.data,
                })
                if(res.data.fahuoStatus == 0){
                    that.setData({
                        status: "买家已付款，待发货",
                        msg: "您的订单待发货"
                    })
                }else if(res.data.fahuoStatus == 1){
                    that.setData({
                        status: "送货中，正火速送往目的地中......",
                        msg: "您的订单送货中......"
                    })
                }else if(res.data.fahuoStatus == 2){
                    that.setData({
                        status: "已送达目的地，确认无误请签收",
                        msg: "您的订单已送达，请签收"
                    })
                }else if(res.data.fahuoStatus == 3){
                    that.setData({
                        status: "已签收",
                        msg: "您的订单已完成"
                    })
                }
                console.log(that.data.result);
            },
            fail: function (res) {
                console.log("单个订单获取失败", res);
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