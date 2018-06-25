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
        is_girl:true,
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

        cc.loader.loadResDir('sound/girl', function (err, objects, urls) {
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
        }); 

        cc.loader.loadResDir('sound/common', function (err, objects, urls) {
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
        this.music.loop = true;
        this.music.play();
    },

    play_music_ingame:function(){
        var clip = this.get_clip("music/bgm2");
        if(clip==null)
        return;
        this.music.clip = clip;
        this.music.loop = true;
        this.music.play();
    },

    play_sound:function(name){
        var clip = this.get_clip("sound/"+name);
        if(clip==null)
        return;
        this.sound.clip = clip;
        this.sound.play();
    },

    play_sound2:function(name){
        console.log(name);
        var sound_name = this.is_girl_sound()+name;
        this.play_sound(sound_name);
    },

    play_chupai_sound(tag) {
        var pai = Global.common.get_pai(tag);
        //console.log(pai.type + '~~~~~~~' + pai.value);
        var sound_name = '';
        switch (pai.type) {
            case 1:
                {
                    sound_name = (pai.value - 1).toString();
                }
                break;
            case 2:
                {
                    sound_name = (pai.value + 8).toString();
                }
                break;
            case 3:
                {
                    sound_name = (pai.value + 17).toString();
                }
                break;
            case 4:
                {
                    sound_name ='28';
                }
                break;
            case 5:
                {
                    sound_name = '29';
                }
                break;
            case 6:
                {
                    sound_name = '27';
                }
                break;

        }
        if (sound_name != '')
        {
            this.play_sound2(sound_name);
        }
    },

    is_girl_sound(){
        if(this.is_girl)
        return 'girl/'
        else
        return 'boy/'
    },

    play_button_click(){
        this.play_sound('common/button_click');
    },

    play_card_out(){
        this.play_sound('common/outcard');
    },

    play_ready_sound(){
        this.play_sound('common/ready');
    },

    play_timeup_sound(){
        this.play_sound('common/timeup_alarm');
    },

    start () {
       
    },

});
