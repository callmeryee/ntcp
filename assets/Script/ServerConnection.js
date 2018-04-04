
var ServerConnection=function(){
}

ServerConnection.prototype.openid="123456";

// ServerConnection.prototype.ip = "http://192.168.2.103:9800/public";
// ServerConnection.prototype.wsServer = "ws://192.168.2.103:9300";

ServerConnection.prototype.ip = "http://ntcp.wohnb.com/ntcp";
ServerConnection.prototype.wsServer = "ws://ntcp.wohnb.com:9500";

ServerConnection.prototype.svc_websocket = null;

ServerConnection.prototype.check_connect_count = 0;
ServerConnection.prototype.max_check_connect_count = 3;
ServerConnection.prototype.connected = false;

ServerConnection.prototype.xmlHttpRequest=function(url,callback)
{
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
}

ServerConnection.prototype.login = function(){
    var url = this.ip + "/getUserInfo?data="+JSON.stringify({openid:this.openid});
    this.xmlHttpRequest(url,function(respone){
        var json = JSON.parse(respone);
        Global.init_login(json);
    })
}

ServerConnection.prototype.create_room = function(v1,v2,v3,v4){
    var url = this.ip + "/createRoom?data="+JSON.stringify({openid:this.openid,totle:arguments[0],multiple:arguments[1],xipai:arguments[2],pay:arguments[3]});
    this.xmlHttpRequest(url,function(respone){
        var json = JSON.parse(respone);
        Global.init_room(json);
    })
}

ServerConnection.prototype.enter_room = function(){
    if(this.svc_websocket == null)
       this.svc_connectPlatform();
    else
       this.svc_send(CLIENT_MSG.CM_ENTER_ROOM,{room_uid:Global.room_uid});
}

ServerConnection.prototype.svc_connectPlatform=function() {
    Global.log("Connecting");
    try {
        this.svc_websocket = new WebSocket(this.wsServer);
    } catch (evt) {
        Global.log("new WebSocket error:" + evt.data);
        this.svc_websocket = null;
        if (typeof(connCb) != "undefined" && connCb != null)
            connCb("-1", "connect error!");
        return;
    }
    var self=this;
    this.check_connect_count += 1;
    this.connected = false;
    this.svc_websocket.onopen = (evt)=>{self.svc_onOpen(evt);};
    this.svc_websocket.onclose = (evt)=>{self.svc_onClose(evt);};
    this.svc_websocket.onmessage = (evt)=>{self.svc_onMessage(evt);};
    this.svc_websocket.onerror = (evt)=>{self.svc_onError(evt);};
}

ServerConnection.prototype.svc_closePlatform=function() {
    if(this.svc_websocket!=null)
    {
        this.svc_websocket.close();
    }
}

ServerConnection.prototype.svc_onOpen = function(evt) {
    Global.log("Connected to WebSocket server.");
    this.check_connect_count = 0;
    this.connected = true;
    this.svc_send(CLIENT_MSG.CM_ENTER_ROOM,{room_uid:Global.room_uid});
}

ServerConnection.prototype.svc_onClose = function(evt) {
    Global.log("Disconnected");
    this.svc_websocket = null;
    if(this.check_connect_count<=this.max_check_connect_count&&!this.connected)
    {
        this.svc_connectPlatform();
    }
    else
        Global.leave_room();
}

ServerConnection.prototype.svc_onMessage = function(evt) {
    if(this.disconnect_count<=this.max_disconnect_count||this.error_disconnect)
    {
        this.disconnect_count = this.max_disconnect_count+1;
        this.error_disconnect = false;
    }
    var data = JSON.parse(evt.data);
    var json={id:data[0],msg:data[1]};
    Global.log(SERVER_MSG[json.id]+": "+JSON.stringify(json.msg));
    switch(json.id)
    {
        // case SERVER_MSG.SM_LOGIN:
        // {
        //     Global.on_login_msg(json.msg);
        // }
        // break;
        // case SERVER_MSG.SM_CREATE_ROOM:
        // {
        //     Global.on_create_room_msg(json.msg);
        // }
        // break;
        case SERVER_MSG.SM_ENTER_ROOM:
        {
            Global.on_enter_room_msg(json.msg);
        }
        break;
        case SERVER_MSG.SM_READY_GAME:
        {
            Global.on_ready_game_msg(json.msg);
        }
        break;
        case SERVER_MSG.SM_START_GAME:
        {
            Global.on_start_game_msg(json.msg);
        }
        break;
        case SERVER_MSG.SM_HUAN_PAI:
        {
            Global.on_huanpai_msg(json.msg);
        }
        break;
        case SERVER_MSG.SM_MO_PAI:
        {
            Global.on_mopai_msg(json.msg);
        }
        break;
        case SERVER_MSG.SM_CHU_PAI:
        {
            Global.on_chupai_msg(json.msg);
        }
        break;
        case SERVER_MSG.SM_GANG_PAI:
        {
            Global.on_gangpai_msg(json.msg);
        }
        break;
        case SERVER_MSG.SM_PENG_PAI:
        {
            Global.on_pengpai_msg(json.msg);
        }
        break;
        case SERVER_MSG.SM_HU_PAI:
        {
            Global.on_hupai_msg(json.msg);
        }
        break;
        case SERVER_MSG.SM_GAME_BALANCE:
        {
            Global.on_balance_msg(json.msg);
        }
        break;
    }
}
ServerConnection.prototype.svc_onError = function(evt) {
    for ( var p in evt) {
        Global.log(p + "=" + evt[p]);
    }
}

ServerConnection.prototype.svc_send = function() { 
    if (this.svc_websocket.readyState == WebSocket.OPEN) {
        var json = JSON.stringify([arguments[0],arguments.length>0?arguments[1]:null]);
        this.svc_websocket.send(json);
        Global.log(CLIENT_MSG[arguments[0]]+": "+(arguments.length>0?JSON.stringify(arguments[1]):""));
    } else {
        Global.log("Send failed. websocket not open. please check.");
    }
}

module.exports = new ServerConnection();