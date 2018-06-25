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
       close_btn:cc.Button,
       music_slider:cc.Slider,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {

    },

    music_callback: function (event) {
        Global.soundmanager.set_music_volume(event.progress);
    },
    

    close:function () {
        Global.soundmanager.play_button_click();
        this.node.active = false;
    },

    change_btn_onclick(){
        if (cc.sys.isNative) {
            cc.sys.localStorage.setItem('local_openid', '');
            cc.sys.localStorage.setItem('local_unionid', '');
           // Global.loadScene('login');
        }
    }

});
