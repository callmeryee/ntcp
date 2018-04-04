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
       close_btn:cc.Button,

       node_totle:cc.Node,
       node_multiple:cc.Node,
       node_xipai:cc.Node,
       node_pay:cc.Node,

       totle:null,
       multiple:null,
       xipai:null,
       pay:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {   
    },

    close:function () {
        Global.disappear_action(this.node);
    },

    create_onlick:function(){
        Global.enter_room = true;
        this.create_room();
    },

    create_for_others_onclick:function(){
        Global.enter_room = false;
        this.create_room();
    },

    create_room:function(){
        this.totle = this.get_data(this.node_totle);
        this.multiple = this.get_data(this.node_multiple);
        this.xipai = this.get_data(this.node_xipai);
        this.pay = this.get_data(this.node_pay);
        server_connetcion.create_room(this.totle,this.multiple,this.xipai,this.pay);
    },

    get_data: function (node) {
        var list = node.children;
        for (var i = 0; i < list.length; i++) {
            var toggle = list[i].getComponent(cc.Toggle);
            if (toggle && toggle.isChecked) {
                return i ;
            }
        }
    },

});
