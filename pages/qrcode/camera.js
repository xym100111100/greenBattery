var a = getApp();

Page({
    data: {
        ec: null
    },
    onLoad: function() {
        wx.setNavigationBarTitle({
            title: a.globalData.app_name + " - 拍摄照片"
        });
        var t = this.getOpenerEventChannel();
        this.setData({
            ec: t
        });
    },
    camera_error: function(t) {
        t.detail && "insertCamera:fail:auth denied" == t.detail.errMsg && a.alert("提示", "请授权使用摄像头进行凭证拍照", function(a) {
            console.log(a);
        });
    },
    click_shoot: function() {
        console.log("---------")
        var a = this;
        wx.createCameraContext().takePhoto({
            quality: "high",
            success: function(t) {
                a.data.ec.emit("camera_cb", t), wx.navigateBack();
            }
        });
    },
    click_back: function() {
        wx.navigateBack();
    }
});