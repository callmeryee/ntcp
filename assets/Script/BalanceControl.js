// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html



var common = require("Common");
var server_connection = require("ServerConnection");
cc.Class({
    extends: cc.Component,

    properties: {
        data:null,
        clone_shoupai:cc.Node,
        clone_dipai:cc.Node,
        items:[cc.Node],
        jiangpai_node:cc.Node,
        continue_btn:cc.Node,
        back_btn:cc.Node,
        share_btn:cc.Node,
    },


    set_balance_data:function(data){
       this.data = data;
    },

    set_jiangpai:function () {
        var jiangpai_node2 = Global.ingame.jiangpai_node;
        var children2 = jiangpai_node2.getChildren();
        var children = this.jiangpai_node.getChildren();
        var len = children.length;
        for(var i = 0;i<len;i++)
        {
            children[i].getComponent(cc.Sprite).spriteFrame = 
            children2[i].getComponent(cc.Sprite).spriteFrame;
        }
    },

    show_balance:function(){
        if(this.data == null)
        return;
        this.set_jiangpai();
        var clients = Global.ingame.clients;
        var len = this.items.length;
        for(var i = 0;i<len;i++)
        {
            var client = clients[i];
            var data1 = client.json;
            var data2 = null;
            if(data1 == null)
            {
                this.items[i].active = false;          
                continue;
            }
            var len2 = this.data.length;
            for(var j = 0;j<len2;j++)
            {
                data2 = this.data[j];
                if(data2.uid == data1.uid)
                   break;
                else
                   data2=null;
            }
            if(data2!=null)
            {
                var item = this.items[i];
                item.active = true;   
                var info = item.getChildByName('info');
                var icon = info.getChildByName('icon').getComponent(cc.Sprite);
                icon.spriteFrame = client.icon.spriteFrame;
                var name = info.getChildByName('name').getComponent(cc.Label);
                name.string = client.name.string;
                var node_hushu=item.getChildByName('hushu');
                node_hushu.getChildByName('Label').getComponent(cc.Label).string = data2.score;
                var node_paixing = item.getChildByName('paixing');
                var paixing_list = [];
                var type2 = data2.type2;
                paixing_list.push(HuType[type2]);
                var type1 = data2.type1;
                for(var i = 0;i<8;i++)
                {
                    if(((type1>>i)&1)>0)
                    {           
                        paixing_list.push(HuPaiType[i+1]);
                    }
                }  
                var paixing_string = "";
                for(var i = 0;i<paixing_list.length;i++)
                {
                    paixing_string+=paixing_list[i]+" ";
                }
                node_paixing.getChildByName('Label').getComponent(cc.Label).string = paixing_string;
                var node_shoupai = item.getChildByName('node_shoupai');
                var node_dipai = item.getChildByName('node_dipai');
                var node_xipai = item.getChildByName('xipai');
                this.set_dipai_data(node_xipai,node_dipai,data2.di);
                this.set_shoupai_data(node_shoupai,node_dipai,data2.shou);
            }
            else
            {

                this.items[i].active = false;    
            }
        }

        this.node.active = true;
    },

    set_shoupai_data:function(node_shoupai,node_dipai,list)
    {
        var pai_list_shoupai = common.get_pai_list(list);
        this.create_nodes(node_shoupai,this.clone_shoupai,pai_list_shoupai);
        this.set_paddingLeft(node_shoupai,node_dipai);
    },

    
    set_paddingLeft:function(node1,node2){
        var layout = node1.getComponent(cc.Layout);
        if(layout!=null){
           layout.paddingLeft = node2.childrenCount*60;
        }
    },

    set_dipai_data:function (node_xipai,node_dipai,list){        
        var data_xipai=[];
        var data_common=[];
        for(var i= 0;i<list.length;i++)
        {
            if(list[i]>120)
            data_xipai.push(list[i]);
            else
            data_common.push(list[i]);
        }
        node_xipai.getChildByName('Label').getComponent(cc.Label).string = data_xipai.length;
        var pai_list_dipai = common.get_pai_list(data_common);
        this.create_nodes2(node_dipai,this.clone_dipai,pai_list_dipai);
    },

    create_nodes:function(node,clone,data){
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
                node.children[i].destroy();
            }
        }   
        for(var i = 0;i<data_num;i++)
        {
            this.set_node_data(node.children[i],data[i]);
        }
    },

    create_nodes2:function(node,clone,data){
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
                node.children[i].destroy();
            }
        }   
        for(var i = 0;i<data_num;i++)
        {
            this.set_node_data2(node.children[i],data2[i]);
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

    continue_btn_onclick:function(){
        server_connection.enter_room();
    },

    back_btn_onclick:function(){
        server_connection.svc_closePlatform();
    },

    share_btn_onclick:function(){

    },
    

    // update (dt) {},
});
