import fetch from '../../utils/seaver'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    e_user: {},
    user: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
   onShow: function (options) {
    this.getUserInfo();
  },
  getUserInfo() { // 获取用户信息
    fetch.get('/userInfo').then((res) => {
      let {
        e_user,
        user
      } = res;
      this.setData({
        e_user,
        user
      })
    }).catch((res) => {
      console.log(res)
    })
  },
  handleOutLogin() { // 退出登陆
    fetch.get('/logout').then((res) => {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }).catch((res) => {
      console.log(res)
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