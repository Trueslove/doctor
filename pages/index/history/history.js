import fetch from '../../../utils/seaver'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataList: [],
        userInfo: {},
        patientId: ''
    },
    handleToPage(e) {
        let url = e.currentTarget.dataset.url;
        let type = e.currentTarget.dataset.type;
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `${url}?type=${type}&id=${id}`
        })
    },
    onLoad: function(options) {
        this.setData({
            patientId: options.patientId
         })
    },
    /**
     * 生命周期函数--监听页面加载
     */
     onShow: function () {
        this.getDataInfo();
    },
    getDataInfo() { // 获取用户信息
        fetch.post('/employee/old_case', {
            patientId: this.data.patientId
        }).then((res) => {
            this.setData({
                dataList: res.details,
                userInfo: res.user
            })
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