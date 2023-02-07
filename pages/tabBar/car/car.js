// pages/car/car.js
wx.cloud.init({
  env:'test1-fqr'
})
const db = wx.cloud.database()
const _ = db.command
Page({
    /**
     * 页面的初始数据
     */
    // 商品列表 ， 总价格 ， 是否全部选中 ， 选中的商品id
    data: {
        // 商品列表渲染
        carList: null,
        // 总价格
        Allprice: 0,
        // 是否全选
        isAll: false,
        allNum: 0
    },
    // 数量 + 1 或 - 1 ， 如果第一个参数是1，就加，否则反之
    add_reduce(e) {
        console.log(e);
        let that = this
        console.log("i", e.target.dataset.i);
        console.log("num", e.target.dataset.num);
        let num = e.target.dataset.num
        let carId = e.target.dataset.carid
        console.log(carId);
        if (Number(e.target.dataset.i)) {
            console.log(1);
            db.collection("shopCar").doc(carId).update({
                data: {
                    productNum: ++num
                }, success(res) {
                    that.onShow()
                }
            })
        } else {
            console.log(0);
            let that = this
            let pNum = null
            db.collection('shopCar').where({
                _id: carId
            }).get({
                success: function (res) {
                    console.log("商品列表获取成功", res);
                    pNum = res.data[0].productNum
                    console.log(pNum);
                    if (pNum == 1) {
                        wx.showToast({
                            title: '商品数量不能小于 1 ',
                            icon: "none"
                        })
                    } else {
                        db.collection("shopCar").doc(carId).update({
                            data: {
                                productNum: --pNum
                            }, success(res) {
                                that.onShow()
                            }
                        })
                    }
                },
                fail: function (res) {
                    console.log("商品列表获取失败", res);
                }
            })
        }
    },
    // 计算金额
    computPrice() {
        let price = 0
        let num = 0
        let that = this
        for (let i = 0; i < that.data.carList.length; i++) {
            if (that.data.carList[i].productChecked == true) {
                num = num + that.data.carList[i].productNum
                price = price + (that.data.carList[i].productNum * that.data.carList[i].productPrice)
                console.log(price);
            }
        }
        that.setData({
            Allprice: price.toFixed(2),
            allNum: num
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    // 重新渲染页面
    onShow: function () {
        // this.onLoad()
        let that = this
        db.collection('shopCar').get({
            success: function (res) {
                console.log("商品列表获取成功", res);
                that.setData({
                    carList: res.data
                })

                let i = 0
                for(let j = 0 ;j<res.data.length;j++){
                    if(res.data[j].productChecked == true){
                        i++
                    }
                }
                if(i == res.data.length){
                    that.setData({
                        isAll: true
                    })
                }else {
                    that.setData({
                        isAll: false
                    })
                }

                that.computPrice()

            },
            fail: function (res) {
                console.log("商品列表获取失败", res);
            }
        })
    },
    // 全选
    checkAll() {
        console.log("进入全选函数");
        let that = this
        console.log(this.data.carList);
        for (let i = 0; i < this.data.carList.length; i++) {
            this.dbSelect(!that.data.isAll, that.data.carList[i]._id)
        }
        that.setData({
            carList: that.data.carList,
            isAll: (!that.data.isAll),
        })
        console.log(this.data.carList);
    },
    // 封装数据库修改函数选中否
    dbSelect(flag, carId) {
        let that = this
        db.collection("shopCar").doc(carId).update({
            data: {
                productChecked: flag
            }, success(res) {
                that.onShow()
            }
        })
    },
    // 单个选中
    checkboxChange(e) {
        let that = this
        let carId = e.target.dataset.id
        let count = 0
        console.log(e);
        console.log(e.target.dataset.id);
        // 因为是点完改完值再进入触发事件
        // 当checkbox的value的值不为空时，就是从不勾选到勾选，走上面，反之走下面
        if (e.detail.value.length !== 0) {
            this.dbSelect(true, carId)
        } else {
            this.dbSelect(false, carId)
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // let that = this
        //  db.collection('shopCar').get({
        //     success: function (res) {
        //         console.log("商品列表获取成功", res);
        //         that.setData({
        //             carList: res.data
        //         })
        //         that.computPrice()
        //     },
        //     fail: function (res) {
        //         console.log("商品列表获取失败", res);
        //     }
        // })
    },

    // 删除 选中 的商品
    deleteCar() {
        let that = this
        wx.showModal({
            title: "提示",
            content: "确定要删除 所选中 的商品？",
            cancelColor: 'cancelColor',
            success(res) {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: "carDelete",
                        success(res) {
                            console.log("选中商品删除成功", res);
                            // that.onLoad()
                            that.onShow()
                        }
                    })
                } else {
                    console.log("取消了删除 所选中 的商品");
                }
            }
        })
    },

    // 删除单个商品
    deleteItem(e) {
        let that = this
        let carId = e.target.dataset.carid
        wx.showModal({
            title: "提示",
            content: "确定要删除 单个 的商品？",
            cancelColor: 'cancelColor',
            success(res) {
                if (res.confirm) {
                    db.collection('shopCar').doc(carId).remove().then(res => {
                        console.log(res)
                        that.onShow()
                    })
                } else {
                    console.log("取消了删除 单个 的商品");
                }
            }
        })
    },

    //结算 
    jiesuan() {
        wx.navigateTo({
            url: '/pages/goods/pages/settlement/settlement'
        })
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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