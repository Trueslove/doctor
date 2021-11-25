// components/chatTemplate/chatTemplate.js
const app = getApp();
const util = require('../../utils/util')
const wxapi = require('../../utils/wxapi')
import {
    uploadVideo
} from "../../utils/upload"
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        inputValue: {
            type: String,
            value: ""
        },
    },
    observers: {
        'inputValue': function (val) {
            if (val == null) return;
            console.log(val)
            this.setData({
                msg: val,
            })
        }
    },
    /**
     * 组件的初始数据
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
        uid: '',
        user: {},
        list: [],
        page: 1,
        imageMode: app.globalData.imageMode,
    },
    created() {

    },
    /**
     * 组件的方法列表
     */
    methods: {
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
                if (type == 1) {
                    this.triggerEvent('getImgUrl', text)
                }
            } else if (this.data.msg) {
                this.triggerEvent('getMessage', this.data.msg);
                this.setData({
                    msg: ''
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
                wxapi.getVoice(this.voiceSucc, this)
            }
        },
        endVoice(res) {
            this.setData({
                audioStatus: false
            })
            wxapi.stopVoice()
        },
        voiceSucc(res, t) {
            console.log(res, '00000')
            wxapi.uploadVideo(res.tempFilePath, r => {
                console.log(r)
                t.triggerEvent('getAuditUrl', {
                    data: r.url,
                    time: Math.ceil(res.duration / 1000)
                });
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
                this.triggerEvent('getVideoUrl', res)
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
        getHistory() {
            util.request({
                modules: '/employee/newsletter_follow',
                method: 'post',
                data: {
                    follow_id: this.data.id,
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
    }
})