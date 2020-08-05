var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, e = getApp();

Page({
    data: {
        eventChannel: null,
        btn_deny: !0,
        lat: "",
        lng: "",
        address: "点击地图选择地点",
        county: "",
        town: "",
        marker: [ {
            id: "marker",
            latitude: "",
            longitude: "",
            iconPath: "/images/marker.png",
            width: 23,
            height: 28
        } ]
    },
    onLoad: function(t) {
        var e = this;
        this.setData({
            eventChannel: this.getOpenerEventChannel()
        }), this.data.eventChannel.on("receive_location", function(t) {
            e.setData({
                lat: t.lat,
                lng: t.lng
            });
        });
    },
    click_map: function(val) {
        this.setData({
            "marker[0].latitude": val.detail.latitude,
            "marker[0].longitude": val.detail.longitude
        }), this.get_address();
    },
    get_address: function() {
        var a = this;
        wx.serviceMarket.invokeService({
            service: "wxc1c68623b7bdea7b",
            api: "rgeoc",
            data: {
                location: this.data.marker[0].latitude + "," + this.data.marker[0].longitude
            }
        }).then(function(n) {
            if ("invokeService:ok" == n.errMsg) {
                var o = "";
                if ("string" == typeof n.data) o = JSON.parse(n.data); else {
                    if ("object" != t(n.data)) return void e.alert("接口错误", "地址解析接口错误：" + o.message);
                    o = n.data;
                }
                if (0 == o.status) {
                    var i = {
                        btn_deny: !1,
                        address: o.result.address,
                        county: o.result.ad_info.adcode,
                        companyAddress:o.result.address_component.street+o.result.address_component.street_number,
                        companyAreaName:o.result.address_component.district,
                        companyCityName:o.result.address_component.city
                    };
                    o.result.address_reference && o.result.address_reference.town && (i.town = o.result.address_reference.town.id), 
                    a.setData(i);
                } else e.alert("接口错误", "地址解析接口错误：" + o.message);
            } else e.alert("接口错误", "调用地址解析接口错误：" + n.errMsg);
        }).catch(function(t) {
            console.error("invokeService fail", t);
        });
    },
    click_done: function() {
        var t = {
            lng: this.data.marker[0].longitude,
            lat: this.data.marker[0].latitude,
            address: this.data.address,
            county: this.data.county,
            town: this.data.town,
            companyAddress:this.data.companyAddress,
            companyAreaName:this.data.companyAreaName,
            companyCityName:this.data.companyCityName

        };
        
        this.data.eventChannel.emit("callback", t), wx.navigateBack();
    },
    onReady: function() {},
    onShow: function() {
        wx.setNavigationBarTitle({
            title: "选择单位所在地点"
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});