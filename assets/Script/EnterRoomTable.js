
var server_connection = require("ServerConnection");
cc.Class({
    extends: cc.Component,

    properties: {
        values:[],
        value_label:cc.Label,
        keybord_node:cc.Node,
        keybords:[cc.Node],
        close_btn:cc.Button,
    },


    start () {
        this.keybords = this.keybord_node.children;
        for(var i =0;i<this.keybords.length;i++)
        {
            if(i==9)
            {
                this.keybords[i].on(cc.Node.EventType.TOUCH_START, function (event) {
                    this.clear_onclick();
                },this);
            }
            else if(i==11)
            {
                this.keybords[i].on(cc.Node.EventType.TOUCH_START, function (event) {
                    this.del_onclick();
                },this);
            }
            else
            {
                var data = i==10?"0":(i+1).toString();
                this.keybords[i].name = data;
                this.keybords[i].on(cc.Node.EventType.TOUCH_START, function (event) {
                    this.num_onclick(event.target.name);
                },this);
            }
        }
        this.clear_onclick();
    },

    close:function () {
        Global.disappear_action(this.node);
    },

    num_onclick:function(num){
        if(this.values.length<6)
        {
            var len = this.values.length;
            this.values[len] = num;
            var text = "";
            for(var i = 0;i<len+1;i++)
            {
                text += this.values[i].toString();
            }
            this.value_label.string = text;
            if(len+1 == 6)
            {
                Global.room_uid = text;
                server_connection.enter_room();
            }
        }
    },


    clear_onclick:function(){
        this.values = [];
        this.value_label.string = "";          
    },

    del_onclick:function(){
        var len = this.values.length;
        if(len>0)
        {
            this.values.splice(len-1,1);
            var text = "";
            for(var i = 0;i<len-1;i++)
            {
                text += this.values[i].toString();
            }
            this.value_label.string = text;
        }
    },

});
