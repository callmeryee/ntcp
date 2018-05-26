
//const i18n = require('i18n');
//i18n.init('zh');
var server_connection = require("ServerConnection");
cc.Class({
	extends: cc.Component,

	properties: {

		player_name:cc.Label,
		head_icon:cc.Sprite,
		player_id:cc.Label,
		diamond_label:cc.Label,
		gold_label:cc.Label,

		create_room_btn : cc.Button,
		enter_room_btn : cc.Button,
		gold_room_btn: cc.Button,

		rule_btn:cc.Button,
		setting_btn:cc.Button,
		back_btn:cc.Button,

		create_table:cc.Node,
		enter_room_table:cc.Node,
		rule_table:cc.Node,
		setting_table:cc.Node,

	},


	setLobbyInfo(){
		this.player_name.string = Global.nickname;
		this.setMoney();	
		Global.setIcon(Global.headimgurl,this.head_icon);
	},

	setMoney(){
		this.diamond_label.string = Global.diamond;
		this.gold_label.string = Global.gold;
	},

	onLoad () {
		Global.lobby = this;
		this.reset();
		this.setLobbyInfo();
	},

	reset:function(){
    	this.create_table.active = false;
	},

	start () {
		Global.soundmanager.play_music();
	},


    create_room_btn_onclick:function(){
		Global.soundmanager.play_button_click();
		Global.appear_action(this.create_table);
	},

	enter_room_btn_onclick:function(){
		Global.soundmanager.play_button_click();
		Global.appear_action(this.enter_room_table);
	},

	record_btn_onclick:function(){		
		Global.soundmanager.play_button_click();
		cc.director.loadScene("record");
	},

	rule_btn_onclick:function(){
		Global.soundmanager.play_button_click();
		this.rule_table.active = true;
	},

	set_btn_onclick:function(){
		Global.soundmanager.play_button_click();
        this.setting_table.active = true;
	},

	back_btn_onclick:function(){
		Global.soundmanager.play_button_click();
		cc.director.loadScene("login");
	},


	// update (dt) {},
});
