var API = require('../../utils/api.js')

var app = getApp();

Page({
    data: {
        copyright: app.globalData.app_copy_right,
        list: []
    },
    onLoad: function(t) {
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 人员管理"
        });

    },
    onShow: function() {
        this.init();
    },
    onPullDownRefresh: function() {},
    init: function() {
    //查询单位人员
    console.log(app.globalData.me)
    API.request('select/busi/personnel',{busiNo:app.globalData.me.busiNo},'get',(res)=>{
       this.setData({
           list:res.data
       })
    })


       // var t = this;
        // app.post("woker", {}, function(app) {
        //     for (var i = 0; i < app.data.length; i++) "" == app.data[i].nick && (app.data[i].nick = "-"), 
        //     0 == app.data[i].pass ? app.data[i].ft = "申请绑定" : 1 == app.data[i].user_block ? app.data[i].ft = "账号停用" : 1 == app.data[i].bind_block ? app.data[i].ft = "停用" : "1" == app.data[i].power ? app.data[i].ft = "管理员" : "2" == app.data[i].power ? app.data[i].ft = "收集员" : "3" == app.data[i].power ? app.data[i].ft = "库管员" : app.data[i].ft = "普通用户";
        //     t.setData({
        //         list: app.data
        //     });
        // });
    },
    click_worker: function(t) {
        var that = this, index = t.currentTarget.dataset.idx;
        if(this.data.list[index].uid != app.globalData.me.id){
            wx.navigateTo({
                url: "edit",
                success: function(app) {
                    app.eventChannel.emit("receive", that.data.list[index]);
                }
            })
        }else{
            app.alert("提示", "不能设置自己");
        }
     
    }
});