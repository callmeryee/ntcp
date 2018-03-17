// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        music:cc.AudioSource,
        sound:cc.AudioSource,

        audio_clips:null,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.soundmanager = this;
        cc.game.addPersistRootNode(this.node);
        
        this.audio_clips = [];
        var self = this;
        cc.loader.loadResDir('music', function (err, objects, urls) {
            if (err) {
                console.log(err.message || err);
                return;
            }
            var len = objects.length;
            for(var i =0;i<len;i++)
            {
                var obj = {};
                obj.clip = objects[i];
                obj.name = urls[i];
                self.audio_clips.push(obj);
            }
            self.play_music();
        });  
  
    },

    get_clip:function(name){
        var len = this.audio_clips.length;
        for(var i =0;i<len;i++)
        {
            if(this.audio_clips[i].name == name)
            {
                return this.audio_clips[i].clip;
            }
        }
    },

    set_music_volume:function(volume){
       this.music.volume = volume;
    },

    play_music:function () {
        var clip = this.get_clip("music/bgm");
        if(clip==null)
        return;
        this.music.clip = clip;
        this.music.play();
    },

    play_sound:function(){

    },

    start () {
       
    },

});
