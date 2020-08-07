var API = require('../../utils/api.js')

var app = getApp();

Page({
    data: {
        copyright: app.globalData.app_copy_right,
        ec: null,
        loading: !1,
        btn_done: !1,
        accepttime: 0,
        // collect: [ {
        //     id: 0,
        //     confirmtime: "2020-04-20 12:04",
        //     ou_bid: 0,
        //     name: "XX公司",
        //     tid: 1,
        //     trash_name: "HW49",
        //     weight: 6e3,
        //     type: 1,
        //     amount: 1
        // } ],
        collect:[],
        id: 0,
        tid: 0,
        trash_name: "",
        nick: "",
        phone: "",
        s_time: 0,
        s_weight: 0,
        s_amount: 0,
        s_uid: 0,

        warehouseNo:'',
        applyWeight: 0,
        applyQuantity: 0,
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 收集记录"
        }), this.getOpenerEventChannel().on("receive", function(t) {
            console.log("----------------")
            console.log(t)
            e.setData(t.row), e.load_data();
        });
    },
    load_data: function() {
        API.request('/warehouse/getWarehouseByWarehouseNo', {warehouseNo:this.data.warehouseNo}, 'get', (res) => {
            if(res.code === 0){
                res.data.transport.map(item=>{
                    item.wasteTypeName = item.wasteTypeNo == '1'?'废电池':'其他'
                })
                this.setData({
                    collect:res.data.transport
                })
            }else{
                app.toast(res.msg, "error")
            }
        })

        // var a = this;
        // t.post("trash_collect", {
        //     act: "store_accept_trash",
        //     id: this.data.id
        // }, function(t) {
        //     a.setData({
        //         collect: t.data
        //     });
        // });
    }
});