// pages/register/register.js
import {
    uploadOne
} from "../../utils/upload"
import fetch from '../../utils/seaver'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        real_name: "", // 真实姓名
        sex: '1', // 性别
        job_status: "1", // 职位
        head_img: "", // 头像
        type: ''
    },
    handleChangeInput(e) { // 输入框发生变化
        let key = e.currentTarget.dataset.key;
        let value = e.detail.value;
        this.setData({
            [key]: value
        })
    },
    // 切换头像
    changeAvatar() {
        let that = this;
        wx.chooseImage({
            count: 1, // 最多可以选择的图片张数，默认9
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {
                let avatar = res.tempFilePaths;
                uploadOne(avatar, data => {
                    that.setData({
                        head_img: data
                    })
                })
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },
    handleSubmit() {
        let {
            real_name,
            sex,
            job_status,
            head_img
        } = this.data;
        fetch.post('/user/edit', {
            real_name,
            sex,
            job_status,
            head_img
        }).then((res) => {
            wx.showToast({
                icon: 'success',
                duration: 1000,
            });
            wx.switchTab({
                url: '/pages/index/index'
            })
        }).catch((res) => {
            console.log(res)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let {
            type
        } = JSON.parse(wx.getStorageSync('userInfo'));
        this.setData({
            type: type
        })
    },
    handleCheck(e) {
        let type = e.currentTarget.dataset.type;
        let key = e.currentTarget.dataset.key;
        this.setData({
            [key]: type
        })
        console.log(type, key, this[key])
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})