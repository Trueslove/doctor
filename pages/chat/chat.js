// pages/user/gtHistory/gtHistory.js
const app = getApp();
const util = require('../../utils/util')
const wxapi = require('../../utils/wxapi')
const webSocket = require('../../utils/webSocket')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: false,
    voiceStatus: false,
    audioStatus: false,
    choiceType: false,
    toView: 'start',
    style: 2,
    id: '',
    doctor_id: '',
    user_id: "",
    uid: '',
    user: {},
    list: [],
    page: 1,
    follow_id: "",
    imageMode: app.globalData.imageMode,
  },
  upper: function (e) {
    if (!this.data.pageStatus) {
      this.data.page++
      this.getHistory()
    }
  },
  lower: function (e) {
    // console.log(e)
  },
  scroll: function (e) {
    // console.log(e)
  },
  choiceClose() {
    this.setData({
      choiceType: false
    })
  },
  inputFocus() {
    this.setData({
      // height: true,
      choiceType: false,
    }, () => {
      setTimeout(() => {
        this.setData({
          toView: 'start' + (this.data.list.length - 1)
        })
      }, 720)
    })
  },
  inputBlur() {
    this.setData({
      height: false,
      toView: 'start' + (this.data.list.length - 1)
    })
  },
  /**
   * 编辑信息
   */
  inputMsg(e) {
    this.setData({
      msg: e.detail.value
    })
  },
  /**
   * 发送消息
   */
  sendMsg(text, type, time) {
    if (text && type) {
      webSocket.sendMsg({
        type: 'chatMessage',
        uid: this.data.uid,
        mid: this.data.doctor_id,
        time: time ? wxapi.coverTime(time) : time,
        style: this.data.style,
        list: type,
        message: text,
      })
    } else if (this.data.msg) {
      webSocket.sendMsg({
        type: 'chatMessage',
        uid: this.data.uid,
        mid: this.data.doctor_id,
        style: this.data.style,
        list: 0,
        message: this.data.msg,
      }, () => {
        this.setData({
          msg: ''
        })
      })
    }
  },
  voice() {
    this.setData({
      voiceStatus: !this.data.voiceStatus,
      choiceType: false
    })
  },
  /**
   * 开始录音
   */
  startVoice() {
    if (wx.getRecorderManager) {
      this.setData({
        audioStatus: true,
        choiceType: false
      })
      wxapi.getVoice(this.voiceSucc)
    }
  },
  endVoice(res) {
    this.setData({
      audioStatus: false
    })
    wxapi.stopVoice()
  },
  voiceSucc(res) {
    wxapi.uploadVideo(res.tempFilePath, r => {
      this.sendMsg(r.url, 2, res.duration / 7200)
    }, {
      time: res.duration
    })
  },
  // 选择图片
  choosePhoto(e) {
    wxapi.choosePhoto(e.currentTarget.dataset.type, wxapi.uploadFile, res => {
      this.sendMsg(res.url, 1)
    })
  },
  // 选择视频
  chooseVideo(e) {
    wxapi.chooseVideo(e.currentTarget.dataset.type, wxapi.uploadVideo, res => {
      this.sendMsg (res.url, 3, res.time)
    })
  },
  // 预览
  openPhoto(e) {
    let arr = this.data.list.map(e => {
      if (e.list === 1) {
        return e.message
      } else {
        return false
      }
    }).filter(e => e)
    wxapi.previewImage(e.currentTarget.dataset.url, arr)
  },
  /**
   * 播放mp3
   */
  openAudio(e) {
    this.setData({
      audioUrl: e.currentTarget.dataset.url
    })
    wxapi.openAudio(e.currentTarget.dataset.url, this.stopAudio)
  },
  stopAudio() {
    this.setData({
      audioUrl: ''
    })
  },
  videoPlay(e) {
    let video = wx.createVideoContext(e.currentTarget.id, this)
    video.requestFullScreen()
  },
  fullscreenchange(e) {
    if (!e.detail.fullscreen) {
      let video = wx.createVideoContext(e.currentTarget.id, this)
      video.pause()
    }
  },
  // choiceType
  choiceType() {
    this.setData({
      choiceType: !this.data.choiceType,
      toView: 'start' + (this.data.list.length - 1)
    })
  },
  init() {
    util.request({
      modules: '/userInfoDetails',
      method: 'post',
      data: {
        id: this.data.doctor_id
      },
      success: (result) => {
        this.setData({
          user: result.data
        })
        this.openSocket()
      }
    })
  },
  getHistory() {
    let url = '/employee/newsletter_follow';
    let params = {follow_id: this.data.follow_id};
    let {
      type
    } = JSON.parse(wx.getStorageSync('userInfo'));
    if (type == 2) {
      url = '/newsletter/consultant_info'
      params = {user_id: this.data.user_id}
    }
    util.request({
      modules: url,
      method: 'post',
      data: {
        ...params,
        page: this.data.page
      },
      success: (result) => {
        this.setData({
          list: result.data.concat(this.data.list)
        }, res => {
          if (this.data.page === 1)
            this.setData({
              toView: 'start' + (result.data.length - 1)
            })
        })
        if (!result.data.length) {
          this.data.pageStatus = true
          wxapi.alert('没有更多数据了', 'none')
        }
        wx.stopPullDownRefresh()
      }
    })
  },
  openSocket() {
    webSocket.createSocket(this.data.uid, this.data.doctor_id, (res) => {}, this.handleMsg)
  },
  handleMsg(data) {
    if (data.message_type === 'chatMessage') {
      this.data.list.push(data.data)
      this.setData({
        list: this.data.list
      }, res => {
        this.setData({
          toView: 'start' + (this.data.list.length - 1)
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      type
    } = JSON.parse(wx.getStorageSync('userInfo'));
    this.setData({
      id: options.id,
      follow_id: options.follow_id,
      doctor_id: options.doctor_id,
      uid: options.uid,
      user_id: options.user_id,
      style: type == 2 ? 3 : 2
    })
    this.init()
    this.getHistory()
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
    webSocket.closeSocket()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.upper();
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