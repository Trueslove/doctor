const wxapi = require("./wxapi");

const URL = "https://qh.baomanyi.net/api";

function uploadOne(event, cb) {
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    console.log(event, event[0], '9999999')
    wx.uploadFile({
        url: URL + '/upload/image', // 接口地址
        filePath: event[0],
        name: 'file',
        formData: {
            user: 'test'
        },
        header: {
            'Authori-zation': 'Bearer ' + wx.getStorageSync('token'),
            'Content-Type': 'multipart/form-data'
        },
        success(res) {
            // 上传完成需要更新 fileList
            let {
                url
            } = JSON.parse(res.data).data;
            cb(url)
        },
    });
}

function uploadVideo(event, cb) {
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    let uploadTask = wx.uploadFile({
        url: URL + '/upload/video', // 接口地址
        filePath: event.tempFilePath,
        name: 'file',
        formData: {
            user: 'test',
            time: event.time
        },
        header: {
            'Authori-zation': 'Bearer ' + wx.getStorageSync('token'),
            'Content-Type': 'multipart/form-data'
        },
        success(res) {
            // 上传完成需要更新 fileList
            let {
                url,
                time
            } = JSON.parse(res.data).data;
            cb({
                url,
                time
            })
        },
    });
    uploadTask.onProgressUpdate((res) => {
        wxapi.alert(true);
        wxapi.alert(res.progress + '%', 'loading', 10000)
    });
}

function uploadMore(event, cb) {
    const {
        file
    } = event.detail;
    let promise = Promise.all(file.map(item => {
        return new Promise(function (resolve, reject) {
            wx.uploadFile({
                url: URL + '/oss/uploadOss.do', // 接口地址
                filePath: item.url,
                name: 'file',
                formData: {
                    user: 'test'
                },
                header: {
                    token: wx.getStorageSync('token')
                },
                success(res) {
                    // 上传完成需要更新 fileList
                    resolve(JSON.parse(res.data).data.filePath);
                },
            });
        })
    }))
    promise.then(res => {
        cb(res)
    }).catch(err => {
        console.log(err);
    });
}

module.exports = {
    uploadOne,
    uploadMore,
    uploadVideo
}