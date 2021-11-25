// import fetch from './utils/serve'
// require('./utils/mixins')
import Socket from "./utils/socket"
App({
  onLaunch: function () {
    //  // 手动关闭
    //  ws.close()
    // 隐藏原生的tabbar
    // wx.hideTabBar()
    wx.getSystemInfo({
      success: res => {
        this.globalData.screenHeight = res.statusBarHeight + 46; // 赋值导航高度
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  globalData: {
    screenHeight: 0
  },
  login(cb) {
    // wx.login({
    //   success: (res)=> {
    //     if (res.code) {
    //       const {code} = res; //code换取token
    //       //发起网络请求
    //       fetch.post('/login/loginByWX.do',{code},{'content-type': 'application/x-www-form-urlencoded'}).then(({token,pfPlatformUser:userInfo={}})=>{
    //         if(userInfo){
    //           wx.setStorageSync('token',token);
    //           wx.setStorageSync('userInfo',userInfo);
    //         }
    //         cb({userInfo});
    //       })
    //     } else {
    //       console.log('获取用户登录态失败！' + res.errMsg)
    //     }
    //   }
    // });
  }
})