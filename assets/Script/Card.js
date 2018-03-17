// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var ingame = require("InGame");
cc.Class({
    extends: cc.Component,
    
    properties: {
        own:cc.Node,
        start_pos_x:0,
        start_pos_y:0,
        data:null,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START,function(event){
           var card = this.getComponent("Card");
           var card_manager = card.own.parent.getComponent("CardManager");
           if(card_manager.can_move)
           {
                Global.ingame.check_buttons([0]);
                card_manager.select_card = card.own.children.indexOf(this);
                card_manager.reset_shoupai_list();
                this.parent = card_manager.node;
                this.x*=card.own.scaleX;
                this.x-=card.own.x;
                this.y*=card.own.scaleY;
                this.y-=card.own.y;
                card.start_pos_x = this.x;
                card.start_pos_y = this.y;
           }
        },this.node);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
           var card = this.getComponent("Card");
           var card_manager = card.own.parent.getComponent("CardManager");
           if(card_manager.can_move)
           {
                this.opacity = 255;
                var delta = event.touch.getDelta();
                this.x += delta.x;
                this.y += delta.y;  
           }
          //  Global.log("move:"+this.x+"~~~"+this.y);
        }, this.node);

        this.node.on(cc.Node.EventType.TOUCH_END,function(event){
            var card = this.getComponent("Card");
            var card_manager = card.own.parent.getComponent("CardManager");
            if(card_manager.can_move)
            {
                card.touch_end(this);
            }
        },this.node);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
            var card = this.getComponent("Card");
            var card_manager = card.own.parent.getComponent("CardManager");
            if(card_manager.can_move)
            {
                card.touch_end(this);
            }
        },this.node);
    },

    touch_end:function(node)
    {
        var card = node.getComponent("Card");
        var t = (Math.abs(node.x)/600)*0.2;
        if(node.x<-600||node.x>600||node.y<100)
        {
            card.card_reset(t);
        }
        else
        {
            card.card_finish(t);
        }
    },

    card_finish:function(t){
        if(this.data == null)
        {
           this.card_reset(t);
           return;
        }
        var card_manager = this.own.parent.getComponent("CardManager");
        var finish = cc.callFunc(function(){
            this.node.destroy();
            card_manager.select_card=-1;
            card_manager.check_shoupai_list();
            var card_out_middle = Global.ingame.card_out_middle;
            Global.ingame.set_card_data2(card_out_middle,this.data.tag);
            card_out_middle.active = true;
        },this);
        var action = cc.sequence(cc.moveTo(t,0,300),finish);
        this.node.runAction(action);
        card_manager.can_move = false;
        Global.ingame.my_turn = false;
        Global.ingame.check_buttons([]);
        card_manager.send_chupai_msg(this.data.tag);
    },

    card_reset:function(t){
        var reset = cc.callFunc(function(){
            this.node.parent = this.own;
            var card_manager = this.own.parent.getComponent("CardManager");
            this.node.setSiblingIndex(card_manager.select_card);
            card_manager.check_shoupai_list();
        },this);
        var action = cc.sequence(cc.moveTo(t,this.start_pos_x,this.start_pos_y),reset);
        this.node.runAction(action);
    },

    onDestroy(){
        
    },
    
});
