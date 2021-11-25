import fetch from '../../../utils/seaver'
//创建audio控件
const myaudio = wx.createInnerAudioContext();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataInfo: {},
        end_time: '',
        shi: "",
        fen: "",
        miao: "",
        chatList: [],
        follow_id: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            follow_id: options.id
        })
        this.getDataInfo();
        this.getUserInfo();
    },
    //音频播放 
    audioPlay(e) {
        let url = e.currentTarget.dataset.url;
        let key = e.currentTarget.dataset.index,
            audioArr = this.data.chatList;
        myaudio.src = url;
        myaudio.autoplay = true;
        myaudio.play();
        audioArr[key].isPlay = true;
        this.setData({
            chatList: audioArr,
        })
    },
    // 音频停止
    audioStop(e) {
        let key = e.currentTarget.dataset.index,
            audioArr = this.data.chatList;
        myaudio.stop();
        audioArr[key].isPlay = false;
        audioArr.forEach(item => {
            item.isPlay = false;
        })
        audioArr[key].isPlay = true;
        // 监听音频结束事件
        myaudio.onStop(() => {
            audioArr.forEach(item => {
                item.isPlay = false;
            })
            this.setData({
                chatList: audioArr
            })
        })
        // 监听音频自然播放至结束的事件
        myaudio.onEnded(() => {
            audioArr.forEach(item => {
                item.isPlay = false;
            })
            this.setData({
                chatList: audioArr
            })
        })
        this.setData({
            chatList: audioArr,
        })
    },
    grouponcountdown(end_time) {
        let EndTime = new Date(end_time).getTime();
        let NowTime = new Date().getTime();
        let total_micro_second = EndTime - NowTime;
        this.end_time = this.dateformats(total_micro_second);
        setTimeout(() => {
            this.grouponcountdown(end_time);
        }, 1000)
    },
    dateformats(micro_second) {
        // 总秒数
        let second = Math.floor(micro_second / 1000);
        // 天数
        let day = Math.floor(second / 3600 / 24);
        // 小时
        let hr = Math.floor(second / 3600 % 24);
        let hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr;

        // 分钟
        let min = Math.floor(second / 60 % 60);
        let minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;

        // 秒
        let sec = Math.floor(second % 60);
        let secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;
        if (day <= 1) {
            this.setData({
                shi: hrStr,
                fen: minStr,
                miao: secStr
            })
        }
    },
    getDataInfo() { // 获取聊天信息
        fetch.post('/employee/newsletter_follow', {
            follow_id: this.data.follow_id,
            page: 1
        }).then((res) => {
            res.forEach(item => {
                if (item.list == 2) {
                    item.isPlay = false;
                }
            })
            this.setData({
                chatList: res
            })
        }).catch((res) => {
            console.log(res)
        })
    },
    getUserInfo() { // 获取用户信息
        fetch.post('/employee/message_follow', {
            follow_id: this.data.follow_id
        }).then((res) => {
            this.setData({
                dataInfo: res
            })
            this.grouponcountdown(res.time_out)
        }).catch((res) => {
            console.log(res)
        })
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
    handleToPage(e) {
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: url
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