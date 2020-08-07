var API = require('../../utils/api.js')

var app = getApp();

Page({
    data: {
        copyright: app.globalData.app_copy_right,
        // trash: [{
        //     checked:true,
        //     w_keep:2244,
        //     id:1,
        //     a_keep:11,
        //     w_increase:3432,
        //     a_increase:'11',
        //     w_reduce:1233,
        //     a_reduce:4322,
        //     name:'标题'
        // }]
        trash:[]
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 库存"
        })
        //  this.getOpenerEventChannel().on("receive", function(e) {
        //     for (var a = e.trash, n = 0; n < a.length; n++) a[n].w_increase = 0, a[n].w_reduce = 0, 
        //     a[n].w_keep = 0, a[n].a_increase = 0, a[n].a_reduce = 0, a[n].a_keep = 0;
        //     t.setData({
        //         trash: a
        //     }), t.init();
        // });

        API.request('/standingBook/getStandingBookByCompanyNo',{companyNo:app.globalData.me.companyNo},'get',(res)=>{
            console.log(res)
            if(res.code === 0){
                res.data.map(item=>{
                    item.checked = true
                }) 
                this.setData({
                    trash:res.data
                 })  
            }

        })
    },
    onShow: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    init: function() {
        var a = this;
        if (this.data.trash.length < 1) wx.showModal({
            title: "提示",
            content: "请管理员先配置单位产废类型。",
            showCancel: !1,
            success: function() {
                wx.navigateBack();
            }
        }); else {
            for (var t = this.data.trash, n = 0; n < t.length; n++) t[n].w_increase = 0, t[n].w_reduce = 0, 
            t[n].w_keep = 0, t[n].a_increase = 0, t[n].a_reduce = 0, t[n].a_keep = 0;
            e.post("stock", {
                act: "sum"
            }, function(e) {
                for (var n = 0; n < e.data.length; n++) for (var i = 0; i < t.length; i++) t[i].id == e.data[n].tid && (t[i].w_increase += e.data[n].w_increase, 
                t[i].w_reduce += e.data[n].w_reduce, t[i].w_keep += e.data[n].w_keep, t[i].a_increase += e.data[n].a_increase, 
                t[i].a_reduce += e.data[n].a_reduce, t[i].a_keep += e.data[n].a_keep);
                a.setData({
                    trash: t
                });
            });
        }
    },
    click_out: function(e) {
        var a = this, t = e.currentTarget.dataset.idx;
        wx.navigateTo({
            url: "out",
            events: {
                reload: function() {
                    a.init();
                }
            },
            success: function(e) {
                e.eventChannel.emit("receive", a.data.trash[t]);
            }
        });
    },
    click_trash: function(e) {
        var a = this, t = e.currentTarget.dataset.idx;
        wx.navigateTo({
            url: "/pages/store/log",
            events: {
                reload: function() {
                    a.init();
                }
            },
            success: function(e) {
                e.eventChannel.emit("receive", {
                    tid: a.data.trash[t].id
                });
            }
        });
    }
});