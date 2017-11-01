/**
 * Created by Administrator on 2017/5/25.
 */
require(['jquery','handlebars', 'layer','pager'], function($,Handlebars,layer) {

    layer.config({
        path: '../js-site/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
    });

    $('.hx-pagination').eq(0).setPager({
        pageindex: 1,
        pagesize: 2,
        totalType : 'holdNum',
        ajax_function: function (pageindex, pagesize) {

            return $.ajax({
                url: 'http://mobileserver.hanxinbank.com/smart/findUserInvestRecord.action',
                data: {
                    "pageNo":pageindex,
                    "pageSize": pagesize,
                    "userId":'4C8F4421-2BE9-4A8E-9668-AB2F380D8269',
                    "type":1
                },
                type: 'post',
                dataType: 'jsonp',
                jsonp: 'callback'
            });
        },
        successFun: function (data) {
            if (data.code == '0000') {
                $('.tab em').eq(0).text(data.holdNum);
                $('.tab em').eq(1).text(data.quitNum);
                $('.tab em').eq(2).text(data.endNum);
                var myTemplate = Handlebars.compile($("#smart-template0").html());
                //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                $('#holdList').html(myTemplate(data));


            } else {
                layer.msg('加载数据失败');
            }
        },
        failFun: function (data) {
            layer.msg('加载数据失败');
        }
    });

    $('.tab').unbind('click').bind('click', function() {
        $(this).addClass('active').siblings().removeClass('active');
        var tabIndex = $(this).attr('tabsIndex');
        var totalType ;
        var type;
        if(tabIndex==0) {
            totalType = 'holdNum';
            type = 1;
        } else if(tabIndex==1) {
            totalType = 'quitNum';
            type = 2;
        } else {
            totalType = 'endNum';
            type = 3;
        }
        $('.hx-pagination').eq(tabIndex).setPager({
            pageindex: 1,
            pagesize: 2,
            totalType : totalType,
            ajax_function: function (pageindex, pagesize) {

                return $.ajax({
                    url: 'http://mobileserver.hanxinbank.com/smart/findUserInvestRecord.action',
                    data: {
                        "pageNo":pageindex,
                        "pageSize": pagesize,
                        "userId":'4C8F4421-2BE9-4A8E-9668-AB2F380D8269',
                        "type":type
                    },
                    type: 'post',
                    dataType: 'jsonp',
                    jsonp: 'callback'
                });
            },
            successFun: function (data) {
                if (data.code == '0000') {
                    var myTemplate = Handlebars.compile($("#smart-template"+tabIndex).html());
                    //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                    $('.tempData').eq(tabIndex).html(myTemplate(data));
                    $('table').eq(tabIndex).parent().siblings().hide();
                    $('table').eq(tabIndex).parent().show();


                } else {
                    layer.msg('加载数据失败');
                }

            },
            failFun: function (data) {
                layer.msg('加载数据失败');
            }
        });

    });





});