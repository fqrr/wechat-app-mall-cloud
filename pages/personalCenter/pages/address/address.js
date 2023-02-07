// pages/address/address.js
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
        flag: null,
        isTurn: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },
    // 选择此地址
    chooseAddress(e) {
        let addressId = e.currentTarget.dataset.addressid
        let that = this
        if(isTurn) {
            db.collection('address').doc(addressId).get({
                success: function (res) {
                    console.log("地址获取成功", res);
                    
                },
                fail: function (res) {
                    console.log("地址获取失败", res);
                }
            })
        }else {
            console.log("并非跳转");
        }
    },

    // 删除单个地址
    de(e) {
        let addressId = e.currentTarget.dataset.addressid
        let that = this
        wx.showModal({
            title: "提示",
            content: "确定要删除此地址？",
            cancelColor: 'cancelColor',
            success(res) {
                if (res.confirm) {
                    db.collection('address').doc(addressId).remove().then(res => {
                        console.log(res)
                        that.onShow()
                    })
                } else {
                    console.log("取消了删除此地址");
                }
            }
        })
    },
    // 添加地址
    address() {
        let that = this
        if (wx.chooseAddress) {
            wx.chooseAddress({
                success: function (res) {
                    console.log(res);
                    db.collection("address").add({
                        data: {
                            provinceName: res.provinceName,
                            cityName: res.cityName,
                            countyName: res.countyName,
                            detailInfo: res.detailInfo,
                            telNumber:res.telNumber,
                            userName:res.userName,
                            postalCode:res.postalCode,
                        }, success(res) {
                            console.log("成功添加地址", res);
                            wx.showToast({
                                title: '加入成功',
                            })
                            onShow()
                        }, fail(res) {
                            console.log("添加地址失败", res);
                        }
                    })
                },
                fail: function (err) {
                    console.log(err);
                }
            })
        } else {
            console.log('当前微信版本不支持chooseAddress');
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
        db.collection('address').get({
            success: function (res) {
                console.log("地址获取成功", res);
                if(res.data.length == 0){
                    that.setData({
                        flag: true
                    })
                }else {
                    that.setData({
                        res: res.data,
                        flag: false
                    })
                    console.log(res);
                }
            },
            fail: function (res) {
                console.log("地址获取失败", res);
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