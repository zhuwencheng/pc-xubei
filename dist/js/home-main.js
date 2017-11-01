/**
 * Created by Administrator on 2017/5/16.
 */
require(['jquery','handlebars', 'homeToll', 'imgScroll','cookie','tools' ,'js-site/handlebar-tool'], function ($,Handlebars) {
    //$('#hx-fixed').fixedScroll('fixedNav');//锁定头部
    $.linkGo();//用于非a标签跳转。放到js最后执行
    $('.hx-partner').toggleScroll({
        pre: '.lb-pre',
        next: '.lb-next',
        type: 'left',
        content: '.wrapper ul',
        distance: 208,
        //ajustDis:'调整距离（非必填项）',
        swap: true,
        max: 5
    });//合作伙伴滚动
    $('.banner-section').fullScroll({time:5000});//焦点图滚动

    $('.scroll-text').Scroll({speed: 500, timer: 2500});

    //注册一个比较大小的Helper,判断v1是否大于v2,判断是否是新手专享
    Handlebars.registerHelper("compare", function (v1, v2, options) {
        if (v1 == v2) {
            //满足添加继续执行
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper("ifAddtion", function (v1, options) {
        if (v1 != null && v1 != 0) {
            //满足添加继续执行
            return options.fn(this);
        }
    });

    $.inintHeader();
    queryTuisong();



    $.ajax({
        url:"http://statichtml.hanxinbank.com/findIndexBorrowInfo.action",
        type:"post",
        data:{},
        dataType: 'jsonp',
        jsonp: 'callback',
        success:function(data){
            var myTemplate = Handlebars.compile($("#borrow-template").html());
            //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
            //$('#borrowList').html(myTemplate(data));
            $('.list-table-w table tr').slice(1).remove();


           // var th= $('.list-table-w table').find('tr').html() ;

            //alert($('.list-table-w table').html()   );
            //alert(myTemplate(data));
         //   $('.list-table-w table').html(th+myTemplate(data))

            $('.list-table-w table').find('tr').after(myTemplate(data));

            $('#borrowList tr').unbind('click').bind('click',function() {
                var id = $(this).find('input').val();
                //alert(id);
                $.cookie("borrowid", id, { path: '/',domain: '.hanxinbank.com' });
            })
        },
        error:function (e) {
            //alert(e)
            console.info('ajax报错+:'+ e);
        }
    });

    //todo 实时加载首页省心计划数据

    $.ajax({
        url:"http://statichtml.hanxinbank.com/findIndexSmart.action",
        type:"post",
        data:{},
        dataType: 'jsonp',
        jsonp: 'callback',
        success:function(data){
            var myTemplate = Handlebars.compile($("#smart-template").html());
            //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
            $('.wp-bd').html(myTemplate(data.smartList));
        },
        error:function (e) {
            //alert(e)
            console.info('ajax报错+:'+ e);
        }
    });




    //推送
    function queryTuisong() {
        if ($.cookie('logintoken')==null) {
            return;
        }

        $.ajax({
            url:"http://mobileserver.hanxinbank.com/borrow/borrowIndexApp.action",
            type:"post",
            data:{"loginToken": $.cookie('logintoken')},
            dataType: 'jsonp',
            jsonp: 'callback',
            success:function(returnJson){
                if (returnJson.code == "0000") {
                    var myTemplate = Handlebars.compile($("#bo-template").html());
                    //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                    //todo 判断加息和新手
                    $('#recomBan').html(myTemplate(returnJson.data));
                    $('#recomBan').show();
                    $('#noLoginBan').hide();

                }

            },
            error:function (e) {
                //alert(e)
                console.info('ajax报错+:'+ e);
            }
        });
    }

    //省心计划点击事件
    $('.wp-card').unbind('click').bind('click',function() {
        var id = $(this).find('input').val();
        $.cookie("borrowid", id, { path: '/',domain: '.hanxinbank.com' });
    });



    $('#borrowList tr').unbind('click').bind('click',function() {
        var id = $(this).find('input').val();
        $.cookie("borrowid", id, { path: '/',domain: '.hanxinbank.com' });
    });


});
