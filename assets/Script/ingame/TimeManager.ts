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
export default class TimeManager extends cc.Component {

    time:cc.Node=null;
    time_num: cc.Label = null;
    time_action:any = null;
    finishcallback:Function = null;
    timer:number = null;


    public setCallBack(finish)
    {
        this.finishcallback = finish;
    }

    public setTime(num,finish)
    {
        if(num == 0 || num == null)
        {
            return;
        }   
        this.finishcallback = finish;
        this.timer = num;
        this.time.active = true;  
    }


    public clearTime(){
        this.finishcallback = null;
        this.time_num.string = '';
        this.time.active = false;  
        this.timer = -1;
    }

    public getTimeLeft(){
        return this.timer;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.time = this.node;
        this.time_num = this.time.getChildByName('num').getComponent(cc.Label);
        this.clearTime();
    }

    btn_onclick(){
        //this.setPostion(-471,32);
        // this.setTime(15,function(){
        //     console.log(111111111111111111);
        // }
        // );
    }

    setPostion(index) {
        var x = 0;
        var y = 0;
        switch (index) {
            case 1:
                {
                    x = -471;
                    y = 263;
                }
                break;
            case 2:
                {
                    x = 471;
                    y = 263;
                }
                break;
            case 3:
                {
                    x = -471;
                    y = 32;
                }
                break;
        }
        this.time.x = x;
        this.time.y = y;
    }
  
     update (dt) {
         if(this.timer>=0)
         {
             this.timer -= dt; 
             if(this.timer<0)
             {
                //  if(this.finishcallback)
                //  this.finishcallback();
                 this.clearTime()
             }   
             else
             {
                if(this.time_num.string!=Math.floor(this.timer).toString())
                {
                   this.time_num.string = Math.floor(this.timer).toString();
                }
                this.time.active = true;  
             }
         }
     }
}
