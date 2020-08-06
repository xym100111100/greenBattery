var API = require('../../utils/api.js')

var app = getApp();

Page({
    data: {
        copyright: app.globalData.app_copy_right,
        loading: !1,
        btn_done: !1,
        // trash: [{
        //     checked:true,
        //     id:1,
        //     name:'玻尿酸'
        // }],
        trash:[],
        wasteTypeNo: 0,
        warehouseOutWeight: "",
        damagedType: 1,
        warehouseOutQuantity: ""
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 危废收集"
        })

        API.request('/wasteType/getAllWasteType', {}, 'get', (res) => {
            if (res.code === 0) {
                res.data.map(item=>{
                    item.checked = true
                })
                this.setData({
                    trash:res.data
                })
            }
               
        })


        //  this.getOpenerEventChannel().on("receive", function(a) {
        //     for (var i = 0, n = 0; n < a.trash.length; n++) a.trash[n].checked && i++;
        //     if (0 != i) {
        //         if (1 == i) for (var s = 0; s < a.trash.length; s++) a.trash[s].checked && (a.trash[s].check = !0, 
        //         a.wasteTypeNo = a.trash[s].id);
        //         e.setData(a);
        //     } else t.alert("提醒", "请先配置经营危废种类", function() {
        //         wx.navigateBack();
        //     });
        // });
    },
    onShow: function() {},
    click_trash: function(t) {
        this.setData({
            wasteTypeNo: parseInt(t.detail.value)
        });
    },
    click_type: function(t) {
        this.setData({
            damagedType: parseInt(t.detail.value)
        });
    },
    input_weight: function(t) {
        this.setData({
            warehouseOutWeight: t.detail.value - 0
        });
    },
    input_amount: function(t) {
        this.setData({
            warehouseOutQuantity: t.detail.value - 0
        });
    },
    click_done: function() {
        let payload={
            applyCompanyNo:app.globalData.me.companyNo,
            applyUserNo:app.globalData.me.userNo,
            damagedType:this.data.damagedType,
            warehouseOutQuantity:this.data.warehouseOutQuantity,
            warehouseOutWeight:this.data.warehouseOutWeight,
            wasteTypeNo:this.data.wasteTypeNo
        }
        API.request('/warehouseOut/addWarehouseOut', payload, 'post', (res) => {
            console.log(res)
            if(res.code === 0){
                    wx.navigateTo({
                    url: "/pages/qrcode/qrcode",
                    success: function(t) {
                        t.eventChannel.emit("receive", {
                            content: res.data
                        });
                    }
                });
            }else{
                wx.toast(res.msg, "success")
            }
        })

        // var a = {
        //     act: "collect"
        // };
        // if (this.data.wasteTypeNo < 1) t.alert("提示", "请选择收集危废"); else if (a.wasteTypeNo = this.data.wasteTypeNo, 
        // "" == this.data.warehouseOutWeight || isNaN(this.data.warehouseOutWeight) || parseFloat(this.data.warehouseOutWeight) <= 0) t.alert("提示", "请填写本次收集质量（千克）"); else {
        //     if (a.warehouseOutWeight = this.data.warehouseOutWeight, 1 == this.data.wasteTypeNo) {
        //         if (1 != this.data.damagedType && 2 != this.data.damagedType) return void t.alert("提示", "请选择蓄电池破损类别");
        //         if (a.damagedType = this.data.damagedType, "" == this.data.warehouseOutQuantity || isNaN(this.data.warehouseOutQuantity) || parseInt(this.data.warehouseOutQuantity) < 1) return void t.alert("提示", "请填写本次收集数量（只）");
        //         a.warehouseOutQuantity = this.data.warehouseOutQuantity;
        //     }
        //     t.post("trash_collect", a, function(t) {
        //         var a = JSON.stringify({
        //             act: "maker_out_confirm",
        //             time: t.data.time,
        //             id: t.data.id
        //         });
        //         wx.navigateTo({
        //             url: "/pages/qrcode/qrcode",
        //             success: function(t) {
        //                 t.eventChannel.emit("receive", {
        //                     content: a
        //                 });
        //             }
        //         });
        //     });
        // }
    }
});