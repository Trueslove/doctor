var SHA1 = require('./sha1')
// var Qs = require('./qs')
var config = require('../config').config

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 拓展对象
 */
const extend = function extend(target) {
  var sources = [...arguments]

  for (var i = 0; i < sources.length; i += 1) {
    var source = sources[i];
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

var noop = function noop() { };

/***
 * @class
 * 表示请求过程中发生的异常
 */
var RequestError = (function () {
  function RequestError(message) {
    Error.call(this, message);
    this.message = message;
  }
  RequestError.prototype = new Error();
  RequestError.prototype.constructor = RequestError;
  return RequestError;
})();

/**
 * 默认参数
 * Url  请求 URL
 * V    接口版本
 * isSign 是否签名 (某些特定接口需要签名 true | false)
 * method 请求方式
 */
var defaultOptions = {
  url: config.host,
  isSign: false,
  method: 'GET',
  success: noop,
  fail: noop,
};

/**
 * request
 * @param {object} options 
 */
/**
 * @method
 * 进行服务器请求
 *
 * @param {Object} options 登录配置
 * @param {string} [options.url] 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "GET"
 * @param {string} [options.v] 请求接口版本，默认为 "v1"
 * @param {Function} [options.success(userInfo)] 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} [options.fail(error)] 登录失败后的回调函数，参数 error 错误信息
 */
const request = options => {
  if (typeof options !== 'object') {
    var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
    throw new RequestError(message);
  }

  options = extend({}, defaultOptions, options);
  // options.data = extend({}, options.data, { token: wx.getStorageSync('token') || '' })

  var data = options.data
  // console.log('')
  // console.log('------ start ------')
  // 签名
  if (options.method == "post" || options.method == "POST") {
    options.method = "POST"
  } else {
    options.method = "GET"
  }
  if (options.isSign) {
    
    // console.log('签名原串 [排序前] >>> ', JSON.stringify(data))
    // data.sign = `${config.conf.SIGN}${Qs.stringify(data)}`
    // console.log('签名原串 [排序后] >>> ', data.sign)
    // data.sign = SHA1(data.sign)
    // console.log('签名 [sign] >>> ', data.sign)

    // data.key = config.conf.KEY
    // console.log('请求参数 >>> ', Qs.stringify(data))
  }
  wx.request({
    url: options.url + '/api' + options.modules,
    header: {
      // 'content-type': 'multipart/form-data',
      'Authori-zation': 'Bearer ' + wx.getStorageSync('token')
    },
    method: options.method,
    data: data,
    success: response => {
      if (response.data.code == 200 || response.data.status == 200) {
        options.success(response.data)
      } else if (response.data.code == 1001) {
        wx.login({
          success: res => {
            wx.request({
              url: options.url + '/api/User/login',
              method: 'POST',
              data: {
                code: res.code
              },
              success: (result) => {
                if (result.data.code === 0) {
                  wx.setStorageSync('token', result.data.data.token)
                  getApp().globalData.token = result.data.data.token
                  getApp().globalData.bidding = result.data.data.is_bidding
                  getApp().globalData.member = result.data.data.is_member
                  getApp().globalData.currency = result.data.data.is_currency
                  getApp().globalData.userInfo = result.data.data
                  request(options)
                } else {
                  // wx.showModal({
                  //   title: "系统提示",
                  //   content: typeof response.data.msg === 'string' && response.data.msg || '网络错误',
                  // })
                }
              }
            })
          },
          fail: res => {
            console.error('fail', res)
          }
        })
      } else {
        // wx.showModal({
        //   title: "系统提示",
        //   content: typeof response.data.msg === 'string' && response.data.msg || '网络错误',
        //   success: function (res) {
        //     if (res.confirm && options.fail) {
        //       options.fail()
        //     }
        //   }
        // })
      }
      // console.log('------ end ------')
      // console.log('')
    },
    fail: function (error) {
      wx.showModal({
        title: "系统提示",
        content: '网络错误'
      })
      options.fail && options.fail(error)
    }
  })
}
/**
 *
 * 
 * navigateTo 页面 跳转
 * @param ev
 */
const go = (ev) => {
  let url = ev.target.dataset.url || ev.currentTarget.dataset.url
  wx.navigateTo({
    url: url,
    success: function(e) {

    },fail: function(e) {
      console.log(e)
    }
  })
}

const switchTab = (ev) => {
  let url = ev.target.dataset.url || ev.currentTarget.dataset.url
  wx.switchTab({
    url: url,
    success: function(e) {

    },fail: function(e) {
      console.log(e)
    }
  })
}

module.exports = {
  formatTime: formatTime,
  request: request,
  go: go,
  switchTab: switchTab
}

wx.showShareMenu({
  withShareTicket: true
})
