import fetch from '../../../utils/seaver'
const myaudio = wx.createInnerAudioContext();
const wxapi = require('../../../utils/wxapi');
Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isShowChat: false, // 是否显示聊天组件
        modalHidden: true, //是否隐藏对话框
        rangeKey: ['years', 'months', 'days'],
        switch: false,
        activeIndex: 0,
        dataInfo: {},
        id: '',
        chatList: [],
        onlineInfo: {
            chief_complaint: "", // 主诉
            examination: "", // 检查
            doctor_order: "", // 医嘱
            dispose: "", // 处置
            diagnosis: "", // 诊断
        },
        next_product: "", // 复诊项目
        next_time: new Date().Format("yyyy-MM-dd hh:mm:ss"), // 下次复诊时间
        next_type: "", // 复诊方式
        is_draft: "", // 0直接提交1草稿
        doctor_desc: "", // 医生最终回复
        doctor_desc_type: "", // 0文字1音频2视频
        doctor_desc_time: "", // 音频时间
        flag: false,
        activeRowIndex: null,
        isPlay: false,
        id: '',
        loginType: '',
        audioUrl: '',
        inputValue: ""
    },
    handleSave(e) {
        let type = e.currentTarget.dataset.type;
        let {
            chatList,
            doctor_desc,
            doctor_desc_type,
            doctor_desc_time,
            onlineInfo,
            activeRowIndex,
            next_time,
            next_product,
            dataInfo
        } = this.data;
        let that = this;
        wx.showModal({
            title: '复诊项目完成确认',
            content: `${dataInfo.doctorName}医生辛苦了，请在次确认完成并关闭本次复诊任务\r\n下次复诊时间为\r\n${next_time}`,
            success(res) {
                if (res.confirm) {
                    onlineInfo.follow_id = that.data.id;
                    let replay = [];
                    chatList.forEach(item => {
                        replay.push({
                            id: String(item.id),
                            doctor_content: item.doctor_content,
                            doctor_type: item.doctor_type,
                            title: item.title
                        })
                    })
                    fetch.post('/employee/doctor_reply', {
                        ...onlineInfo,
                        replay: JSON.stringify(replay),
                        doctor_desc,
                        doctor_desc_type,
                        doctor_desc_time,
                        is_draft: type,
                        next_type: activeRowIndex,
                        next_time,
                        next_product
                    }).then((res) => {
                        wx.showToast({
                            title: '提交成功',
                            mask: true,
                            icon: 'none',
                            duration: 1500
                        });
                        wx.navigateTo({
                            url: `/pages/finish/finish?name=${dataInfo.doctorName}&time=${next_time}`
                        })
                    }).catch((res) => {
                        console.log(res)
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

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
    //事件处理函数
    bindViewTap() {
        this.setData({
            modalHidden: !this.data.modalHidden
        })
    },
    //确定按钮点击事件
    modalBindaconfirm() {
        this.setData({
            modalHidden: !this.data.modalHidden,
        })
    },
    //取消按钮点击事件
    modalBindcancel() {
        this.setData({
            modalHidden: !this.data.modalHidden,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        this.getDataInfo();
        this.getDetailInfo();
    },
    onLoad: function (options) {
        let {
            type
        } = JSON.parse(wx.getStorageSync('userInfo'));
        this.setData({
            id: options.id,
            loginType: type,
        })
    },
    handleHf(e) {
        let {index, content, type} = e.currentTarget.dataset;
        let contentInfo = "";
        if(type == 0) {
            contentInfo = content
        }
        this.setData({
            activeRowIndex: index,
            isShowChat: true,
            inputValue: contentInfo
        })
    },
    getMessage(data) {
        this.changeChatList(data.detail, 0)
    },
    getAuditUrl(data) {
        let url = data.detail.data;
        let time = data.detail.time;
        this.changeChatList(url, 2, time)
    },
    getVideoUrl(data) {
        let url = data.detail.url;
        this.changeChatList(url, 3)
    },
    getImgUrl(data) {
        let url = data.detail;
        this.changeChatList(url, 1)
    },
    changeChatList(content, type, time) {
        let index = this.data.activeRowIndex;
        if (index === 'zzhf') {
            this.setData({
                doctor_desc: content,
                doctor_desc_type: type,
                isShowChat: false,
            })
            if (type == 2) {
                this.setData({
                    doctor_desc_time: time
                })
            }
        } else {
            let chatList = this.data.chatList;
            chatList[index].doctor_content = content;
            chatList[index].doctor_type = type;
            if (type == 2) {
                chatList[index].time = time;
            }
            this.setData({
                chatList: chatList,
                isShowChat: false
            })
        }
    },
    handleZzHf() {
        this.setData({
            activeRowIndex: 'zzhf',
            isShowChat: true
        })
    },
    getDetailInfo() {
        fetch.post("/employee/case_store", {
            follow_id: this.data.id
        }).then((res) => {
            this.setData({
                onlineInfo: res.follow,
            })
        }).catch((res) => {
            console.log(res)
        })
    },
    getDataInfo() { // 获取用户信息
        let url = "/employee/case_follow";
        let params = {
            follow_id: this.data.id
        }
        if (this.data.loginType == 2) {
            url = "/employee/yz_details"
            params = {
                id: this.data.id
            }
        }
        fetch.post(url, params).then((res) => {
            this.setData({
                dataInfo: res,
                chatList: res.img,
                switch: res.is_chat == 0 ? false : true,
                doctor_desc: res.doctor_desc,
                doctor_desc_type: res.doctor_desc_type,
                doctor_desc_time: res.doctor_desc_time
            })
        }).catch((res) => {
            console.log(res)
        })
    },
    getTopFollow() { // 获取上次复诊记录
        fetch.post('/employee/top_follow', {
            patientId: this.data.dataInfo.patientId
        }).then((res) => {
            this.setData({
                onlineInfo: res
            })
        }).catch((res) => {
            console.log(res)
        })
    },
    handleChange(e) { // 变化预约时间
        this.setData({
            next_time: e.detail.dateString
        })
    },
    changeSwitch(e) {
        let that = this;
        wx.showModal({
            title: '提示',
            content: '是否确认开启图文聊天，开启后不可关闭?',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                if (result.confirm) {
                    let url = e.currentTarget.dataset.url;
                    let {
                        id,
                        uid
                    } = this.data.dataInfo;
                    fetch.post('/employee/chat', {
                        follow_id: id,
                        user_id: uid,
                        is_chat: that.data.switch ? 0 : 1
                    }).then((res) => {
                        if (!that.data.switch) {
                            wx.navigateTo({
                                url: `${url}?id=${that.data.id}&doctor_id=${that.data.dataInfo.doctor_id}&uid=${that.data.dataInfo.uid}`
                            })
                        }
                        that.setData({
                            switch: !that.data.switch
                        })
                    }).catch((res) => {
                        console.log(res)
                    })
                } else if (result.cancel) {
                    that.setData({
                        switch: false
                    })
                }
            },
            fail: () => {},
            complete: () => {}
        });

    },
    handleInputPro(e) {
        let key = e.currentTarget.dataset.key;
        let value = e.detail.value;
        this.setData({
            [key]: value
        })
    },
    handleInput(e) { // 输入框发生变化
        let key = e.currentTarget.dataset.key;
        let value = e.detail.value;
        let targetKey = 'onlineInfo.' + key;
        this.setData({
            [targetKey]: value
        })
    },
    handleChangeType(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            activeIndex: index
        })
    },
    handleToPage(e) {
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: `${url}?id=${this.data.id}&patientId=${this.data.dataInfo.patientId}`
        })
    }
})