/**
 * Created by Administrator on 2017/5/23.
 */
require(['jquery', 'handlebars', 'layer', 'tools', 'pager', 'js-site/handlebar-tool'], function ($, Handlebars,layer) {

    layer.config({
        path: '../js-site/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
    });

    $.ajax({
        url: 'http://statichtml.hanxinbank.com//findStatisticsData.action',
        data: {},
        dataType: "jsonp",
        success: function (result) {
            for (var i in result) {
                var text=result[i];
                if(text===null){
                    text='';
                }
                $('[data-name=' + i + ']').text(text);
                if(result.before == '0') {
                    $('[data-name=before]').hide().next('span').hide();
                }

            }
        },
        error : function() {
            layer.msg('加载数据失败');
        }

    });


    //运营月报
    $('.hx-pagination').setPager({
        pageindex: 1,
        pagesize: 4,
        showFirstAndLast: true,
        ajax_function: function (pageindex, pagesize) {
            return $.ajax({
                url: 'http://statichtml.hanxinbank.com/findAdvertPage.action',
                data: {
                    "begin": (pageindex - 1) * pagesize + 1,
                    "end": pageindex * pagesize
                },
                type: 'post',
                dataType: 'jsonp',
                jsonp: 'callback'
            });
        },
        successFun: function (data) {
            if (data.result == '0000') {
                var reportTemplate = Handlebars.compile($("#reportTemplate").html());
                //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                $('.list').html(reportTemplate(data.ads));
            } else {
                layer.msg('加载数据失败');
            }
        },
        failFun: function (data) {
            layer.msg('加载数据失败');
        }
    })








});
