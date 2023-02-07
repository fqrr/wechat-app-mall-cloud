// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
 // 获取头像 名称
 userInfo: {},
 hasUserInfo: false,
 canIUseGetUserProfile: false,
 index:0,
 array:['男','女'],//性别
 date: '2002-09-01',//日期
 region: ['广东省', '广州市', '从化区'],//地区
 phone:'15113507012'



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   // 获取头像等
   if (wx.getUserProfile) {
    this.setData({
        canIUseGetUserProfile: true
    })
}

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


// 性别
bindPickerChange(e){
  this.setData({
    index:e.detail.value
  })
},
// 日期
bindDateChange(e){
  this.setData({
    date:e.detail.value
  })
},
// 地区
bindRegionChange(e){
  this.setData({
    region:e.detail.value
  })
},
//手机号码
bindPhone(){
  wx.showModal({
    editable:true,
    title: '手机号',
    // content: '号码格式为11位数字',
    success :(res)=>{
      // if (res.confirm) {
      //   console.log('用户点击确定')
      // } else if (res.cancel) {
      //   console.log('用户点击取消')
      // }
      // console.log(this);
      this.setData({
        phone:res.content
      })
    }
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})