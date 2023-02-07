// pages/order/order.js
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
        result: null,
        status: []
    },
    goDetail(e) {
        console.log(e.currentTarget.dataset.did);
        wx.navigateTo({
            url: '/pages/businessManagement/pages/setfahuo/setfahuo?did=' + e.currentTarget.dataset.did
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
    // 发货
    queding(e) {
        let that = this
        wx.showModal({
            title: '提示',
            content: '确定已经发货了吗？',
            success(res) {
                if (res.confirm) {
                    db.collection('order').doc(e.currentTarget.dataset.did).update({
                        data: {
                            fahuoStatus: 1,
                        }
                    }).then(res => {
                        that.onShow()
                    })
                } else if (res.cancel) {
                    console.log('点击了取消')
                }
            }
        })
    },
    // 送达
    queda(e){
        let that = this
        wx.showModal({
            title: '提示',
            content: '确定已送达？',
            success(res) {
                if (res.confirm) {
                    db.collection('order').doc(e.currentTarget.dataset.did).update({
                        data: {
                            fahuoStatus: 2,
                        }
                    }).then(res => {
                        that.onShow()
                    })
                } else if (res.cancel) {
                    console.log('点击了取消')
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            result: null,
            status: []
        })
        let that = this
        db.collection('order').where(
            { fahuoStatus: 0 },
        ).get({
            success: function (res) {
                console.log("订单获取成功", res);
                that.setData({
                    result: res.data
                })
                db.collection('order').where(_.or([
                    { fahuoStatus: 1 },
                    { fahuoStatus: 2 },
                    { fahuoStatus: 3 },
                ])).get({
                    success: function (res) {
                        console.log("除未发货获取成功", res);
                        that.setData({
                            result: that.data.result.concat(res.data) 
                        })
                        console.log("result:",that.data.result);
                        for (let i = 0; i < that.data.result.length; i++) {
                            if (that.data.result[i].fahuoStatus == 0) {
                                console.log(0);
                                that.setData({
                                    status: that.data.status.concat("待发货")
                                })
                            } else if (that.data.result[i].fahuoStatus == 1) {
                                that.setData({
                                    status: that.data.status.concat("送货中")
                                })
                            } else if (that.data.result[i].fahuoStatus == 2) {
                                that.setData({
                                    status: that.data.status.concat("已送达")
                                })
                            } else if (that.data.result[i].fahuoStatus == 3) {
                                that.setData({
                                    status: that.data.status.concat("已签收")
                                })
                            }
                        }
                        console.log("result:",that.data.result);
                        console.log("status:",that.data.status);
                    }
                })
            },
            fail: function (res) {
                console.log("订单获取失败", res);
            }
        })
        
    },
s(){
    this.data.status
    console.log(this.data.status);
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