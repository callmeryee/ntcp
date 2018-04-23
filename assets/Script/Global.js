import InGameManager from "./ingame/InGameManager";

var server_connection = require("ServerConnection");
var common = require("Common");
var Global = {   

    AppId:'wx278464a99e02e646',

    server_connection:null,
    common:null,

    headimgurl:'',
    headicon:null,

    nickname:'游客',
    unionid:null,
    openid:null,
    token:null,
    proxy:false,
    diamond:0,
    gold:0, 

    enter_room:false,

    uid:null,
    room_uid:null,
    room_data:null,

    logview:null,
    login:null,
    lobby:null,
    ingame:null,
    soundmanager:null,
    animationmanager:null,
    messagebox:null,


    appear_action:function(node)
    {
        // node.y=700;
        // node.active = true;
        // var action = cc.sequence(
        //     cc.moveTo(0.3, 0,0),
        //     cc.spawn(
        //        cc.moveTo(0.2, 0,50),
        //        cc.rotateTo(0.2,-3)
        //     ),
        //     cc.spawn(
        //         cc.moveTo(0.2, 0,0),
        //         cc.rotateTo(0.2,0)
        //     ),
        //     cc.spawn(
        //         cc.moveTo(0.15, 0,25),
        //         cc.rotateTo(0.15,3)
        //     ),
        //     cc.spawn(
        //         cc.moveTo(0.1, 0,0),
        //         cc.rotateTo(0.1,0)
        //     )
        // ).speed(2);
        // node.runAction(action);
        node.y=0;
        node.active = true;
    },

    disappear_action:function(node,callback)
    {
        // var finish = cc.callFunc(function() {
        //     node.active = false;
        // });
        // var action = cc.sequence(
        //     cc.spawn(
        //         cc.moveTo(0.15, 0,25),
        //         cc.rotateTo(0.15,3)
        //     ),
        //     cc.spawn(
        //         cc.moveTo(0.1, 0,0),
        //         cc.rotateTo(0.1,0)
        //     ),
        //     cc.spawn(
        //         cc.moveTo(0.2, 0,50),
        //         cc.rotateTo(0.2,-3)
        //     ),
        //     cc.spawn(
        //         cc.moveTo(0.2, 0,0),
        //         cc.rotateTo(0.2,0)
        //     ),
        //     cc.moveTo(0.3, 0,700),
        //     finish
        // ).speed(2);
        // node.runAction(action);
        node.active = false;
    },


    init_login:function(json){
        if(json.error!=null)
        {
            this.messagebox.create_box(json.error);
            return;
        }
        //console.log('用户信息:',json);
        if(json.openid == null)
        return;
        if(json.headimgurl)
           this.headimgurl = json.headimgurl;
        if(json.nick)
           this.nickname = json.nick;
        this.openid = json.openid;
        this.unionid = json.uid;
        this.token = json.token;
        this.proxy = json.isProxy;
        this.diamond = json.diamondCount;
        this.gold = json.goldCount;
        Global.common = common;
        this.loadScene('lobby');  
    },

    init_room:function(json){
        if(json.error!=null)
        {
            this.messagebox.create_box(json.error);
            return;
        }
        if(json.roomid == null)
        return;
        this.room_uid = json.roomid;
        if(json.goldCount)
           this.gold = json.goldCount;
        if(json.diamondCount)
           this.diamond = json.diamondCount;
        this.lobby.setMoney();   
        if(this.enter_room)
        {
            server_connection.enter_room();
        }
        else
        {
            this.messagebox.create_box('房间号:'+this.room_uid);
        }
    },

    leave_room:function(){
        //this.ingame = null;
        this.loadScene("lobby");
    },

    // on_login_msg:function(json){
    //     if(json.error)
    //     return;
    //     this.uid = json.uid;
    //     this.loadScene('lobby');
    // },

    // on_create_room_msg:function(json){
    //     if(json.error)
    //     return;
    //     if(json.self==1)
    //     {
    //         this.room_uid = json.room_uid;
    //         server_connection.svc_send(CLIENT_MSG.CM_ENTER_ROOM,{room_uid:this.room_uid});
    //     }
    // },

    on_enter_room_msg:function(json){
        if(json.error)
        {
            this.room_data = null;
            this.messagebox.create_box(json.error);
            return;
        }
        if(json.self)
           this.uid = json.self;
        this.room_data = json;
        if(InGameManager.instance==null)
        {
           Global.server_connection = server_connection;
           this.loadScene('ingame2');
        }
        else if(json.self)
        {
            InGameManager.instance.init_game(); 
        }
        else
            InGameManager.instance.set_room_info();   
    },

    // on_ready_game_msg:function(json){
    //     if(json.error)
    //     {
    //         this.messagebox.create_box(json.error);
    //         return;
    //     }
    //     this.ingame.set_ready(json);
    // },

    // on_start_game_msg:function(json){
    //     if(json.error)
    //     {
    //         this.messagebox.create_box(json.error);
    //         return;
    //     }
    //     this.ingame.get_start_game_msg(json);
    // },

    // on_huanpai_msg:function(json){
    //     if(json.error)
    //     {
    //         this.messagebox.create_box(json.error);
    //         return;
    //     }
    //     this.ingame.get_huanpai_msg(json);
    // },

    // on_mopai_msg:function(json){
    //     if(json.error)
    //     {
    //         this.messagebox.create_box(json.error);
    //         return;
    //     }
    //     this.ingame.get_mopai_msg(json);
    // },

    // on_chupai_msg:function(json){
    //     if(json.error)
    //     {
    //         this.messagebox.create_box(json.error);
    //         return;
    //     }
    //     this.ingame.get_chupai_msg(json);
    // },

    // on_gangpai_msg:function(json){
    //     if(json.error)
    //     {
    //         this.messagebox.create_box(json.error);
    //         return;
    //     }
    //     this.ingame.get_gangpai_msg(json);
    // },

    // on_pengpai_msg:function(json){
    //     if(json.error)
    //     {
    //         this.messagebox.create_box(json.error);
    //         return;
    //     }
    //     this.ingame.get_pengpai_msg(json);
    // },

    // on_hupai_msg:function(json){
    //     if(json.error)
    //     {
    //         this.messagebox.create_box(json.error);
    //         return;
    //     }
    //     this.ingame.get_hupai_msg(json);
    // },

    // on_balance_msg:function(json){
    //     if(json.error)
    //     {
    //         this.messagebox.create_box(json.error);
    //         return;
    //     }
    //     this.ingame.get_balance_msg(json);
    // },

    log:function(text) {
        this.logview.addMessage(text);
    },
    loadScene:function(name){
        cc.director.loadScene(name);
    },

    setIcon:function(url,icon){
        if(url==''&&url==null)
        return;
        var imgurl = url + "?aa=aa.jpg";
        cc.loader.load(imgurl, function (err, texture) {
            icon.spriteFrame = new cc.SpriteFrame(texture);
        });
    },
}

