/**
 * Created by Administrator on 2017/5/27.
 */
define(['jquery','layer','text!component-site/earlyExit-dialog.html','css!component-site/css-site/earlyExit-dialog.css'],function($,layer,tem){
    layer.config({
        path: '../js-site/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
    });
    return function(callback){
        return layer.ready(function(){
            layer.open({
                type: 1,
                title:'申请提前退出',
                area: ['760px', '550px'],
                content: tem //这里content是一个普通的String
            });
            callback&&callback();
        })
    };
});