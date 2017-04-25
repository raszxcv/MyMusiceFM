

 function Fm(){
     this.styleM='public_yuzhong_oumei';
     this.audio=$('audio');//音频元素
     this.main=$('#main');//主界面
     this.fm=$('#fm');//最外层
     this.musiceinfo=$('.musiceinfo');
     this.musiceicon=$('.musiceicon');//音乐显示按钮
     this.reduce=$('.reduce img');//音乐界面缩小
     this.ismove=true;
     this.zhanwei=$('.zhanwei');
     this.songCover=$('.songcover img');//封面图片元素
     this.song=$('.song');//歌曲名
     this.singer=$('.singer');//歌手名
     this.play=$('.play');//播放键
     this.pause=$('.pause');//暂停键
     this.next=$('.next');//下一首
     this.pre=$('.pre');//上一首
     this.preurl=[];//存放上一首歌的URL
     this.style=$('.style');//风格选择菜单按钮
     this.stylecnt=$('.stylecnt');//风格选择菜单列表
     this.skin=$('.skin');//换肤菜单按钮
     this.skinstyle=$('.skinstyle');//换肤菜单列表
     this.volume=$('.volume');//音量控件
     this.slider=$('.slider');//音乐进度滑块
     this.progress=$('.progress');//音乐进度条
     this.before=$('.befortime');//当前音乐时间
     this.time=$('.time');//音乐总时长
     this.clock=true;//设置音乐锁
     this.content=$('.animat-cnt');//封面旋转
     this.wordsong=$('.wordsong ul');//歌词容器
     this.lyric=$('.lyric-ct');
     this.wordsong=$('.wordsong');
     this.edge=$('.edge');
     this.lyriclock=true;
     this.currentTiemSec = 0;
     this.needle=$('.needle');//黑胶指针
     this.bind();//绑定按钮事件
     this.musiceicon.addClass('hide');
     this.getMusiceStyle();
     this.timeUpdate();
     this.getMusice(this.styleM);//获取随机音乐函数

}

