var API = require('../../utils/api.js')
var app = getApp();

Page({
    data: {
        copyright: "",
        ec: null,
        id: 0,
        name: "",
        date: "",
        action: 0,
        weight: "",
        amount: "",
        type: 1,
        loading: !1,
        btn_done: !1,
        standingBookNo: ''
    },
    onLoad: function (a) {
        var that = this;
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 记一笔"
        });
        var i = this.getOpenerEventChannel();
        i.on("receive", function (a) {

            a.ec = i, a.copyright = app.globalData.app_copy_right, a.date = that.today(), that.setData(a),
                that.init();
        });
    },
    onUnload: function () {
        this.data.ec && "function" == typeof this.data.ec.emit && this.data.ec.emit("reload");
    },
    today: function () {
        var t = new Date();
        return t.getFullYear() + "-" + (1 + t.getMonth()).toString().padStart(2, "0") + "-" + t.getDate().toString().padStart(2, "0");
    },
    dateChange: function (t) {
        this.setData({
            date: t.detail.value
        });
    },
    actionChange: function (t) {
        this.setData({
            action: t.detail.value
        });
    },
    typeChange: function (t) {
        this.setData({
            type: t.detail.value
        });
    },
    init: function () {},
    click_log: function () {
        var that = this;
        wx.navigateTo({
            url: "log",
            success: function (a) {
                a.eventChannel.emit("receive", {
                    tid: that.data.id,
                    name: that.data.userName,
                    standingBookNo:that.data.standingBookNo
                });
            }
        });
    },
    input_weight: function (t) {
        this.setData({
            weight: t.detail.value - 0
        });
    },
    input_amount: function (t) {
        this.setData({
            amount: t.detail.value - 0
        });
    },
    click_done: function () {
        if (!this.data.weight) {
            app.alert("提示", "请填写计数数量");
            return
        }
        if (!this.data.amount) {
            app.alert("提示", "请填写计数质量")
            return
        }
        let payload = {
            companyNo: app.globalData.me.companyNo,
            recordAction: this.data.action,
            recordWeight: this.data.weight,
            damagedType: this.data.type,
            recordQuantity: this.data.amount,
            userNo: app.globalData.me.userNo,
            standingBookNo: this.data.standingBookNo,
            username:app.globalData.me.username
        };

        API.request('/standingBook/addStandingBookDetail', payload, 'put', (res) => {
            if (res.code === 0) {
               app.toast("记一笔成功", "success")
                setTimeout(function () {
                    wx.navigateBack();
                }, 500);
            }else{
                app.toast(res.msg, "error")
            }
        })



        // if ("" != this.data.weight) if (1 != this.data.id || "" != this.data.amount) {
        //     var a = {
        //         act: "write",
        //         tid: this.data.id,
        //         date: this.data.date,
        //         action: this.data.action,
        //         weight: this.data.weight,
        //         type: this.data.type,
        //         amount: this.data.amount
        //     };
        //     t.post("maker_log", a, function(a) {
        //         t.toast("保存成功", "success", 1e3), setTimeout(function() {
        //             wx.navigateBack();
        //         }, 1e3);
        //     });
        // } else t.alert("提示", "请填写计数数量"); else t.alert("提示", "请填写计数质量");
    }
});