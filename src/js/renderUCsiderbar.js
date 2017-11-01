/**
 * Created by Administrator on 2017/5/25.
 */
define(['jquery','text!component-site/uc-sidebar.html','css!component-site/css-site/uc-sidebar.css'],function($,Tem){
    return function(callback){
        var activeName=$('.uc-sidebar').attr('activeNav');
        var sidebar=$('.uc-sidebar').replaceWith(Tem);//渲染完

        $('.hxuc-left-menu dd[name='+activeName+']').addClass('active');
        //菜单切换
        $('.hxuc-left-menu dt').on('click',function(){
            if($(this).hasClass('up')){
                var dd=$(this).nextUntil('dt');
                $(this).removeClass('up');
                dd.show();
                dd.animate({height:40},300);
            }else{
                $(this).addClass('up');
                var dd=$(this).nextUntil('dt');
                dd.animate({height:0},300,function(){
                    dd.hide();
                });
            }
        });
        $('.user-matter-msg').on('click','.close',function(){
            $('.user-matter-msg').remove();
        });
        callback&&callback();
    };
});