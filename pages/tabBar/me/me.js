// pages/me/me.js
// 个人中心
wx.cloud.init({
  env:'test1-fqr'
})
const db = wx.cloud.database()
const _ = db.command
Page({
    data: {
        // 获取头像 名称
        userInfo: {},
        hasUserInfo: false,
        canIUseGetUserProfile: false,

        // 自定义数据
        result: null,
        result1: null,
        fahuo: 0,
        shouhuo: 0
    },

    address(e) {
        console.log(e);
        let type = e.currentTarget.dataset.type
        if (type == "0") {
            wx.navigateTo({
                url: '/pages/personalCenter/pages/finishOrder/finishOrder'
            })
        }
        if (type == "1") {
            console.log("待发货");
            wx.navigateTo({
                url: '/pages/personalCenter/pages/stayFaHuoAll/stayFaHuoAll'
            })
        }
        if (type == "2") {
            console.log("待收货");
            wx.navigateTo({
                url: '/pages/personalCenter/pages/shouHuoAll/shouHuoAll'
            })
        }
        if (type == "4") {
            console.log("收货地址");
            if (wx.chooseAddress) {
                wx.chooseAddress({
                    success: function (res) {
                        console.log(JSON.stringify(res))
                    },
                    fail: function (err) {
                        console.log(JSON.stringify(err))
                    }
                })
            } else {
                console.log('当前微信版本不支持chooseAddress');
            }
        }
    },

    onLoad() {
        // 获取头像等
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }

        // 获取订单icon图标和文字渲染
        let that = this
        db.collection('dingdanIcon').get({
            success: function (res) {
                console.log("订单图标获取成功", res);
                that.setData({
                    result: res.data
                })
                that.computPrice()
            },
            fail: function (res) {
                console.log("订单图标获取失败", res);
            }
        })
        db.collection('my').get({
            success: function (res) {
                console.log("收藏图标获取成功", res);
                that.setData({
                    result1: res.data
                })
            },
            fail: function (res) {
                console.log("收藏图标获取失败", res);
            }
        })
    },
    // 头像
    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    },

    coll(e) {
        console.log(e);
        console.log(e.target.dataset.i);
        if (e.target.dataset.i !== "1") {
            wx.navigateTo({
                url: '/pages/personalCenter/pages/login/login'
            })
        } else {
            wx.navigateTo({
                url: '/pages/personalCenter/pages/collection/collection'
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
        let that = this
        let j = 0
        let k = 0
        let l = 0
        let m = 0
        db.collection('order').get({
            success: function (res) {
                console.log("订单获取成功", res);
                for (let i = 0; i < res.data.length; i++) {
                    console.log(res.data[i].fahuoStatus);
                    // 获取未发货数量
                    if (res.data[i].fahuoStatus == 0) {
                        that.setData({
                            fahuo: ++j
                        })
                    } else {
                        // 当总数量等于自增数量，就是没有一件未发货数量就把fahuo设为0
                        m++
                        if (m == res.data.length) {
                            that.setData({
                                fahuo: 0
                            })
                        }
                    }
                    // 获取已发货和到货数量
                    if (res.data[i].fahuoStatus == 1 || res.data[i].fahuoStatus == 2) {
                        console.log(1111);
                        that.setData({
                            shouhuo: ++k
                        })
                    } else {
                        l++
                        if (l == res.data.length) {
                            that.setData({
                                shouhuo: 0
                            })
                        }
                    }
                }
            },
            fail: function (res) {
                console.log("订单获取失败", res);
            }
        })
    },
    person(){
      wx.redirectTo({
        url: '/pages/personalCenter/pages/personal/personal',
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