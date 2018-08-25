import Player from "./Player";
import { stat } from "fs";
import BalanceManager from "./BalanceManager";
import TimeManager from "./TimeManager";
import ResultManager from "./ResultManager";
import GlobalStatic from "../GlobalStatic";

// Learn TypeScript:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/typescript/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class RecordManager extends cc.Component {

    @property(cc.SpriteAtlas)
    public pai_atlas: cc.SpriteAtlas = null;

    record_data: any = null;

    public static instance: RecordManager = null;
    public static icon_first_name = 'pic_';
    public static icon_fanzhuan = false;

    node_game_buttons: cc.Node = null;
    node_maizhuang_buttons:cc.Node = null;
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

    player_1: Player = null;
    player_2: Player = null;
    player_self: Player = null;

    current_player: Player = null;

    public data_jiangpai: any = null;
    public data_new_card: any = null;
    public data_middle_card: any = null;
    data_orgin:any = null;

    balance: BalanceManager = null;
    result:ResultManager = null;

    time: TimeManager = null;

    room_jushu_max = null;
    room_jushu_current = null;

    // LIFE-CYCLE CALLBACKS:
    wait_time = 5;

    timer:number = 0;
    index:number = 0;
    pause:boolean = true;
    is_new:boolean = false;
    is_speed_up = false;

    last_msg_type = null;

    update (dt) {
       if(this.pause)
       return;
       if(this.timer>0)
       {
           this.timer -= dt;
       }
       else
       {
           this.timer = this.wait_time;
           this.switch_record();
       }
    }



    onLoad () {
        RecordManager.instance = this;

        this.node_menu = this.node.getChildByName('node_menu');

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
            this.menu_btn_onclick()
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

        var speedup_btn = this.node.getChildByName('speed_up');

        speedup_btn.on(cc.Node.EventType.TOUCH_START,function(event){
            this.wait_time = 1; 
            this.is_speed_up = true; 
            this.timer = 0.5;  
            console.log('speed up = true') ;   
        },this);

        speedup_btn.on(cc.Node.EventType.TOUCH_END,function(event){
            this.wait_time = 5;  
            this.is_speed_up = false;      
            console.log('speed up = false') ;
        },this);

        speedup_btn.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
            this.wait_time = 5;  
            this.is_speed_up = false;     
            console.log('speed up = false') ; 
        },this);

        var putongpaixu_btn = node_buttons.getChildByName('putongpaixu_btn');
        putongpaixu_btn.on('click', function (event) {
            this.putongpaixu_btn_onclick();
        }, this);

        this.time = node_body.getChildByName('node_time').getComponent('TimeManager');

    }


    start () {
        this.yuan_btn_onclick();
        this.load_record();
    }
 
    onDestroy(){
        RecordManager.instance = null;
        window.callStaticMethod(0, 'cocosLog:RecordManager destroy');
    }
    
    init_game() {
        this.node_room_id.string = "";
        this.init_player();
        this.resetGame();
    }

    resetGame(){
        this.hide_maizhuang();
        this.balance.hide_balance();
        this.result.hide_result();
        this.set_time(null, null);
        this.set_node_count_label(0);
        this.set_jiangpai_data(null);
        this.set_middle_data(null);
        this.show_game_btns([0, 1]);
        this.show_order_btns([]);
        this.clear_player();
        this.set_jushu();
        if(!this.is_speed_up)
        this.wait_time = 5;
        else
        this.wait_time = 1;
    }

    init_room_info() {
        this.node_room_info.string = '';
        return;
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

    set_jushu() {
        if (this.room_jushu_current == null) {
            this.node_room_jushu.string = '';
        }
        else {
            if (this.room_jushu_current > this.room_jushu_max) {
                this.room_jushu_current = this.room_jushu_max;
                this.node_room_jushu.string = '局数' + this.room_jushu_current + '/' + this.room_jushu_max;
            }
        }

    }

    menu_btn_onclick() {
        console.log('menu_btn on click');
        Global.soundmanager.play_button_click();
        this.node_menu.active = true;
    }

    hide_maizhuang(){
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

    public set_card_data(node: cc.Node, data: any) {

        if(data == null)
        {
            var sprite = node.getComponent(cc.Sprite);
            if (sprite != null)
            {
                sprite.enabled = false;
            }
            var children = node.children;
            for (var i = 0; i < children.length; i++) {        
                children[i].active = false;
            }
        }
        else
        {
            var icon_name = this.get_card_icon_name(data.type, data.value);
            var frame = RecordManager.instance.pai_atlas.getSpriteFrame(icon_name);
            var sprite = node.getComponent(cc.Sprite);
            if (sprite != null)
            {
                sprite.enabled = true;
                sprite.spriteFrame = frame;
            }
            var children = node.children;
            for (var i = 0; i < children.length; i++) {
                sprite = children[i].getComponent(cc.Sprite);
                if (sprite != null)
                    sprite.spriteFrame = frame;
                if (children[i].childrenCount > 0) {
                    children[i].children[0].active = data.tag == RecordManager.instance.data_new_card;
                }
                children[i].active = i < data.count;
            }
        }
       
    }

    get_card_icon_name(type, value) {
        if (type <= 3) {
            return RecordManager.icon_first_name + type.toString() + value.toString();
        }
        else if (type == 4) {
            return RecordManager.icon_first_name + "41";
        }
        else if (type == 5) {
            return RecordManager.icon_first_name + "42";
        }
        else if (type == 6) {
            return RecordManager.icon_first_name + "43";
        }
        else {
            return RecordManager.icon_first_name + "4" + (value + 3).toString();
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

    init_player() {
        this.player_1.reset();
        this.player_2.reset();
        this.player_self.reset();
    }

    clear_player(){
        this.player_1.clear();
        this.player_2.clear();
        this.player_self.clear();
    }


    set_player(json){
        var player = json.player;
        var len = player.length;
        var inJson = false;
        for(var i = 0;i<len;i++){
            var data = player[i];
            if( data[1].unionid == Global.unionid)
            {
                inJson = true;
                switch(len)
                {
                    case 1:
                    {
                        this.player_self.set_uid(data[0]);
                        this.player_self.set_unionid(data[1].unionid);
                        this.player_self.set_icon(data[1].imgurl);
                        this.player_self.set_name(data[1].nick);
                    }
                    break;
                    case 2:
                    {
                        if(i==0)
                        {
                            this.player_self.set_uid(data[0]);
                            this.player_self.set_unionid(data[1].unionid);
                            this.player_self.set_icon(data[1].imgurl);
                            this.player_self.set_name(data[1].nick);

                            var temp = player[1];
                            this.player_2.set_uid(temp[0]);
                            this.player_2.set_unionid(temp[1].unionid);
                            this.player_2.set_icon(temp[1].imgurl);
                            this.player_2.set_name(temp[1].nick);
                        }
                        else
                        {
                            this.player_self.set_uid(data[0]);
                            this.player_self.set_unionid(data[1].unionid);
                            this.player_self.set_icon(data[1].imgurl);
                            this.player_self.set_name(data[1].nick);

                            var temp = player[0];
                            this.player_1.set_uid(temp[0]);
                            this.player_1.set_unionid(temp[1].unionid);
                            this.player_1.set_icon(temp[1].imgurl);
                            this.player_1.set_name(temp[1].nick);
                        }
                    }
                    break;
                    case 3:
                    {
                        if(i==0)
                        {
                            this.player_self.set_uid(data[0]);
                            this.player_self.set_unionid(data[1].unionid);
                            this.player_self.set_icon(data[1].imgurl);
                            this.player_self.set_name(data[1].nick);

                            var temp = player[1];
                            this.player_2.set_uid(temp[0]);
                            this.player_2.set_unionid(temp[1].unionid);
                            this.player_2.set_icon(temp[1].imgurl);    
                            this.player_2.set_name(temp[1].nick);
                            
                            temp = player[2];
                            this.player_1.set_uid(temp[0]);
                            this.player_1.set_unionid(temp[1].unionid);
                            this.player_1.set_icon(temp[1].imgurl);
                            this.player_1.set_name(temp[1].nick);
                            
                        }
                        else if(i==1)
                        {
                            this.player_self.set_uid(data[0]);
                            this.player_self.set_unionid(data[1].unionid);
                            this.player_self.set_icon(data[1].imgurl);
                            this.player_self.set_name(data[1].nick);

                            var temp = player[2];
                            this.player_2.set_uid(temp[0]);
                            this.player_2.set_unionid(temp[1].unionid);
                            this.player_2.set_icon(temp[1].imgurl);
                            this.player_2.set_name(temp[1].nick);

                            temp = player[0];
                            this.player_1.set_uid(temp[0]);
                            this.player_1.set_unionid(temp[1].unionid);
                            this.player_1.set_icon(temp[1].imgurl);
                            this.player_1.set_name(temp[1].nick);

                        }
                        else
                        {
                            this.player_self.set_uid(data[0]);
                            this.player_self.set_unionid(data[1].unionid);
                            this.player_self.set_icon(data[1].imgurl);
                            this.player_self.set_name(data[1].nick);

                            var temp = player[0];
                            this.player_2.set_uid(temp[0]);
                            this.player_2.set_unionid(temp[1].unionid);
                            this.player_2.set_icon(temp[1].imgurl);
                            this.player_2.set_name(temp[1].nick);

                            temp = player[1];
                            this.player_1.set_uid(temp[0]);
                            this.player_1.set_unionid(temp[1].unionid);
                            this.player_1.set_icon(temp[1].imgurl);
                            this.player_1.set_name(temp[1].nick);

                        }
                    }
                    break;

                }
                break;
            }
        }
        if(!inJson)
        {
            Global.messagebox.create_box('记录中不存在玩家自己');
        }
        this.player_self.init2();
        this.player_1.init2();
        this.player_2.init2();
    }

    fanzhuan_btn_onclick() {
        RecordManager.icon_fanzhuan = !RecordManager.icon_fanzhuan; 
        this.player_1.fanzhuan();
        this.player_2.fanzhuan();
        this.player_self.fanzhuan();
        var rot = 0;
        if(RecordManager.icon_fanzhuan)
        rot = 180;
        this.node_card_out_middle.children[0].rotation = rot;
        this.node_card_out_left.children[0].rotation = rot;
        this.node_card_out_right.children[0].rotation = rot;
        this.node_jiangpai.children[0].rotation = rot;
        this.node_jiangpai.children[1].rotation = rot;
    }

    jian_btn_onclick() {
        RecordManager.icon_first_name = 'pic_';
        this.set_pai_style();
        var node_buttons = this.node.getChildByName('node_buttons');
        node_buttons.getChildByName('jian_btn').active = false;
        node_buttons.getChildByName('yuan_btn').active = true;
    }

    yuan_btn_onclick() {
        RecordManager.icon_first_name = 'pai_';
        this.set_pai_style();
        var node_buttons = this.node.getChildByName('node_buttons');
        node_buttons.getChildByName('jian_btn').active = true;
        node_buttons.getChildByName('yuan_btn').active = false;
    }

    menu_btn_hide() {
        Global.soundmanager.play_button_click();
        this.node_menu.active = false;
    }

    leave_room_btn_onclick(){
        Global.leave_room();
        this.node_menu.active = false;
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

    }

    continue_btn_onclick(){
        this.timer = 0;
    }


    load_record() {

        // //测试
        // {
        //     var self = this;
        //     this.pause = true;
        //     this.index = 0;
        //     this.init_game();
        //     cc.loader.loadRes('record/record.text', function (error, obj) {
        //         var temp = obj.toString();
        //         Global.record_data=temp;        
        //             var temp = Global.record_data;
        //             self.record_data = temp.split('\n');
        //             self.switch_record();
        //             self.pause = false;
        //             Global.record_data = null;
                
        //     }); 
        //     return;
        // }    

        var self = this;
        this.pause = true;
        this.index = 0;
        this.init_game();
        if(Global.record_data!=null)
        {
            var temp = Global.record_data;
            self.record_data = temp.split('\n');
            self.switch_record();
            self.pause = false;
            Global.record_data = null;
            this.init_room_info();
        }
    }
 

    get_record(index: number) {
        if (this.record_data == null || index >= this.record_data.length)
            return;
        var temp = this.record_data[index];
        if (temp == ""||temp.length<=2)
        {
            this.timer = 0;
            return;
        }
        if(index==0)
        {
            temp = '{"player":'+temp+'}';
            var json = JSON.parse(temp);
            console.log('start',json);
            this.set_player(json);
            this.timer = 0;
        }
        else
        {
            var start = 1;
            var end = temp.length - 1;
            temp = temp.substring(start, end);
            start = temp.indexOf(',') + 1;
            end = temp.length;
            var type = Number.parseInt(temp.substring(0, start - 1));
            var msg = temp.substring(start, end);
            this.onMessage(type,msg);
            this.last_msg_type = type;

        }
    }

    switch_record(){
        this.get_record(this.index);
        this.index++;
    }


    onMessage(type,msg){
        console.log(msg);
        var json = JSON.parse(msg);
        console.log(type,json);
        switch(type)
        {
            case SERVER_MSG.SM_ENTER_ROOM:
            this.on_enter_room_msg(json);
            break;

            case SERVER_MSG.SM_START_GAME:
            this.set_start_game_msg(json);
            break;

            case SERVER_MSG.SM_MO_PAI:
            this.on_mopai_msg(json);
            break;

            case SERVER_MSG.SM_CHU_PAI:
            this.on_chupai_msg(json);
            break;

            case SERVER_MSG.SM_HUAN_PAI:
            this.on_huanpai_msg(json);
            break;

            case SERVER_MSG.SM_PENG_PAI:
            this.on_pengpai_msg(json);
            break;

            case SERVER_MSG.SM_GANG_PAI:
            this.on_gangpai_msg(json);
            break;

            case SERVER_MSG.SM_HU_PAI:
            this.on_hupai_msg(json);
            break;

            case SERVER_MSG.SM_GAME_BALANCE:
            this.on_balance_msg(json);
            break;

            case SERVER_MSG.SM_SYNC_ROOM_STATE:
            this.on_sync_room_msg(json);
            break;

            case SERVER_MSG.SM_MAI_ZHUANG:
            this.on_maizhuang_msg(json);
            break;

            default:
            this.timer = 0;
            break;

        }
    }

    on_enter_room_msg(json)
    {

        var players_data = json.clients;  

        var len = players_data.length;
        for (var i = 0; i < len; i++) {
            if (players_data[i].info.unionid == this.player_1.get_unionid()) {
                this.player_1.set_uid(players_data[i].uid);
            }
            else if (players_data[i].info.unionid == this.player_2.get_unionid()) {
                this.player_2.set_uid(players_data[i].uid);
            }
            else if (players_data[i].info.unionid == this.player_self.get_unionid()) {
                this.player_self.set_uid(players_data[i].uid);
            }

           // console.log("11111111111111111111111111111111"+ players_data[i].info.unionid+"11111111111111"+players_data[i].uid);

        }

        // console.log("11111111111111111111111111111111"+ this.player_self.get_unionid()+"11111111111111"+this.player_self.get_uid());
        // console.log("11111111111111111111111111111111"+ this.player_1.get_unionid()+"11111111111111"+this.player_1.get_uid());
        // console.log("11111111111111111111111111111111"+ this.player_2.get_unionid()+"11111111111111"+this.player_2.get_uid());

        this.timer = 0;  

    }

    on_maizhuang_msg(json)
    {
        var player = this.getPlayerByID(json.uid);
        player.set_maizhuang(json.maizhuang);
        this.timer = 0;
    }

    on_balance_msg(json) {
        if (this.last_msg_type != 10) {
            if (json.score) {
                this.result.set_result_data(json);
                this.result.show_result();
            }
            else {
                this.balance.set_balance_data(json);
                this.balance.show_balance();
            }
        }
        else {
            this.timer = 0;
        }

    }

    on_leave_room_msg(json)
    {
        var player = this.getPlayerByID(json.uid);
        player.set_info(null);
        player.init();
    }

    on_broadcast_msg(json){
        this.timer = 0;
        return;
    } 


    on_hupai_msg(json) {
        this.clear_time();
        this.balance.set_hupai_data(json);
        this.timer = 0;
        if(!this.is_speed_up)
        this.wait_time = 15;
        else
        this.wait_time = 1;
        this.is_new = true;
    }

    on_gangpai_msg(json) {
        if(json.shou)
        {
            var player = this.getPlayerByID(json.uid);
            player.set_data_di(json.di);
            player.set_data_shou(json.shou);
            player.set_num(json.shou.length);
            this.set_middle_data(null);
        }
        this.timer = 0;
    }

    on_pengpai_msg(json) {
        if(json.shou)
        {
            var player = this.getPlayerByID(json.uid); 
            this.current_player = player;
            player.set_data_di(json.di);
            player.set_data_shou(json.shou);
            player.set_num(json.shou.length);
            this.set_middle_data(null);
            this.set_time(player,null);
        }
        else
        {
            this.timer = 0;
        }
        
    }

    on_chupai_msg(json) {
        if(json.shou){
            var player = this.getPlayerByID(json.uid);
            this.data_new_card = null;
            player.chupai(json.pai);
            player.set_data_shou(json.shou);
            player.set_num(json.shou.length);
            if (this.data_middle_card != null) {
                var player = this.getPlayerByID(this.data_middle_card.uid);
                player.push_data_out(this.data_middle_card.value);
                this.set_middle_data(null);
            }
            this.clear_time();
        }
        this.timer = 0;
    }

    on_mopai_msg(json) {
        if (json.pai) {
            var player = this.getPlayerByID(json.uid);
            this.current_player = player;
            var value = json.pai;
            this.data_new_card = value;
            player.push_data_shou(value);
            player.set_data_shou(player.get_data_shou());
            player.set_num(json.size1);
            this.set_node_count_label(json.size2);
            this.set_time(player, null);
        }
        else {
           this.timer = 0;
        }
      
    }

    on_huanpai_msg(json) {
    
        var player = this.getPlayerByID(json.uid);
        player.set_data_di(json.di);
        if (json.shou) {
            player.set_data_shou(json.shou);
        }
        this.timer = 0;      
    }


    set_start_game_msg(json){
        if(this.is_new)
        {
            this.resetGame();
            this.is_new = false; 
        }

        // console.log("22222222222222222222222222"+json.uid);

        // console.log("11111111111111111111111111111111"+ this.player_self.get_unionid()+"11111111111111"+this.player_self.get_uid());
        // console.log("11111111111111111111111111111111"+ this.player_1.get_unionid()+"11111111111111"+this.player_1.get_uid());
        // console.log("11111111111111111111111111111111"+ this.player_2.get_unionid()+"11111111111111"+this.player_2.get_uid());

        var player = this.getPlayerByID(json.uid);
        this.player_1.set_prepare();
        this.player_2.set_prepare();
        this.player_self.set_prepare();
        this.show_game_btns([]);
        var list = json.shou;
        var num = list.length;
        player.set_data_shou(list);
        player.set_num(num);
        this.set_node_count_label(json.size2);
        this.set_jiangpai_data(json.jiang);
        this.timer = 0;  
    }

    on_sync_room_msg(json){

        var players_data = json.players;  

        var len = players_data.length;
        for (var i = 0; i < len; i++) {
            if (players_data[i].info.unionid == this.player_1.get_unionid()) {
                this.player_1.set_uid(players_data[i].uid);
            }
            else if (players_data[i].info.unionid == this.player_2.get_unionid()) {
                this.player_2.set_uid(players_data[i].uid);
            }
            else if (players_data[i].info.unionid == this.player_self.get_unionid()) {
                this.player_self.set_uid(players_data[i].uid);
            }

           // console.log("11111111111111111111111111111111"+ players_data[i].info.unionid+"11111111111111"+players_data[i].uid);


        }

        // console.log("11111111111111111111111111111111"+ this.player_self.get_unionid()+"11111111111111"+this.player_self.get_uid());
        // console.log("11111111111111111111111111111111"+ this.player_1.get_unionid()+"11111111111111"+this.player_1.get_uid());
        // console.log("11111111111111111111111111111111"+ this.player_2.get_unionid()+"11111111111111"+this.player_2.get_uid());

        this.timer = 0;  

    }


    getPlayerByID(value: string) {
        if (this.player_1.get_uid() == value)
            return this.player_1;
        else if (this.player_2.get_uid() == value)
            return this.player_2;
        else if (this.player_self.get_uid() == value)
            return this.player_self;
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
        else
        {
            this.time.clearTime();
        }
    }

    clear_time() {
        this.time.clearTime();
    }

  
}
