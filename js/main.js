

 function Fm(){
     this.styleM='public_yuzhong_oumei';
     this.audio=$('audio');//音频元素
     this.songCover=$('.songcover img');//封面图片元素
     this.song=$('.song');//歌曲名
     this.singer=$('.singer');//歌手名
     this.play=$('.play');//播放键
     this.pause=$('.pause');//暂停键
     this.next=$('.next');//下一首
     this.pre='aa';//上一首
     this.style=$('.style');//风格选择菜单按钮
     this.stylecnt=$('.stylecnt');//风格选择菜单列表
     this.volume=$('.volume');//音量控件
     this.slider=$('.slider');//音乐进度滑块
     this.progress=$('.progress');//音乐进度条
     this.before=$('.befortime');//当前音乐时间
     this.time=$('.time');//音乐总时长
     this.clock=true;//设置音乐锁
     this.content=$('.animat-cnt');//封面旋转
     this.wordsong=$('.wordsong');//歌词容器
     this.edge=$('.edge');

     this.bind();//绑定按钮事件
     this.getMusiceStyle();

     this.getMusice(this.styleM);//获取随机音乐函数

}

Fm.prototype={
    //绑定播放器控件函数
    bind:function(){
        var me =this;
        //播放按钮
        me.play.on('click',function(){
            me.play.hide();
            me.pause.show();
            me.audio[0].play();
        });
        //暂停按钮
        me.pause.on('click',function(){
            me.pause.hide();
            me.play.show();
            me.audio[0].pause();
        });
        //下一首按钮
        me.next.on('click',function(){
            me.play.hide();
            me.pause.show();
            me.getMusice();
        });
        //风格菜单按钮
        me.style.on('click',function(){
            //判断菜单是否显示
            if(/show/g.test(me.stylecnt.attr('class'))){
                me.stylecnt.removeClass('show');
            }else{
                me.stylecnt.addClass('show');
            }

        });
        //切换音乐风格
        me.stylecnt.on('click',function(event){
            event.stopPropagation();
            var styleMhz=event.target;
            console.log($(styleMhz).attr('class'));
             me.getMusice($(styleMhz).attr('class'));

        });
        //音量控制
        // me.volume.on('mouseup',function(){
        //     me.setVolume();
        // });
        //音乐进度条滑块控制
        me.slider.on('mousedown',function(e){
            var oldx=parseInt(me.slider.css('left')),
                oldleft=e.pageX;
            me.pause.click();
            $(document).on('mousemove',function(e){
                var newx=e.pageX-oldleft+oldx;
                me.slider.css('left',newx);

                if(newx<0){
                    me.slider.css('left',0)
                }
                if(newx>200){
                    me.slider.css('left',200)
                }
                $(document).on('mouseup',function(){
                    $(document).off('mouseup');
                    $(document).off('mousemove');
                    me.play.click();
                    me.audio[0].currentTime=me.audio[0].duration*parseInt(me.slider.css('left'))/200;
                })
            })
        });
        //唱片旋转动画控制
        me.audio.on('play',function(){
            me.content.addClass('animat');
        });
        me.audio.on('pause',function(){
            me.content.removeClass('animat');
        });
        //封面和歌词切换
        me.songCover.on('click',function(){
            me.edge.css('opacity',0);
            me.wordsong.addClass('show');
        });
        me.wordsong.on('click',function(){
            me.wordsong.removeClass('show');
            me.edge.css('opacity',1)

        });
        
     },
    //获取随机音乐函数
    getMusice:function(style){
        var me =this;
        if(this.clock){
             this.clock=false;
            if(style){
                styleM=style;
            }
            console.log(styleM);
            $.ajax({
                url:'http://api.jirengu.com/fm/getSong.php',
                type:'GET',
                data:{
                    channel:styleM
                },
                success:function(data){
                    var newdata=JSON.parse(data),
                        artist=newdata.song[0].artist,
                        picture=newdata.song[0].picture,
                        url=newdata.song[0].url,
                        sid=newdata.song[0].sid,
                        title=newdata.song[0].title;


                    me.audio.attr('src',url);
                    me.songCover.attr('src',picture);
                    me.song.text(title);
                    me.singer.text(artist);
                    me.getWordsSong(sid);
                    me.audio[0].play();
                     me.playbackProgress(true);
                    console.log(newdata.song[0].url);
                    me.clock=true;
                }

            })
        }

    },
    //获取一次音乐风格列表
    getMusiceStyle:function(){
        var me =this;
        $.ajax({
            url:'http://api.jirengu.com/fm/getChannels.php',
            type:'get',
            success:function(data){
                var newdata=JSON.parse(data);
                newli(newdata.channels);
            }
        });
        function newli(data){
            console.log(data[0]);
            for(var key in data){
                var newLi = '<li class="'+data[key].channel_id+'">'+data[key].name+"Mhz"+'</li>';
                me.stylecnt.append(newLi);
            }
            console.log(newLi)
        }
    },
    playbackProgress:function(){
            var me =this;
            var setprogress;
                me.audio.on('play',function(){
                     setprogress=setInterval(function(){
                        var widthline = Math.round(me.audio[0].currentTime)/Math.round(me.audio[0].duration) * 100;
                        me.slider.css({
                            left:widthline+'%'
                        });
                        me.time.text(Math.floor(me.audio[0].duration/60)+':'+Math.floor(me.audio[0].duration%60)||'00:00');
                        me.before.text(Math.floor(me.audio[0].currentTime/60)+':'+Math.floor(me.audio[0].currentTime%60)||'00:00');

                        if(me.time.text()===me.before.text()){
                            me.getMusice();
                        }
                    },1000);
                });
            me.audio.on('pause',function(){
                clearInterval(setprogress);
            })
    },
    //获取歌词
    getWordsSong:function(sidstr) {
        var me = this;
        me.wordsong.html('');
        $.get('http://api.jirengu.com/fm/getLyric.php', {
                sid: sidstr
            })
            .done(function (sidstr) {

                var lyric = parseLyric(JSON.parse(sidstr).lyric);
                loadLyric(lyric);
                setSyncLyric();
            });
        function parseLyric(lyric) {
            var lines = lyric.split('\n'),
                pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
                result = [];
            for(var i=0;i<lines.length;i++){
                if(!pattern.test(lines[i])){
                    continue
                }
                result.push([lines[i].match(pattern),lines[i].replace(/\[\d{2}:\d{2}.\d{2}\](?=\w)/,'')]);
            }
            return result;
        }
        function loadLyric(lrc){
            for(var i=0;i<lrc.length;i++){
                if(!/\[\d{2}:\d{2}.\d{2}\]/g.test(lrc[i][1])){

                    var time=parseInt(lrc[i][0].join('')[1])+parseInt(lrc[i][0].join('')[2])*60+parseInt(lrc[i][0].join('')[4]+lrc[i][0].join('')[5])+parseInt(lrc[i][0].join('')[7]+lrc[i][0].join('')[8])/100
                    me.wordsong.append('<p'+' name="'+time+'">'+lrc[i][1]+'</p>');
                }
            }
        }
        function setSyncLyric(){
            var el=$('.wordsong p');
            me.audio.on('timeupdate',function(){
                el.each(function(i,v){
                    if(me.audio[0].currentTime>parseInt($(this).attr('name'))){
                        $(this).css('color','red')
                    }
                })
            })
        }
    }
};
 var a=new Fm();


