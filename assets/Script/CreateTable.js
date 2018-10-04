// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
cc.Class({
    extends: cc.Component,

    properties: {
        close_btn: cc.Button,

        node_totle: cc.Node,
        node_multiple: cc.Node,
        node_xipai: cc.Node,
        node_fengding:cc.Node,
        node_pay: cc.Node,

        playCount: null,
        payType: null,
        balanceRate: null,
        includexi: null,
        fengding:null,
        forceNew: null,

        timer:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    update (dt) {
        if (this.timer > 0) {
            this.timer -= dt;
            if (this.timer < 0)
                this.timer = 0;
        }
    },

    start() {
    },

    show:function(){
       this.timer = 0;
       this.node.active = true;
    },

    close: function () {
        Global.soundmanager.play_button_click();
        Global.disappear_action(this.node);
    },

    create_onlick: function () {
        Global.soundmanager.play_button_click();
        Global.enter_room = true;
        this.create_room();
    },

    create_for_others_onclick: function () {
        // Global.soundmanager.play_button_click();
        // Global.enter_room = false;
        // this.create_room();
    },

    create_room: function () {
        if(this.timer>0)
        return;
        this.playCount = this.set_playCount();
        this.balanceRate = this.set_balanceRate();
        this.payType = this.setPayType();
        this.fengding = this.setFengDing();
        this.includexi = this.set_includexi();
        this.forceNew = true;
        ServerConnection.createRoom(this.playCount, this.payType, this.balanceRate, this.includexi,this.fengding);
        this.timer = 3;
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


    set_includexi(){
        var index = this.get_data(this.node_xipai);
        return index == 0?true:false;
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
        var ret;
        switch (index) {
            case 0:
                {
                    //ret = 0;
                    ret = [1,1,1];
                }
                break;
            case 1:
                {
                    ret = [1,2,3];
                    //ret = Math.pow(2, 1) + Math.pow(2, 2) + Math.pow(2, 3);
                }
                break;
            case 2:
                {
                    ret = [2,3,4];
                    //ret = Math.pow(2, 2) + Math.pow(2, 3) + Math.pow(2, 4);
                }
                break;
            case 3:
                {
                    ret = [3,4,5];
                    //ret = Math.pow(2, 3) + Math.pow(2, 4) + Math.pow(2, 5);
                }
                break;
            case 4:
                {
                    ret = [3,5,7];
                    //ret = Math.pow(2, 3) + Math.pow(2, 5) + Math.pow(2, 7);
                }
                break;
            case 5:
                {
                    ret = [5,7,10];
                    //ret = Math.pow(2, 5) + Math.pow(2, 7) + Math.pow(2, 10);
                }
                break;
        }
        return ret;
    },

    setPayType(){
        var index = this.get_data(this.node_pay);  
        switch(index)
        {
            case 0 :
            return 'Host';
            break;
            case 1 :
            return 'Winer';
            break;
            case 2 :
            return 'AA';
            break;
        }
        
    },

    setFengDing(){
        var index = this.get_data(this.node_fengding);
        switch(index)
        {
            case 0:
            return 0;
            case 1:
            return 500;
            case 2:
            return 800;
        }
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
