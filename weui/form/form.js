var e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};

module.exports = function(r) {
    function t(e) {
        if (n[e]) return n[e].exports;
        var u = n[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return r[e].call(u.exports, u, u.exports, t), u.l = !0, u.exports;
    }
    var n = {};
    return t.m = r, t.c = n, t.d = function(e, r, n) {
        t.o(e, r) || Object.defineProperty(e, r, {
            enumerable: !0,
            get: n
        });
    }, t.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        });
    }, t.t = function(r, n) {
        if (1 & n && (r = t(r)), 8 & n) return r;
        if (4 & n && "object" === (void 0 === r ? "undefined" : e(r)) && r && r.__esModule) return r;
        var u = Object.create(null);
        if (t.r(u), Object.defineProperty(u, "default", {
            enumerable: !0,
            value: r
        }), 2 & n && "string" != typeof r) for (var i in r) t.d(u, i, function(e) {
            return r[e];
        }.bind(null, i));
        return u;
    }, t.n = function(e) {
        var r = e && e.__esModule ? function() {
            return e.default;
        } : function() {
            return e;
        };
        return t.d(r, "a", r), r;
    }, t.o = function(e, r) {
        return Object.prototype.hasOwnProperty.call(e, r);
    }, t.p = "", t(t.s = 4);
}([ function(e, r, t) {
    Object.defineProperty(r, "__esModule", {
        value: !0
    }), r.diff = function(e, r) {
        if (!e && r || e && !r) return !0;
        for (var t in r) if (e[t] !== r[t]) return !0;
        for (var n in e) if (e[n] !== r[n]) return !0;
        return !1;
    }, r.diffObject = function(e, r) {
        if (!e && r) return r;
        if (!r && e) return e;
        var t = {}, n = !1;
        for (var u in r) e[u] !== r[u] && (n = !0, t[u] = r[u]);
        for (var i in e) e[i] !== r[i] && (n = !0, t[i] = r[i]);
        return n ? t : null;
    };
}, , , , function(e, r, t) {
    function n(e) {
        e.data.prop && (this.data.formItems[e.data.prop] = e), e.setInForm && e.setInForm(), 
        this.data.firstItem || (this.data.firstItem = e), this.data.firstItem;
    }
    function u(e) {
        e.data.prop && delete this.data.formItems[e.data.prop];
    }
    Object.defineProperty(r, "__esModule", {
        value: !0
    });
    var i = t(5), a = t(0);
    Component({
        properties: {
            models: {
                type: Object,
                value: {},
                observer: "_modelChange"
            },
            rules: {
                type: Array,
                value: [],
                observer: "_rulesChange"
            },
            extClass: {
                type: String,
                value: ""
            }
        },
        data: {
            errors: {},
            formItems: {},
            firstItem: null
        },
        relations: {
            "../cell/cell": {
                type: "descendant",
                linked: n,
                unlinked: u
            },
            "../checkbox-group/checkbox-group": {
                type: "descendant",
                linked: n,
                unlinked: u
            }
        },
        attached: function() {
            this.initRules(), this.formValidator = new i.default(this.data.models, this.data.newRules);
        },
        methods: {
            initRules: function(e) {
                var r = {};
                return (e || this.data.rules).forEach(function(e) {
                    e.name && e.rules && (r[e.name] = e.rules || []);
                }), this.setData({
                    newRules: r
                }), r;
            },
            _modelChange: function(e, r, t) {
                var n = this;
                if (!this.isInit) return this.isInit = !0, e;
                this.formValidator.setModel(e), this.isInit = !0;
                var u = a.diffObject(r, e);
                return u && function() {
                    var e = !0, r = [], t = {};
                    for (var i in u) !function(i) {
                        n.formValidator.validateField(i, u[i], function(n, u) {
                            u && u[i] && (r.push(u[i]), t[i] = u[i]), e = n;
                        });
                    }(i);
                    n._showErrors(u, t), n.triggerEvent(e ? "success" : "fail", e ? {
                        trigger: "change"
                    } : {
                        errors: r,
                        trigger: "change"
                    });
                }(), e;
            },
            _rulesChange: function(e) {
                var r = this.initRules(e);
                return this.formValidator && this.formValidator.setRules(r), e;
            },
            _showAllErrors: function(e) {
                for (var r in this.data.newRules) this._showError(r, e && e[r]);
            },
            _showErrors: function(e, r) {
                for (var t in e) this._showError(t, r && r[t]);
            },
            _showError: function(e, r) {
                var t = this.data.formItems[e];
                t && t.data.showError && t.setError(r);
            },
            validate: function(e) {
                var r = this;
                return this.formValidator.validate(function(t, n) {
                    r._showAllErrors(n);
                    var u = r.handleErrors(n);
                    r.triggerEvent(t ? "success" : "fail", t ? {
                        trigger: "validate"
                    } : {
                        errors: u,
                        trigger: "validate"
                    }), e && e(t, u);
                });
            },
            validateField: function(e, r) {
                var t = this, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function(e) {
                    arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                };
                return this.formValidator.validateField(e, r, function(r, u) {
                    t._showError(e, u);
                    var i = t.handleErrors(u);
                    t.triggerEvent(r ? "success" : "fail", r ? {
                        trigger: "validate"
                    } : {
                        errors: i,
                        trigger: "validate"
                    }), n && n(r, i);
                });
            },
            handleErrors: function(e) {
                if (e) {
                    var r = [];
                    return this.data.rules.forEach(function(t) {
                        e[t.name] && (e[t.name].name = t.name, r.push(e[t.name]));
                    }), r;
                }
                return e;
            },
            addMethod: function(e, r) {
                return this.formValidator.addMethod(e, r);
            }
        }
    }), r.default = i.default;
}, function(e, r, t) {
    function n(e, r) {
        if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
    }
    Object.defineProperty(r, "__esModule", {
        value: !0
    });
    var u = t(6), i = t(0), a = Object.prototype.toString, o = function(e, r) {
        var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null, n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null, i = "";
        for (var a in e) if ("name" !== a && "message" !== a) {
            var o = void 0 !== e.validator ? e.validator : u.default[a];
            if ("function" == typeof o && (i = o(e, r, t, n))) return i;
        }
        return i;
    }, F = function() {
        function e(r, t) {
            n(this, e), this.models = r, this.rules = t, this.errors = {};
        }
        return e.prototype.validate = function(e) {
            var r = this;
            return new Promise(function(t) {
                var n = 0, u = 0, a = r.errors, o = r.models, F = !1;
                for (var s in r.rules) !function(e) {
                    !function(t) {
                        var s = a[t];
                        r._innerValidateField(e, o[t], function(e, r) {
                            n++, e || u++, i.diff(s, r) && (a[t] = r, F = !0);
                        });
                    }(e);
                }(s);
                Object.keys(a).forEach(function(e) {
                    a[e] || delete a[e];
                }), t({
                    isValid: !u,
                    errors: u ? a : void 0
                }), e && e(!u, u ? a : void 0);
            });
        }, e.prototype.validateField = function(e, r) {
            var t = this, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function(e) {
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            };
            return new Promise(function(u) {
                t._innerValidateField(e, r, function(r, a) {
                    var o = {};
                    o[e] = a, u({
                        valid: r,
                        error: r ? void 0 : a
                    }), n(r, r ? void 0 : o);
                    var F = t.errors[e];
                    i.diff(F, a) && (a || delete t.errors[e], t.errors[e] = a);
                });
            });
        }, e.prototype._innerValidateField = function(e, r) {
            var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function(e) {
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            }, n = this.rules[e];
            if (!n) return console.warn("[form-validtor] rule name " + e + " not exists."), 
            void t(!0);
            "function" == typeof r && (t = r, r = void 0);
            var u = !1, i = this.models;
            if ("[object Array]" === a.call(n)) n.forEach(function(n) {
                n.name = e;
                var a = o(n, r || i[e], n.param, i);
                a && !u && (u = !0, t(!1, a ? {
                    message: a,
                    rule: n
                } : void 0));
            }), u || t(!u); else {
                var F = n;
                F.name = e;
                var s = o(F, r || i[e], F.param, i), f = s ? {
                    message: s,
                    rule: F
                } : void 0;
                s && (u = !0), t(!u, f);
            }
        }, e.prototype.addMethod = function(e, r) {
            u.default[e] = r;
        }, e.prototype.setModel = function(e) {
            this.models = e;
        }, e.prototype.setRules = function(e) {
            this.rules = e;
        }, e;
    }();
    r.default = F;
}, function(e, r, t) {
    Object.defineProperty(r, "__esModule", {
        value: !0
    });
    var n = t(7), u = {
        required: "%s必填",
        minlength: "长度最少为%s",
        maxlength: "长度最大为%s",
        rangelength: "长度在%s和%s之间",
        bytelength: "最多只能输入%s个字",
        min: "值最小为%s",
        max: "值最大为%s",
        range: "值的范围为%s和%s之间",
        mobile: "请输入正确的手机号",
        email: "请输入正确的电子邮件",
        url: "请输入正确的URL地址",
        equalTo: "值和字段%s不相等"
    };
    r.default = {
        required: function(e, r, t, i) {
            if (!1 !== e.required) return r ? void 0 : n.sprintf(e.message || u.required, e.name);
        },
        minlength: function(e, r) {
            var t = e.minlength;
            if ((r = r || "").length < t) return n.sprintf(e.message || u.minlength, t);
        },
        maxlength: function(e, r) {
            var t = e.maxlength;
            if ((r = r || "").length > t) return n.sprintf(e.message || u.maxlength, t);
        },
        rangelength: function(e, r) {
            var t = e.range;
            if ((r = r || "").length > t[1] || r.length < t[0]) return n.sprintf(e.message || u.rangelength, t[0], t[1]);
        },
        min: function(e, r) {
            var t = e.min;
            if (r < t) return n.sprintf(e.message || u.min, t);
        },
        max: function(e, r) {
            var t = e.max;
            if (r > t) return n.sprintf(e.message || u.max, t);
        },
        range: function(e, r) {
            var t = e.range;
            if (r < t[0] || r > t[1]) return n.sprintf(e.message || u.range, t[0], t[1]);
        },
        mobile: function(e, r) {
            if (!1 !== e.mobile) return 11 !== (r = r || "").length ? n.sprintf(e.message || u.mobile) : void 0;
        },
        email: function(e, r) {
            if (!1 !== e.email) return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(r) ? void 0 : n.sprintf(e.message || u.email);
        },
        url: function(e, r) {
            if (!1 !== e.url) return /^(https?|s?ftp|weixin):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(r) ? void 0 : e.message || u.url;
        },
        equalTo: function(e, r, t, i) {
            var a = e.equalTo;
            if (r !== i[a]) return n.sprintf(e.message || u.equalTo, e.name);
        },
        bytelength: function(e, r, t, i) {
            if (t = e.param, r.replace(/[^\x00-\xff]/g, "**").length > t) return n.sprintf(e.message || u.bytelength, t);
        }
    };
}, function(e, r, t) {
    Object.defineProperty(r, "__esModule", {
        value: !0
    }), r.sprintf = function() {
        for (var e = arguments.length, r = Array(e), t = 0; t < e; t++) r[t] = arguments[t];
        var n = void 0, u = r[0] || "", i = void 0, a = void 0, o = r.length - 1;
        if (o < 1) return u;
        for (n = 1; n < o + 1; ) u = u.replace(/%s/, "{#" + n + "#}"), n++;
        for (u.replace("%s", ""), n = 1; ;) {
            if (void 0 === (i = r[n])) break;
            a = new RegExp("{#" + n + "#}", "g"), u = u.replace(a, i), n++;
        }
        return u;
    };
} ]);