var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../utils/weapp.qrcode.min.js")), a = getApp();

Page({
    data: {
        copyright: a.globalData.app_copy_right,
        content: "",
        second: 300,
        status: 0
    },
    onLoad: function(t) {
        var a = this;
        this.getOpenerEventChannel().on("receive", function(t) {
            a.setData({
                content: t.content
            }), a.init();
        });
    },
    onUnload: function() {
        this.setData({
            second: 0
        });
    },
    init: function() {
        var a = this;
        (0, t.default)({
            width: 200,
            height: 200,
            canvasId: "myQrcode",
            ctx: wx.createCanvasContext("myQrcode"),
            text: this.data.content,
            image: {
                imageResource: "/images/app_icon.png",
                dx: 70,
                dy: 70,
                dWidth: 60,
                dHeight: 60
            }
        }), setTimeout(function() {
            a.count_down();
        }, 1e3);
    },
    count_down: function() {
        var t = this;
        if (!(2 == this.data.status || this.data.second < 1)) {
            var a = this.data.second - 1;
            this.setData({
                second: a
            }), this.update_status(), setTimeout(function() {
                t.count_down();
            }, 1e3);
        }
    },
    update_status: function() {
        var t = this;
        a.post("qrcode_status", {
            qrcode: this.data.content
        }, function(e) {
            e.data && e.data > 0 && (t.setData({
                status: e.data
            }), 2 == e.data ? (a.toast("对方已确认"), setTimeout(function() {
                wx.navigateBack({
                    delta: 2
                });
            }, 1e3)) : 1 == e.data && a.toast("对方已扫码"));
        });
    }
});