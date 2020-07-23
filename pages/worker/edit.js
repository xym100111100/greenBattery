var t = getApp();

Page({
    data: {
        copyright: t.globalData.app_copy_right,
        role: 0,
        id: 0,
        nick: "",
        pass: 0,
        phone: "",
        power: "",
        uid: 0,
        bind_block: 0,
        user_block: 0,
        ft: ""
    },
    onLoad: function(a) {
        var e = this;
        this.getOpenerEventChannel().on("receive", function(a) {
            a.role = t.globalData.me.role, e.setData(a);
        });
    },
    onShow: function() {
        wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 人员编辑"
        });
    },
    click_power: function(a) {
        var e = this, s = "";
        s = 2 == this.data.role || 3 == this.data.role ? a.detail.value : 1 == a.detail.value.length ? "1" : "", 
        1 == this.data.pass ? t.post("woker", {
            act: "setpower",
            uid: this.data.uid,
            power: s
        }, function(a) {
            t.toast("操作成功", "success"), e.setData({
                power: "" + s
            });
        }) : this.setData({
            power: "" + s
        });
    },
    click_block: function(a) {
        var e = this, s = a.detail.value.length;
        1 == this.data.pass ? t.post("woker", {
            act: "setblock",
            uid: this.data.uid,
            block: s
        }, function(a) {
            t.toast("操作成功", "success"), e.setData({
                bind_block: "" + s
            });
        }) : this.setData({
            bind_block: "" + s
        });
    },
    click_bind: function(a) {
        var e = this, s = {
            act: "handle_bind_reqeust",
            id: this.data.id,
            power: this.data.power,
            block: this.data.bind_block,
            pass: a.currentTarget.dataset.pass
        };
        "1" != s.pass || 2 != this.data.role && 3 != this.data.role || "" != s.power ? t.post("woker", s, function(a) {
            t.toast("处理完成", "success"), "1" == s.pass && e.setData({
                pass: 1
            }), setTimeout(function() {
                wx.navigateBack();
            }, 1e3);
        }) : t.alert("提示", "请指定人员角色");
    },
    click_unbind: function() {
        t.post("woker", {
            act: "unbind",
            uid: this.data.uid
        }, function(a) {
            a.ok ? (t.toast("操作成功", "success"), setTimeout(function() {
                wx.navigateBack();
            }, 1e3)) : t.alert("提示", a.msg);
        });
    }
});