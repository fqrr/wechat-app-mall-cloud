// pages/settlement/settlement.js
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
        address: null,
        Allprice: null,
        allNum: null
    },

    // 购买
    pay() {
        let that = this
        if (this.data.address == null) {
            wx.showToast({
                title: '请点击上方的选择地址',
                icon: 'none',
                duration: 3000
            })
        } else if (that.data.address.cityName.trim() !== "" && that.data.address.countyName.trim() !== "" && that.data.address.detailInfo.trim() !== "" && that.data.address.provinceName.trim() !== "" && that.data.address.telNumber.trim() !== "" && that.data.address.userName.trim() !== "") {
            let address = that.data.address.provinceName.trim() + that.data.address.cityName.trim() + that.data.address.countyName.trim() + that.data.address.detailInfo.trim()
            var myDate = new Date();
            // console.log(myDate.getFullYear() + "/" + myDate.getMonth()+ "/" +myDate.getDate() + " " +myDate.getHours() + ":" + myDate.getMinutes()+ ":" +myDate.getSeconds());
            let getTime = myDate.getFullYear() + "/" + myDate.getMonth() + "/" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds()

            for (let i = 0; i < that.data.res.length; i++) {
                db.collection("order").add({
                    data: {
                        productSrc: that.data.res[i].productSrc,
                        productName: that.data.res[i].productName,
                        productNum: that.data.res[i].productNum,
                        productPrice: that.data.res[i].productPrice,
                        productShopCate: that.data.res[i].productShopCate,
                        productId: that.data.res[i].productId,
                        fahuoStatus: 0,
                        shouhuoStatus: 0,
                        phone: that.data.address.telNumber.trim(),
                        username: that.data.address.userName.trim(),
                        address: address,
                        time: getTime
                    }, success(res) {
                        console.log("生成订单", res);
                        wx.showToast({
                            title: '购买成功',
                            icon: 'none',
                            duration: 1000,
                            success: function () {
                                wx.cloud.callFunction({
                                    name: "carDelete",
                                    success(res) {
                                        console.log("选中商品删除成功", res);
                                    }
                                })
                                setTimeout(() => {
                                    wx.switchTab({
                                        url: '/pages/tabBar/me/me',
                                    })
                                }, 1000);
                            }
                        })
                    }, fail(res) {
                        console.log("订单生成失败", res);
                    }
                })
            }
        }

    },

    // 计算金额
    computPrice() {
        let price = 0
        let num = 0
        let that = this
        console.log(that.data.res);
        for (let i = 0; i < that.data.res.length; i++) {
            if (that.data.res[i].productChecked == true) {
                num = num + that.data.res[i].productNum
                price = price + (that.data.res[i].productNum * that.data.res[i].productPrice)
                console.log(price);
            }
        }
        that.setData({
            Allprice: price.toFixed(2),
            allNum: num
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        db.collection('shopCar').where({
            productChecked: true
        }).get({
            success: function (res) {
                console.log("要结算的商品获取成功", res);
                that.setData({
                    res: res.data
                })
                that.computPrice()
            },
            fail: function (res) {
                console.log("要结算的商品获取失败", res);
            }
        })
    },

    // 获取地址
    address() {
        let that = this
        if (wx.chooseAddress) {
            wx.chooseAddress({
                success: function (res) {
                    console.log("地址", res)
                    that.setData({
                        address: res
                    })
                    console.log(that.data.address);
                },
                fail: function (err) {
                    console.log(JSON.stringify(err))
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
        // let that = this
        // wx.showLoading({
        //   title: '刷新中',
        //   duration:1000
        // })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})