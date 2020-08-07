var t = getApp();

Page({
    data: {
        loading: !1,
        ec: null,
        tid: 0,
        date1: "2020-02-20",
        date2: "2020-02-21",
        today: "2020-08-07",
        tid:1,
        list: [{
            out:true,
            amount:11,
            inputtime:'2020-11-11',
            weight:222, },
            {
            out:false,
            amount:11,
            inputtime:'2020-11-11',
            weight:222, }
        ]
    },
    onLoad: function(a) {
        var n = this;
        wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 历史记录"
        });
        // var e = this.getOpenerEventChannel();
        // e.on("receive", function(t) {
        //     t.ec = e, t.date1 = n.first_day(), t.date2 = n.today(), t.today = n.today(), n.setData(t), 
        //     n.load_data(!0);
        // });
    },
    onShow: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    today: function() {
        var t = new Date();
        return t.getFullYear() + "-" + (1 + t.getMonth()).toString().padStart(2, "0") + "-" + t.getDate().toString().padStart(2, "0");
    },
    first_day: function() {
        var t = new Date();
        return t.getFullYear() + "-" + (1 + t.getMonth()).toString().padStart(2, "0") + "-01";
    },
    load_data: function() {
        var a = this, n = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        if (n || !this.data.loading) {
            this.setData({
                loading: !0
            });
            var e = this.data.list;
            t.post("stock", {
                act: "log",
                tid: this.data.tid,
                d1: this.data.date1,
                d2: this.data.date2,
                skip: n ? 0 : e.length
            }, function(t) {
                n && (e = []), t.data.length > 0 && (e = e.concat(t.data)), a.setData({
                    list: e,
                    loading: !1
                });
            });
        }
    },
    dateChange: function(t) {
        var a = t.currentTarget.dataset.idx, n = t.detail.value, e = {};
        e["date" + a] = n, this.setData(e);
    },
    click_query: function() {
        this.load_data(!0);
    },
    touch_top: function(t) {},
    touch_bottom: function(t) {
        this.load_data();
    }
});