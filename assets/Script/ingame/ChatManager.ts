import InGameManager from "./InGameManager";

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
export default class NewClass extends cc.Component {

    talk_node:cc.Node;
    msg_node:cc.EditBox;
    send_node:cc.Node;
    close_node:cc.Node;

    timer:null;

    public talk_string = [
       '不要吵了，专心打牌吧',
       '不要走，今天我们决战通宵',
       '成已听好，不点炮我就自摸了',
       '出一张来碰碰撒',
       '快点吧，你这速度也太慢了吧',
       '没几张牌了，跟跟熟张吧',
       '他还没有喜，当心他穷胡',
       '太下手了，一把也没得胡'
    ];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       this.talk_node = this.node.getChildByName('scrollview').getComponent(cc.ScrollView).content;
       var children = this.talk_node.children;
       for(var i = 0;i<children.length;i++)
       {
            children[i].children[0].getComponent(cc.Label).string = this.talk_string[i];
            children[i].on('click', function (event) {
               var index = children.indexOf(event.currentTarget);
               this.send_talk(index);
             }, this);
       }
       this.msg_node =  this.node.getChildByName('editbox').getComponent(cc.EditBox);

       this.send_node = this.node.getChildByName('send');
       this.send_node.on('click', function (event) {
         this.send_msg();
      }, this);

      this.close_node = this.node.getChildByName('close');
       this.close_node.on('click', function (event) {
        this.node.active = false;
      }, this);

      this.timer = 0;
    }

    show(){
        if(this.msg_node)
        this.msg_node.string = '';
        this.node.active = true;
    }

    hide(){
      this.node.active = false;
    }

    send_talk(index){
      this.hide();
      if(this.timer>0)
      return;

      if(InGameManager.instance == null)
      return;
      ServerConnection.svc_send(CLIENT_MSG.CM_BROADCAST,{type:1,msg:index});

      this.timer = 1;
       
    }

    send_msg(){
      this.hide();
      if(this.timer>0)
      return;
      var msg = '';
      if(this.msg_node)
       msg = encodeURIComponent(this.msg_node.string);
       if(msg=='')
       return;
       ServerConnection.svc_send(CLIENT_MSG.CM_BROADCAST,{type:2,msg:msg});
      this.timer = 1;
    }

    update (dt) {
      if(this.timer>0)
      this.timer -= dt;
      else
      this.timer = 0;
    }
}
