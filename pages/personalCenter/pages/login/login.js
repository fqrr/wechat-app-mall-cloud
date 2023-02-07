// pages/login/login.js
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
        Sid: null
    },
    formSubmit(e) {
        console.log(e);
        let admin = e.detail.value.admin
        let pwd = e.detail.value.pwd
        let email = e.detail.value.email
        let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
        // 三个文本框输入了内容就进入  注册  
        if (admin.trim() !== "" && pwd.trim() !== "" && email.trim() !== "") {
            console.log("邮政验证：", str.test(email));
            // 判断数据库是否存在  此用户名
            db.collection('business').where({
                acount: admin,
            }).get({
                success(res) {
                    console.log(res);
                    // 若没有 用户名，就可以注册
                    if (res.data.length == 0) {
                        // 然后判断邮箱是否  邮箱格式，是就进入
                        if (str.test(email)) {
                            console.log("注册账号...");
                            db.collection('business').add({
                                data: {
                                    acount: admin,
                                    pwd: pwd,
                                    email: email
                                },
                                success: res => {
                                    // 在返回结果中会包含新创建的记录的 _id
                                    wx.showToast({
                                        title: '注册成功',
                                        duration: 2000
                                    })
                                    
                                },
                                fail: err => {
                                    wx.showToast({
                                        icon: 'none',
                                        title: '注册失败',
                                        duration: 2000
                                    })
                                    console.error('[数据库] [新增记录] 失败：', err)
                                }
                            })
                        } 
                        // 提示邮箱格式不正确提示
                        else {
                            wx.showToast({
                                title: '邮箱格式不正确，请重新输入',
                                icon: "none",
                                duration: 3000
                            })
                        }
                    } 
                    // 提示用户名已存在
                    else {
                        wx.showToast({
                            title: '用户名已存在，请重新输入用户名',
                            icon: "none",
                            duration: 3000
                        })
                    }
                }
            })
        } 
        // 填了前两个文本框，进入账号密码验证
        else if (admin.trim() !== "" && pwd.trim() !== "") {
            console.log("验证账号密码...");
            // 验证账号密码
            db.collection('business').where({
                acount: admin,
                pwd: pwd
            }).get({
                success(res) {
                    console.log(res);
                    // 当没有获取到东西，就是账号密码错误
                    if (res.data.length == 0) {
                        wx.showToast({
                            title: '账号或密码错误，若无账号请输入邮箱',
                            icon: "none",
                            duration: 4000
                        })
                    }
                    // 账号密码正确
                    else {
                        wx.showToast({
                            title: '登录成功',
                        })
                        wx.redirectTo({
                          url: '/pages/businessManagement/pages/businessControl/businessControl',
                        })
                    }
                }
            })
        } else {
            wx.showToast({
                title: '账号或密码未输入！',
                icon: "none"
            })
        }
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