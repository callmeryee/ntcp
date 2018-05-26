import Player from "./Player";
import { stat } from "fs";
import BalanceManager from "./BalanceManager";
import TimeManager from "./TimeManager";
import ResultManager from "./ResultManager";

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

    node_game_buttons: cc.Node = null;
    node_maizhuang_buttons:cc.Node = null;
    node_order_buttons: cc.Node = null;
    node_card_out_middle: cc.Node = null;
    node_card_out_left: cc.Node = null;
    node_card_out_right: cc.Node = null;
    node_jiangpai: cc.Node = null;
    node_count_label: cc.Label = null;
    node_room_id: cc.Label = null;

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

    // LIFE-CYCLE CALLBACKS:
    
    wait_time = 5;
    timer:number = 0;
    index:number = 0;
    pause:boolean = true;
    is_new:boolean = false;

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

        this.time = node_body.getChildByName('node_time').getComponent('TimeManager');

    }

    start () {
        this.load_record();
    }
 
    onDestroy(){
        RecordManager.instance = null;
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
        var icon_name = this.get_card_icon_name(data.type, data.value);
        var frame = RecordManager.instance.pai_atlas.getSpriteFrame(icon_name);
        var sprite = node.getComponent(cc.Sprite);
        if (sprite != null)
            sprite.spriteFrame = frame;
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
        for(var i = 0;i<len;i++){
            var data = player[i];
            if(i==0)
            {
               this.player_self.set_uid(data[0]);
               this.player_self.set_openid(data[1]);
            }
            else if(i==1){
                this.player_2.set_uid(data[0]);
                this.player_2.set_openid(data[1]);
            }
            else if(i==2){
                this.player_1.set_uid(data[0]);
                this.player_1.set_openid(data[1]);
            }
        }
        this.player_self.init2();
        this.player_1.init2();
        this.player_2.init2();
    }



    load_record() {
        var self = this;
        this.pause = true;
        this.index = 0;
        this.init_game();
        cc.loader.loadRes('record/record.text', function (error, obj) {
            var temp = obj.toString();
            self.record_data = temp.split('\n');
            self.switch_record();
            self.pause = false;
        });
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
            var end = temp.length - 2;
            temp = temp.substring(start, end);
            start = temp.indexOf(',') + 1;
            end = temp.length;
            var type = Number.parseInt(temp.substring(0, start - 1));
            var msg = temp.substring(start, end);
            this.onMessage(type,msg);
        }
    }

    switch_record(){
        this.get_record(this.index);
        this.index++;
    }

    onMessage(type,msg){
        var json = JSON.parse(msg);
        console.log(type,json);
        switch(type)
        {
            case 0:
            this.timer = 0;   
            break;
            case 2:
            this.timer = 0;
            break;

            case 3:
            this.set_start_game_msg(json);
            break;

            case 4:
            this.on_mopai_msg(json);
            break;

            case 5:
            this.on_chupai_msg(json);
            break;

            case 6:
            this.on_huanpai_msg(json);
            break;

            case 7:
            this.on_pengpai_msg(json);
            break;

            case 8:
            this.on_gangpai_msg(json);
            break;

            case 9:
            this.on_hupai_msg(json);
            break;

            case 10:
            this.on_balance_msg(json);
            break;

        }
    }

    on_balance_msg(json) {
        if(json.score)
        {
        this.result.set_result_data(json);
        this.result.show_result();
        }
        else
        {
        this.balance.set_balance_data(json);
        this.balance.show_balance();
        }
    }


    on_hupai_msg(json) {
        this.clear_time();
        this.balance.set_hupai_data(json);
        this.timer = 0;
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
        var player = this.getPlayerByID(json.uid);
        this.player_1.set_prepare(false);
        this.player_2.set_prepare(false);
        this.player_self.set_prepare(false);
        this.show_game_btns([]);
        var list = json.shou;
        var num = list.length;
        player.set_data_shou(list);
        player.set_num(num);
        this.set_node_count_label(json.size2);
        this.set_jiangpai_data(json.jiang);
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
