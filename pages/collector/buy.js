var t = getApp();

Page({
    data: {
        copyright: t.globalData.app_copy_right,
        loading: !1,
        btn_done: !1,
        trash: [],
        tid: 0,
        weight: "",
        type: 1,
        amount: ""
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 危废收集"
        }), this.getOpenerEventChannel().on("receive", function(a) {
            for (var i = 0, n = 0; n < a.trash.length; n++) a.trash[n].checked && i++;
            if (0 != i) {
                if (1 == i) for (var s = 0; s < a.trash.length; s++) a.trash[s].checked && (a.trash[s].check = !0, 
                a.tid = a.trash[s].id);
                e.setData(a);
            } else t.alert("提醒", "请先配置经营危废种类", function() {
                wx.navigateBack();
            });
        });
    },
    onShow: function() {},
    click_trash: function(t) {
        this.setData({
            tid: parseInt(t.detail.value)
        });
    },
    click_type: function(t) {
        this.setData({
            type: parseInt(t.detail.value)
        });
    },
    input_weight: function(t) {
        this.setData({
            weight: t.detail.value - 0
        });
    },
    input_amount: function(t) {
        this.setData({
            amount: t.detail.value - 0
        });
    },
    click_done: function() {
        var a = {
            act: "collect"
        };
        if (this.data.tid < 1) t.alert("提示", "请选择收集危废"); else if (a.tid = this.data.tid, 
        "" == this.data.weight || isNaN(this.data.weight) || parseFloat(this.data.weight) <= 0) t.alert("提示", "请填写本次收集质量（千克）"); else {
            if (a.weight = this.data.weight, 1 == this.data.tid) {
                if (1 != this.data.type && 2 != this.data.type) return void t.alert("提示", "请选择蓄电池破损类别");
                if (a.type = this.data.type, "" == this.data.amount || isNaN(this.data.amount) || parseInt(this.data.amount) < 1) return void t.alert("提示", "请填写本次收集数量（只）");
                a.amount = this.data.amount;
            }
            t.post("trash_collect", a, function(t) {
                var a = JSON.stringify({
                    act: "maker_out_confirm",
                    time: t.data.time,
                    id: t.data.id
                });
                wx.navigateTo({
                    url: "/pages/qrcode/qrcode",
                    success: function(t) {
                        t.eventChannel.emit("receive", {
                            content: a
                        });
                    }
                });
            });
        }
    }
});