/**
 * Created by Administrator on 2016/6/30.
 */
(function ($){
    var FullScroll=function(dom,options){
        this.$dom=$(dom);
        this.init(options);
    };
    FullScroll.prototype={
        constructor:FullScroll,
        index:0,
        clearId:null,
        defaults:{
            time:3000,
            showTool:true
        },
        init:function(options){
            var that=this;
            $.extend(that,that.defaults,options);
            that.scrollWidth=this.$dom.width();
            that.renderHtml().initEvents();
            return that;
        },
        renderHtml:function(){
            var that=this;
            var a=that.$dom.find('a');
            that.count= a.length;
            var wrapper=$('<div class="scroll-wrapper"></div>');
            var liHtml='';
            $.each(a,function(i,item){
                var html='<a href="'+$(item).attr('href')+'" target="_blank" style="background-image:url('+$(item).find('img').attr('src');
                wrapper.append(html+')"></a>');
                liHtml+='<li></li>';
            });
            that.$dom.html(wrapper);
            that.$dom.find('a').width(that.scrollWidth);
            if(that.count>1){
                that.$dom.append('<ul class="controlnav">'+liHtml+'</div>');
                var controlNav=that.$dom.find('.controlnav');
                controlNav.css({marginLeft:-controlNav.width()})
                that.$dom.append('<span class="prevnav" data-key="-1"></span><span class="nextnav" data-key="1"></span>');
                controlNav.find('li').eq(0).addClass('active');
                that.clearId=window.setTimeout(function(){that._toIndex(1)},that.time);
            }
            return that;
        },
        initEvents:function(){
            var that=this;
            $(window).resize(function () {
                var maxWidth=that.$dom.width();
                that.scrollWidth=maxWidth;
                that.$dom.find('.scroll-wrapper').stop();
                that.$dom.find('a').width(that.scrollWidth);
                that.$dom.find('.scroll-wrapper').css({ marginLeft:-that.scrollWidth*that.index });
            });
            that.$dom.on('click','.controlnav li',function(){
                var index=$(this).index();
                that.$dom.find('.scroll-wrapper').stop();
                window.clearTimeout(that.clearId);
                that._toIndex(index);
            });
            that.$dom.on('click','.prevnav,.nextnav',function(){
                var currentIndex=that.index;
                var nextIndex=that.index+parseInt($(this).attr('data-key'));
                nextIndex<0?nextIndex=that.count-1:'';
                nextIndex>that.count-1?nextIndex=0:'';
                that.$dom.find('.scroll-wrapper').stop();
                window.clearTimeout(that.clearId);
                that._toIndex(nextIndex);
            });
            return that;
        },
        _toIndex:function(index){
            //console.log(index);
            var that=this;
            $.when( that.$dom.find('.scroll-wrapper').animate({ marginLeft:-that.scrollWidth*index }, 'easein' ) ).then( function(){
                that.index=index;
                that.$dom.find('.controlnav li').removeClass('active').eq(index).addClass('active');

            });
            that.clearId=window.setTimeout(function(){
                if(index+1>=that.count){
                    that._toIndex(0);
                }else{
                    that._toIndex(index+1);
                }
            },that.time);
            return that;
        }
    }
    $.fn.fullScroll = function (options) {
        return this.each(function (key, value) {
            var element = $(this);
            var nivoslider = new FullScroll(this, options);
        });
    };
})(jQuery);