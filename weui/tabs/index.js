var e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};

module.exports = function(t) {
    function r(e) {
        if (n[e]) return n[e].exports;
        var a = n[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return t[e].call(a.exports, a, a.exports, r), a.l = !0, a.exports;
    }
    var n = {};
    return r.m = t, r.c = n, r.d = function(e, t, n) {
        r.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
        });
    }, r.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        });
    }, r.t = function(t, n) {
        if (1 & n && (t = r(t)), 8 & n) return t;
        if (4 & n && "object" === (void 0 === t ? "undefined" : e(t)) && t && t.__esModule) return t;
        var a = Object.create(null);
        if (r.r(a), Object.defineProperty(a, "default", {
            enumerable: !0,
            value: t
        }), 2 & n && "string" != typeof t) for (var o in t) r.d(a, o, function(e) {
            return t[e];
        }.bind(null, o));
        return a;
    }, r.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default;
        } : function() {
            return e;
        };
        return r.d(t, "a", t), t;
    }, r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }, r.p = "", r(r.s = 5);
}({
    5: function(e, t, r) {
        Component({
            options: {
                addGlobalClass: !0,
                pureDataPattern: /^_/,
                multipleSlots: !0
            },
            properties: {
                tabs: {
                    type: Array,
                    value: []
                },
                tabClass: {
                    type: String,
                    value: ""
                },
                swiperClass: {
                    type: String,
                    value: ""
                },
                activeClass: {
                    type: String,
                    value: ""
                },
                tabUnderlineColor: {
                    type: String,
                    value: "#07c160"
                },
                tabActiveTextColor: {
                    type: String,
                    value: "#000000"
                },
                tabInactiveTextColor: {
                    type: String,
                    value: "#000000"
                },
                tabBackgroundColor: {
                    type: String,
                    value: "#ffffff"
                },
                activeTab: {
                    type: Number,
                    value: 0
                },
                swipeable: {
                    type: Boolean,
                    value: !0
                },
                animation: {
                    type: Boolean,
                    value: !0
                },
                duration: {
                    type: Number,
                    value: 500
                }
            },
            data: {
                currentView: 0
            },
            observers: {
                activeTab: function(e) {
                    var t = this.data.tabs.length;
                    if (0 !== t) {
                        var r = e - 1;
                        r < 0 && (r = 0), r > t - 1 && (r = t - 1), this.setData({
                            currentView: r
                        });
                    }
                }
            },
            lifetimes: {
                created: function() {}
            },
            methods: {
                handleTabClick: function(e) {
                    var t = e.currentTarget.dataset.index;
                    this.setData({
                        activeTab: t
                    }), this.triggerEvent("tabclick", {
                        index: t
                    });
                },
                handleSwiperChange: function(e) {
                    var t = e.detail.current;
                    this.setData({
                        activeTab: t
                    }), this.triggerEvent("change", {
                        index: t
                    });
                }
            }
        });
    }
});