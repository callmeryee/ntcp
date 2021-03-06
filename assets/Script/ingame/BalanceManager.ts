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
export default class BalanceManager extends cc.Component {

    data_json: any = null;

    data_score: any = null;

    data_card: any = null;
    data_hu: any = null;
    data: any = null;

    node_jiangpai: cc.Node = null;
    node_items: cc.Node[] = null;


    public init() {
        this.node_jiangpai = this.node.getChildByName('node_jiangpai');
        this.node_items = this.node.getChildByName('Layerout').children;
    }

    set_hupai_data(data) {
        this.data_hu = data;
    }

    set_balance_data(json) {
        this.data_json = json;
        this.data_card = json.card;
        this.data = json.data;
    }

    set_jiangpai() {
        var data_jiangpai = null;
        if (InGameManager.instance != null)
            data_jiangpai = InGameManager.instance.data_jiangpai;
        else if (RecordManager.instance != null)
            data_jiangpai = RecordManager.instance.data_jiangpai;
        if (data_jiangpai != null) {
            if (data_jiangpai == null || data_jiangpai.length == 0)
                this.node_jiangpai.active = false;
            else {
                var len = this.node_jiangpai.children.length;
                for (var i = 0; i < len; i++) {
                    var node = this.node_jiangpai.children[i];
                    if (i < data_jiangpai.length) {
                        var pai = Global.common.get_pai(data_jiangpai[i]);


                        if (InGameManager.instance != null)
                            InGameManager.instance.set_card_data(node, pai);
                        else if (RecordManager.instance != null)
                            RecordManager.instance.set_card_data(node, pai);

                        node.active = true;
                    }
                    else {
                        node.active = false;
                    }
                }
                this.node_jiangpai.active = true;
            }

        }
    }

    public hide_balance() {
        this.node.active = false;
    }

    public show_balance(data) {
        this.data = data;
        this.set_jiangpai();
        var balance = data.balance;
        var score = data.score;
        var len = this.node_items.length;
        for (var i = 0; i < len; i++) {
            var data2 = null;
            if (i < balance.length) {
                data2 = balance[i];
            }
            if (data2 != null) {
                var player = null;

                if (InGameManager.instance != null)
                    player = InGameManager.instance.getPlayerByID(data2.guid);
                else if (RecordManager.instance != null)
                    player = RecordManager.instance.getPlayerByID(data2.guid);

                var item = this.node_items[i];
                item.active = true;
                var info = item.getChildByName('info');
                var icon = info.getChildByName('icon').getComponent(cc.Sprite);
                var maizhuang = info.getChildByName('maizhuang');

                maizhuang.active = player.is_maizhuang;
                icon.spriteFrame = player.icon.spriteFrame;
                var name = info.getChildByName('name').getComponent(cc.Label);
                name.string = player.name_label.string;
                var node_hushu = item.getChildByName('hushu');
                node_hushu.getChildByName('Label').getComponent(cc.Label).string = data2.hu;
                var node_paixing = item.getChildByName('paixing');
                var paixing_string = "";
                if (data2.type1 && data2.type2) {
                    var paixing_list = [];
                    var type2 = data2.type2;
                    paixing_list.push(HuType[type2]);
                    var type1 = data2.type1;
                    for (var k = 0; k < 8; k++) {
                        if (((type1 >> k) & 1) > 0) {
                            paixing_list.push(HuPaiType[k + 1]);
                        }
                    }
                    for (var k = 0; k < paixing_list.length; k++) {
                        paixing_string += paixing_list[k] + " ";
                    }
                }
                node_paixing.getChildByName('Label').getComponent(cc.Label).string = paixing_string;

                var data_xi = [];
                var data_di = [];
                var list = data2.di;
                for (var j = 0; j < list.length; j++) {
                    if (list[j] > 120)
                        data_xi.push(list[j]);
                    else
                        data_di.push(list[j]);
                }

                var node_xier = item.getChildByName('xier');
                node_xier.getChildByName('Label').getComponent(cc.Label).string = "x" + data_xi.length;

                var children = item.getChildByName('node_cards').children;
                this.sort_cards(children, data_di, data2.shou);

                var win_type = item.getChildByName('win_type').getComponent(cc.Label);
                win_type.string = "";

                if (data.loser) {
                    if (data.loser == data2.guid) {
                        win_type.string = "点炮";
                    }
                }
                else {
                    if (data.winner == data2.guid) {
                        win_type.string = "自摸";
                    }
                }

                for (var j = 0; j < score.length; j++) {
                    if (score[j].guid == data2.guid) {
                        var node_score = item.getChildByName('score');
                        node_score.getChildByName('Label').getComponent(cc.Label).string = score[j].score.toString();
                        break;
                    }
                }

            }
            else {

                this.node_items[i].active = false;
            }
        }

        this.node.active = true;
    }