window.Global = Global


var CLIENT_MSG;
(function (CLIENT_MSG) {
CLIENT_MSG[CLIENT_MSG["CM_ENTER_ROOM"] = 0] = "CM_ENTER_ROOM";
CLIENT_MSG[CLIENT_MSG["CM_LEAVE_ROOM"] = 1] = "CM_LEAVE_ROOM";
CLIENT_MSG[CLIENT_MSG["CM_READY_GAME"] = 2] = "CM_READY_GAME";
CLIENT_MSG[CLIENT_MSG["CM_START_GAME"] = 3] = "CM_START_GAME";
CLIENT_MSG[CLIENT_MSG["CM_GET_ROOM_INFO"] = 4] = "CM_GET_ROOM_INFO";
CLIENT_MSG[CLIENT_MSG["CM_CHU_PAI"] = 5] = "CM_CHU_PAI";
CLIENT_MSG[CLIENT_MSG["CM_RESPON_CHU_PAI"] = 6] = "CM_RESPON_CHU_PAI";
CLIENT_MSG[CLIENT_MSG["CM_HUAN_PAI"] = 7] = "CM_HUAN_PAI";
})(CLIENT_MSG || (CLIENT_MSG = {}));
var SERVER_MSG;
(function (SERVER_MSG) {
SERVER_MSG[SERVER_MSG["SM_ENTER_ROOM"] = 0] = "SM_ENTER_ROOM";
SERVER_MSG[SERVER_MSG["SM_LEAVE_ROOM"] = 1] = "SM_LEAVE_ROOM";
SERVER_MSG[SERVER_MSG["SM_READY_GAME"] = 2] = "SM_READY_GAME";
SERVER_MSG[SERVER_MSG["SM_START_GAME"] = 3] = "SM_START_GAME";
SERVER_MSG[SERVER_MSG["SM_MO_PAI"] = 4] = "SM_MO_PAI";
SERVER_MSG[SERVER_MSG["SM_CHU_PAI"] = 5] = "SM_CHU_PAI";
SERVER_MSG[SERVER_MSG["SM_HUAN_PAI"] = 6] = "SM_HUAN_PAI";
SERVER_MSG[SERVER_MSG["SM_PENG_PAI"] = 7] = "SM_PENG_PAI";
SERVER_MSG[SERVER_MSG["SM_GANG_PAI"] = 8] = "SM_GANG_PAI";
SERVER_MSG[SERVER_MSG["SM_HU_PAI"] = 9] = "SM_HU_PAI";
SERVER_MSG[SERVER_MSG["SM_GAME_BALANCE"] = 10] = "SM_GAME_BALANCE";
})(SERVER_MSG || (SERVER_MSG = {}));

