require(['jquery', 'handlebars', 'layer','pager','homeToll','tools','cookie','js/handlebar-tool'], function ($,Handlebars,layer) {


    layer.config({
        path: '../js/lib/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
    });

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

    $('em').unbind('click').bind('click', function() {
        $(this).addClass('active').siblings().removeClass('active');
        $('.hx-pagination').show();
        $('.hx-pagination').setPager({
            pageindex: 1,
            pagesize: 8,
            ajax_function: function (pageindex, pagesize) {
                var type = $('.productlist-filter .active').eq(0).attr('borrowType');
                var period = $('.productlist-filter .active').eq(1).attr('period');
                var payMethod = $('.productlist-filter .active').eq(2).attr('payMethod');

                return $.ajax({
                    url: 'https://mobileservers.hanxinbank.com/revision/findBorrowPage.action',
                    data: {
                        "begin": (pageindex - 1) * pagesize + 1,
                        "end": pageindex * pagesize,
                        "type":type,
                        "borrowPeriod":period,
                        "payMethod":payMethod
                    },
                    type: 'post',
                    dataType: 'jsonp',
                    jsonp: 'callback'
                });
            },
            successFun: function (data) {
                if (data.code == '200') {
                    var myTemplate = Handlebars.compile($("#borrow-template").html());
                    //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                    $('#borrowList').html(myTemplate(data.result));
                } else {
                    layer.msg('加载数据失败');
                }
            },
            failFun: function (data) {
                layer.msg('加载数据失败');
            }
        })

    })


    //加载页面数据
    $('.hx-pagination').setPager({
        pageindex: 1,
        pagesize: 8,
        ajax_function: function (pageindex, pagesize) {
            var type = $('.productlist-filter .active').eq(0).attr('borrowType');
            var period = $('.productlist-filter .active').eq(1).attr('period');
            var payMethod = $('.productlist-filter .active').eq(2).attr('payMethod');

            return $.ajax({
                url: 'https://mobileservers.hanxinbank.com/revision/findBorrowPage.action',
                data: {
                    "begin": (pageindex - 1) * pagesize + 1,
                    "end": pageindex * pagesize,
                    "type":type,
                    "borrowPeriod":period,
                    "payMethod":payMethod
                },
                type: 'post',
                dataType: 'jsonp',
                jsonp: 'callback'
            });
        },
        successFun: function (data) {
            if (data.code == '200') {
                var myTemplate = Handlebars.compile($("#borrow-template").html());
                //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                $('#borrowList').html(myTemplate(data.result));
                $.each(data.result, function (index, item) {
                    $('#borrowData' + index).data(item);
                });
                $('#borrowList tr').bind("click", function(){
                    var borrowid= $(this).data('id');
                    var paymethodid =$(this).data('payMethodId');
                    $.cookie("paymethodid",paymethodid , { path: '/',domain: '.hanxinbank.com' });
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
    })

    $.linkGo();//用于非a标签跳转。放到js最后执行

    $.setNavTitleNum();


    $(document).ready(function(){

        $.inintHeader();
    });
});