import InGameManager from "./InGameManager";
import RecordManager from "./RecordManager";

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
export default class Player extends cc.Component {

    location:any = null;
    
    public data_info:any = null;
    data_shou: Array<number> = [];
    data_di: Array<number> = [];
    data_out: Array<number> = [];
    data_xi: Array<number> = [];

    node_own: cc.Node = null;
    node_out: cc.Node = null;
    node_xi: cc.Node = null;
    node_info: cc.Node = null;
    node_talk:cc.Label = null;

    name_label: cc.Label = null;
    node_prepare: cc.Node = null;
    num_label: cc.Label = null;
    icon:cc.Sprite = null;
    node_maizhuang:cc.Node = null;

    public can_move:boolean = true;

    start_pos_x:number;
    start_pos_y:number;

    data_select:any=null;

    uid:any = null;
    unionid:any = null;

    public is_maizhuang = false;

    timer = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if(Global.common == null)
           Global.common = require('Common');
        this.node_own = this.node.getChildByName('node_own');
        var start = 12;
        var end = this.node_own.children.length;
        for(var i = start;i<end;i++)
        {
            var node = this.node_own.children[i];
            this.set_node_event(node);
        }
        this.node_out = this.node.getChildByName('node_out');
        this.node_xi = this.node.getChildByName('node_xipai');
        this.node_info = this.node.getChildByName('node_info');
        this.node_talk = this.node.getChildByName('node_talk').getComponent(cc.Label);
        this.name_label = this.node_info.getChildByName('name').getComponent(cc.Label);
        this.node_prepare = this.node_info.getChildByName('prepare');
        this.node_maizhuang = this.node_info.getChildByName('maizhuang');
        this.num_label = this.node_info.getChildByName('num').getComponent(cc.Label);
        this.icon = this.node_info.getComponent(cc.Sprite);
        this.timer = 0;

