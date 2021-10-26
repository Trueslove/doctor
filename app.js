// import fetch from './utils/serve'
// require('./utils/mixins')
App({
  onLaunch: function () {
    // 隐藏原生的tabbar
    wx.hideTabBar()
  },
  globalData: {
  },
  login(cb){
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
