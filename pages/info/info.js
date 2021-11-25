import fetch from '../../utils/seaver'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeIdx: 1,
        num: '',
        dataInfo: [],
        dataList: [],
        system_message: 0,
        patientName: "",
        loginType: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
     onShow: function (options) {
        let {
            type
        } = JSON.parse(wx.getStorageSync('userInfo'));
        this.setData({
            loginType: type
        })
        this.getDataList();
    },
    handleChangeInput(e) { // 搜索条件
        let value = e.detail.value;
        this.setData({
            patientName: value
        })
        this.getDataList();
    },
    handleToPageDetail(e) {
        let row = e.currentTarget.dataset.row;
        if (row) {
            let uid = row.uid || row.user_id
            wx.navigateTo({
                url: '/pages/chat/chat?id=' + row.id + '&uid=' + uid + '&doctor_id=' + row.m_id + '&follow_id=' + row.follow_id + "&user_id=" + row.user_id
            })
        } else {
            wx.navigateTo({
                url: '/pages/info/infoDetail/infoDetail'
            })
        }
    },
    getDataList() { // 获取消息列表
        let {
            patientName
        } = this.data;
        let url = '/newsletter/list';
        if (this.data.loginType == 2) {
            url = '/newsletter/consultant_list'
            fetch.post(url, {
                patientName
            }).then((res) => {
                this.setData({
                    dataList: res.chat_count,
                    system_message: res.system_message
                })
            }).catch((res) => {
                console.log(res)
            })
        } else {
            fetch.get(url).then((res) => {
                this.setData({
                    dataList: res.chat_count,
                    system_message: res.system_message
                })
            }).catch((res) => {
                console.log(res)
            })
        }
        
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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