import fetch from '../../../utils/seaver'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: '', // 线下unline,线上2
        dataInfo: {},
        userInfo: {},
        id: ""
    },
    onLoad: function (options) {
        this.setData({
            type: options.type,
            id: options.id
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        this.getDataInfo();
    },
    getDataInfo() { // 获取详情
        fetch.post('/employee/case_details', {
            medicalRecordNo: this.data.id,
            on_line: this.data.type
        }).then((res) => {
            let {
                user,
                details
            } = res;
            this.setData({
                dataInfo: details[0],
                userInfo: user
            })
        }).catch((res) => {
            console.log(res)
        })
    },
    handleGoBack() {
        wx.navigateBack({
            delta: 1
        });
    },
    handleToPage(e) {
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: `${url}?id=${this.data.dataInfo.medicalRecordNo}`
        })
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