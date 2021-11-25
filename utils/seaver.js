const API = 'https://qh.baomanyi.net/api'

function fetch(url, type = 'get', data = {}, header = {content: 'application/json'}, isPage = false) {
    wx.showLoading({
        title: ''
    })
    return new Promise(function (resolve, reject) {
        let token = wx.getStorageSync('token');
        let head = {'content-type': 'application/json', 'Authori-zation': 'Bearer ' + token}
        if (header) {
            Object.assign(head, header);
        }
        let request = {
            url: API + url,
            data: data,
            method: type,
            dataType: "json",
            header: head,
            success: function (res) {
                wx.hideLoading();
                let {data, msg, total, status, code} = res.data;
                if (status === 200 || code === 200) {
                    isPage ? resolve({data, total, msg}) : resolve(data);
                } else {
                    if (status === 410000) { //未登录
                        wx.showModal({
                            title: '提示',
                            content: msg,
                            success: function (res) {
                            }
                          })
                        // wx.showToast({title: msg, mask: true, icon: 'none', duration: 2500});
                        setTimeout(()=>{
                            wx.redirectTo({url: "/pages/login/login"});
                        },1000)
                    } else if (status === "fail") {
                        setTimeout(()=>{
                            wx.showModal({
                                title: '提示',
                                content: msg,
                                success: function (res) {
                                }
                              })
                            // wx.showToast({title: msg, mask: true, icon: 'none', duration: 2500});
                        })
                    } else if (status === 500) {
                        setTimeout(()=>{
                            wx.showModal({
                                title: '提示',
                                content: msg,
                                success: function (res) {
                                }
                              })
                            // wx.showToast({title: msg, mask: true, icon: 'none', duration: 2500});
                        })
                    } else if (status === 400) {
                        // wx.showModal({
                        //     title: '提示',
                        //     content: msg,
                        //     success: function (res) {
                        //     }
                        //   })
                        setTimeout(() => {
                            wx.showToast({title: msg, mask: true, icon: 'none', duration: 2000});
                        }, 0)
                    }
                    reject(status)
                }
            },
            fail: reject,
            complete: function () {
                wx.hideLoading();
            }
        }
        wx.request(request);
    })
}

module.exports = {
    "get": function (url, data, header, isPage) {
        return fetch(url, "GET", data, header, isPage);
    },
    "post": function (url, data, header, isPage) {
        return fetch(url, "POST", data, header, isPage);
    }
};
