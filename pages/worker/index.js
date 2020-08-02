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
        this.init();
    },
    onShow: function() {
      
    },
    onPullDownRefresh: function() {},
    init: function() {
    //查询单位人员
    API.request('/company/selectCompanyPersonnel',{companyNo:app.globalData.me.companyNo},'get',(res)=>{
        res.data.map(item=>{
            switch (item.companyRole) {
                case 1:
                    item.role = '管理员'
                    break;
                case 2:
                    item.role = '收集员'
                    break;
                case 3:
                    item.role = '库管员'
                    break;
                default:
                    item.role = '申请绑定'
                    break;
            }
        })

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
        if(this.data.list[index].userNo != app.globalData.me.userNo){
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