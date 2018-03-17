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
        clone:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.clone.active = false;

        Global.messagebox = this;
        cc.game.addPersistRootNode(this.node);
        this.node.setGlobalZOrder(50);
    },

    start () {
        
    },


    create_box:function (text) {
        console.log(text);
        var obj = cc.instantiate(this.clone);
        var close = obj.getChildByName("close");
        close.on(cc.Node.EventType.MOUSE_UP,function(event){
            console.log(this.destroy());
        },obj);
        obj.getChildByName("text").getComponent(cc.Label).string = text;
        obj.parent = this.node;
        obj.scaleX=1;
        obj.scaleY=1;
        obj.rotation = 0;
        obj.active = true;
    },

    close_box:function(){
       
    },

    // update (dt) {},
});
