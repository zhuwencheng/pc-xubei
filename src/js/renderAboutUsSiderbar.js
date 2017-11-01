/**
 * Created by Administrator on 2017/5/25.
 */
define(['jquery','text!component-site/aboutus-sidebar.html','css!css-site/component/aboutus-sidebar.css'],function($,Tem){
    return function(callback){
        var activeName=$('.uc-sidebar').attr('activeNav');
        var sidebar=$('.uc-sidebar').replaceWith(Tem);//渲染完

        $('.hxabout-left-menu dd[name='+activeName+']').addClass('active');
        //菜单切换
        callback&&callback();
    };
});