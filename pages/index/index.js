//index.js
Page({
  data: {
    typeItem: [
      {label: '超时', num: 9, type: 0},
      {label: '未完成', num: 9, type: 1},
      {label: '到期未提交', num: 9, type: 2},
      {label: '已完成', num: 19, type: 3},
      {label: '未到期', num: 29, type: 4},
      {label: '全部', num: 9, type: 5}
    ],
    activeIndex: 0, // type类型当前选中
    activeIdx: 0 // 底部导航当前选中状态
  },
  //事件处理函数
  onLoad: function () {
    
  },
  handleToPageDetail() { // 跳转详情页
    wx.navigateTo({
      url: '/pages/index/onlineDetail/onlineDetail'
    })
  },
  handleChangeType(e) { // 更改type类型
    let index = e.currentTarget.dataset.index
    this.setData({
      activeIndex: index
    })
  }
})