    sort_cards(children, data_di, data_shou) {
        var len2 = data_di.length;
        var pai_list_di = [];
        for (var i = 0; i < len2; i++) {
            var temp = Global.common.get_pai(data_di[i]);
            var in_list = false;
            for (var j = 0; j < pai_list_di.length; j++) {
                if (pai_list_di[j].value == temp.value && pai_list_di[j].type == temp.type) {
                    pai_list_di[j].count++;
                    in_list = true;
                }
            }
            if (!in_list) {
                pai_list_di.push(temp);
            }

        }

        var len1 = 12;
        var index = 0;
        for (var i = 0; i < len1; i++) {
            if (pai_list_di.length > index) {
                var pai = pai_list_di[index];

                if (InGameManager.instance != null)
                    InGameManager.instance.set_card_data(children[i], pai);
                else if (RecordManager.instance != null)
                    RecordManager.instance.set_card_data(children[i], pai);

                children[i].active = true;
            }
            else {
                children[i].active = false;
            }
            index++;
        }

        var data_shou_temp = [];
        var data_hu_temp = null;
        var pai_list_temp = Global.common.get_pai_list(data_shou);
        len2 = pai_list_temp.length;
        for (var i = 0; i < len2; i++) {
            if (this.data_hu != null) {
                if (this.data_hu.pai != pai_list_temp[i].tag) {
                    data_shou_temp.push(pai_list_temp[i].tag);
                }
                else {
                    data_hu_temp = pai_list_temp[i].tag;
                }
            }
            else {
                data_shou_temp.push(pai_list_temp[i].tag);
            }
        }
        if (data_hu_temp != null) {
            data_shou_temp.push(data_hu_temp);
        }

        len2 = children.length;
        index = 0;
        for (var i = len1; i < len2; i++) {
            if (data_shou_temp.length > index) {
                var pai = Global.common.get_pai(data_shou_temp[index]);

                if (InGameManager.instance != null)
                    InGameManager.instance.set_card_data(children[i], pai);
                else if (RecordManager.instance != null)
                    RecordManager.instance.set_card_data(children[i], pai);

                if (this.data_hu != null) {
                    if (pai.tag == this.data_hu.pai) {
                        children[i].children[0].children[0].active = true;
                    }
                    else {
                        children[i].children[0].children[0].active = false;
                    }
                }
                else {
                    children[i].children[0].children[0].active = false;
                }
                children[i].active = true;
            }
            else {
                children[i].active = false;
            }
            index++;
        }

    }


    continue_btn_onclick() {
        if (InGameManager.instance != null) {
            this.hide_balance();
            if (this.data.total != null) {
                InGameManager.instance.result.set_result_data(this.data.total);
                InGameManager.instance.result.show_result();
            }
            else {
                if (InGameManager.instance != null)
                InGameManager.instance.init_game();
                InGameManager.instance.show_game_btns([1]);
            }
        }
        else {
            if (RecordManager.instance != null)
                RecordManager.instance.continue_btn_onclick();
        }

    }

    back_btn_onclick() {
        if (InGameManager.instance != null)
            //Global.leave_room();
            ServerConnection.svc_closePlatform();
        else if (RecordManager.instance != null)
            Global.leave_room();
    }

    share_btn_onclick() {
        if (InGameManager.instance == null)
            return;
        Global.game_app.shareScreenshot();
    }


    // update (dt) {},
}
