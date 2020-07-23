var t = getApp();
var API = require('../../utils/api.js')

Page({
    data: {
        loading: !1,
        ec: null,
        tid: 0,
        name: "",
        date1: "",
        date2: "",
        today: "",
        list: [],
        tempList:[{
            name:'小明同学'
        }],
        slideButtons: [ {
            type: "warn",
            text: "删除"
        } ]
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 历史记录"
        });
        // var i = this.getOpenerEventChannel();
        // i.on("receive", function(t) {
        //     t.ec = i, t.date1 = e.first_day(), t.date2 = e.today(), t.today = e.today(), e.setData(t), 
        //     e.load_data(!0);
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
    load_data: function(val) {
        wx.removeStorageSync('userInfo')
        
        API.request('/bd/getBDInfoList',{lime:1,page:10},'get',(res)=>{
            console.log(res)
        })
       
        // var a = this, e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        // if (e || !this.data.loading) {
        //     this.setData({
        //         loading: !0
        //     });
        //     var i = this.data.list;
        //     t.post("/bd/getBDInfoList", {
        //         act: "log",
        //         tid: this.data.tid,
        //         d1: this.data.date1,
        //         d2: this.data.date2,
        //         skip: e ? 0 : i.length,
        //         limit: 10,
        //         page: 1
        //     }, function(res) {
        //             console.log(t.alert(22,444))
        //         e && (i = []), t.data.length > 0 && (i = i.concat(t.data)), a.setData({
        //             list: i,
        //             loading: !1
        //         });
        //     });
        // }
    },
    dateChange: function(t) {
        var a = t.currentTarget.dataset.idx, e = t.detail.value, i = {};
        i["date" + a] = e, this.setData(i);
    },
    click_query: function(val) {
        console.log(val)
        this.load_data(!0);
    },
    touch_top: function(t) {},
    touch_bottom: function(t) {
        this.load_data();
    },
    click_del: function(a) {
        var e = this, i = a.currentTarget.dataset.idx;
        "1" == t.globalData.me.power || this.data.list[i].uid == t.globalData.me.id ? 3 != this.data.list[i].action ? t.post("maker_log", {
            act: "del",
            id: this.data.list[i].id
        }, function(a) {
            t.toast("删除成功", "success");
            var n = e.data.list;
            n.splice(i, 1), e.setData({
                list: n
            }), e.data.ec && "function" == typeof e.data.ec.emit && e.data.ec.emit("reload");
        }) : t.alert("提示", "转出记录不能删除。") : t.alert("提示", "单位管理员 或 录入者 才能删除。");
    }
});