var API = require('../../utils/api.js')

var app = getApp();
// 这里还有个list1，不懂为什么原先这样做，现在不暂时不要了
Page({
    data: {
        loading: !1,
        activeTab: 0,
        state:0,
        applyCompanyNo:'',
        list:[],
        // list: [{
        //     nick:"杰克1",
        //     phone:'18707895796',
        //     trash_name:'废电池',
        //     s_weight:2222,
        //     s_amount:434,
        //     s_time:'1996-02-12',
        //     s_weight:222,
        // }],
        date1: "2001-03-17",
        date2: "2019-03-17",
        today: "2020-07-23",
        list1: [{
            trash_name:'废电池',
            s_time:'2022-09-09',
            s_weight:100,
            tid:1,
            s_amount:22,
            a_time:'202-03-20',
            a_weight:22,
            a_amount:20,
            name:'尔莫科技',
            nick:'小明',
            state:1,
        },
        {
            trash_name:'废电池',
            s_time:'2022-09-09',
            s_weight:100,
            tid:1,
            s_amount:22,
            a_time:'202-03-20',
            a_weight:22,
            a_amount:20,
            name:'尔莫科技',
            nick:'小明',
            state:0,
        }],
    },
    onLoad: function() {
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 入库申请"
        })
        this.setData({
            applyCompanyNo:app.globalData.me.companyNo
        })
        this.load_data()
        //  this.load_data(), this.setData({
        //     date1: this.first_day(),
        //     date2: this.today(),
        //     today: this.today()
        // });
    },
    click_tab: function(a) {
        var e = a.currentTarget.dataset.idx;
        this.setData({
            activeTab: e,
            state:e
        }), 0 == e ? (wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 入库申请"
        }), this.load_data()) : (wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 入库记录"
        }), this.load_data());
    },
    load_data: function() {
        API.request('/warehouse/getWarehouseListByTimeInterval', {applyCompanyNo:this.data.applyCompanyNo,state:this.data.state}, 'get', (res) => {
            if(res.code === 0){
                this.setData({
                    list:res.data
                })
            }else{
                this.setData({
                    list:[]
                })
            }
            console.log(res)
            // if(res.code === 0){
            //     res.data.map(item=>{
            //         item.username = app.globalData.me.username
            //     })
            //     this.setData({
            //         list:res.data
            //     })
            // }
           
        })
        // var a = this;
        // t.post("trash_collect", {
        //     act: "store_list",
        //     tab: 0
        // }, function(t) {
        //     a.setData({
        //         list: t.data
        //     });
        // });
    },
    click_row: function(t) {
        var a = this, e = t.currentTarget.dataset.idx;
        0 == this.data.activeTab ? wx.navigateTo({
            url: "/pages/collector/store_accept",
            events: {
                reload: function() {
                    a.load_data();
                }
            },
            success: function(t) {
                t.eventChannel.emit("receive", {
                    row: a.data.list[e]
                });
            }
        }) : wx.navigateTo({
            url: "/pages/collector/store_detail",
            success: function(t) {
                t.eventChannel.emit("receive", {
                  //  row: a.data.list1[e]
                });
            }
        });
    },
    today: function() {
        var t = new Date();
        return t.getFullYear() + "-" + (1 + t.getMonth()).toString().padStart(2, "0") + "-" + t.getDate().toString().padStart(2, "0");
    },
    first_day: function() {
        var t = new Date();
        return t.getFullYear() + "-" + (1 + t.getMonth()).toString().padStart(2, "0") + "-01";
    },
    touch_top: function() {
        console.log("touch_top");
    },
    touch_bottom: function() {
        console.log("touch_bottom");
    },
    load_data1: function() {
        var a = this, e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        if (e || !this.data.loading) {
            this.setData({
                loading: !0
            });
            var i = this.data.list1;
            t.post("trash_collect", {
                act: "store_list",
                tab: 1,
                d1: this.data.date1,
                d2: this.data.date2,
                skip: e ? 0 : i.length
            }, function(t) {
                e && (i = []), t.data.length > 0 && (i = i.concat(t.data)), a.setData({
               //     list1: i,
                    loading: !1
                });
            });
        }
    },
    dateChange: function(t) {
        var a = t.currentTarget.dataset.idx, e = t.detail.value, i = {};
        i["date" + a] = e, this.setData(i);
    },
    click_query: function() {
        this.load_data1(!0);
    }
});