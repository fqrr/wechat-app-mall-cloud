// pages/shangchuan/shangchuan.js
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
        bigImg: [],
        img: [],
        res: null,
        result: []
    },
    del(e) {
        let that = this
        console.log(e);
        console.log(e.currentTarget.dataset.i);
        // console.log(that.data.bigImg[e.currentTarget.dataset.i]);
        if (e.currentTarget.dataset.n == 1) {
            console.log("商品");
            wx.cloud.deleteFile({
                fileList: [that.data.bigImg[e.currentTarget.dataset.i]],
                success: res => {
                    // handle success
                    console.log(res.fileList)
                },
                fail: console.error
            })
            that.data.bigImg.splice(e.currentTarget.dataset.i, 1)
            that.setData({
                bigImg: that.data.bigImg
            })
            console.log(that.data.bigImg);
        } else {
            console.log("详情");
            wx.cloud.deleteFile({
                fileList: [that.data.img[e.currentTarget.dataset.i]],
                success: res => {
                    // handle success
                    console.log(res.fileList)
                },
                fail: console.error
            })
            that.data.img.splice(e.currentTarget.dataset.i, 1)
            that.setData({
                img: that.data.img
            })
            console.log(that.data.bigImg);
        }
    },
    // shangchuan() {

    // },
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
        let that = this
        that.setData({
            result: [],
            res: [],
        })
        db.collection('cate').get({
            success: function (res) {
                console.log("分类获取成功", res);
                that.setData({
                    res: res.data
                })
                for (let i = 0; i < res.data.length; i++) {
                    that.setData({
                        result: that.data.result.concat(res.data[i].shopcate)
                    })
                }
            },
            fail: function (res) {
                console.log("分类获取失败", res);
            }
        })
        console.log(that.data.res);
        console.log(that.data.result);
    },
    sZhanShi() {
        let that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                wx.showLoading({
                    title: '上传中',
                });
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let filePath = res.tempFilePaths[0];
                // const name = Math.random() * 1000000;
                var newDateTime = Date.parse(new Date()) + Math.random() * 100
                const cloudPath = "img/index/" + newDateTime + filePath.match(/\.[^.]+?$/)[0]
                // console.log(filePath);
                // console.log(newDateTime);
                console.log(cloudPath);

                wx.cloud.uploadFile({
                    cloudPath,//云存储图片名字
                    filePath,//临时路径
                    success: res => {
                        console.log('[上传图片] 成功：', res)
                        that.setData({
                            bigImg: that.data.bigImg.concat(res.fileID),//云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
                        });
                        let fileID = res.fileID;
                        console.log(fileID);
                    },
                    fail: e => {
                        console.error('[上传图片] 失败：', e)
                    },
                    complete: () => {
                        wx.hideLoading()
                    }
                });
            }
        })
    },
    sDetail() {
        let that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                wx.showLoading({
                    title: '上传中',
                });
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let filePath = res.tempFilePaths[0];
                // const name = Math.random() * 1000000;
                var newDateTime = Date.parse(new Date()) + Math.random() * 100
                const cloudPath = "img/shopDetail/" + newDateTime + filePath.match(/\.[^.]+?$/)[0]
                // console.log(filePath);
                // console.log(newDateTime);
                console.log(cloudPath);

                wx.cloud.uploadFile({
                    cloudPath,//云存储图片名字
                    filePath,//临时路径
                    success: res => {
                        console.log('[上传图片] 成功：', res)
                        that.setData({
                            img: that.data.img.concat(res.fileID),//云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
                        });
                        let fileID = res.fileID;
                        console.log(fileID);
                    },
                    fail: e => {
                        console.error('[上传图片] 失败：', e)
                    },
                    complete: () => {
                        wx.hideLoading()
                    }
                });
            }
        })
    },

    submit(e) {
        let that = this
        console.log(e);
        console.log(this.data.bigImg.length !== 0);
        if (e.detail.value.proName.trim() !== "" && e.detail.value.proNum.trim() !== ""
            && e.detail.value.proPrice.trim() !== "" && e.detail.value.proSales.trim() !== ""
            && e.detail.value.cate.trim() !== "" && this.data.bigImg.length !== 0 && this.data.img.length !== 0) {
            db.collection('product').add({
                data: {
                    detailSrc: that.data.img,
                    name: e.detail.value.proName,
                    num: Number(e.detail.value.proNum),
                    price: Number(e.detail.value.proPrice),
                    sales: Number(e.detail.value.proSales),
                    shopcate: e.detail.value.cate,
                    src: that.data.bigImg
                }
            }).then(res => {
                console.log(res)
                wx.showToast({
                    title: '添加成功',
                    duration: 1000,
                })
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1000);
            })
        } else {
            wx.showToast({
                title: '还有内容未填',
                icon: "none",
                duration: 2000
            })
        }
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