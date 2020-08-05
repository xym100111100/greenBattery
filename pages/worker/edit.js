var app = getApp();
var API = require('../../utils/api.js')

Page({
    data: {
        copyright: app.globalData.app_copy_right,
        role: 0,
        id: 0,
        userName: "",
        pass: 0,
        cell: "",
        companyRole: "",
        uid: 0,
        bind_block: 0,
        user_block: 0,
        ft: ""
    },
    onLoad: function(a) {
        var that = this;
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 人员编辑"
        });
        this.getOpenerEventChannel().on("receive", function(payload) {
            payload.companyType = app.globalData.me.companyType
            that.setData(payload);
        });
    },
    onShow: function() {

    },
    click_power: function(val) {
        if(val.detail.value.length <1){
            return 
        }
         let payload = {
            companyRole: parseInt(val.detail.value[0])  ,
            companyNo:app.globalData.me.companyNo,
            companyType:app.globalData.me.companyType,
            userNo:this.data.userNo
         }
         API.request('/user/updateUserRole',payload,'get',(res)=>{
                app.toast("设置用户角色成功", "success")
         })
        // var e = this, s = "";
        // s = 2 == this.data.role || 3 == this.data.role ? a.detail.value : 1 == a.detail.value.length ? "1" : "", 
        // 1 == this.data.pass ? app.post("woker", {
        //     act: "setpower",
        //     uid: this.data.uid,
        //     companyRole: s
        // }, function(a) {
        //     app.toast("操作成功", "success"), e.setData({
        //         companyRole: "" + s
        //     });
        // }) : this.setData({
        //     companyRole: "" + s
        // });
    },
    click_block: function(a) {
        var e = this, s = a.detail.value.length;
        1 == this.data.pass ? app.post("woker", {
            act: "setblock",
            uid: this.data.uid,
            block: s
        }, function(a) {
            app.toast("操作成功", "success"), e.setData({
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
            companyRole: this.data.companyRole,
            block: this.data.bind_block,
            pass: a.currentTarget.dataset.pass
        };
        "1" != s.pass || 2 != this.data.role && 3 != this.data.role || "" != s.companyRole ? app.post("woker", s, function(a) {
            app.toast("处理完成", "success"), "1" == s.pass && e.setData({
                pass: 1
            }), setTimeout(function() {
                wx.navigateBack();
            }, 1e3);
        }) : app.alert("提示", "请指定人员角色");
    },
    click_unbind: function() {
        app.post("woker", {
            act: "unbind",
            uid: this.data.uid
        }, function(a) {
            a.ok ? (app.toast("操作成功", "success"), setTimeout(function() {
                wx.navigateBack();
            }, 1e3)) : app.alert("提示", a.msg);
        });
    }
});