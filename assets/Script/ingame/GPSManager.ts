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

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    node_items: cc.Node[] = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    public init() {
        this.node_items = this.node.getChildByName('Layerout').children;
    }

    public show() {
        if (InGameManager.instance == null)
            return;

        this.set_info(InGameManager.instance.player_1, this.node_items[0]);
        this.set_info(InGameManager.instance.player_2, this.node_items[1]);
        this.set_info(InGameManager.instance.player_self, this.node_items[2]);

        this.check_gps_on(InGameManager.instance.player_1, InGameManager.instance.player_2, this.node_items[0]);
        this.check_gps_on(InGameManager.instance.player_2, InGameManager.instance.player_self, this.node_items[1]);
        this.check_gps_on(InGameManager.instance.player_self, InGameManager.instance.player_1, this.node_items[2]);

        this.node.active = true;

    }

    set_info(player, item) {
        if (player != null && player.data_info != null) {
            var node_info = item.getChildByName('info');
            node_info.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = player.icon.spriteFrame;
            if (player.location != null) {
                node_info.getChildByName('location').getComponent(cc.Label).string = player.location.location;
            }
            else {
                node_info.getChildByName('location').getComponent(cc.Label).string = '';
            }
            item.active = true;
        }
        else {
            item.active = false;
        }
    }

    check_gps_on(player1, player2, item) {
        if (player1.location != null && player1.data_info != null && player2.location != null && player2.data_info != null) {
            item.getChildByName('gpsopen').active = true;
            item.getChildByName('gpsno').active = false;
            item.getChildByName('distance').getComponent(cc.Label).string = '相距' + this.algorithm(player1.location.longitude,player1.location.latitude,player2.location.longitude,player2.location.latitude) +'米';
        }
        else {
            item.getChildByName('gpsopen').active = false;
            item.getChildByName('gpsno').active = true;
            item.getChildByName('distance').getComponent(cc.Label).string = '';
        }
    }

    public hide() {
        this.node.active = false;
    }

    algorithm(longitude1, latitude1, longitude2, latitude2) {
        var Lat1 = this.rad(latitude1); // 纬度
        var Lat2 = this.rad(latitude2);
        var a = Lat1 - Lat2;//两点纬度之差
        var b = this.rad(longitude1) - this.rad(longitude2); //经度之差
        var s = 2 * Math.asin(Math
            .sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(Lat1) * Math.cos(Lat2) * Math.pow(Math.sin(b / 2), 2)));//计算两点距离的公式
        s = s * 6378137.0;//弧长乘地球半径（半径为米）
        s = Math.round(s * 10) / 10;//精确距离的数值
        return s;
    }

    rad(d) {
        return d * Math.PI / 180.00; //角度转换成弧度
    }

    // update (dt) {},
}
