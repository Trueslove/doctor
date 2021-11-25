import fetch from '../../../utils/seaver'
const myaudio = wx.createInnerAudioContext();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        rangeKey: ['years', 'months', 'days'],
        id: '',
        onlineInfo: {
            chief_complaint: "", // 主诉
            examination: "", // 检查
            doctor_order: "", // 医嘱
            dispose: "", // 处置
            diagnosis: "", // 诊断
        },
        flag: false,
    },
    handleSave(e) {
        let {
            onlineInfo,
        } = this.data;
        onlineInfo.follow_id = this.data.id;
        fetch.post('/employee/update_follow', {
            ...onlineInfo,
        }).then((res) => {
            wx.showToast({
                title: '提交成功',
                mask: true,
                icon: 'none',
                duration: 1500
            });
        }).catch((res) => {
            console.log(res)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        this.getDetailInfo();
    },
    onLoad: function (options) {
        this.setData({
            id: options.id,
        })
    },
    getDetailInfo() {
        fetch.post("/employee/case_store", {follow_id: this.data.id}).then((res) => {
            this.setData({
                onlineInfo: res.follow,
                dataInfo: res.user
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
    handleInput(e) { // 输入框发生变化
        let key = e.currentTarget.dataset.key;
        let value = e.detail.value;
        let targetKey = 'onlineInfo.' + key;
        this.setData({
            [targetKey]: value
        })
    }
})