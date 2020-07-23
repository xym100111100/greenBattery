var r = function(r) {
    return (r = r.toString())[1] ? r : "0" + r;
}, t = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(r) {
        var e = "", o = void 0, i = void 0, n = void 0, d = void 0, a = void 0, h = void 0, c = void 0, C = 0;
        for (r = t._utf8_encode(r); C < r.length; ) d = (o = r.charCodeAt(C++)) >> 2, a = (3 & o) << 4 | (i = r.charCodeAt(C++)) >> 4, 
        h = (15 & i) << 2 | (n = r.charCodeAt(C++)) >> 6, c = 63 & n, isNaN(i) ? h = c = 64 : isNaN(n) && (c = 64), 
        e = e + this._keyStr.charAt(d) + this._keyStr.charAt(a) + this._keyStr.charAt(h) + this._keyStr.charAt(c);
        return e;
    },
    decode: function(r) {
        var e = "", o = void 0, i = void 0, n = void 0, d = void 0, a = void 0, h = void 0, c = 0;
        for (r = r.replace(/[^A-Za-z0-9+/=]/g, ""); c < r.length; ) o = this._keyStr.indexOf(r.charAt(c++)) << 2 | (d = this._keyStr.indexOf(r.charAt(c++))) >> 4, 
        i = (15 & d) << 4 | (a = this._keyStr.indexOf(r.charAt(c++))) >> 2, n = (3 & a) << 6 | (h = this._keyStr.indexOf(r.charAt(c++))), 
        e += String.fromCharCode(o), 64 != a && (e += String.fromCharCode(i)), 64 != h && (e += String.fromCharCode(n));
        return e = t._utf8_decode(e);
    },
    _utf8_encode: function(r) {
        r = r.replace(/rn/g, "n");
        for (var t = "", e = 0; e < r.length; e++) {
            var o = r.charCodeAt(e);
            o < 128 ? t += String.fromCharCode(o) : o > 127 && o < 2048 ? (t += String.fromCharCode(o >> 6 | 192), 
            t += String.fromCharCode(63 & o | 128)) : (t += String.fromCharCode(o >> 12 | 224), 
            t += String.fromCharCode(o >> 6 & 63 | 128), t += String.fromCharCode(63 & o | 128));
        }
        return t;
    },
    _utf8_decode: function(r) {
        for (var t = "", e = 0, o = 0, i = 0; e < r.length; ) (o = r.charCodeAt(e)) < 128 ? (t += String.fromCharCode(o), 
        e++) : o > 191 && o < 224 ? (i = r.charCodeAt(e + 1), t += String.fromCharCode((31 & o) << 6 | 63 & i), 
        e += 2) : (i = r.charCodeAt(e + 1), c3 = r.charCodeAt(e + 2), t += String.fromCharCode((15 & o) << 12 | (63 & i) << 6 | 63 & c3), 
        e += 3);
        return t;
    }
};

module.exports = {
    formatTime: function(t) {
        var e = t.getFullYear(), o = t.getMonth() + 1, i = t.getDate(), n = t.getHours(), d = t.getMinutes(), a = t.getSeconds();
        return [ e, o, i ].map(r).join("/") + " " + [ n, d, a ].map(r).join(":");
    },
    Base64: t
};