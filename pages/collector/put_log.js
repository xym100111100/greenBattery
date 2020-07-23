var t = getApp();

Page({
    data: {
        loading: !1,
        activeTab: 0,
        date1: "",
        date2: "",
        today: "",
        list: [],
        list1: []
    },
    onLoad: function() {
        wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 入库记录"
        }), this.load_data(), this.setData({
            date1: this.first_day(),
            date2: this.today(),
            today: this.today()
        });
    },
    click_tab: function(t) {
        this.setData({
            activeTab: t.currentTarget.dataset.idx
        }), this.load_data();
    },
    today: function() {
        var t = new Date();
        return t.getFullYear() + "-" + (1 + t.getMonth()).toString().padStart(2, "0") + "-" + t.getDate().toString().padStart(2, "0");
    },
    first_day: function() {
        var t = new Date();
        return t.getFullYear() + "-" + (1 + t.getMonth()).toString().padStart(2, "0") + "-01";
    },
    touch_top: function() {
        console.log("touch_top");
    },
    touch_bottom: function() {
        console.log("touch_bottom");
    },
    load_data: function() {
        var a = this, e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        if (e || !this.data.loading) {
            this.setData({
                loading: !0
            });
            var i = this.data.list;
            t.post("trash_collect", {
                act: "put_in_log",
                state: this.data.activeTab,
                d1: this.data.date1,
                d2: this.data.date2,
                skip: e ? 0 : i.length
            }, function(t) {
                e && (i = []), t.data.length > 0 && (i = i.concat(t.data)), a.setData({
                    list: i,
                    loading: !1
                });
            });
        }
    },
    dateChange: function(t) {
        var a = t.currentTarget.dataset.idx, e = t.detail.value, i = {};
        i["date" + a] = e, this.setData(i);
    },
    click_query: function() {
        this.load_data();
    },
    click_row: function(t) {
        var a = this, e = t.currentTarget.dataset.idx;
        wx.navigateTo({
            url: "/pages/collector/put_log_detail",
            success: function(t) {
                t.eventChannel.emit("receive", {
                    row: a.data.list[e]
                });
            }
        });
    }
});