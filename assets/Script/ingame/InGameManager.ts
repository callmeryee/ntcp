import Player from "./Player";
import { stat } from "fs";
import BalanceManager from "./BalanceManager";
import ResultManager from "./ResultManager";
import TimeManager from "./TimeManager";
import ChatManager from "./ChatManager";
import GPSManager from "./GPSManager";

// Learn TypeScript:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/typescript/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

const { ccclass, property } = cc._decorator;
@ccclass
export default class InGameManager extends cc.Component {

    public static ORDER_BUTTON_TYPE = cc.Enum(
        {
            CHUPAI: 0,
            PENG: 1,
            GANG: 2,
            HU: 3,
            GUO: 4
        });
    public static instance: InGameManager = null;
    public static icon_first_name = 'pic_';
    public static icon_fanzhuan = false;

    node_game_buttons: cc.Node = null;
    node_maizhuang_buttons: cc.Node = null;
    node_order_buttons: cc.Node = null;
    node_card_out_middle: cc.Node = null;
    node_card_out_left: cc.Node = null;
    node_card_out_right: cc.Node = null;
    node_jiangpai: cc.Node = null;
    node_count_label: cc.Label = null;
    node_room_id: cc.Label = null;
    node_room_info: cc.Label = null;
    node_room_jushu: cc.Label = null;

    node_menu: cc.Node = null;
    dismiss_game_button:cc.Node = null;
    leave_room_button:cc.Node = null;

    player_1: Player = null;
    player_2: Player = null;
    player_self: Player = null;

    @property(cc.SpriteAtlas)
    public pai_atlas: cc.SpriteAtlas = null;

    record: any = null;
    current_player: Player = null;

    public data_jiangpai: any = null;
    public data_new_card: any = null;
    public data_middle_card: any = null;
    data_orgin: any = null;

    balance: BalanceManager = null;
    time: TimeManager = null;

    result: ResultManager = null;

    chat:ChatManager = null;

    gps:GPSManager = null;

    room_jushu_max = null;
    room_jushu_current = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        InGameManager.instance = this;

        this.node_menu = this.node.getChildByName('node_menu');
        this.node_menu.active = false;
        this.dismiss_game_button = this.node_menu.getChildByName('button').getChildByName('dismiss_game_btn');
        this.dismiss_game_button.active = false;
        this.leave_room_button = this.node_menu.getChildByName('button').getChildByName('leave_room_btn');

        this.balance = this.node.getChildByName('node_balance').getComponent('BalanceManager');
        this.result = this.node.getChildByName('node_result').getComponent('ResultManager');
        this.balance.init();
        this.result.init();

        var node_body = this.node.getChildByName('node_body');
        var node_players = node_body.getChildByName('node_players');
        this.player_1 = node_players.getChildByName('node_1').getComponent('Player');
        this.player_2 = node_players.getChildByName('node_2').getComponent('Player');
        this.player_self = node_players.getChildByName('node_3').getComponent('Player');

        var node_out = node_body.getChildByName('node_out');
        this.node_card_out_middle = node_out.getChildByName('card_out_middle');
        this.node_card_out_left = node_out.getChildByName('card_out_left');
        this.node_card_out_right = node_out.getChildByName('card_out_right');

        this.node_jiangpai = node_body.getChildByName('node_jiangpai');
        var node_count = node_body.getChildByName('node_count');
        this.node_count_label = node_count.getChildByName('num').getComponent(cc.Label);
        this.node_room_id = node_body.getChildByName('node_room_id').getComponent(cc.Label);
        this.node_room_info = node_body.getChildByName('node_room_info').getComponent(cc.Label);
        this.node_room_jushu = node_body.getChildByName('node_room_jushu').getComponent(cc.Label);

        var node_buttons = this.node.getChildByName('node_buttons');
        var node_1 = node_buttons.getChildByName('node_1');
        this.node_game_buttons = node_1;
        var node_2 = node_buttons.getChildByName('node_2');
        this.node_order_buttons = node_2;
        var node_3 = node_buttons.getChildByName('node_3');
        this.node_maizhuang_buttons = node_3;

