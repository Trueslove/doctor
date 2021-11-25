// components/back/back.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        navHeight: 0,
        iconTop: 0
    },
    created() {
        var that = this;
        setTimeout(function () {
            that.setData({
                navHeight: app.globalData.screenHeight * 2, // 给刚刚声明的变量附上全局获取的nav高度
                iconTop: app.globalData.screenHeight - 10
            })
            wx.hideLoading()
        })
    },
    /**
     * 组件的方法列表
     */
    methods: {
        handleBack() {
            wx.navigateBack({
                delta: 1, // 返回上一级页面。
            })
        }
    }
})