/**
 * Created by Administrator on 2017/5/16.
 */
/*
 define(['jquery'],function($){
 $(function(){
 if($('.hx-component-header').length>0){
 require(['text!component-site/header.html'], function(tem) {
 var index=$('.hx-component-header').attr('activeNav');
 var header=$('.hx-component-header').replaceWith(tem);
 $('.hx-nav-wrapper .link').eq(index).addClass('active');
 });
 };
 if($('.hx-component-footer').length>0){
 require(['text!component-site/footer.html'], function(tem) {
 var header=$('.hx-component-footer').replaceWith(tem);
 });
 };
 if($('.hx-component-siderbar').length>0){
 require(['text!component-site/siderbar.html'], function(tem) {
 var header=$('.hx-component-siderbar').replaceWith(tem);
 });
 }
 });
 });*/
define(['jquery', 'text!component-site/header.html', 'text!component-site/footer.html', 'text!component-site/siderbar.html', 'css!../../css/component/home-toptoolbar.css', 'css!../../css/component/home-footer.css', 'tools', 'cookie'], function ($, hTem, fTem, sTem) {
    return function (callback) {
        var index = $('.hx-component-header').attr('activeNav');
        var header = $('.hx-component-header').replaceWith(hTem);
        $('.hx-nav-wrapper .link').eq(index).addClass('active');
        $('.hx-component-footer').replaceWith(fTem);
        $('.hx-component-siderbar').replaceWith(sTem);
        /*setTimeout(function () {
         if ($.cookie('logintoken') == null && $.cookie('username') == null) {
         //δ��¼
         $('#onlineuser').hide();
         $('#loginpart').show();
         $('#login-btn').attr('href', "https://passport.hanxinbank.com/login.html?returnurl=" + window.location.href);
         $('#sign-btn').attr('href', "https://passport.hanxinbank.com/register.html?returnurl=" + window.location.href);
         } else {
         $('#timeduring').text($.getHelloStr());
         $('#spusername').text($.cookie('username'));
         $('#onlineuser').show();
         $('#loginpart').hide();

         }
         }, 50);*/
        if ($.cookie('logintoken') == null && $.cookie('username') == null) {
            $('#onlineuser').hide();
            $('#loginpart').show();
            $('#login-btn').attr('href', "https://passport.hanxinbank.com/login.html?returnurl=" + window.location.href);
            $('#sign-btn').attr('href', "https://passport.hanxinbank.com/register.html?returnurl=" + window.location.href);
        } else {
            $.ajax({
                url: 'http://mobileserver.hanxinbank.com/message/messListPC.action',
                data: {
                    "logintoken": $.cookie('logintoken'),
                    "begin": 1,
                    "end": 1,
                    "statType": 0
                },
                type: 'post',
                dataType: "jsonp",
                success: function (data) {
                    if (data.unreadNumber == undefined) {
                        $('#unreadNum').text();

                    } else {
                        $('#unreadNum').text("(" + data.unreadNumber + ")");
                        if (data.unreadNumber > 0) {
                            $('.hxuc-num').text(data.unreadNumber);
                        }
                    }

                }

            });


            $('#timeduring').text($.getHelloStr());
            $('#spusername').text($.cookie('username'));
            $('#onlineuser').show();
            $('#loginpart').hide();

        }
        var fixedScroll = function (dom, className) {
            var that = dom;
            if (that.length === 0) {
                return false
            }
            ;
            var top = that.parent().offset().top;
            $(window).scroll(function () {
                if ($(window).scrollTop() > top) {
                    that.addClass(className);
                } else {
                    that.removeClass(className);
                }
            })
        }
        fixedScroll($('#hx-fixed'), 'fixedNav');
        callback && callback();
    };
});
