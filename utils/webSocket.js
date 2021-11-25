const wxapi = require('./wxapi')
var webSocket = function(fn){
  let socketTask = null, time, idTask, midTask
  return {
    // 开启服务
    createSocket(id, mid, fn, getMsg) {
      if (socketTask) {
        if (fn) fn()
        return false
      }
      socketTask = wx.connectSocket({
        url: 'wss://qh.baomanyi.net:8282',
        header:{
          'content-type': 'application/json'
        },
        success: res => {
          console.log(1111)
        }
      })
      if (socketTask) {
        socketTask.onOpen(res => {
          idTask = id || idTask
          midTask = mid || midTask
          this.login(midTask, fn)
        })
        socketTask.onMessage(res => {
          let {data} = res
          data = JSON.parse(data)
          if (getMsg) getMsg(data)
        })
        socketTask.onClose(res => {
          socketTask = null
          this.clearPing()
        })
        socketTask.onError(res => {
          wxapi.dialog("", '网络错误')
          socketTask = null
          this.clearPing()
        })
      }
    },
    // 登录
    login(id, fn) {
      this.sendMsg({
        type:'Init',
        uid: midTask
      }, () => {
        this.keepPing()
        if (fn) fn()
      })
    },
    // 发送消息
    sendMsg(data, fn = null) {
      if (socketTask) {
        socketTask.send({
          data: JSON.stringify(data),
          success: res => {
            if (fn) fn()
          }
        })
      } else {
        this.createSocket(() => {
          this.sendMsg(data, fn)
        })
      }
    },
    // 开启心跳
    keepPing() {
      if (time) clearInterval(time)
      time = setInterval(() => {
        this.sendMsg({type: 'ping'})
      }, 4000)
    },
    // 关闭心跳
    clearPing() {
      if (time) clearInterval(time)
    },
    // 关闭
    closeSocket() {
      if (socketTask) socketTask.close()
    },
  }
}()
module.exports = webSocket