var State={
    IN_NONE:0,
    IN_LOGIN:1,
    IN_LOBBY:2,
    IN_ROOM:3,
    IN_READY:4,
    IN_GAME:5,
    IN_BLANCE:6
    }

var RoomState={
    IN_NONE:0,
    IN_WAIT:1,
    IN_PLAY:2,
    IN_BLANCE:3
    }

var PaiMessageResponse;
(function (PaiMessageResponse) {
PaiMessageResponse[PaiMessageResponse["RESULT_NONE"] = 0] = "RESULT_NONE";
PaiMessageResponse[PaiMessageResponse["RESULT_PENG"] = 1] = "RESULT_PENG";
PaiMessageResponse[PaiMessageResponse["RESULT_GANG"] = 2] = "RESULT_GANG";
PaiMessageResponse[PaiMessageResponse["RESULT_HU"] = 3] = "RESULT_HU";
PaiMessageResponse[PaiMessageResponse["RESULT_XI"] = 4] = "RESULT_XI";
PaiMessageResponse[PaiMessageResponse["RESULT_ANGANG"] = 5] = "RESULT_ANGANG";
})(PaiMessageResponse || (PaiMessageResponse = {}));

var HuType;
(function (HuType) {
HuType[0] = "NONE";
HuType[1] = "飘胡";
HuType[2] = "清胡";
HuType[3] = "塌子胡";
})(HuType || (HuType = {}));

var HuPaiType;
(function (HuPaiType) {
HuPaiType[0] = "NONE";
HuPaiType[1] = "文钱";
HuPaiType[2] = "单吊";
HuPaiType[3] = "丫子";
HuPaiType[4] = "边张";
HuPaiType[5] = "自摸";
HuPaiType[6] = "天胡";
HuPaiType[7] = "天听";
HuPaiType[8] = "穷喜";
})(HuPaiType || (HuPaiType = {}));


window.CLIENT_MSG = CLIENT_MSG
window.SERVER_MSG = SERVER_MSG
window.State = State
window.RoomState = RoomState
window.PaiMessageResponse = PaiMessageResponse
window.HuType = HuType
window.HuPaiType = HuPaiType

