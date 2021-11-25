// pages/finish/finish.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        timer: '',//定时器名字
        countDownNum: 5//倒计时初始值
    },
    countDown() {
        let that = this;
        let countDownNum = that.data.countDownNum;//获取倒计时初始值
        that.setData({
          timer: setInterval(function () {
            //每隔一秒countDownNum就减一，实现同步
            countDownNum--;
            that.setData({
              countDownNum: countDownNum
            })
            if (countDownNum == 0) {
              that.onJumpIndex()
            }
          }, 1000)
        })
      },
      onJumpIndex(){
        clearInterval(this.timer);
        wx.switchTab({
          url:'/pages/index/index'
        })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setData({
        time: options.time,
        name: options.name
      })
        this.countDown();
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