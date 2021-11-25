// components/backTop/backTop.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },
    created() {
        // 在页面中定义插屏广告
        let that = this;
        that.getSysdata();
    },
    /**
     * 组件的初始数据
     */
    data: {
        // 拖拽参数
        writePosition: [80, 90], //默认定位参数
        writesize: [0, 0], // X Y 定位
        window: [0, 0], //屏幕尺寸
        write: [325, 600], //定位参数
        scrolltop: 0, //据顶部距离
    },
    /**
     * 组件的方法列表
     */
    methods: {
        handleToTop() {
            wx.pageScrollTo({
                scrollTop: 0
            })
        },
        //计算默认定位值
        getSysdata: function () {
            var that = this;
            wx.getSystemInfo({
                success: function (e) {
                    that.data.window = [e.windowWidth, e.windowHeight];
                    var write = [];
                    write[0] = that.data.window[0] * that.data.writePosition[0] / 100;
                    write[1] = that.data.window[1] * that.data.writePosition[1] / 100;
                    console.log(write, 45)
                    that.setData({
                        write: write
                    }, function () {
                        // 获取元素宽高
                        wx.createSelectorQuery().select('.collectBox').boundingClientRect(function (res) {
                            if (!!res) {
                                that.data.writesize = [res.width, res.height];
                            }
                        }).exec();
                    })
                },
                fail: function (e) {
                    console.log(e)
                }
            });
        },
        //开始拖拽  
        touchmove: function (e) {
            var that = this;
            var position = [e.touches[0].pageX - that.data.writesize[0] / 2, e.touches[0].pageY - that.data.writesize[1] / 2 - this.data.scrolltop];
            that.setData({
                write: position
            });
        },
        onPageScroll(e) {
            this.data.scrolltop = e.scrollTop;
        },
    }
})