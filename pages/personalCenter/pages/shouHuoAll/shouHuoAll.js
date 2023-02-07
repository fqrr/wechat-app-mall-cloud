// pages/shouHuoAll/shouHuoAll.js
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
            url: '/pages/personalCenter/pages/stayfahuo/stayfahuo?did=' + e.currentTarget.dataset.did
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
    queding(e) {
        let that = this
        wx.showModal({
            title: '提示',
            content: '确定要签收了吗？',
            success(res) {
                if (res.confirm) {
                    // 修改为签收
                    db.collection('order').doc(e.currentTarget.dataset.did).update({
                        data: {
                            fahuoStatus: 3,
                        },
                        success(res) {
                            console.log(res);
                            that.onShow()
                        }
                    })
                    db.collection('product').doc(e.currentTarget.dataset.sid).update({
                        data:{
                            description:'测试02',
                          done:true
                      }
                     }).then(res=>{
                      console.log(res)
                     })

                    // db.collection("shopCar").doc(carId).update({
                    //     data: {
                    //         productChecked: flag
                    //     }, success(res) {
                    //         that.onShow()
                    //     }
                    // })

                    db.collection("product").doc(e.currentTarget.dataset.sid).get({
                        success: res => {
                            let num = res.data.num
                            let n = res.data.sales
                            n = n + Number(e.currentTarget.dataset.n)
                            console.log(n);
                            db.collection("product").doc(e.currentTarget.dataset.sid).update({
                                data: {
                                    sales: n,
                                    num: (num -  Number(e.currentTarget.dataset.n))
                                },success(res){
                                    console.log(res);
                                }
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this
        db.collection('order').where(_.or([
            { fahuoStatus: 1 },
            { fahuoStatus: 2 }
        ])).get({
            success: function (res) {
                console.log("订单获取成功", res);
                that.setData({
                    result: res.data
                })
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].fahuoStatus == 0) {
                        // let arr = that.data.status
                        // arr.push
                        that.setData({
                            status: that.data.status.concat("待发货")
                        })
                    } else if (res.data[i].fahuoStatus == 1) {
                        that.setData({
                            status: that.data.status.concat("送货中")
                        })
                    } else if (res.data[i].fahuoStatus == 2) {
                        that.setData({
                            status: that.data.status.concat("已送达")
                        })
                    }
                }
                console.log(that.data.result);
            },
            fail: function (res) {
                console.log("订单获取失败", res);
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