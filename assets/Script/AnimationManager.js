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
        animation:cc.Animation,
        sprite:cc.Sprite,
    },

    onLoad () {

        Global.animationmanager = this;
        cc.game.addPersistRootNode(this.node);
        this.node.setGlobalZOrder(100);

        this.animation = this.node.getComponent(cc.Animation);
        this.sprite = this.node.getComponent(cc.Sprite);
        var self = this;
        cc.loader.loadResDir('animationclip', function (err, objects, urls) {
            if (err) {
                console.log(err.message || err);
                return;
            }
            var len = objects.length;
            for(var i = 0;i<len;i++)
            {
                self.animation.addClip(objects[i]);
            }
            //self.play('hu_clip');
        });   
    },

    play:function(name){
        this.sprite.enabled = true;  
        this.animation.play(name);
    },

    onAnimEnd:function () {
        this.sprite.enabled = false;  
    },

    // update (dt) {},
});
