/**
 * Created by Administrator on 2016/12/24.
 */
function Vol(){
    this.vol=$('.vol');//音量控件
    this.volslider=$('.volslider');
    this.volslip=$('.volslip');
    this.volme=$('.volme');
    this.audio=$('audio');
    this.volslip.addClass('hide');
    this.clock=false;//音量键状态值
    this.bind();
    this.setVolme(0.5);
    
}

Vol.prototype={
    bind:function(){
        var me=this;

        me.volslider.on('mousedown',function(e){
            var oldx=parseInt(me.volslider.css('left'));
            var oldleft=e.pageX;
            $(document).on('mousemove',function(e){
                var newx=e.pageX-oldleft+oldx;
                me.volslider.css('left',newx);
                if(newx>100){
                    me.volslider.css('left',100);
                }
                if(newx<0){
                    me.volslider.css('left',0);
                }
                me.setVolme(parseInt(me.volslider.css('left'))/100);

                $(document).on('mouseup',function(){
                    $(document).off('mouseup');
                    $(document).off('mousemove');
                })
            })
        });
        me.volme.on('mouseenter',function(e){
            me.volslip.removeClass('hide');
            me.volslip.addClass('show');
            if(me.clock===false){
                me.clock=true;
                setTimeout(function(){
                    me.volslip.removeClass('show');
                    me.volslip.addClass('hide');
                    console.log(1)
                    me.clock=false;
                },5000)
            }
        });
        me.volslip.on('click',function(e){
            var newvol=(e.pageX-$(this).offset().left)/100;
            me.setVolme(newvol);
            me.volslider.css('left',newvol*100);

        })
    },
    setVolme:function(vol){
        var volme=vol;
        this.audio[0].volume=volme;
    }
};
var vol =new Vol();