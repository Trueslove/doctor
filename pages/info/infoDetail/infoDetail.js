import fetch from '../../../utils/seaver'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataList: [],
        id: '',
    },
    /**
     * 生命周期函数--监听页面加载
     */
     onShow: function (options) {
        this.setData({
            id: options.id,
        })
        this.getDataList();
    },
    getDataList() { // 获取消息列表
        fetch.post('/employee/message_details', {
            id: this.data.id
        }).then((res) => {
            this.setData({
                dataList: res
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})