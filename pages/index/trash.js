var t = getApp();

Page({
    data: {
        loading: !1,
        btn_done: !1,
        role: 0,
        trash: [
            {
                name:'核废料',
                checked:true,
                id:1,
                capacity:100,
            },
            {
                name:'废电池',
                checked:false,
                id:2,
                capacity:100,
            }
        ]
    },
    onLoad: function(a) {
        var i = this;
        wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 危废种类"
        })
        //  this.getOpenerEventChannel().on("receive", function(t) {
        //     i.setData({
        //         role: t.role,
        //         trash: t.trash
        //     });
        // });
    },
    onShow: function() {},
    onPullDownRefresh: function() {},
    init: function() {},
    click_trash: function(t) {
        for (var a = t.detail.value, i = 0; i < a.length; i++) a[i] = parseInt(a[i]);
        for (var e = this.data.trash, n = 0; n < e.length; n++) e[n].checked = a.indexOf(e[n].id) > -1, 
        e[n].checked && !e[n].capacity && (e[n].capacity = "");
        this.setData({
            trash: e
        });
    },
    capacity_input: function(t) {
        var a = this.data.trash;
        a[t.currentTarget.dataset.idx].capacity = t.detail.value, this.setData({
            trash: a
        });
    },
    click_done: function() {
        if (!this.data.btn_done) {
            for (var a = [], i = 0; i < this.data.trash.length; i++) if (this.data.trash[i].checked) {
                if ("" == this.data.trash[i].capacity) return void t.alert("提示", "请填写“" + this.data.trash[i].name + "”的最大库存量。");
                a.push({
                    tid: this.data.trash[i].id,
                    capacity: this.data.trash[i].capacity
                });
            }
            a.length < 1 ? t.alert("提示", "请勾选危废。") : t.post("busi_trash", {
                act: "set",
                trash: a
            }, function(a) {
                t.toast("设置成功", "success"), setTimeout(function() {
                    wx.navigateBack();
                }, 1e3);
            });
        }
    }
});