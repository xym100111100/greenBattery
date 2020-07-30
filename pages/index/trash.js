var API = require('../../utils/api.js')

var app = getApp();

Page({
    data: {
        loading: false,
        btn_done: false,
        role: 0,
        trash: []
    },
    onLoad: function (a) {
        var i = this;
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 危废种类"
        })
        this.init()
    },


    init: function () {
        API.request('select/alltype', {}, 'get', (alltypeResult) => {
            if (alltypeResult.code === 0) {
                API.request('/getBusiDangerousType', {
                    busiNo: app.globalData.me.busiNo
                }, 'get', (res) => {
                    if (res.code === 0) {
                        alltypeResult.data.map(item => {
                            let result = res.data.some((busiItem) => {
                                return item.typeNo === busiItem
                            })
                            item.checked = result ? true : false
                        })
                        this.setData({
                            trash: alltypeResult.data
                        })
                    }
                })
            }
        })
    },
    click_trash: function (val) {
        const items = this.data.trash
        const values = val.detail.value
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
            items[i].checked = false
            let result = values.some((item) => {
                return item == items[i].typeNo
            })
            items[i].checked = result ? true : false

        }
        this.setData({
            items
        })
    },
    capacity_input: function (val) {
        var trash = this.data.trash;
        trash[val.currentTarget.dataset.idx].capacity = val.detail.value
        this.setData({
            trash: trash
        });
    },
    click_done: function () {
       const that = this
        // 检查是否没有选择
        let result = that.data.trash.some(item => {
            return item.checked
        })
        if (!result) {

            app.alert("提示", "请勾选危废。")
            return
        }
        // 检查选择的危废是否有数量没有填
        result = that.data.trash.some(item => {
            return item.checked && (item.capacity === '' || item.capacity === "0")
        })
        if (result) {
            app.alert("提示", "请填写中的类型的最大库存量")
            return
        }
        // 提交
        that.setData({
            loading:true
        })
        API.request('/saveBusiDangerousType', {
            busiNo: app.globalData.me.busiNo,
            data: that.data.trash
        }, 'post', (res) => {
            if (res.code === 0) {
                app.toast("设置成功", "success"), setTimeout(function () {
                    that.setData({
                        loading:false
                    })
                    wx.navigateBack();
                }, 500);
            }
        })

        // if (!this.data.btn_done) {
        //     for (var a = [], i = 0; i < this.data.trash.length; i++)
        //         if (this.data.trash[i].checked) {
        //             if ("" == this.data.trash[i].capacity) return void app.alert("提示", "请填写“" + this.data.trash[i].name + "”的最大库存量。");
        //             a.push({
        //                 tid: this.data.trash[i].id,
        //                 capacity: this.data.trash[i].capacity
        //             });
        //         }
        //     a.length < 1 ? app.alert("提示", "请勾选危废。") : app.post("busi_trash", {
        //         act: "set",
        //         trash: a
        //     }, function (a) {
        //         app.toast("设置成功", "success"), setTimeout(function () {
        //             wx.navigateBack();
        //         }, 1e3);
        //     });
        // }
    }
});