Fm.prototype= {
    //绑定播放器控件函数
    bind: function () {
        var me = this;
        //音乐界面出现
        me.zhanwei.on('click',function(){
            if(me.ismove){
                me.ismove=false;
                me.main.removeClass('hide');
                me.main.animate({
                    'opacity':'1'
                },500,function(){
                    me.musiceicon.addClass('hide');
                    me.zhanwei.addClass('hide');
                })
            }
        });
        //音乐界面隐藏
        me.reduce.on('click',function(){
            me.main.animate({
                'opacity':'0'
            },500,function(){
                me.main.addClass('hide');
                me.musiceicon.removeClass('hide');
                me.zhanwei.removeClass('hide');

            })
        });
        //音乐小图标拖拽
        me.zhanwei.on('mousedown',function(e){
            me.ismove=true;
            var oldx=parseInt(me.fm.css('left'));
            var oldy=parseInt(me.fm.css('top'));
            var oldleft=e.pageX;
            var oldtop=e.pageY;
            $(document).on('mousemove',function(e){
                    if(me.ismove){
                        var newx = e.pageX-oldleft+oldx;
                        var newy = e.pageY-oldtop+oldy;
                        me.fm.css({
                            'left':newx,
                            'top':newy
                        });
                    }
                $(document).on('mouseup',function(){
                    me.ismove=false;
                        $(document).off('mouseup');
                        $(document).off('mousemove');


                })
            })
        });
        //音乐主体拖拽
        me.musiceinfo.on('mousedown',function(e){
            var oldx=parseInt(me.fm.css('left'));
            var oldy=parseInt(me.fm.css('top'));
            var oldleft=e.pageX;
            var oldtop=e.pageY;
            $(document).on('mousemove',function(e){
                var newx = e.pageX-oldleft+oldx;
                var newy = e.pageY-oldtop+oldy;

                me.fm.css({
                    'left':newx,
                    'top':newy
                });
                $(document).on('mouseup',function(){

                    $(document).off('mouseup');
                    $(document).off('mousemove');

                })
            })
        });
        //进度条点击设置
        me.progress.on('click',function(e){
            var clickX=(e.pageX-$(this).offset().left)/200;
            me.audio[0].currentTime=me.audio[0].duration*clickX;
        });
        //播放按钮
        me.play.on('click', function () {
            me.play.hide();
            me.pause.show();
            me.audio[0].play();
        });
        //暂停按钮
        me.pause.on('click', function () {
            me.pause.hide();
            me.play.show();
            me.audio[0].pause();
        });
        //上一首按钮
        me.pre.on('click',function(){
            me.audio.attr('src', me.preurl[0]);
            me.songCover.attr('src', me.preurl[4]);
            me.song.text(me.preurl[2]);
            me.singer.text(me.preurl[3]);
            me.getWordsSong(me.preurl[1]);
            me.audio[0].play();
            me.playbackProgress(true);
            me.clock = true;

        });
        //下一首按钮
        me.next.on('click', function () {
            me.preurl=[];
            me.preurl.push(me.audio.attr('src'),me.audio.attr('sid'), me.song.text(), me.singer.text(),me.songCover.attr('src'));
            me.play.hide();
            me.pause.show();
            me.getMusice();
        });
        //风格菜单按钮
        me.style.on('click', function () {
            //判断菜单是否显示
            if (/show/g.test(me.stylecnt.attr('class'))) {
                me.stylecnt.removeClass('show');
            } else {
                me.stylecnt.addClass('show');
            }

        });
        //切换音乐风格
        me.stylecnt.on('click', function (event) {
            event.stopPropagation();
            var styleMhz = event.target;
            me.getMusice($(styleMhz).attr('id'));

        });
        //换肤菜单
        me.skin.on('click',function(){
            if (/show/g.test(me.skinstyle.attr('class'))) {
                me.skinstyle.removeClass('show');
            } else{
                me.skinstyle.addClass('show');
            }
        });
        //换肤风格切换
        me.skinstyle.on('click',function(event){
            event.stopPropagation();
            var skinstyle=$(event.target).attr('class');
            switch(skinstyle){
                case 'skinblack':
                    me.main.css('background','black');
                    break;
                case 'skinred':
                    me.main.css('background','red');
                    break;
                case 'skingreen':
                    me.main.css('background','green');
                    break;
                case 'skinyellow':
                    me.main.css('background','yellow');
                    break;
                case 'skindefault':
                    me.main.css('background','linear-gradient(45deg,black, rgb(138,100,125))');
                    break;
            }


        })
        //音量控制
        // me.volume.on('mouseup',function(){
        //     me.setVolume();
        // });
        //音乐进度条滑块控制
        me.slider.on('mousedown', function (e) {
            var oldx = parseInt(me.slider.css('left')),
                oldleft = e.pageX;
            me.pause.click();
            $(document).on('mousemove', function (e) {
                var newx = e.pageX - oldleft + oldx;
                me.slider.css('left', newx);

                if (newx < 0) {
                    me.slider.css('left', 0)
                }
                if (newx > 200) {
                    me.slider.css('left', 200)
                }
                $(document).on('mouseup', function () {
                    $(document).off('mouseup');
                    $(document).off('mousemove');
                    me.play.click();
                    me.audio[0].currentTime = me.audio[0].duration * parseInt(me.slider.css('left')) / 200;
                })
            })
        });
        //唱片旋转动画控制和黑胶指针
        me.audio.on('play', function () {
            me.content.css('animation-play-state','running');
            me.musiceicon.css('animation-play-state','running');
            me.needle.removeClass('needlerotate');
        });
        me.audio.on('pause', function () {
            me.content.css('animation-play-state','paused');
            me.musiceicon.css('animation-play-state','paused');
            me.needle.addClass('needlerotate');
        });
        //封面和歌词切换
        me.songCover.on('click', function () {
            me.edge.css('opacity', 0);
            me.needle.css('opacity',0);
            me.wordsong.addClass('show');
        });
        me.wordsong.on('click', function () {
            me.wordsong.removeClass('show');
            me.edge.css('opacity', 1);
            me.needle.css('opacity',1);

        });



    },
    //获取随机音乐函数
    getMusice: function (style) {
        var me = this;
        if (this.clock) {
            this.clock = false;
            if (style) {
                styleM = style;
            }
            $.ajax({
                url: 'http://api.jirengu.com/fm/getSong.php',
                type: 'GET',
                data: {
                    channel: styleM
                },
                success: function (data) {
                    var newdata = JSON.parse(data),
                        artist = newdata.song[0].artist,
                        picture = newdata.song[0].picture,
                        url = newdata.song[0].url,
                        sid = newdata.song[0].sid,
                        title = newdata.song[0].title;

                    me.audio.attr('src', url);
                    me.songCover.attr('src', picture);
                    me.song.text(title);
                    me.singer.text(artist);
                    me.audio.attr('sid',sid);
                    me.getWordsSong(sid);
                    me.audio[0].play();
                    me.playbackProgress(true);
                    me.clock = true;
                }
            })
        }
    },
    //获取一次音乐风格列表
    getMusiceStyle: function () {
        var me = this;
        $.ajax({
            url: 'http://api.jirengu.com/fm/getChannels.php',
            type: 'get',
            success: function (data) {
                var newdata = JSON.parse(data);
                newli(newdata.channels);
            }
        });
        function newli(data) {
            for (var key in data) {
                var newLi = '<li id="' + data[key].channel_id +  '">' + data[key].name + "Mhz" + '</li>';
                me.stylecnt.append(newLi);
            }
        }
    },
    playbackProgress: function () {
        var me = this;
        var setprogress;
        me.audio.on('play', function () {
            setprogress = setInterval(function () {
                var widthline = Math.round(me.audio[0].currentTime) / Math.round(me.audio[0].duration) * 100;
                me.slider.css({
                    left: widthline + '%'
                });
                me.time.text(Math.floor(me.audio[0].duration / 60) + ':' + Math.floor(me.audio[0].duration % 60) || '00:00');
                me.before.text(Math.floor(me.audio[0].currentTime / 60) + ':' + Math.floor(me.audio[0].currentTime % 60) || '00:00');

                if (me.time.text() === me.before.text()) {
                    me.getMusice();
                }
            }, 1000);
        });
        me.audio.on('pause', function () {
            clearInterval(setprogress);
        })
    },
    //获取歌词
    getWordsSong: function (sidstr) {
        var me = this;


        $.get('http://api.jirengu.com/fm/getLyric.php', {
                sid: sidstr
            })
            .done(function (lyric) {
                var Lyric = JSON.parse(lyric).lyric;
                $('.lyric-ct>p').remove();
                me.lyricTimeArr = [];
                me.lyricFormat(Lyric);

            });
    },
    lyricFormat:function(str){
        var html = '';
        var lyricArr = str.split('\n');
        for (var i = 0; i < lyricArr.length; i++) {
            var lyric = lyricArr[i].slice(10);
            if (!lyric) {
                lyric = '-';
            }
            html += '<p class=' + '\"lyric' + i + '\">' + lyric + '</p>';
            this.lyricTimeFormat(lyricArr[i]);
        }
        this.lyric.append(html);
    },
    lyricTimeFormat:function(str){
        var min = parseFloat(str.slice(1, 3));
        var sec = Math.round(min * 60 + parseFloat(str.slice(4, 9)));
        this.lyricTimeArr.push(sec);

    },
    timeUpdate:function(){
        var me = this;
        this.audio.on('timeupdate', function() {
            if (me.currentTiemSec != Math.round(me.audio[0].currentTime)) {
                me.currentTiemSec = Math.round(me.audio[0].currentTime);
                me.lyricBoxMove(me.currentTiemSec);
            }
        })
    },
    lyricBoxMove:function(num){

        for (var i = 1; i < this.lyricTimeArr.length; i++) {
            if (num === this.lyricTimeArr[i]) {
                if($('.lyric-ct p').eq(i).text().length>=48){
                    var Top = 96 - i * 16 + 'px';
                }else{
                     Top = 80 - i * 16 + 'px';
                }

                var lightClass = '.lyric' + i;
                $(lightClass).siblings().removeClass('light-lyric');
                $(lightClass).addClass('light-lyric');
                this.lyric.animate({
                    top: Top
                }, 300);
            }
        }
    }
}
var a=new Fm();


