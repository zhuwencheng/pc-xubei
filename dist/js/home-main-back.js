/**
 * Created by Administrator on 2016/4/28.
 */
$(function() {
    var homeMain={
        init:function(){
            var that=this;
            that.renderData().initEvents();
            return that;
        },
        renderData:function(){
            var that=this;
            //html数据渲染放于此处，dom渲染完成后再执行事件绑定
            return that;
        },
        initEvents:function(){
            $('input').placeholder();
            $('.grow-num').growNum();
            $('#to-ad-close').on('click',function(){
                $(this).parent().css({height:0});
            });
            //登录
            $('#login-btn').on('click',function(){
                if ($.cookie("logintoken") == null) {
                    //未登录
                    utl.showLittleLoginPopbox();
                }
            });
            /*首页特效事件绑定*/
            //$('#slider').nivoSlider({effect: 'fold'});
            $("#hx-notice").Scroll({speed: 500, timer: 5000, type: 'left'});
            $('.scroll-content').Scroll({speed: 500, timer: 1500});
            //$('.hx-top-ad').fixedScroll('fixedNav');
            $('#hx-fixed').fixedScroll('fixedNav');
            $('#tab1').navTab({nav: '.fs-tabs li', content: '.floor-content', active: 'current', type: 'mouseenter'});
            $('.recTab').toggleScroll({
                pre: '.fc-pre',
                next: '.fc-next',
                type: 'top',
                tabNum: 4,
                content: '.inner-wrapper-y',
                distance: 130,
                max:4,
                ajustDis: 1
            });//精选滚动切换
            $('.hb-recommend').toggleScroll({
                pre: '.pre',
                next: '.next',
                type: 'left',
                tabNum: 1,
                content: '.inner-wrapper-x',
                max:1,
                distance: 320
            });//债权滚动切换
            $('.floor-content-x').toggleScroll({
                pre: '.fc-pre',
                next: '.fc-next',
                type: 'left',
                tabNum: 3,
                content: '.inner-wrapper-x',
                max:3,
                distance: 306/*,ajustDis:1*/
            });//精选滚动切换
            $('.hx-flink-panel').toggleScroll({
                pre: '.lb-pre',
                next: '.lb-next',
                swap:true,
                type: 'left',
                tabNum: 1,
                content: 'ul',
                max:5,
                distance: 236/*,ajustDis:1*/
            });//底部友情链接切换滚动
            $('#to-top').on('click',function(){
                $('body').animate({ scrollTop: '0px' }, 'easein')
            });
            $('.right-fixed-ad').on('click','.close',function(){
                $(this).closest('.right-fixed-ad').animate({ right: '-200px' }, 'easein')
            });
            /*首页特效事件绑定*/
            $('.right-fixed-ad').on('click', '.close', function () {
                $(this).closest('.right-fixed-ad').animate({ right: '-200px' }, 'easein')
            });

        }
    }
    //-----------------
    homeMain.init();
});
