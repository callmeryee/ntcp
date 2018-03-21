// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var server_connection = require("ServerConnection");
var common = require("Common");
function client(){
    this.json = null;
    this.node = null;
    this.icon = null;
    this.name = null;
    this.prepare = null;
    this.time = null;
    this.time_num = null;
    this.num = null;
    this.cardmanager = null;
    this.initInfo = function(){
       if(this.json==null)
       {
            this.icon.enabled = false;
            this.name.string = "";
            this.time.active = false;
            this.setState(State.IN_ROOM);
            this.setNum("");
            this.node.active = false;
       }
       else
       {
            this.icon.enabled = true;
            this.name.string = this.json.uid;
            this.time.active = false;
            this.setState(this.json.state);
            this.setNum("");
            this.node.active = true;
       }
    }

 
    this.setState = function(state)
    {
        if(this.json==null)
        {
            this.prepare.active = false;
            return;
        }
        this.json.state = state;      
        this.prepare.active = this.json.state == State.IN_READY;
    }

    this.setNum = function(num)
    {
        this.num.string = num;
    }

}
cc.Class({
    extends: cc.Component,

    properties: {

        my_turn:false,

        middle_card_data:null,
        new_card_data:null,

        pai_atlas:cc.SpriteAtlas,
        icon_first_name:null,

        clients:[],
        
        client_nodes:[cc.Node],

        jiangpai_node:cc.Node,
        buttons_node:cc.Node,
        card_left:cc.Label,

        menu_btn:cc.Button,
        start_btn:cc.Button,
        invite_btn:cc.Button,

        menu_node:cc.Node,
        balance:cc.Node,

        card_out_left:cc.Node,
        card_out_right:cc.Node,
        card_out_middle:cc.Node,
    
        node_room_id:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.ingame = this;
    },

    start(){
       this.init_ingame_ui();
    },

    init_ingame_ui:function(){
        if (Global.room_uid != null)
            this.node_room_id.string = "房间号：" + Global.room_uid;
        else
            this.node_room_id.string = "";
        this.start_btn.node.active = true; 
        this.invite_btn.node.active = true; 
        this.card_left.node.parent.active = false;
        this.jiangpai_node.active = false;
        this.balance.active = false;
        this.menu_node.active = false;
        this.icon_first_name = "pic_";
        var len = this.client_nodes.length;
        for(var i =0;i<len;i++)
        {
            this.clients[i] = new client();
            var node = this.client_nodes[i];
            this.clients[i].node = node;
            this.clients[i].cardmanager = node.getComponent("CardManager");
            this.clients[i].cardmanager.can_move = false;
            node = this.client_nodes[i].getChildByName("info");
            this.clients[i].icon = node.getComponent(cc.Sprite);
            this.clients[i].name = node.getChildByName("name").getComponent(cc.Label);
            this.clients[i].prepare = node.getChildByName("prepare");
            this.clients[i].time = node.getChildByName("time");
            this.clients[i].time_num = this.clients[i].time.getChildByName("num").getComponent(cc.Label);
            this.clients[i].num = node.getChildByName("num").getComponent(cc.Label);

        }

        this.create_clients();
        for(var i = 0;i<this.clients.length;i++)
        {
            this.set_out_data(this.clients[i],[]);
            this.set_dipai_data(this.clients[i],[]);
            this.set_shoupai_data(this.clients[i],[],false);
        }  
       
        this.hide_buttons();
        this.set_middle_card_data(null);
    },

    set_card_left:function(num){
        this.card_left.string = num;
        this.card_left.node.parent.active = true;
    },

    set_jiangpai:function(data){
        var children = this.jiangpai_node.getChildren();
        for(var i = 0;i<data.length;i++)
        {
            var pai = common.get_pai(data[i]);
            this.set_card_data(children[i],pai);
        }
        this.jiangpai_node.active = true;
    },

    create_clients:function(){
        var clients_data = Global.room_data.clients;
        var len = this.clients.length;
        for(var i =0;i<len;i++)
		{
            this.clients[i].json = null;             
        }
        var self_index = 0;
        len = clients_data.length;
		for(var i =0;i<len;i++)
		{
            if(clients_data[i].uid == Global.uid)
            { 
                self_index = i;
                this.clients[2].json = clients_data[i];
                break;
            }              
        }
        switch (self_index) {
            case 0:
            {
                if(len==2)
                {
                    this.clients[0].json = null;
                    this.clients[1].json = clients_data[1]; 
                }
                else if(len == 3)
                {
                    this.clients[0].json = clients_data[2];
                    this.clients[1].json = clients_data[1]; 
                }
            }
            break;
            case 1:
            {
                if(len==2)
                {
                    this.clients[0].json = clients_data[0];;
                    this.clients[1].json = null; 
                }
                else if(len == 3)
                {
                    this.clients[0].json = clients_data[0];
                    this.clients[1].json = clients_data[2]; 
                }
            }
            break;
            case 2:
            {
                this.clients[0].json = clients_data[1];
                this.clients[1].json = clients_data[0]; 
            }
            break;
        }   
        var len = this.clients.length;
        for(var i =0;i<len;i++)
		{
            this.clients[i].initInfo();             
        }  
    },

    get_client:function(uid){
        var len = this.clients.length;
        for(var i =0;i<len;i++)
		{
            if(this.clients[i].json!=null)
            {
                var json = this.clients[i].json;
                if(json.uid==uid)
                return this.clients[i];
            }          
        }
        return null;
    },

    get_client_index:function(uid){
        var len = this.clients.length;
        for(var i =0;i<len;i++)
		{
            if(this.clients[i].json!=null)
            {
                var json = this.clients[i].json;
                if(json.uid==uid)
                return i;
            }          
        }
        return 0;
    },

    set_ready:function(json){
        var client = this.get_client(json.uid)
        client.setState(json.state);
        if(client.json.uid == Global.uid)
        {
            this.start_btn.node.active = client.json.state != State.IN_READY; 
        }
    },

    get_start_game_msg:function(json){
        this.start_btn.node.active = false; 
        this.invite_btn.node.active = false; 
        this.set_card_left(json.size2);
        this.set_jiangpai(json.jiang);

        var list = json.shou;
        for(var i = 0;i<this.clients.length;i++)
        {
            this.clients[i].setState(State.IN_GAME);
            this.clients[i].setNum(list.length);
        }
        this.set_shoupai_data(this.clients[2],list,true);
    },



    set_shoupai_data:function(client,list,check){
        client.cardmanager.set_list_shoupai(list);
        if(check)
        {
            var len = list.length;
            var data_xipai = [];
            for(var i =0;i<len;i++)
            {
                if(list[i]>120)
                {
                    data_xipai.push(list[i]);
                }
            };
    
            if(data_xipai.length>0)
            {
                server_connection.svc_send(CLIENT_MSG.CM_HUAN_PAI,data_xipai);
                return;
            };
            
            var bts = [];
            if(this.check_hu(list))
                bts.push(3);
            if(this.check_gang_list(list))
                bts.push(2);     
            if(bts.length>0)
            {
                bts.push(4);
                this.check_buttons(bts);
            }
            else
                this.guo_btn_onclick();
        }
    },

    push_shoupai_data:function(client,value)
    {
        this.new_card_data = value;
        var list = client.cardmanager.data_shoupai;
        list.push(value);
        this.set_shoupai_data(client,list,true);
    },

    set_dipai_data:function(client,list){
         var data_xipai=[];
         var data_common=[];
         for(var i= 0;i<list.length;i++)
         {
             if(list[i]>120)
             data_xipai.push(list[i]);
             else
             data_common.push(list[i]);
         }
         client.cardmanager.set_list_dipai(data_common);
         client.cardmanager.set_list_xipai(data_xipai);
    },

    push_out_data:function(client,value){
        var list = client.cardmanager.data_out;
        list.push(value);
        this.set_out_data(client,list);
    },

    set_out_data:function(client,list){
        client.cardmanager.set_list_out(list);
    },


    get_mopai_msg:function(json){
        var client = this.get_client(json.uid)
        if(json.uid == Global.uid)
        {
            this.my_turn = true;

            var value = json.pai;
            this.push_shoupai_data(client,value);
        }
        else
        {

        }
        client.setNum(json.size1);
        this.set_card_left(json.size2);

    },


    get_chupai_msg:function(json){
        var client = this.get_client(json.uid);
        if(json.uid!=Global.uid)
        {
            this.start_card_animation(json.uid,json.pai);
            client.setNum(json.size1);
            var list = [];
            var len = this.clients[2].cardmanager.data_shoupai.length;
            for(var i = 0;i<len;i++)
            {
                list.push(this.clients[2].cardmanager.data_shoupai[i]);
            }
            list.push(json.pai);

            var bts = [];
            if(this.check_hu(list))
                bts.push(3);
            if(this.check_gang(json.pai))
                bts.push(2);
            if(this.check_peng(json.pai))
                bts.push(1);
            if(bts.length>0)
            {
                bts.push(4);
                this.check_buttons(bts);
            }
            else
                this.guo_btn_onclick();  
        }
        else
        {   
            this.new_card_data = null;     
            var shoupai = json.shou;
            this.set_shoupai_data(client,shoupai,false);
            client.setNum(shoupai.length);
            server_connection.svc_send(CLIENT_MSG.CM_RESPON_CHU_PAI,{type:PaiMessageResponse.RESULT_NONE});
        }

        if(this.middle_card_data!=null)
        {
            client = this.get_client(this.middle_card_data.uid);
            this.push_out_data(client,this.middle_card_data.value);
            this.set_middle_card_data(null);
        }

        this.set_middle_card_data({uid:json.uid,value:json.pai});
    },


    get_huanpai_msg:function(json){
        var client = this.get_client(json.uid);
        if(json.uid == Global.uid)
        {
           this.set_shoupai_data(this.clients[2],json.shou,true);
        }
        this.set_dipai_data(client,json.di);
    },

    get_gangpai_msg:function(json){
        var client = this.get_client(json.uid);
        if(json.uid == Global.uid)
        {
            this.set_shoupai_data(this.clients[2],json.shou,false);
            this.clients[2].setNum(json.shou.length);
            this.hide_buttons();
        }
        else
        {
            client.setNum(json.size1);
        }
        this.set_dipai_data(client,json.di);
        this.set_middle_card_data(null);
    },

    get_pengpai_msg:function(json){
        var client = this.get_client(json.uid);
        if(json.uid == Global.uid)
        {
            this.set_shoupai_data(this.clients[2],json.shou,false);
            this.clients[2].setNum(json.shou.length);
            this.hide_buttons();
            this.clients[2].cardmanager.can_move = true;
        }
        else
        {
            client.setNum(json.size1);
        }
        this.set_dipai_data(client,json.di);
        this.set_middle_card_data(null);
    },

    get_hupai_msg:function(json){
        this.hide_buttons();
    },

    get_balance_msg:function(json){
        var bc = this.balance.getComponent("BalanceControl");
        bc.set_balance_data(json);
        bc.show_balance();
    },

    check_hu:function(list){
        var ret = common.check_win(list);
        if(ret.length>0)
        {
            //console.log(ret);
        }
        return ret.length>0;
    },

    check_peng:function(value){
        var pai = common.get_pai(value);
        var shoupai_list = this.clients[2].cardmanager.pai_list_shoupai;
        var count = 0;
        var len = shoupai_list.length;
        for(var i = 0;i<len;i++){
            if(pai.type == shoupai_list[i].type && pai.value == shoupai_list[i].value){
                count++;
            }
        }
        return count == 2;
    },


    check_gang:function(value){
        var pai = common.get_pai(value);
        var shoupai_list = this.clients[2].cardmanager.pai_list_shoupai;
        var count = 0;
        var len = shoupai_list.length;
        for(var i = 0;i<len;i++){
            if(pai.type == shoupai_list[i].type && pai.value == shoupai_list[i].value){
                count++;
            }
        }
        return count == 3;
    },

    check_gang_list:function(list){
        var len = list.length;
        var count = 0;
        for(var i = 0;i<len;i++)
        {
            for(var j = i+1;j<len;j++){
                if(list[j].type == list[i].type && list[j].value == list[i].value){
                    count++;
                }
            }
            for(var j=0;j<i;j++)
            {
                if(list[j].type == list[i].type && list[j].value == list[i].value){
                    count++;
                }
            }
            
        }  
        return count == 3;
    },

    start_card_animation:function(uid,value){    
        var index = this.get_client_index(uid);
        var node = null;
        var start_pos = null;
        var start_rot = null;
        if(index == 0)
        {
           node = this.card_out_left;
           start_pos = cc.p(-620, -126);
           start_rot = 65;
        }
        else
        {
           node = this.card_out_right;
           start_pos = cc.p(620, -126);
           start_rot = -65;
        }

        this.card_out_middle.active = false;
        var data = common.get_pai(value);
    
        this.set_card_data(node,data);
        node.x = start_pos.x;
        node.y = start_pos.y;
        node.rotation = start_rot;
        node.active = true;
        var ingame = this;
        var finish = cc.callFunc(function(){
            node.active = false;
            node.x = start_pos.x;
            node.y = start_pos.y;
            ingame.card_out_middle.active = true;
        },this);
        var action = cc.sequence(cc.moveTo(0.3,cc.p(0, 163)),cc.rotateTo(0.3,0),finish);
        node.runAction(action);
    },



    set_card_data:function(node,data){
        var card = node.getComponent("Card");
        if(card!=null)
           card.data = data;
        var icon_name = this.get_card_icon_name(data.type,data.value);
        var frame = this.pai_atlas.getSpriteFrame(icon_name);
        var sprite = node.getComponent(cc.Sprite);
        if(sprite!=null)
           sprite.spriteFrame = frame;
        var children = node.children;
        for(var i = 0;i<children.length;i++)
        {
            sprite = children[i].getComponent(cc.Sprite);
            if(sprite!=null)
               sprite.spriteFrame = frame;
            if(children[i].childrenCount>0)
            {
                children[i].children[0].active = data.tag == this.new_card_data;
            }
        }
    },

    set_card_data2:function(node,value){
        var pai = common.get_pai(value);
        this.set_card_data(node,pai);
    },

    set_card_data_dipai:function(node,data){
        var card = node.getComponent("Card");
        if(card!=null)
           card.data = data;
        var icon_name = this.get_card_icon_name(data.type,data.value);
        var frame = this.pai_atlas.getSpriteFrame(icon_name);
        var sprite = node.getComponent(cc.Sprite);
        if(sprite!=null)
           sprite.spriteFrame = frame;
        var children = node.children;
        for(var i = 0;i<children.length;i++)
        {
            if(i<data.count)
            {
                sprite = children[i].getComponent(cc.Sprite);
                    if(sprite!=null)
                    sprite.spriteFrame = frame;
                children[i].active = true;
            }
            else
            {
                children[i].active = false;
            }
        }

    },

    set_middle_card_data:function(data){
        if(data != null)
        {
            this.middle_card_data = data;
            var pai = common.get_pai(data.value);
            this.set_card_data(this.card_out_middle,pai);
        }
        else
        {
            this.middle_card_data = null;
            this.card_out_middle.active = false;
        }
    },


    get_card_icon_name:function(type,num){
        if(type<=3)
        {
            return this.icon_first_name+type.toString()+num.toString();
        }
        else if(type==4)
        {
            return this.icon_first_name+"41"; 
        }
        else if(type==5)
        {
            return this.icon_first_name+"42"; 
        }
        else if(type==6)
        {
            return this.icon_first_name+"43"; 
        }
        else
        {
            return this.icon_first_name+"4"+(num+3).toString();
        }
    },

    set_icon_first_name:function(data){
        this.icon_first_name = data;
    },

    start_btn_onclick:function(){
        server_connection.svc_send(CLIENT_MSG.CM_READY_GAME,{state:State.IN_READY});
    },

    invite_btn_onclick:function(){

    },

    menu_btn_show:function(){
        this.menu_node.active = true;
    },

    menu_btn_hide:function(){
        this.menu_node.active = false;
    },
    
    chupai_btn_onclick:function(){

    },

    peng_btn_onclick:function(){
        server_connection.svc_send(CLIENT_MSG.CM_RESPON_CHU_PAI,{type:PaiMessageResponse.RESULT_PENG});

    },

    gang_btn_onclick:function(){
        server_connection.svc_send(CLIENT_MSG.CM_RESPON_CHU_PAI,{type:PaiMessageResponse.RESULT_GANG});

    },

    hu_btn_onclick:function(){
        server_connection.svc_send(CLIENT_MSG.CM_RESPON_CHU_PAI,{type:PaiMessageResponse.RESULT_HU});
    },

    guo_btn_onclick:function(){
        server_connection.svc_send(CLIENT_MSG.CM_RESPON_CHU_PAI,{type:PaiMessageResponse.RESULT_NONE});   
        if(this.my_turn)
           this.clients[2].cardmanager.can_move = true;
        this.hide_buttons();
    },

    back_btn_onclick:function(){
        server_connection.svc_closePlatform();
    },

    hide_buttons:function(){
        this.check_buttons([]);
    },

    //0:出牌 1：碰 2：杠 3：胡 4：过
    check_buttons:function(data){
        var buttons = this.buttons_node.getChildren();
        var len = buttons.length;
        for(var i = 0;i<len;i++){
            buttons[i].active = false;
        }
        for(var i = 0;i<data.length;i++){
            var index = data[i];
            if(index<buttons.length)
            {
                buttons[index].active = true;
            }
        }
    },

    // update (dt) {},
});
