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
        player1_btn:cc.Node,
        player2_btn:cc.Node,
        random_btn: cc.Node,
        address_node: cc.Node,
        http_address: cc.EditBox,
        ws_address: cc.EditBox,
    },

    onLoad() {

        Global.login = this;
        this.random_btn.active = !cc.sys.isNative;
        this.player1_btn.active = !cc.sys.isNative;
        this.player2_btn.active = !cc.sys.isNative;

        if (cc.sys.isNative && Global.location == null) {
            window.callStaticMethod(4, {});
        }           
    },


    login_onclick: function () {

        Global.soundmanager.play_button_click();

        if (cc.sys.isNative) {
            Global.local_unionid = cc.sys.localStorage.getItem('local_unionid');
            if (Global.local_unionid && Global.local_unionid != '') {
                Global.authorize_after_registerApp = false;
                window.callStaticMethod(1, { appid: Global.AppId });
            }
            else
            {
                Global.authorize_after_registerApp = true;
                window.callStaticMethod(1, { appid: Global.AppId });
            }
                
        }
        else {
             ServerConnection.login('123', 'oUQtWxNbxtl6WrywgcMSGzBpezRo', false);
            //ServerConnection.login('123', 'testuid54515', false);
        }

    },

    player1_onclick:function(){
        ServerConnection.login('123', 'oUQtWxDOWvhp9xn0BULWPjCEvjQE', false);
    },

    player2_onclick:function(){
        ServerConnection.login('123', 'oUQtWxH0lhVwlo_F6ehB0oKtVvmw', false);
    },

    get_location: function (msg) {

        if (msg!=null) {
            if(msg.error == 0)
            {
                Global.location = msg.msg.addr;
                Global.latitude = msg.msg.latitude;
                Global.longitude = msg.msg.longitude;
               // Global.radius = msg.msg.radius;
            }
            else
            {            
                Global.log("msg.error != 161");
            }
        }
        else
        {
            Global.log("local_msg == null");
        }
 
    },

    random_onclick: function () {

        ServerConnection.random_user();
    },

    show_address_btn_onclick: function () {
        this.address_node.active = true;
    },

    address_confirm_onclick: function () {
        ServerConnection.ip = this.http_address.string;
        ServerConnection.wsServer = this.ws_address.string;
    },

    address_cancle_onclick: function () {
        this.address_node.active = false;
    },

});
