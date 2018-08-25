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
        clone2:cc.Node,
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
        var obj = cc.instantiate(this.clone);
        var close = obj.getChildByName("close");

        close.on('click', function (event) {
            this.destroy();
        }, obj);

        obj.getChildByName("text").getComponent(cc.Label).string = text;
        obj.parent = this.node;
        obj.scaleX=1;
        obj.scaleY=1;
        obj.rotation = 0;
        obj.active = true;
    },

    

    create_box_confirm:function (text,callback) {

            var obj = cc.instantiate(this.clone2);
            var close = obj.getChildByName("close");
            var confirm = obj.getChildByName("confirm");
            var time_label = obj.getChildByName("time").getComponent(cc.Label);  
            time_label.string = "";
            var t = 120;
            var stop_timer = false;
            function timer()
            {
                time_label.string = t;
                setTimeout(() => {
                    t-=1;

                    if(obj == null)
                    {
                        callback = null;
                        return;
                    }

                    if(t>0 && !stop_timer)
                    {
                        timer(); 
                    }
                    else
                    {
                        if(callback)
                        {
                            callback(true);
                            callback = null;
                        }
                        if(obj!=null)
                        {
                            obj.destroy();
                        }
                    }
                }, 1000);
            }
        
            timer();

            close.on('click', function (event) {
                stop_timer = true;
                if(callback)
                {
                    callback(false);
                    callback = null;
                }
                this.destroy();
            }, obj);

            confirm.on('click',function(event){
                stop_timer = true;
                if(callback)
                {
                    callback(true);
                    callback = null;
                }
                this.destroy();
            },obj);
    
            obj.getChildByName("text").getComponent(cc.Label).string = text;
            obj.parent = this.node;
            obj.scaleX=1;
            obj.scaleY=1;
            obj.rotation = 0;
            obj.active = true;

            return obj;
    },


});
