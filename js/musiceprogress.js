/**
 * Created by Administrator on 2016/12/24.
 */


function Progress(){
    this.audio=$('audio');
    this.progress=$('.progress');
    this.slider=$('.slider');
    this.beforetime=$('.befortime');
    this.time=$('.time');
    this.bind();
}

Progress.prototype={
    bind:function(){
        var me=this;

        me.slider.on('mousedown',function(e){
            var oldx=parseInt(me.slider.css('left')),
                oldleft=e.pageX;
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
                })
            })
        })
    }
};



var progress=new Progress();