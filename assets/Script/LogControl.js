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
        logView:cc.Node,
        logLabel:cc.Label,
        clear_btn:cc.Button,
        close_btn:cc.Button,
        show_btn:cc.Button,
    },

    onLoad:function(){
        Global.logview = this;
        cc.game.addPersistRootNode(this.node);
        this.node.setGlobalZOrder(1000);
        if(cc.sys.isNative)
        {
            this.show_btn.node.active = false;
        }
    },

    clear_onclick:function(){
        this.logLabel.string = "";
    },
    close_onclick:function(){
        this.logView.active = false;
    },

    show_log:function(){
        this.logView.active = true;
    },

    addMessage:function(text){
        this.logLabel.string += text+"\n";
        //this.node.active = true;
    }

});
