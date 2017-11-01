/**
 * Created by Administrator on 2017/5/25.
 */
require(['jquery','handlebars', 'layer','pager','tools','js-site/handlebar-tool'], function($,Handlebars,layer) {

    layer.config({
        path: '../js-site/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
    });

    var investId = $.getQueryString('investId')



    $.ajax({
        url: 'http://mobileserver.hanxinbank.com/smart/findUserInvestDetail.action',
        type: 'post',
        data: {
            "userId":'4C8F4421-2BE9-4A8E-9668-AB2F380D8269',
            "investId":investId
        },
        dataType: 'jsonp',
        jsonp: 'callback',
        success:function(data) {
            $('.uc-rhd span').text(data.investInfo.productName);
            $('.uc-rhd a').attr("href",'productDetail.html?productId='+data.investInfo.borrowId);
            var myTemplate = Handlebars.compile($("#investInfo-template").html());
            //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
            $('.ucwp-des').html(myTemplate(data.investInfo));
        },
        error:function(e) {
            //alert(e)
            console.info('ajax报错+:'+ e);
        }
    });

    $('body').on('click','.contract-menu span',function(e){
        $('.drop-menu').hide();
        $(this).siblings('ul').show();
        e.stopPropagation();
    });
    $(document).click(function(){
        $('.drop-menu').hide();
    });
    $('.hx-pagination').setPager({
        pageindex: 1,
        pagesize: 8,
        totalType : 'holdNum',
        ajax_function: function (pageindex, pagesize) {

            return $.ajax({
                url: 'http://mobileserver.hanxinbank.com/smart/findUserInvestDetail.action',
                type: 'post',
                data: {
                    "userId":'4C8F4421-2BE9-4A8E-9668-AB2F380D8269',
                    "investId":investId,
                    "pageNo":pageindex,
                    "pageSize":pagesize
                },
                type: 'post',
                dataType: 'jsonp',
                jsonp: 'callback'
            });
        },
        successFun: function (data) {
            if (data.code == '0000') {
                var myTemplate = Handlebars.compile($("#asset-template").html());
                //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                $('#assetList').html(myTemplate(data.assets));


            } else {
                layer.msg('加载数据失败');
            }
        },
        failFun: function (data) {
            layer.msg('加载数据失败');
        }
    });






});