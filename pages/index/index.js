import fetch from '../../utils/seaver'
//index.js
Page({
  data: {
    typeItem: [{
        label: '超时',
        key: 'time_out',
        type: 1
      },
      {
        label: '未完成',
        key: 'undone',
        type: 2
      },
      {
        label: '到期未提交',
        key: 'unsubmitted',
        type: 3
      },
      {
        label: '已完成',
        key: 'completed',
        type: 4
      },
      {
        label: '未到期',
        key: 'not_expired',
        type: 5
      },
      {
        label: '全部',
        key: 'all',
        type: 0
      }
    ],
    typeNum: {},
    dataList: [],
    patientName: "", // 患者姓名
    activeIndex: 2, // type类型当前选中
    page: 1,
    isShowMore: false
  },
  //事件处理函数
  onReady: function () {
    this.getDataInfo();
    this.getDataCount();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: ++this.data.page
    })
    this.getDataInfo();
  },
  // js 传入秒数 与 index
  timerhandle(timeSeconds, index) {
    if (timeSeconds) {
      this.setData({
        ['timerList[' + index + ']']: [parseInt(timeSeconds / 60 / 60 % 24), parseInt(timeSeconds / 60 % 60), parseInt(timeSeconds % 60)]
      }, () => {
        let timer = setInterval(() => {
          timeSeconds--
          // 倒计时到0，可以加入自定义函数处理
          if (timeSeconds <= 0) {
            clearInterval(timer)
          }
          this.setData({
            ['timerList[' + index + ']']: [parseInt(timeSeconds / 60 / 60 % 24), parseInt(timeSeconds / 60 % 60), parseInt(timeSeconds % 60)]
          })
        }, 1000)
        let ll = this.data.dataList
        ll.push(timer)
        this.setData({
          dataList: ll
        })
        console.log(ll, 'ffffff')
      })
    } else {
      this.setData({
        ['timerList[' + index + ']']: ['00', '00', '00']
      })
      console.log(this.data.timerList)
    }
  },
  // 清除定时器
  clearAllTimer() {
    this.data.dataList.forEach((el, index) => {
      clearInterval(el)
    })
    this.setData({
      dataList: [],
      timerList: []
    }, () => {

    })
  },
  grouponcountdown(end_time, index) {
    var EndTime = new Date(end_time).getTime();
    var NowTime = new Date().getTime();
    var total_micro_second = EndTime - NowTime;
    let dataList = this.data.dataList;
    let item = dataList[index];
    let timeObj = this.dateformats(total_micro_second)
    dataList[index] = Object.assign(item, timeObj)
    this.setData({
      dataList: dataList
    })
    this.end_time = this.dateformats(total_micro_second);
    setTimeout(() => {
      this.grouponcountdown(end_time, index);
    }, 1000)
  },
  dateformats(micro_second) {
    // 总秒数
    var second = Math.floor(micro_second / 1000);
    // 天数
    var day = Math.floor(second / 3600 / 24);
    // 小时
    var hr = Math.floor(second / 3600 % 24);
    var hrStr = hr.toString();
    if (hrStr.length == 1) hrStr = '0' + hrStr;

    // 分钟
    var min = Math.floor(second / 60 % 60);
    var minStr = min.toString();
    if (minStr.length == 1) minStr = '0' + minStr;

    // 秒
    var sec = Math.floor(second % 60);
    var secStr = sec.toString();
    if (secStr.length == 1) secStr = '0' + secStr;
    if (day <= 1) {
      return {
        shi: Math.abs(hrStr),
        fen: Math.abs(minStr),
        miao: Math.abs(secStr)
      }
    }
  },
  handleToPageOnline(e) {
    let {
      id,
    } = e.currentTarget.dataset.row;
    wx.navigateTo({
      url: '/pages/index/editForm/editForm?id=' + id
    })
  },
  handleChangeInput(e) { // 搜索条件
    let value = e.detail.value;
    this.setData({
      patientName: value
    })
    this.setData({
      page: 1,
      dataList: [],
      isShowMore: false
    })
    this.getDataInfo();
  },
  getDataInfo() { // 获取用户信息
    let url = '/employee/list';
    let {
      type
    } = JSON.parse(wx.getStorageSync('userInfo'));
    if (type == 2) {
      url = '/employee/yz_list'
    }
    let {
      activeIndex,
      patientName,
      page
    } = this.data;
    fetch.post(url, {
      type: activeIndex,
      patientName,
      page
    }).then((res) => {
      let oldData = this.data.dataList
      let dataList = res;
      if (dataList.length > 0) {
        this.setData({
          dataList: oldData.concat(oldData, dataList),
          isShowMore: false
        })
        dataList.forEach((item, index) => {
          this.timerhandle(item.end_time, index);
        })
      } else if (res.length == 0 && oldData.length != 0) {
        this.setData({
          isShowMore: true
        })
      } else {
        this.setData({
          isShowMore: false
        })
      }
    }).catch((res) => {
      console.log(res)
    })
  },
  getDataCount() { // 获取任务数量
    let url = '/employee/count';
    let {
      type
    } = JSON.parse(wx.getStorageSync('userInfo'));
    if (type == 2) {
      url = '/employee/yz_count'
    }
    fetch.post(url).then((res) => {
      this.setData({
        typeNum: res
      })
    }).catch((res) => {
      console.log(res)
    })
  },
  handleToPageDetail(e) { // 跳转详情页
    let {
      type,
      id
    } = e.currentTarget.dataset.row;
    if (type != 5 && type != 3) {
      wx.navigateTo({
        url: `/pages/index/onlineDetail/onlineDetail?id=${id}`
      })
    }
  },
  handleChangeType(e) { // 更改type类型
    let index = e.currentTarget.dataset.index
    this.setData({
      activeIndex: index,
      dataList: [],
      page: 1
    })
    this.getDataInfo();
  }
})