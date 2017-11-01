/**
 * Created by Administrator on 2017/5/27.
 */
define(['jquery','layer','text!component-site/wplan-dialog.html','css!component-site/css-site/wplan-dialog.css'],function($,layer,tem){
    layer.config({
        path: '../js-site/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
    });
    return function(callback){
        layer.ready(function(){
            layer.open({
                type: 1,
                title:'省心计划授权',
                btn: ['开启授权'],
                area: ['640px', '400px'],
                content: tem //这里content是一个普通的String
            });
            callback&&callback();
        })
    };
});