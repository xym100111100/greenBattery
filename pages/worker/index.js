var a = getApp();

Page({
    data: {
        copyright: a.globalData.app_copy_right,
        list: [
            {
                pass:1,
                ft:'停用',
                nick:'杰克',
                phone:'1827800374',
                uid:216,
            },
            {
                pass:1,
                ft:'管理员',
                nick:'小明',
                phone:'1827800374',
                uid:215,
            },
            {
                pass:0,
                ft:'申请绑定',
                nick:'珍妮',
                phone:'1827800374',
                uid:214,
            },
            {
                pass:1,
                ft:'库管员',
                nick:'杰克马',
                phone:'1827800374',
                uid:213,
            },
        ]
    },
    onLoad: function(t) {
        wx.setNavigationBarTitle({
            title: a.globalData.app_name + " - 人员管理"
        });
    },
    onShow: function() {
        this.init();
    },
    onPullDownRefresh: function() {},
    init: function() {
        var t = this;
        // a.post("woker", {}, function(a) {
        //     for (var i = 0; i < a.data.length; i++) "" == a.data[i].nick && (a.data[i].nick = "-"), 
        //     0 == a.data[i].pass ? a.data[i].ft = "申请绑定" : 1 == a.data[i].user_block ? a.data[i].ft = "账号停用" : 1 == a.data[i].bind_block ? a.data[i].ft = "停用" : "1" == a.data[i].power ? a.data[i].ft = "管理员" : "2" == a.data[i].power ? a.data[i].ft = "收集员" : "3" == a.data[i].power ? a.data[i].ft = "库管员" : a.data[i].ft = "普通用户";
        //     t.setData({
        //         list: a.data
        //     });
        // });
    },
    click_worker: function(t) {
        var i = this, e = t.currentTarget.dataset.idx;
        this.data.list[e].uid != a.globalData.me.id ? wx.navigateTo({
            url: "edit",
            success: function(a) {
                a.eventChannel.emit("receive", i.data.list[e]);
            }
        }) : a.alert("提示", "不能设置自己");
    }
});