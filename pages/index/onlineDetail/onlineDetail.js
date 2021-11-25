import fetch from '../../../utils/seaver'
const myaudio = wx.createInnerAudioContext();
const wxapi = require('../../../utils/wxapi');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataInfo: {},
        imgList: [],
        audioUrl: ""
    },
    //音频播放 
    audioPlay(e) {
        this.setData({
            audioUrl: e.currentTarget.dataset.url
        })
        wxapi.openAudio(e.currentTarget.dataset.url, this.audioStop)
    },
    // 音频停止
    audioStop(e) {
        this.setData({
            audioUrl: ''
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id
        })
    },
    getDataInfo() { // 获取用户信息
        fetch.post('/employee/case_follow', {
            follow_id: this.options.id
        }).then((res) => {
            this.setData({
                dataInfo: res,
                imgList: res.img
            })
        }).catch((res) => {
            console.log(res)
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getDataInfo();
    },
    handleToPage(e) {
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: `${url}?id=${this.data.dataInfo.id}`
        })
    },
})