        var menu_btn = node_buttons.getChildByName('menu_btn');
        menu_btn.on('click', function (event) {
            this.menu_btn_onclick();
        }, this);


        var fanzhuan_btn = node_buttons.getChildByName('fanzhuan_btn');
        fanzhuan_btn.on('click', function (event) {
            this.fanzhuan_btn_onclick();
        }, this);

        var jian_btn = node_buttons.getChildByName('jian_btn');
        jian_btn.on('click', function (event) {
            this.jian_btn_onclick();
        }, this);

        var yuan_btn = node_buttons.getChildByName('yuan_btn');
        yuan_btn.on('click', function (event) {
            this.yuan_btn_onclick();
        }, this);


        var GPS_btn = node_buttons.getChildByName('GPS_btn');
        GPS_btn.on('click', function (event) {
            this.GPS_btn_onclick();
        }, this);

        var chat_btn =  node_buttons.getChildByName('chat_btn');
        chat_btn.on('click', function (event) {
            this.chat.show();
        }, this);

        var putongpaixu_btn = node_buttons.getChildByName('putongpaixu_btn');
        putongpaixu_btn.on('click', function (event) {
            this.putongpaixu_btn_onclick();
        }, this);


        var invite_btn = node_1.getChildByName('invite_btn');
        invite_btn.on('click', function (event) {
            Global.soundmanager.play_button_click();
            this.invite_btn_onclick();
        }, this);
        var play_btn = node_1.getChildByName('play_btn');
        play_btn.on('click', function (event) {
            Global.soundmanager.play_ready_sound();
            this.play_btn_onclick();
        }, this);
        var chupai_btn = node_2.getChildByName('chupai_btn');
        chupai_btn.on('click', function (event) {
            this.chupai_btn_onclick();
        }, this);
        var peng_btn = node_2.getChildByName('peng_btn');
        peng_btn.on('click', function (event) {
            Global.soundmanager.play_sound2('peng');
            this.peng_btn_onclick();
        }, this);
        var gang_btn = node_2.getChildByName('gang_btn')
        gang_btn.on('click', function (event) {
            Global.soundmanager.play_sound2('gang');
            this.gang_btn_onclick();
        }, this);
        var hu_btn = node_2.getChildByName('hu_btn');
        hu_btn.on('click', function (event) {
            Global.soundmanager.play_sound2('hu');
            this.hu_btn_onclick();
        }, this);
        var guo_btn = node_2.getChildByName('guo_btn');
        guo_btn.on('click', function (event) {
            //Global.soundmanager.play_card_out();
            this.guo_btn_onclick();
        }, this);
        var maizhuang_btn = node_3.getChildByName('maizhuang_btn');
        maizhuang_btn.on('click', function (event) {
            Global.soundmanager.play_button_click();
            this.maizhuang_btn_onclick();
        }, this);
        var bumaizhuang_btn = node_3.getChildByName('bumaizhuang_btn');
        bumaizhuang_btn.on('click', function (event) {
            Global.soundmanager.play_button_click();
            this.bumaizhuang_btn_onclick();
        }, this);


        this.time = node_body.getChildByName('node_time').getComponent('TimeManager');
        this.chat = this.node.getChildByName('node_chat').getComponent('ChatManager');
        this.chat.hide();

