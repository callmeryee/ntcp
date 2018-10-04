import InGameManager from "./ingame/InGameManager";

var common = require("Common");


function LoginSocket() {

    this.getMessage = function (send, callback) {
        var socket = null;
        try {
            socket = new WebSocket(ServerConnection.wsLogin);
        } catch (evt) {
            socket = null;
            Global.log("new LoginSocket error:" + evt.data);
            if (typeof (connCb) != "undefined" && connCb != null)
                connCb("-1", "loginsocket connect error!");
        }

        if (socket != null) {
            socket.onopen = () => { send(socket) };
            socket.onclose = this.onClose;
            socket.onmessage = (evt) => {
                console.log(evt.data);
                callback(JSON.parse(evt.data));
                socket.close();
            };
            socket.onerror = this.onError;
        }


    };

    this.onClose = function (evt) {
        console.log("login socket onclose");
    };

    this.onError = function (evt) {
        for ( var p in evt) {
            console.log(p + "=" + evt[p]);
        }
    };

}


var ServerConnection = {


    // wsLogin: "ws://192.168.2.103:9800",
    // wsServer: "ws://192.168.2.103:9801",
    // record_url: "http://192.168.2.110:8080/record/",


    wsLogin: "ws://47.96.188.12:9800",
    wsServer: "ws://47.96.188.12:9801",
    record_url: "http://47.96.188.12/record/",

    svc_websocket: null,
    login_socket: null,

    checked: false,

    xmlHttpRequest: function (url, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                var respone = xhr.responseText;
                callback(respone);
            }
        };
        xhr.open("GET", url, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.timeout = 5000;
        xhr.send();
    },

    xmlHttpRequest2: function (url, data, callback) {

        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                var respone = xhr.responseText;
                callback(respone);
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.timeout = 5000; if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        if (data != null)
            data = JSON.stringify(data);
        xhr.send(data);
    },


    sendCode: function (code) {

        if (this.login_socket == null)
            this.login_socket = new LoginSocket();

        this.login_socket.getMessage(function (socket) {
            socket.send(JSON.stringify({
                path: "GetUserInfo",
                data: {
                    code: code
                }
            }))
        }, function (message) {
            Global.log("GetUserInfo_code:"+JSON.stringify(message));
            ServerConnection.sendUnionID(message.unionid);
        });

        // var url = this.ip + "/getUserInfo";
        // var data = { code: code, uid: uid, checkCode: check };
        // this.xmlHttpRequest2(url, data, function (respone) {
        //     var json = JSON.parse(respone);
        //     //console.log(json);
        //     Global.init_login(json);
        // })
    },

    getGameRecord: function (guid) {

        if (this.login_socket == null)
            this.login_socket = new LoginSocket();

        this.login_socket.getMessage(function (socket) {
            socket.send(JSON.stringify({
                path: "GetGameRecord",
                data: {
                    guid: guid
                }
            }))
        }, function (message) {
            Global.log("GetGameRecord");
            console.log(message);
        });

    },

    sendUnionID: function (unionid) {
        if (this.login_socket == null)
            this.login_socket = new LoginSocket();

        this.login_socket.getMessage(function (socket) {
            socket.send(JSON.stringify({
                path: "GetUserInfo",
                data: {
                    unionid: unionid
                }
            }))
        }, function (message) {
            Global.log("GetUserInfo_unionid");
            Global.init_login(message);
        });
    },


    sendTestUnionID: function () {
        if (this.login_socket == null)
            this.login_socket = new LoginSocket();

        this.login_socket.getMessage(function (socket) {
            socket.send(JSON.stringify({
                path: "TestUserInfo",
                data: {

                }
            }))
        }, function (message) {
            console.log(message);
            Global.log("Get test user info");
            Global.init_login(message);
        });

    },


    createRoom: function (playCount, payType, balanceRate, includexi, fengding) {

        if (this.login_socket == null)
            this.login_socket = new LoginSocket();
        var currency = 'diamond';
        var data = { unionid: Global.unionid, count: playCount, payType: payType, balanceRate: balanceRate, includexi: includexi, currency: currency, limit: fengding };
        this.login_socket.getMessage(function (socket) {
            socket.send(JSON.stringify({
                path: "CreateRoomCard",
                data: data
            }))
        }, function (message) {
            Global.log("CreateRoomCard");
            Global.init_room(message);
        });
    },

    // create_room: function (playCount, payType, balanceRate, includexi, fengding) {

    //     var url = this.ip + "/getRoomCard";
    //     var currencyType = 'Diamond';
    //     var data = { uid: Global.unionid, playCount: playCount, payType: payType, balanceRate: balanceRate, includexi: includexi, currencyType: currencyType, maxScore: fengding };
    //     this.xmlHttpRequest2(url, data, function (respone) {
    //         var json = JSON.parse(respone);
    //         //console.log(json);
    //         Global.init_room(json);
    //     })
    // },

    get_record: function (uid, dayCount) {
        var url = this.ip + "/getRoomRecoder";
        var data = { uid: uid, dayCount: dayCount };
        console.log(data);
        this.xmlHttpRequest2(url, data, function (respone) {
            var json = JSON.parse(respone);
            // console.log(json);
            Global.deal_record(json);
        })
    },

    get_card_record: function (path) {
        var url = this.record_url + path;
        this.xmlHttpRequest(url, function (respone) {
            Global.record_data = respone;
            Global.loadScene('record');
        })
    },

    random_user: function () {
        // var url = "http://192.168.2.103:9800/test/createRandomUser";
        // this.xmlHttpRequest(url, function (respone) {
        //     var json = JSON.parse(respone);
        //     //console.log(json);
        //     Global.init_login(json);
        // })
    },


    enter_room: function () {
        this.svc_send(CLIENT_MSG.CM_ENTER_ROOM, { guid: Global.room_uid });
    },


    check_in_room: function () {
        if (Global.room_uid) {
            ServerConnection.enter_room();
        }
    },




    svc_connectPlatform: function () {

        Global.log("Connecting");
        try {
            ServerConnection.svc_websocket = new WebSocket(ServerConnection.wsServer);
        } catch (evt) {
            Global.log("new WebSocket error:" + evt.data);
            ServerConnection.svc_websocket = null;
            if (typeof (connCb) != "undefined" && connCb != null)
                connCb("-1", "connect error!");
        }

        ServerConnection.svc_websocket.onopen = ServerConnection.svc_onOpen;
        ServerConnection.svc_websocket.onclose = ServerConnection.svc_onClose;
        ServerConnection.svc_websocket.onmessage = ServerConnection.svc_onMessage;
        ServerConnection.svc_websocket.onerror = ServerConnection.svc_onError;
    },


    svc_closePlatform: function () {
        if (this.svc_websocket != null) {
            this.svc_websocket.close();
            this.svc_websocket = null;
            console.log('ws close');
        }
    },

    svc_onOpen: function (evt) {
        Global.log("Connected to WebSocket server.");
        ServerConnection.checked = false;
        var data = { guid: Global.guid, unionid: Global.unionid };
        ServerConnection.svc_websocket.send(JSON.stringify(data));
    },

    svc_onClose: function (evt) {
        Global.log("Disconnected");
        ServerConnection.svc_websocket = null;
        Global.leave_room();
    },

    svc_onMessage: function (evt) {

        console.log(evt.data);

        var data = JSON.parse(evt.data);
        if (!ServerConnection.checked) {
            if (data.error == 0) {
                ServerConnection.checked = true;
                ServerConnection.check_in_room();
            }
            return;
        }
        if (data.error) {
            switch (data.error) {
                case "ROOM_NOT_FOUND":
                    {
                        Global.room_uid = null;
                        Global.messagebox.create_box('没有找到对应的房间');
                    }
                    break;
                default:
                    Global.messagebox.create_box(data.error);
                    break;
            }

            return;
        }
        var json = { id: data[0], msg: data[1] };
        Global.log(SERVER_MSG[json.id] + ": " + JSON.stringify(json.msg));
        switch (json.id) {

            case SERVER_MSG.SM_CHECK_IN_ROOM:
                {
                    Global.on_check_in_room_msg(json.msg);
                }
                break;

            case SERVER_MSG.SM_ENTER_ROOM:
                {
                    Global.on_enter_room_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_SYNC_ROOM_STATE:
                {
                    Global.on_sync_room_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_LEAVE_ROOM:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_leave_room_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_RECONNECT:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_reconnect_msg(json.msg);
                }
                break;

            case SERVER_MSG.SM_READY_GAME:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_ready_game_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_START_GAME:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_start_game_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_HUAN_PAI:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_huanpai_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_MO_PAI:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_mopai_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_CHU_PAI:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_chupai_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_GANG_PAI:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_gangpai_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_PENG_PAI:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_pengpai_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_HU_PAI:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_hupai_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_GAME_BALANCE:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_balance_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_MAI_ZHUANG:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_maizhuang_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_BROADCAST:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_broadcast_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_DISMISS_GAME:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_dismiss_game_msg(json.msg);
                }
                break;

            case SERVER_MSG.SM_DISMISS_GAME_RESULT:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_dismiss_game_result_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_TEST_PAI:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_test_pai_msg(json.msg);
                }
                break;
            case SERVER_MSG.SM_REFRESH_PAI:
                {
                    if (InGameManager.instance)
                        InGameManager.instance.on_refresh_pai_msg(json.msg);
                }
                break;

        }
    },

    svc_onError: function (evt) {
        for ( var p in evt) {
            Global.log(p + "=" + evt[p]);
        }
    },

    svc_send: function () {
        if (ServerConnection.svc_websocket.readyState == WebSocket.OPEN) {
            var json = JSON.stringify([arguments[0], arguments.length > 0 ? arguments[1] : null]);
            ServerConnection.svc_websocket.send(json);
            Global.log(CLIENT_MSG[arguments[0]] + ": " + (arguments.length > 0 ? JSON.stringify(arguments[1]) : ""));
        } else {
            Global.log("Send failed. websocket not open. please check.");
        }
    },
}

