// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

//0：日志 1:注册appid 2：授权 3分享 4定位 5截图
window.OnNativeResponse = function (type, msg) {
    window.callStaticMethod(0, msg);
    if (type == 1) {
        if (msg.error == 0) {
            if (Global.authorize_after_registerApp) {
                window.callStaticMethod(2, {});
            }
            else {
                ServerConnection.login('123', Global.local_unionid, false);
            }
        }
    }
    else if (type == 2) {
        if (msg.error == 0) {
            var code = msg.msg.code;
            if (code != null) {
                ServerConnection.login(code, '123', true);
            }
        }
    }
    else if (type == 4) {
        Global.login.get_location(msg);
    }
}

window.OnLocationResponse = function (type, msg) {
    if (type == 4) {
        Global.login.get_location(msg);
    }
}

window.callStaticMethod = function (type, msg) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("AppController", "callNativeWithType:andMessage:", type, JSON.stringify(msg));
    }
    else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("com/heretry/ntcp/AppActivity", "callNative", "(ILjava/lang/String;)V", type, JSON.stringify(msg));
    }
}




cc.Class({
    extends: cc.Component,

    properties: {
        _isCapturing: false, // 正在截图中标志
    },

    onLoad() {
        Global.game_app = this;
        cc.game.addPersistRootNode(this.node);
    },

    // 微信分享屏幕截图
    shareScreenshot: function () {
        // 网页端不支持
        if (cc.sys.isBrowser) {
            cc.log('网页端不支持微信分享~');
            return;
        }

        // 正在截图中判断
        if (this._isCapturing) {
            return;
        }
        this._isCapturing = true;

        // 截图文件判断
        var fileName = "shareScreenshot.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if (jsb.fileUtils.isFileExist(fullPath)) {
            jsb.fileUtils.removeFile(fullPath);
        }

        // 截图并保存图片文件
        var size = cc.director.getWinSize(); // 获取视图大小
        var texture = new cc.RenderTexture(size.width, size.height); // 新建渲染纹理
        texture.setPosition(cc.p(size.width / 2, size.height / 2)); // 移动渲染纹理到视图中心
        texture.begin(); // 开始渲染
        cc.director.getRunningScene().visit(); // 访问当前场景
        texture.end(); // 渲染结束
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG); // 保存渲染纹理到图片文件

        // 延时50毫秒，检测截图文件是否存在
        // 重复10次这个过程，如果超过10次仍没检测到图片文件，截图失败（超时）
        var self = this;
        var tryTimes = 0;
        var fn = function () {
            if (jsb.fileUtils.isFileExist(fullPath)) {
                // 调用相应平台微信分享图片方法

                window.callStaticMethod(3, { type:3, path: fullPath, scene: 1 });

                self._isCapturing = false;
            } else {
                tryTimes++;
                if (tryTimes > 10) {
                    self._isCapturing = false;
                    cc.log('截图失败，超时~');
                    return;
                }
                setTimeout(fn, 50);
            }
        };
        setTimeout(fn, 50);
    },


    update(dt) {
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                var script = jsb.reflection.callStaticMethod("com/heretry/ntcp/AppActivity", "readLastScript", "()Ljava/lang/String;");
                if (script != "") {
                    // window.callStaticMethod(0,script);
                    eval(script);
                }

                var script2 = jsb.reflection.callStaticMethod("com/heretry/ntcp/AppActivity", "readLocationScript", "()Ljava/lang/String;");
                if (script2 != "") {
                    // window.callStaticMethod(0,script);
                    eval(script2);
                }
            }
        }
    },

});