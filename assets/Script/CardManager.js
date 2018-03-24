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
cc.Class({
    extends: cc.Component,

    properties: {

        data_shoupai:null,
        data_out:null,
        data_xipai:null,
        data_dipai:null,

        pai_list_out:null,
        pai_list_xipai:null,
        pai_list_shoupai:null,
        pai_list_dipai:null,

        clone_shoupai:cc.Node,
        clone_dipai:cc.Node,

        node_shoupai:cc.Node,
        node_dipai:cc.Node,
        node_out:cc.Node,
        node_xipai:cc.Node,

        select_card:-1,
        can_move:false,
    },

    set_list_shoupai:function(list){
        this.data_shoupai = list;
        this.pai_list_shoupai = common.get_pai_list(list);
        this.create_nodes(this.node_shoupai,this.clone_shoupai,this.pai_list_shoupai);
        this.set_paddingLeft();
        this.select_card = -1;
        this.check_shoupai_list();
    },

    set_paddingLeft:function(){
        var layout = this.node_shoupai.getComponent(cc.Layout);
        if(layout!=null){
           layout.paddingLeft = this.pai_list_dipai.length*60;
        }
    },


    set_list_xipai:function(list){
        this.data_xipai = list;
        this.pai_list_xipai = common.get_pai_list(list);
        var objs = this.node_xipai.children;
        var num = objs.length;
        var list_num = list.length;
        for(var i =0;i<num;i++)
        {
            if(i<list_num)
            {
                var data = this.pai_list_xipai[i];
                var icon_name = Global.ingame.get_card_icon_name(data.type,data.value);
                var frame = Global.ingame.pai_atlas.getSpriteFrame(icon_name);
                objs[i].getComponent(cc.Sprite).spriteFrame = frame;
                objs[i].active = true;
            }
            else
            {
                objs[i].active = false;
            }
        }
    },


    set_list_dipai:function(list){ 
        this.data_dipai = list;
        this.pai_list_dipai = common.get_pai_list(list);
        this.create_nodes2(this.node_dipai,this.clone_dipai,this.pai_list_dipai);
        this.set_paddingLeft();
    },


    set_list_out:function(list){ 
        this.data_out = list;
        this.pai_list_out = common.get_pai_list(list);
        this.create_nodes(this.node_out,this.clone_shoupai,this.pai_list_out);
    },


    create_nodes(node,clone,data){
        var num = node.childrenCount;
        var data_num = data.length;
        if(num<data_num)
        {
            for(i = num;i<data_num;i++)
            {
               var obj = cc.instantiate(clone);
               obj.parent = node;
               obj.scaleX=1;
               obj.scaleY=1;
               obj.rotation = 0;
            }
        }
        else
        {
            for(i = data_num;i<num;i++)
            {
                node.children[i].active = false;
            }
        }   
        for(var i = 0;i<data_num;i++)
        {
            this.set_node_data(node.children[i],data[i]);
            node.children[i].active = true;
        }
    },

    create_nodes2(node,clone,data){
        var num = node.childrenCount;
        var data_num = data.length;
        var data2 = [];
        for(var i=0;i<data_num;i++)
        {
            var data2_num = data2.length;
            var in_data2 = false;
            for(var j=0;j<data2_num;j++)
            {
                if(data[i].type==data2[j].type&&data[i].value==data2[j].value)
                {
                    data2[j].count += 1;
                    in_data2 = true;
                    break;
                }
            }
            if(!in_data2)
            data2.push(data[i]);
        }

        this.pai_list_dipai = data2;
        data_num = data2.length;
        if(num<data_num)
        {
            for(i = num;i<data_num;i++)
            {
               var obj = cc.instantiate(clone);
               obj.parent = node;
               obj.scaleX=1;
               obj.scaleY=1;
            }
        }
        else
        {
            for(i = data_num;i<num;i++)
            {
                node.children[i].active = false;
            }
        }   
        for(var i = 0;i<data_num;i++)
        {
            this.set_node_data2(node.children[i],data2[i]);
            node.children[i].active = true;
        }
    },

    set_node_data:function(node,data){
        Global.ingame.set_card_data(node,data);
        node.active = true;
    },

    set_node_data2:function(node,data){
        Global.ingame.set_card_data_dipai(node,data);
        node.active = true;
    },
            

    check_shoupai_list:function () {
        var num = this.node_shoupai.childrenCount;
        for(i=0;i<num;i++)
        {
            if(i==this.select_card)
            {
                this.node_shoupai.children[i].children[0].y=20;
            }
            else
            {
                this.node_shoupai.children[i].children[0].y=0;
            }
        }
    },

    reset_shoupai_list:function(){
        var num = this.node_shoupai.childrenCount;
        for(i=0;i<num;i++)
        {
            this.node_shoupai.children[i].children[0].y=0;     
        }
    },



    send_chupai_msg:function(value){
        server_connection.svc_send(CLIENT_MSG.CM_CHU_PAI,{pai:value});
    },

    

    start () {
      //  console.log(this.own);
     //   this.check_card(this.own,10);

    },

    // update (dt) {},
});
