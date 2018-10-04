import GlobalStatic from "./GlobalStatic";

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

    @property(cc.Node)
    clone: cc.Node = null;

    @property(cc.Node)
    container: cc.Node = null;


    exit_onclick(){
    this.node.active = false;
    }

    daycount = '1';
    json = null;

    start(){
        
    }

    show(){

        this.json = null;

        var len2 = this.container.children.length;
        for(var i=0;i<len2;i++)
        {
            this.container.children[i].active = false;
        }
        
        ServerConnection.getGameRecord(Global.guid);

        this.node.active = true;
    }

    initTable(){
        for (var i = 0; i < 10; i++) {
            var obj = cc.instantiate(this.clone);
            obj.active =true;
            obj.parent = this.container;
        }
    }

    record_onclick(index){
        //测试
        // cc.director.loadScene("record");
        // return;
        ServerConnection.get_card_record(this.json[index].cardid);
    }

    deal_record(json){
        this.json = json;
        console.log(json);
        var len = json.length;
        var len2 = this.container.children.length;
        var index = 0;
        for (var i = 0; i < len; i++) {
            var obj = null;
            if(i<len2)
            {
                obj = this.container.children[i];
                obj.active = true;
            }
            else
            {
                obj = cc.instantiate(this.clone);
                obj.active =true;
                obj.parent = this.container;
            }
            this.set_record(obj,json[i]);
            index++;
        }

        len2 = this.container.children.length;
        for(var i=index;i<len2;i++)
        {
            this.container.children[i].active = false;
        }
    }

    set_record(obj,data)
    {
        console.log(data);
        var time_string = '';
        try{
            var time = data.createDate.split('T');
            var t1 = time[0];
            var time2 = time[1].split('.');
            var t2 = time2[0];
            time_string = t1 +'\n'+ t2;
        }
        catch(e){

        }

        var len = data.score.length;
        var score_string = '';
        var winner = '';
        var winner_score = 0;
        for(var i = 0;i<len;i=i+3)
        {
            var temp1 = data.score[i];
            var temp2 = data.score[i+2];
            var temp3 = data.score[i+1];
            if (winner == '') {
                winner = temp1;
                winner_score = temp2;
            }
            else {
                if (temp2 > winner_score) {
                    winner = temp1;
                    winner_score = temp2;
                }
                else if(temp2 == winner_score)
                {
                    if(temp1 == Global.guid)
                    {
                        winner = temp1;
                        winner_score = temp2;
                    }
                }
            }
            
            score_string += temp3+':'+temp2+' '
        }
        

        obj.getChildByName('room').getComponent(cc.Label).string = data.roomid.toString();
        obj.getChildByName('ret').getComponent(cc.Label).string = winner == Global.guid? '赢':'输';
        obj.getChildByName('score').getComponent(cc.Label).string = score_string;
        obj.getChildByName('time').getComponent(cc.Label).string = time_string;
        //obj.getChildByName('button').setUserData(data.cardid);
        obj.getChildByName('button').on('click', function (event) {
            var list = this.container.children;
            var index = list.indexOf(event.currentTarget.parent);
            console.log(index);
            this.record_onclick(index);
        }, this);
    }

    // update (dt) {},
}
