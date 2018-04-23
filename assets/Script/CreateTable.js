// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var server_connetcion = require("ServerConnection");
cc.Class({
    extends: cc.Component,

    properties: {
        close_btn: cc.Button,

        node_totle: cc.Node,
        node_multiple: cc.Node,
        node_xipai: cc.Node,
        node_pay: cc.Node,

        playCount: null,
        payType: null,
        balanceRate: null,
        includexi: null,
        forceNew: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
    },

    close: function () {
        Global.disappear_action(this.node);
    },

    create_onlick: function () {
        Global.enter_room = true;
        this.create_room();
    },

    create_for_others_onclick: function () {
        Global.enter_room = false;
        this.create_room();
    },

    create_room: function () {
        this.playCount = this.set_playCount();
        this.balanceRate = this.set_balanceRate();
        this.payType = 1;
        this.includexi = true;
        this.forceNew = true;
        server_connetcion.create_room(this.playCount, this.payType, this.balanceRate, this.includexi, this.forceNew);
    },

    get_data: function (node) {
        var list = node.children;
        for (var i = 0; i < list.length; i++) {
            var toggle = list[i].getComponent(cc.Toggle);
            if (toggle && toggle.isChecked) {
                return i;
            }
        }
    },

    set_playCount() {
        var index = this.get_data(this.node_totle);
        var ret = 6;
        switch (index) {
            case 0:
                ret = 6;
                break;
            case 1:
                ret = 12;
                break;
        }
        return ret;
    },

    set_balanceRate() {
        var index = this.get_data(this.node_multiple);
        var ret = 0;
        switch (index) {
            case 0:
                {
                    ret = 0;
                }
                break;
            case 1:
                {
                    ret = Math.pow(2, 1) + Math.pow(2, 2) + Math.pow(2, 3);
                }
                break;
            case 2:
                {
                    ret = Math.pow(2, 2) + Math.pow(2, 3) + Math.pow(2, 4);
                }
                break;
            case 3:
                {
                    ret = Math.pow(2, 3) + Math.pow(2, 4) + Math.pow(2, 5);
                }
                break;
        }
        return ret;
    },

    get_balanceRate(value) {
        var len = 15;
        var ret = [];
        if (value == 0) {
            ret = [1, 1, 1];
        }
        else {
            for (var i = 0; i < len; i++) {
                if ((value>>i) & 1 == 1)
                    ret.push(i);
            }
        }
        console.log(ret);
        return ret;
    }
});
