// pages/login.js
import fetch from '../../utils/seaver'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    captcha: '', // 验证码
    phone: '', // 手机号
    isShowNum: false, // 是否显示倒计时
    sec: 60, // 倒计时读秒
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleChangeInput(e) { // 输入框发生变化
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
    this.setData({
      [key]: value
    })
  },
  handleLogin() { // 登陆
    let {
      phone,
      captcha
    } = this.data;
    if (!phone) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else if (!captcha) {
      wx.showToast({
        title: '请输入验证码！',
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else {
    fetch.post('/login/mobile', {
      phone,
      captcha,
      type: 1
    }).then((res) => {
      wx.showToast({
        icon: 'success',
        duration: 1000,
      });
      if (res.status == 2) {
        wx.switchTab({
          url: '/pages/index/index'
        })
      } else if (res.status == 1) {
        wx.navigateTo({
          url: '/pages/register/register'
        })
      }
      wx.setStorage({
        key: 'token',
        data: res.token
      });
      wx.setStorage({
        key: 'userInfo',
        data: JSON.stringify(res)
      });
    }).catch((res) => {
      console.log(res)
    })
    }
  },
  getCaptcha() { // 获取验证码
    let {
      phone
    } = this.data;
    fetch.post('/register/verify', {
      phone,
    }).then((res) => {
      wx.showToast({
        icon: 'success',
        duration: 1000,
      });
    }).catch((res) => {
      console.log(res)
    })
  },
  handleSendCaptcha() { // 点击获取验证码
    let {
      phone
    } = this.data;
    if (!phone) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 1000,
      });
      return false;
    }
    let _this = this;
    this.setData({
      isShowNum: true
    })
    this.getCaptcha();
    let num = 60;
    let remain = num; //用另外一个变量来操作秒数是为了保存最初定义的倒计时秒数，就不用在计时完之后再手动设置秒数
    let time = setInterval(function () {
      if (remain == 1) {
        clearInterval(time);
        _this.setData({
          sec: num,
          isShowNum: false
        })
        return false //必须有
      }
      remain--;
      _this.setData({
        sec: remain
      })
    }, 1000)
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