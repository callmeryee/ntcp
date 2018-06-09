// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html


var common = require("Common");

//0：日志 1:注册appid 2：授权 3分享
window.OnNativeResponse = function (type, msg) {
    window.callStaticMethod(0, msg);
    if (type == 1) {
        if (msg.error == 0) {
            window.callStaticMethod(2, {});
        }
    }
    else if (type == 2) {
        if (msg.error == 0) {
            var code = msg.msg.code;
            if(code!=null)
            {
               ServerConnection.login(code,'123',true);
            }
        }
    }
    //分享
    //window.callStaticMethod(3,{title:"人人长牌",description:"大家一起来",type:0})
}
    

window.callStaticMethod = function(type,msg){
    if(cc.sys.os == cc.sys.OS_IOS){
        jsb.reflection.callStaticMethod("AppController","callNativeWithType:andMessage:",type,JSON.stringify(msg));
    }
    else if(cc.sys.os == cc.sys.OS_ANDROID){
        jsb.reflection.callStaticMethod("com/heretry/ntcp/AppActivity", "callNative", "(ILjava/lang/String;)V", type,JSON.stringify(msg));
    }
}

cc.Class({
    extends: cc.Component,

    properties: {
        random_btn:cc.Node,
        address_node:cc.Node,
        http_address:cc.EditBox,
        ws_address:cc.EditBox,
    },

    onLoad () {

        Global.login = this;
        this.random_btn.active = !cc.sys.isNative;
        // cc.game.onStop = function () {
        //     ServerConnection.svc_closePlatform();
        //     cc.log("stopApp");
        // }
	},


    onopen(evt){
        console.log(evt);
    },
    
    login_onclick:function () {
        Global.soundmanager.play_button_click();
        if (cc.sys.isNative) {
            var local_unionid = cc.sys.localStorage.getItem('local_unionid');
            if (local_unionid&&local_unionid!='') {
                ServerConnection.login('123',local_unionid,false);
            }
            else        
                window.callStaticMethod(1,{appid:Global.AppId});
        }
        else
        {
            ServerConnection.login('123','oUQtWxNbxtl6WrywgcMSGzBpezRo',false);
        }
    },

    random_onclick:function(){

        ServerConnection.random_user();
    },
     
    show_address_btn_onclick:function(){
        this.address_node.active = true;
    },

    address_confirm_onclick:function(){    
        ServerConnection.ip = this.http_address.string;
        ServerConnection.wsServer = this.ws_address.string;
    },

    address_cancle_onclick:function(){
        this.address_node.active = false;
    },

    update (dt) {
        if(cc.sys.isNative)
        {
            if(cc.sys.os == cc.sys.OS_ANDROID){
                var script = jsb.reflection.callStaticMethod("com/heretry/ntcp/AppActivity", "readLastScript", "()Ljava/lang/String;");         
                if(script != ""){
                   // window.callStaticMethod(0,script);
                   eval(script);
                }
           }
        }    
    },

});
