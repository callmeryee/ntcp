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

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

 
    data:any = null;

    data_card:any = null;

    node_items:cc.Node[] = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    public init () {
        this.node_items = this.node.getChildByName('Layerout').children;
    }

    hide_result(){
        this.node.active = false;
    }

    set_result_data(json){
        this.data = json;   
        this.data_card =  Global.room_data.card;
    }

    show_result(){

        Global.room_uid = null;

        var total_scores = [];   
        for(var i=0;i<this.data.length;i++)
        {
            var temp = this.data[i].score;
            var temp2 = {};
            temp2.guid = this.data[i].guid;
            temp2.score = 0;
            temp2.winner = false;
            for(var j=0;j<temp.length;j++)
            {
                temp2.score+=temp[j];
            }
            total_scores.push(temp2);
        }

        console.log(total_scores);
        var winner = null;
        for(var i=0;i<total_scores.length;i++)
        {
            if(winner == null)
            {
               winner = total_scores[i];
               winner.winner = true;
               continue;
            }
            else
            {
                if(total_scores[i].score>winner.score)
                {
                    winner.winner = false;
                    winner = total_scores[i];
                    winner.winner = true;
                }
                else
                {
                    total_scores[i].winner = false;
                }
            }
        }

        console.log(total_scores);

        for(var i=0;i<this.node_items.length;i++)
        {
            if(i<this.data.length)
            {
                var data2 = this.data[i];
                var node = this.node_items[i];

                var player = null;
                if (InGameManager.instance != null)
                    player = InGameManager.instance.getPlayerByID(data2.guid);
                else if (RecordManager.instance != null)
                    player = RecordManager.instance.getPlayerByID(data2.guid);


                var content = node.getChildByName('scrollview').getComponent(cc.ScrollView).content;
                var layout = content.getChildByName('layout');
                var items = layout.children;
                var node_info = node.getChildByName('info');

                var label_name = node_info.getChildByName('name').getComponent(cc.Label);
                label_name.string = player.name_label.string;
                var icon = node_info.getChildByName('icon').getComponent(cc.Sprite);
                icon.spriteFrame = player.icon.spriteFrame;
                var label_ID = node_info.getChildByName('ID').getComponent(cc.Label);
                label_ID.string = "ID:" + player.get_uid();
                var node_host = node_info.getChildByName('host');
                node_host.active = player.get_uid() == this.data_card.owner;
               // console.log('~~~~~~~~~~~~~房主'+player.get_unionid(),this.data_card.owner);

                var data_score = data2.score;
        
                for(var j = 0;j<items.length;j++)
                {
                    if(j<data_score.length)
                    {      
                       items[j].getChildByName('No').getComponent(cc.Label).string = '第'+(j+1).toString()+'局';
                       items[j].getChildByName('score').getComponent(cc.Label).string = data_score[j].toString();
                       items[j].active = true;
                    }
                    else
                    {
                        items[j].active = false;
                    }
                }

                var score_label = node.getChildByName('score').getChildByName('Label').getComponent(cc.Label);
                score_label.string = total_scores[i].score.toString();
                var node_winner = node_info.getChildByName('winner');
                node_winner.active = total_scores[i].winner;
                this.node_items[i].active = true;
            }
            else
                this.node_items[i].active = false;
        }
        this.node.active = true;
    }

    back_btn_onclick(){
        if(InGameManager.instance != null)
        {
            window.callStaticMethod(0, 'cocosLog:InGameManager is not null');
           // Global.leave_room();
            Global.room_uid = null;
            ServerConnection.svc_closePlatform();
        }
        else if(RecordManager.instance!=null)
        {
            window.callStaticMethod(0, 'cocosLog:RecordManager is not null');
            Global.leave_room();
        }
        
    }

    share_btn_onclick(){
        if(InGameManager.instance == null)
        return;
        Global.game_app.shareScreenshot();
    }

    

    // update (dt) {},
}