        this.gps = this.node.getChildByName('node_GPS').getComponent('GPSManager');
        this.gps.init();
        this.gps.hide();
    }

    start() {
        Global.soundmanager.play_music_ingame();
        this.init_room_info();
        this.init_game();
        this.yuan_btn_onclick();
        //  this.load_record();
    }


    load_record() {
        var self = this;
        cc.loader.loadRes('record/record', function (error, obj) {
            var temp = obj.toString();
            self.record = temp.split('\n');
            self.get_record(4);
        });
    }

    get_record(index: number) {
        if (this.record == null || index >= this.record.length)
            return;
        var temp = this.record[index];
        if (temp == "")
            return;
        var start = 1;
        var end = temp.length - 2;
        temp = temp.substring(start, end);
        start = temp.indexOf(',') + 1;
        end = temp.length;
        var type = Number.parseInt(temp.substring(0, start - 1));
        var msg = temp.substring(start, end);
        var json = JSON.parse(msg);

        console.log(type);
        console.log(json);

        // switch(type)
        // {
        //     case 3:
        //     this.get_start_game_msg(json,this.player_self);
        //     break;

        //     case 6:
        //     this.get_huanpai_msg(json);
        //     break;
        // }
    }

    init_game() {
        this.hide_maizhuang();
        this.balance.hide_balance();
        this.result.hide_result();
        this.set_time(null, null);
        this.set_node_count_label(0);
        this.set_jiangpai_data(null);
        this.set_middle_data(null);
        this.show_game_btns([0,1]);
        this.show_order_btns([]);
        if (Global.room_uid != null)
            this.node_room_id.string = "房号" + Global.room_uid;
        else
            this.node_room_id.string = "";
        this.init_player();
        this.set_jushu();
    }

    onDestroy() {
        console.log('ingame destroy');
        InGameManager.instance = null;

    }

    init_room_info() {
        if (Global.room_data != null) {
            var card_data = Global.room_data.card;
            var ret = '';
            if (card_data.includexi) {
                ret += '带喜儿;'
            }
            else {
                ret += '不带喜儿;'
            }

            if (card_data.balanceRate) {
                var rate = card_data.balanceRate;
                if (rate[0] == rate[1] == rate[2] == 1)
                    ret += '无倍数;';
                else
                    ret += '倍数' + rate[0].toString() + ',' + rate[1].toString() + ',' + rate[2].toString() + ';';
            }

            if (card_data.maxScore) {
                var max_score = card_data.maxScore;
                console.log(max_score);
                switch (max_score) {
                    case 0:
                        ret += '不封顶;';
                        break;
                    default:
                        ret += '封顶' + max_score.toString() + '胡;'
                        break;
                }
            }
            else
            {
                ret += '不封顶;';
            }

            if (card_data.payType) {
                switch (card_data.payType) {
                    case 1:
                        ret += '房主支付';
                        break;
                    case 3:
                        ret += '大赢家支付';
                        break;
                    case 2:
                        ret += 'AA支付';
                        break;
                }
            }

            this.node_room_info.string = ret;
            if(card_data.maxUseCount && card_data.canUseCount)
            {
                var temp = card_data.maxUseCount - card_data.canUseCount;
                temp += 1;
                this.room_jushu_current = temp;
                this.room_jushu_max = card_data.maxUseCount;
            }
        }
        else {
            this.node_room_info.string = '';
        }
    }

    set_jushu(){
        if(this.room_jushu_current>this.room_jushu_max)
        this.room_jushu_current = this.room_jushu_max;
        this.node_room_jushu.string ='局数' + this.room_jushu_current+'/'+this.room_jushu_max;
    }

    init_player() {
        this.player_1.reset();
        this.player_2.reset();
        this.player_self.reset();
        if (Global.room_data != null) {
            var clients_data = Global.room_data.clients;
            var self_index = 0;
            var len = clients_data.length;
            for (var i = 0; i < len; i++) {
                if (clients_data[i].uid == Global.uid) {
                    self_index = i;
                    this.player_self.set_info(clients_data[i]);
                    break;
                }
            }
            switch (self_index) {
                case 0:
                    {
                        if (len == 2) {
                            this.player_1.set_info(null);
                            this.player_2.set_info(clients_data[1]);
                        }
                        else if (len == 3) {
                            this.player_1.set_info(clients_data[2]);
                            this.player_2.set_info(clients_data[1]);
                        }
                    }
                    break;
                case 1:
                    {
                        if (len == 2) {
                            this.player_1.set_info(clients_data[0]);
                            this.player_2.set_info(null);
                        }
                        else if (len == 3) {
                            this.player_1.set_info(clients_data[0]);
                            this.player_2.set_info(clients_data[2]);
                        }
                    }
                    break;
                case 2:
                    {

                        this.player_1.set_info(clients_data[1]);
                        this.player_2.set_info(clients_data[0]);
                    }
                    break;
            }

            this.player_1.init();
            this.player_2.init();
            this.player_self.init();
        }
    }

    set_room_info() {
        this.init_player();
    }

    show_game_btns(data: Array<number>) {
        var children = this.node_game_buttons.children;
        var len = children.length;
        for (var i = 0; i < len; i++) {
            children[i].active = false;
        }
        for (var i = 0; i < data.length; i++) {
            var index = data[i];
            if (index < children.length) {
                children[index].active = true;
            }
        }
    }


    public show_order_btns(data: Array<number>) {
        var children = this.node_order_buttons.children;
        var len = children.length;
        for (var i = 0; i < len; i++) {
            children[i].active = false;
        }
        for (var i = 0; i < data.length; i++) {
            var index = data[i];
            if (index < children.length) {
                children[index].active = true;
            }
        }
    }

    menu_btn_onclick() {
        console.log('menu_btn on click');
        Global.soundmanager.play_button_click();
        this.node_menu.active = true;
    }

    fanzhuan_btn_onclick() {
        InGameManager.icon_fanzhuan = !InGameManager.icon_fanzhuan; 
        this.player_1.fanzhuan();
        this.player_2.fanzhuan();
        this.player_self.fanzhuan();
        var rot = 0;
        if(InGameManager.icon_fanzhuan)
        rot = 180;
        this.node_card_out_middle.children[0].rotation = rot;
        this.node_card_out_left.children[0].rotation = rot;
        this.node_card_out_right.children[0].rotation = rot;
        this.node_jiangpai.children[0].rotation = rot;
        this.node_jiangpai.children[1].rotation = rot;
    }

    jian_btn_onclick() {
        InGameManager.icon_first_name = 'pic_';
        this.set_pai_style();
        var node_buttons = this.node.getChildByName('node_buttons');
        node_buttons.getChildByName('jian_btn').active = false;
        node_buttons.getChildByName('yuan_btn').active = true;
    }

    yuan_btn_onclick() {
        InGameManager.icon_first_name = 'pai_';
        this.set_pai_style();
        var node_buttons = this.node.getChildByName('node_buttons');
        node_buttons.getChildByName('jian_btn').active = true;
        node_buttons.getChildByName('yuan_btn').active = false;
    }

    set_pai_style(){
        this.player_1.sort_node_xi();
        this.player_1.set_data_shou(this.player_1.data_shou);
        this.player_1.sort_node_out();

        this.player_2.sort_node_xi();
        this.player_2.set_data_shou(this.player_2.data_shou);
        this.player_2.sort_node_out();

        this.player_self.sort_node_xi();
        this.player_self.set_data_shou(this.player_self.data_shou);
        this.player_self.sort_node_out();

        this.set_middle_data(this.data_middle_card);     
        this.set_jiangpai_data(this.data_jiangpai);
    }

    putongpaixu_btn_onclick() {

    }

    GPS_btn_onclick() {
        if(this.player_self.getState() == State.IN_GAME)
        {
            this.gps.show();
        }
    }

    menu_btn_hide() {
        Global.soundmanager.play_button_click();
        this.node_menu.active = false;
    }

    dismiss_game_btn_onclick(){
        ServerConnection.svc_send(CLIENT_MSG.CM_DISMISS_GAME,{});
        this.node_menu.active = false;
    }

    leave_room_btn_onclick(){
        ServerConnection.svc_send(CLIENT_MSG.CM_LEAVE_ROOM,{});
        ServerConnection.svc_closePlatform();
        this.node_menu.active = false;
    }

    //1：文字  2：图片 3：音乐 4：视频 5：网页
    invite_btn_onclick() {
        var description = Global.nickname+"邀请你对战，"+this.node_room_info.string+";共"+ this.room_jushu_max+"局";
        var title = "人人南通长牌" + " " + this.node_room_id.string;
        window.callStaticMethod(3,{type:2, title:title,description:description,message:description,scene:0,url:"http://www.baidu.com"});
    }

    play_btn_onclick() {
        console.log('play_btn on click');
        ServerConnection.svc_send(CLIENT_MSG.CM_READY_GAME, { state: State.IN_READY });
    }

    chupai_btn_onclick() {
        console.log('chupai_btn on click');
        if (this.current_player == this.player_self) {
            this.player_self.auto_chupai();
        }
        this.hide_buttons();
    }

    peng_btn_onclick() {
        console.log('peng_btn on click');
        ServerConnection.svc_send(CLIENT_MSG.CM_RESPON_CHU_PAI, { type: PaiMessageResponse.RESULT_PENG });
        this.hide_buttons();
    }

    gang_btn_onclick() {
        console.log('gang_btn on click');
        ServerConnection.svc_send(CLIENT_MSG.CM_RESPON_CHU_PAI, { type: PaiMessageResponse.RESULT_GANG });
        this.hide_buttons();
    }

    hu_btn_onclick() {
        console.log('hu_btn on click');
        Global.soundmanager.play_sound('hu');
        ServerConnection.svc_send(CLIENT_MSG.CM_RESPON_CHU_PAI, { type: PaiMessageResponse.RESULT_HU });
        this.hide_buttons();
    }

    guo_btn_onclick() {
        console.log('guo_btn on click');
        ServerConnection.svc_send(CLIENT_MSG.CM_RESPON_CHU_PAI, { type: PaiMessageResponse.RESULT_NONE });
        if (this.current_player == this.player_self) {
            if (this.time.getTimeLeft() >= 0) {
                this.time.setCallBack(this.auto_chupai);
                this.player_self.can_move = true;
            }
            else {
                //this.auto_chupai();
            }
        }
        this.hide_buttons();
    }

    hide_buttons() {
        this.show_order_btns([]);
    }

    maizhuang_btn_onclick() {
        console.log('maizhuang on click');
        this.set_start_game_msg(this.data_orgin);
        ServerConnection.svc_send(CLIENT_MSG.CM_MAI_ZHUANG, { maizhuang: true });
        this.hide_maizhuang();
    }

    bumaizhuang_btn_onclick() {
        console.log('bumaizhuang on click');
        this.set_start_game_msg(this.data_orgin);
        ServerConnection.svc_send(CLIENT_MSG.CM_MAI_ZHUANG, { maizhuang: false });
        this.hide_maizhuang();
    }

    hide_maizhuang() {
        this.node_maizhuang_buttons.active = false;
    }


    set_node_count_label(value) {
        this.node_count_label.string = value;
    }

    set_jiangpai_data(data: Array<number>) {
        this.data_jiangpai = data;
        if (data == null || data.length == 0)
            this.node_jiangpai.active = false;
        else {
            var len = this.node_jiangpai.children.length;
            var index = 0;
            for (var i = 0; i < len; i++) {
                var node = this.node_jiangpai.children[i];
                if (index < data.length) {
                    var pai = Global.common.get_pai(data[index]);
                    this.set_card_data(node, pai);
                    node.active = true;
                }
                else {
                    node.active = false;
                }
                index++;
            }
            this.node_jiangpai.active = true;
        }
    }

    set_middle_data(data: any) {
        if (data == null) {
            this.data_middle_card = null;
            this.node_card_out_middle.active = false;
        }
        else {
            this.data_middle_card = data;
            var pai = Global.common.get_pai(data.value);
            this.set_card_data(this.node_card_out_middle, pai);
            this.node_card_out_middle.active = true;
        }
    }



    public set_card_data(node: cc.Node, data: any) {
        var icon_name = this.get_card_icon_name(data.type, data.value);
        var frame = InGameManager.instance.pai_atlas.getSpriteFrame(icon_name);
        var sprite = node.getComponent(cc.Sprite);
        if (sprite != null)
            sprite.spriteFrame = frame;
        var children = node.children;
        for (var i = 0; i < children.length; i++) {
            sprite = children[i].getComponent(cc.Sprite);
            if (sprite != null)
                sprite.spriteFrame = frame;
            if (children[i].childrenCount > 0) {
                children[i].children[0].active = data.tag == InGameManager.instance.data_new_card;
            }
            children[i].active = i < data.count;
        }
    }

    get_card_icon_name(type, value) {
        if (type <= 3) {
            return InGameManager.icon_first_name + type.toString() + value.toString();
        }
        else if (type == 4) {
            return InGameManager.icon_first_name + "41";
        }
        else if (type == 5) {
            return InGameManager.icon_first_name + "42";
        }
        else if (type == 6) {
            return InGameManager.icon_first_name + "43";
        }
        else {
            return InGameManager.icon_first_name + "4" + (value + 3).toString();
        }
    }

    getPlayerByID(value: string) {
        if (this.player_1.get_uid() == value)
            return this.player_1;
        else if (this.player_2.get_uid() == value)
            return this.player_2;
        else if (this.player_self.get_uid() == value)
            return this.player_self;
    }



    on_huanpai_msg(json) {
        if (json.error) {
            Global.messagebox.create_box(json.error);
            return;
        }
        var player = this.getPlayerByID(json.uid);
        player.set_data_di(json.di);
        if (json.shou) {
            player.set_data_shou(json.shou);
            if (json.uid = Global.uid)
                this.check_data_shou(player, player.get_data_shou());
        }
    }

    on_ready_game_msg(json) {
        if (json.error) {
            Global.messagebox.create_box(json.error);
            return;
        }
        var player = this.getPlayerByID(json.uid)
        player.setState(State.IN_READY);
        player.set_prepare();
        if (player.get_uid() == Global.uid) {
            if (json.state == State.IN_READY.toString())
                this.show_game_btns([]);
            else
                this.show_game_btns([0,1]);
        }
    }


    show_maizhuang(json) {
        if (json.error) {
            Global.messagebox.create_box(json.error);
            return;
        }
        this.data_orgin = json;

        this.show_game_btns([]);
        this.set_node_count_label(json.size2);
        this.set_jiangpai_data(json.jiang);

        var player = this.getPlayerByID(json.uid);
        var list = json.shou;
        var list_temp = [];
        for (var i = 0; i < 5; i++) {
            list_temp.push(list[i]);
        }
        player.set_data_shou(list_temp);
        this.node_maizhuang_buttons.active = true;
    }


    on_start_game_msg(json) {
        if (json.error) {
            Global.messagebox.create_box(json.error);
            return;
        }

        this.dismiss_game_button.active =true;
        this.leave_room_button.active = false;

        this.player_1.setState(State.IN_GAME);
        this.player_2.setState(State.IN_GAME);
        this.player_self.setState(State.IN_GAME);

        this.player_1.set_prepare();
        this.player_2.set_prepare();
        this.player_self.set_prepare();

        this.show_maizhuang(json);

        this.broadcast_location();
    }

    broadcast_location(){
        if(Global.location!=null)
        {
            var msg = {
                location:Global.location,
                latitude:Global.latitude,
                longitude:Global.longitude,
              //  radius:Global.radius
            }
            ServerConnection.svc_send(CLIENT_MSG.CM_BROADCAST,{type:3,msg:msg}); 
        }
        else
        {
            Global.log("Global.location = null");
        }
        
    }

    set_start_game_msg(json) {
        var player = this.getPlayerByID(json.uid);
        this.show_game_btns([]);
        this.set_node_count_label(json.size2);
        this.set_jiangpai_data(json.jiang);
        var list = json.shou;
        var num = list.length;
        this.check_data_shou(player, list);
        if (player == this.player_self) {
            this.player_1.set_num(num);
            this.player_2.set_num(num);
            this.player_self.set_num(num);
        }
    }

    check_data_shou(player, list) {
        var len = list.length;
        var data_xipai = [];
        for (var i = 0; i < len; i++) {
            if (list[i] > 120) {
                data_xipai.push(list[i]);
            }
        };

        if (data_xipai.length > 0) {
            ServerConnection.svc_send(CLIENT_MSG.CM_HUAN_PAI, data_xipai);
            return;
        };

        player.set_data_shou(list);
        if (this.current_player == this.player_self) {
            var bts = [];
            if (player.check_hu())
                bts.push(3);
            if (player.check_gang_list())
                bts.push(2);
            if (bts.length > 0) {
                bts.push(4);
                this.time.setCallBack(this.guo_btn_onclick);
                this.show_order_btns(bts);
                this.player_self.can_move = false;
            }
            else
                this.guo_btn_onclick();
        }
        else {
            this.guo_btn_onclick();
        }
    }


    on_mopai_msg(json) {
        if (json.error) {
            Global.messagebox.create_box(json.error);
            return;
        }
        var player = this.getPlayerByID(json.uid);
        this.current_player = player;
        this.set_time(player, this.auto_chupai);
        if (json.uid == Global.uid) {
            var value = json.pai;
            this.data_new_card = value;
            player.push_data_shou(value);
            player.can_move = true;
            this.check_data_shou(player, player.get_data_shou());
        }
        else {

        }
        player.set_num(json.size1);
        this.set_node_count_label(json.size2);
    }

    set_time(player, callback) {
        if (player == this.player_1) {
            this.time.setPostion(1);
            this.time.setTime(16, null);
        }
        else if (player == this.player_2) {
            this.time.setPostion(2);
            this.time.setTime(16, null);
        }
        else if (player == this.player_self) {
            this.time.setPostion(3);
            this.time.setTime(16, callback);
        }
        else {
            this.time.clearTime();
        }
    }

    clear_time() {
        this.time.clearTime();
    }

    on_chupai_msg(json) {
        if (json.error) {
            Global.messagebox.create_box(json.error);
            return;
        }
        this.clear_time();
        var player = this.getPlayerByID(json.uid);
        if (json.uid != Global.uid) {
            this.start_card_animation(json.uid, json.pai);
            player.set_num(json.size1);
            var list = [];
            var data_shou = this.player_self.get_data_shou();
            for (var i = 0; i < data_shou.length; i++) {
                list.push(data_shou[i]);
            }
            list.push(json.pai);

            var bts = [];
            if (this.player_self.check_hu(list))
                bts.push(3);
            if (this.player_self.check_gang(json.pai))
                bts.push(2);
            if (this.player_self.check_peng(json.pai))
                bts.push(1);
            if (bts.length > 0) {
                bts.push(4);
                this.set_time(this.player_self, this.guo_btn_onclick);
                this.show_order_btns(bts);
            }
            else
                this.guo_btn_onclick();
        }
        else {
            this.data_new_card = null;
            player.set_data_shou(json.shou);
            player.set_num(json.shou.length);
            ServerConnection.svc_send(CLIENT_MSG.CM_RESPON_CHU_PAI, { type: PaiMessageResponse.RESULT_NONE });
        }

        if (this.data_middle_card != null) {
            var player = this.getPlayerByID(this.data_middle_card.uid);
            player.push_data_out(this.data_middle_card.value);
            this.set_middle_data(null);
        }
    }



    start_card_animation(uid, value) {
        var self = this;
        var player = this.getPlayerByID(uid);
        var node = null;
        var start_pos = null;
        var start_rot = null;
        if (player == this.player_1) {
            node = this.node_card_out_left;
            start_pos = cc.p(-620, -126);
            start_rot = 65;
        }
        else if (player == this.player_2) {
            node = this.node_card_out_left;
            start_pos = cc.p(620, -126);
            start_rot = -65;
        }
        else
            return;

        self.set_middle_data(null);
        var pai = Global.common.get_pai(value);
        self.set_card_data(node, pai);
        node.x = start_pos.x;
        node.y = start_pos.y;
        node.rotation = start_rot;
        node.active = true;
        var finish = cc.callFunc(function () {
            node.active = false;
            node.x = start_pos.x;
            node.y = start_pos.y;
            self.set_middle_data({ uid: uid, value: value });
        }, this);
        var action = cc.sequence(cc.moveTo(0.3, cc.p(0, 135)), cc.rotateTo(0.3, 0), finish);
        node.runAction(action);
    }

    on_leave_room_msg(json)
    {
        if (json.error) {
            Global.messagebox.create_box(json.error);
            return;
        }
        var player = this.getPlayerByID(json.uid);
        player.set_info(null);
        player.init();
    }


    on_gangpai_msg(json) {
        if (json.error) {
            Global.messagebox.create_box(json.error);
            return;
        }
        var player = this.getPlayerByID(json.uid);
        player.set_data_di(json.di);
        if (json.uid == Global.uid) {
            player.set_data_shou(json.shou);
            player.set_num(json.shou.length);
            this.hide_buttons();
        }
        else {
            player.set_num(json.size1);
        }
        this.set_middle_data(null);
    }


    on_pengpai_msg(json) {
        if (json.error) {
            Global.messagebox.create_box(json.error);
            return;
        }
        var player = this.getPlayerByID(json.uid);
        this.current_player = player;
        this.set_time(player, this.auto_chupai);
        player.set_data_di(json.di);
        if (json.uid == Global.uid) {
            player.set_data_shou(json.shou);
            player.set_num(json.shou.length);
            this.hide_buttons();
            player.can_move = true;
        }
        else {
            player.set_num(json.size1);
        }
        this.set_middle_data(null);
    }

    on_hupai_msg(json) {
        if (json.error) {
            Global.messagebox.create_box(json.error);
            return;
        }
        this.clear_time();
        this.hide_buttons();
        this.balance.set_hupai_data(json);
    }


    on_balance_msg(json) {
        if (json.error) {
            Global.messagebox.create_box(json.error);
            return;
        }

        this.player_1.setState(State.IN_BLANCE);
        this.player_2.setState(State.IN_BLANCE);
        this.player_self.setState(State.IN_BLANCE);

        if (json.score) {
            this.result.set_result_data(json);
            this.result.show_result();
        }
        else {
            this.balance.set_balance_data(json);
            this.balance.show_balance();
        }
    }

    on_maizhuang_msg(json) {
        var player = this.getPlayerByID(json.uid);
        player.set_maizhuang(json.maizhuang);
    }

    on_broadcast_msg(json){
        if (json.error) {
            Global.messagebox.create_box(json.error);
            return;
        }
        var player = this.getPlayerByID(json.uid);
        var msg = json.msg;
        if(msg!=null)
        {
            switch(msg.type)
            {
                case 1 :
                {
                    var index = msg.msg;
                    var temp = index + 19;
                    Global.soundmanager.play_sound2('putong_'+temp.toString());
                    player.add_talk_msg(this.chat.talk_string[index]);
                }
                break;
                case 2 :
                {
                    player.add_talk_msg(decodeURIComponent(msg.msg));
                }
                break;
                case 3:
                {
                    player.location = msg.msg;
                }
            }
        }
    } 

    dismiss_room_box = null;
    on_dismiss_game_msg(json){
        var player = this.getPlayerByID(json.uid);
        if(player!=null)
        {
            var text = "玩家 " + player.data_info.info.nick + " 申请解散房间，请问是否同意？（倒计时结束未选择，则默认同意解散）";
            this.dismiss_room_box = Global.messagebox.create_box_confirm(text,function(ret){
                ServerConnection.svc_send(CLIENT_MSG.CM_DISMISS_GAME,{dismiss:ret});
            });
        }
        
    }

    on_dismiss_game_result_msg(json){
        if(!json.dismiss)
        {
            if(this.dismiss_room_box!=null)
            {
                this.dismiss_room_box.destroy();
            }
            var text = "解散房间失败。";
            Global.messagebox.create_box(text);
        }
    }


    auto_chupai() {
        if (InGameManager.instance == null)
            return;
        var self = InGameManager.instance;
        if (self.current_player == self.player_self)
            self.player_self.auto_chupai();
    }


    public check_pai_same(value) {
        this.player_1.check_pai_same(value);
        this.player_2.check_pai_same(value);
        this.player_self.check_pai_same(value);
    }



    



    // update (dt) {},
}
