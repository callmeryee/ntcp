
//const i18n = require('i18n');
//i18n.init('zh');
cc.Class({
	extends: cc.Component,

	properties: {

		player_name: cc.Label,
		head_icon: cc.Sprite,
		player_id: cc.Label,
		diamond_label: cc.Label,
		gold_label: cc.Label,

		create_room_btn: cc.Button,
		enter_room_btn: cc.Button,
		gold_room_btn: cc.Button,

		kefu_btn: cc.Button,
		rule_btn: cc.Button,
		setting_btn: cc.Button,
		back_btn: cc.Button,

		create_table: cc.Node,
		enter_room_table: cc.Node,
		rule_table: cc.Node,
		setting_table: cc.Node,
		kefu_table: cc.Node,
		record_table: cc.Node,

	},


	setLobbyInfo() {
		this.player_name.string = Global.nickname;
		this.player_id.string = "ID:" + Global.guid;
		this.setMoney();
		Global.setIcon(Global.headimgurl, this.head_icon);
	},

	setMoney() {
		this.diamond_label.string = Global.diamond;
		this.gold_label.string = Global.gold;
	},

	onLoad() {
		window.callStaticMethod(0, 'cocosLog:lobby onloaded');
		Global.lobby = this;
		this.reset();
		this.setLobbyInfo();
	},

	reset: function () {
		this.create_table.active = false;
	},

	start() {
		Global.soundmanager.play_music();
	},


	create_room_btn_onclick: function () {
		Global.soundmanager.play_button_click();
		if (ServerConnection.svc_websocket == null) {
			ServerConnection.svc_connectPlatform();
		}
		else
			ServerConnection.check_in_room();
		this.create_table.getComponent('CreateTable').show();
	},

	enter_room_btn_onclick: function () {
		Global.soundmanager.play_button_click();
		if (ServerConnection.svc_websocket == null) {
			ServerConnection.svc_connectPlatform();
		}
		else
			ServerConnection.check_in_room();
		Global.appear_action(this.enter_room_table);

	},


	record_btn_onclick: function () {
		Global.soundmanager.play_button_click();
		this.record_table.getComponent('RecordTable').show();
	},

	rule_btn_onclick: function () {
		Global.soundmanager.play_button_click();
		this.rule_table.active = true;
	},

	kefu_btn_onclick: function () {
		Global.soundmanager.play_button_click();
		this.kefu_table.active = true;
	},

	set_btn_onclick: function () {
		Global.soundmanager.play_button_click();
		this.setting_table.active = true;
	},

	back_btn_onclick: function () {
		Global.soundmanager.play_button_click();
		Global.loadScene("login");
	},

	deal_record: function (json) {
		this.record_table.getComponent('RecordTable').deal_record(json);
	}


	// update (dt) {},
});
