
//const i18n = require('i18n');
//i18n.init('zh');
var server_connection = require("ServerConnection");
cc.Class({
	extends: cc.Component,

	properties: {

		player_name:cc.Label,
		player_id:cc.Label,

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


	onLoad () {
	    Global.lobby = this;
		this.reset();
	},

	reset:function(){
    	this.create_table.active = false;
	},

	start () {
		Global.soundmanager.play_music();
	},


    create_room_btn_onclick:function(){
		Global.appear_action(this.create_table);
	},

	enter_room_btn_onclick:function(){
		Global.appear_action(this.enter_room_table);
	},

	record_btn_onclick:function(){
		
       // server_connection.load_record();
	},

	rule_btn_onclick:function(){
		this.rule_table.active = true;
	},

	set_btn_onclick:function(){
        this.setting_table.active = true;
	},

	back_btn_onclick:function(){
		cc.director.loadScene("login");
	},


	// update (dt) {},
});