window.ServerConnection = ServerConnection

var Global = {

    game_app: null,

    AppId: 'wx278464a99e02e646',
    authorize_after_registerApp: false,
    local_unionid: null,

    common: null,

    headimgurl: '',
    headicon: null,

    location: null, //位置信息
    latitude: null, //纬度
    longitude: null, //经度
    radius: null,//定位精度

    nickname: '游客',
    unionid: null,
    guid: null,
    token: null,
    proxy: false,
    diamond: 0,
    gold: 0,

    enter_room: false,
    room_uid: null,

    room_data: null,

    logview: null,
    login: null,
    lobby: null,
    ingame: null,
    soundmanager: null,
    animationmanager: null,
    messagebox: null,

    record_data: null,

    sync_data: null,


    appear_action: function (node) {
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
        node.y = 0;
        node.active = true;
    },

    disappear_action: function (node, callback) {
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


    init_login: function (json) {

        if (json.error != null) {
            this.messagebox.create_box("账号信息错误");
            return;
        }
        //console.log('用户信息:',json);

        if (json.headimgurl)
            Global.headimgurl = json.headimgurl;
        if (json.nick)
            Global.nickname = json.nick;
        Global.unionid = json.unionid;
        Global.guid = json.guid;
        Global.token = json.token;
        Global.proxy = json.isProxy;
        Global.diamond = json.diamond;
        Global.gold = json.gold;

        if (cc.sys.isNative) {
            cc.sys.localStorage.setItem('local_unionid', this.unionid);
        }
        Global.common = common;

        Global.loadScene('lobby');
    },

    init_room: function (json) {
        console.log("room card info:" + json);
        if (json.error != null) {

            switch (json.error) {
                case "ERROR_USER_STATE_INROOM":
                    {
                        var text = "当前房间未正常退出，房号 " + json.msg
                        this.messagebox.create_box(text);

                    }
                    break;
                default:
                    {
                        this.messagebox.create_box(json.error);
                    }
                    break;
            }

            return;
        }
        if (json.guid == null)
            return;
        Global.room_uid = json.guid;
        if (json.gold)
            Global.gold = json.gold;
        if (json.diamond)
            Global.diamond = json.diamond;
        Global.lobby.setMoney();
        if (Global.enter_room) {
            ServerConnection.enter_room();
        }
        else {
            this.messagebox.create_box('房间号:' + this.room_uid);
        }
    },

    deal_record: function (json) {
        this.lobby.deal_record(json);
    },


    leave_room: function () {
        //this.ingame = null;
        window.callStaticMethod(0, 'cocosLog:lobby isLoading');
        Global.loadScene('lobby');
    },


    on_check_in_room_msg: function (json) {
        // console.log(json);
        // if (json.roomid != null) {
        //     Global.room_uid = json.roomid;
        //     ServerConnection.enter_room();
        // }
        // else {
        //     if (Global.active_room_uid != null) {
        //         Global.room_uid = Global.active_room_uid;
        //         ServerConnection.enter_room();
        //     }
        // }
    },


    on_enter_room_msg: function (json) {
        if (json.error) {
            this.room_data = null;

            switch (json.error) {
                case "ERROR_USER_STATE_INROOM":
                    {
                        var text = "当前房间未正常退出，房号 " + json.msg
                        this.messagebox.create_box(text);
                    }
                    break;
                default:
                    {
                        this.messagebox.create_box(json.error);
                    }
                    break;
            }

            return;
        }

        this.room_data = json;

        if (InGameManager.instance == null) {
            Global.loadScene('ingame');
        }
        else {
            InGameManager.instance.init_game();
            InGameManager.instance.init_room_info();
            InGameManager.instance.init_player_info();
        }
    },


    on_sync_room_msg: function (json) {
        if (json.error) {
            this.room_data = null;

            switch (json.error) {
                case "ERROR_USER_STATE_INROOM":
                    {
                        var text = "当前房间未正常退出，房号 " + json.msg;
                        this.messagebox.create_box(text);

                    }
                    break;
                default:
                    {
                        this.messagebox.create_box(json.error);
                    }
                    break;
            }
        }

        this.room_data = json;

        if (InGameManager.instance == null) {
            Global.loadScene('ingame');
        }
    },

    log: function (text) {
        this.logview.addMessage(text);
    },
    loadScene: function (name) {
        cc.director.loadScene(name);
    },

    setIcon: function (url, icon) {
        if (url == '' && url == null)
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
    CLIENT_MSG[CLIENT_MSG["CM_CHECK_IN_ROOM"] = 0] = "CM_CHECK_IN_ROOM";
    CLIENT_MSG[CLIENT_MSG["CM_ENTER_ROOM"] = 1] = "CM_ENTER_ROOM";
    CLIENT_MSG[CLIENT_MSG["CM_LEAVE_ROOM"] = 2] = "CM_LEAVE_ROOM";
    CLIENT_MSG[CLIENT_MSG["CM_READY_GAME"] = 3] = "CM_READY_GAME";
    CLIENT_MSG[CLIENT_MSG["CM_START_GAME"] = 4] = "CM_START_GAME";
    CLIENT_MSG[CLIENT_MSG["CM_GET_ROOM_INFO"] = 5] = "CM_GET_ROOM_INFO";
    CLIENT_MSG[CLIENT_MSG["CM_CHU_PAI"] = 6] = "CM_CHU_PAI";
    CLIENT_MSG[CLIENT_MSG["CM_TEST_PAI"] = 7] = "CM_TEST_PAI";
    CLIENT_MSG[CLIENT_MSG["CM_MAI_ZHUANG"] = 8] = "CM_MAI_ZHUANG";
    CLIENT_MSG[CLIENT_MSG["CM_BROADCAST"] = 9] = "CM_BROADCAST";
    CLIENT_MSG[CLIENT_MSG["CM_DISMISS_GAME"] = 10] = "CM_DISMISS_GAME";
})(CLIENT_MSG || (CLIENT_MSG = {}));
var SERVER_MSG;
(function (SERVER_MSG) {
    SERVER_MSG[SERVER_MSG["SM_CHECK_IN_ROOM"] = 0] = "SM_CHECK_IN_ROOM";
    SERVER_MSG[SERVER_MSG["SM_ENTER_ROOM"] = 1] = "SM_ENTER_ROOM";
    SERVER_MSG[SERVER_MSG["SM_LEAVE_ROOM"] = 2] = "SM_LEAVE_ROOM";
    SERVER_MSG[SERVER_MSG["SM_READY_GAME"] = 3] = "SM_READY_GAME";
    SERVER_MSG[SERVER_MSG["SM_START_GAME"] = 4] = "SM_START_GAME";
    SERVER_MSG[SERVER_MSG["SM_MO_PAI"] = 5] = "SM_MO_PAI";
    SERVER_MSG[SERVER_MSG["SM_CHU_PAI"] = 6] = "SM_CHU_PAI";
    SERVER_MSG[SERVER_MSG["SM_REFRESH_PAI"] = 7] = "SM_REFRESH_PAI";
    SERVER_MSG[SERVER_MSG["SM_TEST_PAI"] = 8] = "SM_TEST_PAI";
    SERVER_MSG[SERVER_MSG["SM_PENG_PAI"] = 9] = "SM_PENG_PAI";
    SERVER_MSG[SERVER_MSG["SM_GANG_PAI"] = 10] = "SM_GANG_PAI";
    SERVER_MSG[SERVER_MSG["SM_HU_PAI"] = 11] = "SM_HU_PAI";
    SERVER_MSG[SERVER_MSG["SM_GAME_BALANCE"] = 12] = "SM_GAME_BALANCE";
    SERVER_MSG[SERVER_MSG["SM_SYNC_ROOM_STATE"] = 13] = "SM_SYNC_ROOM_STATE";
    SERVER_MSG[SERVER_MSG["SM_MAI_ZHUANG"] = 14] = "SM_MAI_ZHUANG";
    SERVER_MSG[SERVER_MSG["SM_BROADCAST"] = 15] = "SM_BROADCAST";
    SERVER_MSG[SERVER_MSG["SM_DISMISS_GAME"] = 16] = "SM_DISMISS_GAME";
    SERVER_MSG[SERVER_MSG["SM_DISMISS_GAME_RESULT"] = 17] = "SM_DISMISS_GAME_RESULT";
    SERVER_MSG[SERVER_MSG["SM_RECONNECT"] = 18] = "SM_RECONNECT";
})(SERVER_MSG || (SERVER_MSG = {}));

var State = {
    IN_NONE: 0,
    IN_LOGIN: 1,
    IN_LOBBY: 2,
    IN_ROOM: 3,
    IN_READY: 4,
    IN_GAME: 5,
    IN_BLANCE: 6
}

var RoomState = {
    IN_NONE: 0,
    IN_WAIT: 1,
    IN_PLAY: 2,
    IN_BLANCE: 3
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

