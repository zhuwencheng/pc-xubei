require(['jquery', 'handlebars', 'layer', 'pager', 'homeToll', 'tools', 'cookie','js-site/handlebar-tool'], function ($, Handlebars,layer) {

    layer.config({
        path: '../js-site/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
    });

    $.linkGo();//用于非a标签跳转。放到js最后执行


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


    //在卖的省心计划列表
    $.ajax({
        url: 'https://mobileservers.hanxinbank.com//revision/findOnSaleSmartProductPage.action',
        type: 'post',
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function (json) {
            if (json.result.length == 0) {
                $('.w1140.mgt-40').hide();
            } else {
                var myTemplate = Handlebars.compile($("#saleSmartTemplate").html());
                //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                $('#saleSmartList').html(myTemplate(json.result));
                $.each(json.result, function (index, item) {
                    $('#saleSmartData' + index).data(item);
                    $('#saleSmartList tr').bind("click", function(){
                        var borrowid= $(this).data('id');
                      //  var paymethodid = $sender.closest(".card-body").attr("paymethodid");
                      //  $.cookie("paymethodid",paymethodid , { path: '/',domain: '.hanxinbank.com' });
                        $.cookie("borrowid", borrowid, { path: '/',domain: '.hanxinbank.com' });
                      //  window.open("smartDetail.html?borrowid="+borrowid);
                    })
                });
            }


        },
        error: function (e) {
            //alert(e)
            console.info('ajax报错+:'+ e);
        }
    });


    //往期计划 分页
    $('.hx-pagination').setPager({
        pageindex: 1,
        pagesize: 8,
        ajax_function: function (pageindex, pagesize) {
            return $.ajax({
                url: 'https://mobileservers.hanxinbank.com//revision/findPastSmartPage.action',
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
            if (data.code == '200') {
                var smartTemplate = Handlebars.compile($("#smartTemplate").html());
                //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                $('#smartList').html(smartTemplate(data.result));
              //  $('.hx-pagination').before(smartTemplate(data.result));
                $.each(data.result, function (index, item) {
                    $('#smartData' + index).data(item);
                });
                $('#smartList tr').bind("click", function(){
                    var borrowid= $(this).data('id');
                    //  var paymethodid = $sender.closest(".card-body").attr("paymethodid");
                    //  $.cookie("paymethodid",paymethodid , { path: '/',domain: '.hanxinbank.com' });
                    $.cookie("borrowid", borrowid, { path: '/',domain: '.hanxinbank.com' });
                    //  window.open("smartDetail.html?borrowid="+borrowid);
                })
            } else {
                layer.msg('加载数据失败');
            }
        },
        failFun: function (data) {
            layer.msg('加载数据失败');
        }
    });

  //  $.setNavTitleNum();

    $(document).ready(function () {
        setInterval (  $.inintHeader(),500);
    });



});