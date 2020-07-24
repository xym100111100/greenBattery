var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};

module.exports = function(e) {
    function r(t) {
        if (n[t]) return n[t].exports;
        var a = n[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return e[t].call(a.exports, a, a.exports, r), a.l = !0, a.exports;
    }
    var n = {};
    return r.m = e, r.c = n, r.d = function(t, e, n) {
        r.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: n
        });
    }, r.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        });
    }, r.t = function(e, n) {
        if (1 & n && (e = r(e)), 8 & n) return e;
        if (4 & n && "object" === (void 0 === e ? "undefined" : t(e)) && e && e.__esModule) return e;
        var a = Object.create(null);
        if (r.r(a), Object.defineProperty(a, "default", {
            enumerable: !0,
            value: e
        }), 2 & n && "string" != typeof e) for (var o in e) r.d(a, o, function(t) {
            return e[t];
        }.bind(null, o));
        return a;
    }, r.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t.default;
        } : function() {
            return t;
        };
        return r.d(e, "a", e), e;
    }, r.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
    }, r.p = "", r(r.s = 25);
}({
    25: function(t, e, r) {
        Component({
            options: {
                addGlobalClass: !0
            },
            properties: {
                extClass: {
                    type: String,
                    value: ""
                },
                focus: {
                    type: Boolean,
                    value: !1
                },
                placeholder: {
                    type: String,
                    value: "搜索"
                },
                value: {
                    type: String,
                    value: ""
                },
                search: {
                    type: Function,
                    value: null
                },
                throttle: {
                    type: Number,
                    value: 500
                },
                cancelText: {
                    type: String,
                    value: "取消"
                },
                cancel: {
                    type: Boolean,
                    value: !0
                }
            },
            data: {
                result: [{
                    text:'尔莫科技',
                    value:0
                },{
                    text:'金钱天下',
                    value:1
                }],
                checked_id: 0,
                error: 0,
                errmsg: ""
            },
            lastSearch: Date.now(),
            lifetimes: {
                attached: function() {
                    this.data.focus && this.setData({
                        searchState: !0
                    });
                }
            },
            methods: {
                clearInput: function() {
                    this.setData({
                        value: ""
                    }), this.triggerEvent("clear");
                },
                inputFocus: function(t) {
                    this.triggerEvent("focus", t.detail);
                },
                inputBlur: function(t) {
                    this.setData({
                        focus: !1
                    }), this.triggerEvent("blur", t.detail);
                },
                showInput: function() {
                    this.setData({
                        focus: !0,
                        searchState: !0
                    });
                },
                hideInput: function() {
                    this.setData({
                        searchState: !1
                    });
                },
                inputChange: function(t) {
                    var e = this;
                    this.setData({
                        value: t.detail.value
                    }), this.triggerEvent("input", t.detail), Date.now() - this.lastSearch < this.data.throttle || "function" == typeof this.data.search && (this.lastSearch = Date.now(), 
                    this.timerId = setTimeout(function() {
                        e.data.search(t.detail.value).then(function(t) {
                            e.setData({
                                result: t,
                                error: 0,
                                errmsg: ""
                            });
                        }).catch(function(t) {
                            e.setData({
                                result: [],
                                error: 1,
                                errmsg: t
                            }), console.log("search error", t);
                        });
                    }, this.data.throttle));
                },
                selectResult: function(t) {
                    var e = t.currentTarget.dataset.index, r = this.data.result[e];
                    this.data.checked_id == r.value ? this.setData({
                        checked_id: 0
                    }) : (this.setData({
                        checked_id: r.value
                    }), this.triggerEvent("selectresult", {
                        index: e,
                        item: r
                    }));
                }
            }
        });
    }
});