        //////////////////////test
        //this.set_data_shou([1,2,3,4,5,6]);

    }

    card_clone(clone:cc.Node){
        var obj = cc.instantiate(clone);
        obj.parent = this.node_own;
        obj.scaleX=1;
        obj.scaleY=1;
        obj.rotation = 0;
        obj.active = false;
        this.set_node_event(obj);
    }

    set_node_event(obj){
        var self = this;
        obj.on(cc.Node.EventType.TOUCH_START,function(event){
            if(self.can_move)
            {
                var index =self.node_own.children.indexOf(this);
                self.data_select = self.data_shou[index-12];
                InGameManager.instance.show_order_btns([0]);
                InGameManager.instance.check_pai_same(self.data_select);
                if(this.parent!=self.node)
                {
                    this.parent = self.node;
                    this.scaleX = 1;
                    this.scaleY = 1;
                    this.x = self.node_own.x+self.node_own.scaleX*this.x;
                    this.y = self.node_own.y+self.node_own.scaleY*this.y;
                    self.start_pos_x = this.x;
                    self.start_pos_y = this.y;
                }
            }
         },obj);
 
         obj.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if(self.can_move)
            {
                var delta = event.touch.getDelta();
                this.x += delta.x;
                this.y += delta.y;  
            }
         }, obj);
 
         obj.on(cc.Node.EventType.TOUCH_END,function(event){
            if(self.can_move)
             {
                self.touch_end(self,this);
             }
         },obj);
 
         obj.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
             if(self.can_move)
             {
                self.touch_end(self,this);
             }
         },obj);
    }

    public check_pai_same(value){
        this.sort_node_out(value);
    }

    touch_end(self,node)
    {
        if(node.y<-100)
        {
            var t = (Math.abs(node.x-self.start_pos_x)/600)*0.2;
            self.card_reset(node,t);
        }
        else
        {
            var t = (Math.abs(node.x)/600)*0.2;
            self.card_finish(node,t);
        }
    }

    public auto_chupai(){
        var self = this;
        var value = null;

        if(self.data_select!=null)
        {
            value = self.data_select;
        }
        else if(InGameManager.instance.data_new_card!=null)
        {
            value = InGameManager.instance.data_new_card;
        }
        else
            value = self.data_shou[this.data_shou.length-1];
        this.chupai(value);
     
    }

    public chupai(value){
        var self = this;
        var index = self.data_shou.indexOf(value);
        if(index<0)
        {
            index = this.data_shou.length-1;
            value = self.data_shou[index];
        }
        self.data_select = value;
        var node = self.node_own.children[index+12];
        //console.log(self.data_shou,value,index);
        node.parent = self.node;
        node.scaleX = 1;
        node.scaleY = 1;
        node.rotation = self.node_own.rotation;
        node.x = self.node_own.x+self.node_own.scaleX*node.x;
        node.y = self.node_own.y+self.node_own.scaleY*node.y;
        self.start_pos_x = node.x;
        self.start_pos_y = node.y;
        var t = (Math.abs(node.x)/600)*0.2;
        self.card_finish(node,t);
    }

    card_reset(node,t){
        var self = this;
        var reset = cc.callFunc(function(){
            node.parent = self.node_own;
            self.sort_node_own();
        },this);
        var action = cc.sequence(cc.moveTo(t,this.start_pos_x,this.start_pos_y),reset);
        node.runAction(action);
    }

    card_finish(node,t){
        var self = this;
        var finish = cc.callFunc(function(){
            node.active = false;
            node.parent = self.node_own;
            if(InGameManager.instance!=null)
            InGameManager.instance.set_middle_data({uid:self.get_uid(),value:self.data_select});
            else if(RecordManager.instance!=null)
            RecordManager.instance.set_middle_data({uid:self.get_uid(),value:self.data_select});
            self.data_select = null;
            if(InGameManager.instance!=null)
               InGameManager.instance.check_pai_same(self.data_select);
        },this);
        var action = cc.sequence(cc.moveTo(t,0,135),finish);
        node.runAction(action);
        if(InGameManager.instance!=null)
           self.send_chupai_msg();
        if(InGameManager.instance!=null)
           InGameManager.instance.show_order_btns([]);
        self.can_move = false;
        if(InGameManager.instance!=null)
           InGameManager.instance.clear_time();
    }
 
    send_chupai_msg(){
        if(this.data_select==null)
           return;
        Global.soundmanager.play_chupai_sound(this.data_select);
        ServerConnection.svc_send(CLIENT_MSG.CM_CHU_PAI,{pai:this.data_select});
    }


    public reset() {
        this.set_info(null);
        this.clear();
        this.show(false);
    }

    public clear(){
        this.can_move = false;
        this.set_num(0);
        this.set_prepare();
        this.set_maizhuang(false);
        this.set_data_di([]);
        this.set_data_shou([]);
        this.set_data_out([]);
    }

    public init() {
        if (this.data_info != null) {
            this.set_prepare();
            if(this.data_info.info.nick)
               this.set_name(this.data_info.info.nick);
            if(this.data_info.info.imgurl)
               this.set_icon(this.data_info.info.imgurl);
            this.show(true);
        }
        else {
            this.show(false);
        }
    }

    public setState(tag)
    {
        if (this.data_info != null)
        {
            this.data_info.state = tag.toString();
        }
    }

    public getState()
    {
        if (this.data_info != null)
        {
            return this.data_info.state; 
        }
        else
            return null;
    }

    public init2(){
        if(this.uid!=null)
        {
            this.set_prepare();
            this.show(true);
        }
        else
        {
            this.show(false);
        }
    }

    show(tag:boolean){
        this.node.active = tag;
    }

    public set_info(value:any){
        this.data_info = value;
        if(this.data_info!=null)
        {
           this.set_uid(this.data_info.uid);  
           this.set_unionid(this.data_info.info.unionid);
        } 
    }

    public set_uid(uid){
        this.uid = uid;
    }

    public set_unionid(unionid){
        this.unionid = unionid;
    }

    public get_uid(){
        if(this.uid!=null)
        return this.uid;
        else
        return null;
    }

    public get_unionid(){
        if(this.unionid!=null)
        return this.unionid;
        else
        return null;
    }

    public set_name(value: string) {
        this.name_label.string = value;
    }

    public set_num(value: number) {
        this.num_label.string = value.toString();
    }

    public set_prepare() {
        if(this.data_info!=null)
        this.node_prepare.active = this.data_info.state == State.IN_READY.toString();
        else
        this.node_prepare.active = false;
    }
    
    public set_maizhuang(tag :boolean){
        this.is_maizhuang = tag;
        this.node_maizhuang.active = tag;
    }

    public set_icon(url:string){
        Global.setIcon(url,this.icon);
    }

    public set_data_shou(data: Array<number>) {
        var pai_list = Global.common.get_pai_list(data);
        this.data_shou = [];
        var len = pai_list.length;
        var new_pai = null;
        for(var i =0 ;i<len;i++)
        {
            if(InGameManager.instance!=null)
            {
                if(pai_list[i].tag == InGameManager.instance.data_new_card)
                {
                    new_pai = pai_list[i];
                    continue;
                }
            }
            else if(RecordManager.instance!=null)
            {
                if(pai_list[i].tag == RecordManager.instance.data_new_card)
                {
                    new_pai = pai_list[i];
                    continue;
                }
            }     
            this.data_shou.push(pai_list[i].tag);
        }
        if(new_pai!=null)
        {
            this.data_shou.push(new_pai.tag);
        }
        this.sort_node_own();
    }

    public push_data_shou(value){
        this.data_shou.push(value);
        this.set_data_shou(this.data_shou);
    }

    public get_data_shou(){
        return  this.data_shou;
    }

    public set_data_di(data: Array<number>) {
        this.data_di = [];
        this.data_xi = [];
        var len = data.length;
        for (var i = 0; i < len; i++) {
            if (data[i] > 120)
                this.data_xi.push(data[i]);
            else
                this.data_di.push(data[i]);
        }
        this.sort_node_xi();
    }

    public set_data_out(data: Array<number>) {
        this.data_out = data;
        this.sort_node_out();
    }

    public push_data_out(value){
        this.data_out.push(value);
        this.sort_node_out();
    }

    sort_node_xi() {
        var children = this.node_xi.children;
        var len = children.length;
        var index = 0;
        for (var i = 0; i < len; i++) {
            if (this.data_xi.length > index) {
                var pai = Global.common.get_pai(this.data_xi[index]);
                if(InGameManager.instance!=null)
                InGameManager.instance.set_card_data(children[i], pai);
                else if(RecordManager.instance!=null)
                RecordManager.instance.set_card_data(children[i], pai);
                children[i].active = true;
            }
            else {
                children[i].active = false;
            }
            index++;
        }
    }

    fanzhuan(){

            var rot = 0;
            if(InGameManager.instance!=null)
            {
                if(InGameManager.icon_fanzhuan)
                {
                    rot = 180;
                }
            }
            else if(RecordManager.instance!=null)
            {
                if(RecordManager.icon_fanzhuan)
                {
                    rot = 180;
                }
            }
            for(var i = 0;i<this.node_own.children.length;i++)
            {
                this.node_own.children[i].rotation = rot;
            }
            for(var i = 0;i<this.node_out.children.length;i++)
            {
                this.node_out.children[i].rotation = rot;
            }
            for(var i = 0;i<this.node_xi.children.length;i++)
            {
                this.node_xi.children[i].rotation = rot;
            }
    }

    sort_node_own() {
        var children = this.node_own.children;
        var len2 = this.data_di.length;
        var pai_list_di = [];
        var func = null;
        if(InGameManager.instance!=null)
        {
            func = InGameManager.instance;
        }
        else if(RecordManager.instance!=null)
        {
            func = RecordManager.instance;
        }
        for(var i =0;i<len2;i++)
        {
            var temp = Global.common.get_pai(this.data_di[i]);
            var in_list = false;
            for(var j= 0;j<pai_list_di.length;j++)
            {
                if(pai_list_di[j].value == temp.value&&pai_list_di[j].type == temp.type)
                {
                    pai_list_di[j].count++;
                    in_list = true;
                }
            }
            if(!in_list)
            {
                pai_list_di.push(temp);
            }

        }

        var len1 = 12;
        var index = 0;
        for (var i = 0; i < len1; i++) {
            if (pai_list_di.length > index) {
                var pai = pai_list_di[index];
                func.set_card_data(children[i], pai);
                children[i].active = true;
            }
            else {
                children[i].active = false;
            }
            index++;
        }

        len2 = children.length;
        index = 0;
        for (var i = len1; i < len2; i++) {
            if (this.data_shou.length > index) {
                var pai = Global.common.get_pai(this.data_shou[index]);
                func.set_card_data(children[i], pai);
                if(this.data_select == pai.tag)
                {
                    children[i].children[0].y=20;
                }
                else
                {
                    children[i].children[0].y=0;
                }
                if(func.data_new_card == pai.tag)
                {
                    children[i].children[0].children[0].active = true;
                }
                else
                {
                    children[i].children[0].children[0].active = false;
                }          
                children[i].active = true;
            }
            else 
            {
                children[i].active = false;
            }
            index++;
        }
     
    }


    sort_node_out(value = null) {
        var check_pai = null;
        if(value!=null)
        {
            check_pai = Global.common.get_pai(value); 
        }
        var children = this.node_out.children;
        var len = children.length;
        var index = 0;
        for (var i = 0; i < len; i++) {
            if (this.data_out.length > index) {
                var pai = Global.common.get_pai(this.data_out[index]);
                if(InGameManager.instance!=null)
                InGameManager.instance.set_card_data(children[i], pai);
                else if(RecordManager.instance!=null)
                RecordManager.instance.set_card_data(children[i], pai);
                if(check_pai!=null)
                {
                    if(check_pai.value == pai.value&&check_pai.type == pai.type)
                    {
                        children[i].children[0].color = cc.Color.RED;
                    }
                    else
                    {
                        children[i].children[0].color = cc.Color.WHITE;
                    }
                }
                else
                {
                    children[i].children[0].color = cc.Color.WHITE;
                }
                children[i].active = true;
            }
            else {
                children[i].active = false;
            }
            index++;
        }
    }


    check_hu(list = null){
        if(list == null)
        list = this.data_shou;
        if (list.length == 2) {
            var pai1 = Global.common.get_pai(list[0]);
            var pai2 = Global.common.get_pai(list[1]);
            if (pai1.type == pai2.type && pai1.value == pai2.value)
                return true;
        }
        else {
            var ret = Global.common.check_win(list);
            if (ret.length > 0) {
                //console.log(ret);
            }
            return ret.length > 0;
        }
    }

    check_peng(value){
        var pai = Global.common.get_pai(value);
        var shoupai_list = Global.common.get_pai_list(this.data_shou);
        var count = 0;
        var len = shoupai_list.length;
        for(var i = 0;i<len;i++){
            if(pai.type == shoupai_list[i].type && pai.value == shoupai_list[i].value){
                count++;
            }
        }
        return count == 2;
    }


    check_gang(value){
        var pai = Global.common.get_pai(value);
        var shoupai_list = Global.common.get_pai_list(this.data_shou);
        var count = 0;
        var len = shoupai_list.length;
        for(var i = 0;i<len;i++){
            if(pai.type == shoupai_list[i].type && pai.value == shoupai_list[i].value){
                count++;
            }
        }
        return count == 3;
    }

    check_gang_list(){
        
        var shoupai_list = Global.common.get_pai_list(this.data_shou);
        var dipai_list = Global.common.get_pai_list(this.data_di);

        var len = shoupai_list.length;
        for(var i = 0;i<len;i++)
        {
            var pai = shoupai_list[i];
            var len2 = dipai_list.length;
            var count = 0;
            for(var j = 0;j<len2;j++)
            {
                if(pai.type == dipai_list[j].type&&pai.value == dipai_list[j].value)
                {
                    count++;
                }
            }
            if(count == 3)
               return true;
 
            count = 0;
            for(var j = i+1;j<len;j++)
            {
                if(pai.type == shoupai_list[j].type && pai.value == shoupai_list[j].value)
                {
                    count++;
                }
            }
            if(count == 3)
               return true;
        }
        return false;
    }

    add_talk_msg(msg)
    {
        this.timer = 5;
        this.node_talk.string = msg;
    }


    update (dt) {
      if(this.timer>0)
      this.timer -= dt;
      else
      {
          this.timer =0;
          if(this.node_talk.string!='')
          this.node_talk.string = '';
      }
    }
}
