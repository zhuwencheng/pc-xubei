require(['jquery', 'handlebars', 'js-site/com-transferdialog', 'layer', 'pager', 'tools', 'js-site/handlebar-tool', 'cookie','homeToll'], function ($, Handlebars, transferDialog, layer) {


    layer.config({
        path: '../js-site/layer/'
    });
    $.hxToolTip();

    $.linkGo();//用于非a标签跳转。放到js最后执行


    //债权转让列表 分页
    $('.hx-pagination').setPager({
        pageindex: 1,
        pagesize: 8,
        ajax_function: function (pageindex, pagesize) {
            return $.ajax({
                url: 'http://iweb.hanxinbank.com/transfer/queryCreditTransferPage.do',
                data: {
                    "pageNo": pageindex,
                    "pageSize": pagesize
                },
                type: 'post',
                dataType: 'jsonp',
                jsonp: 'callback'
            });
        },
        successFun: function (data) {
            if (data.code == '0000') {
                var creditTemplate = Handlebars.compile($("#creditTemplate").html());
                //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                $('#creditList').html(creditTemplate(data.result.lists));
                $.each(data.result.lists, function (index, item) {
                    $('#transferData' + index).data(item);
                });
            } else {
                layer.msg('加载数据失败');
            }
        },
        failFun: function (data) {
            layer.msg('加载数据失败');
        }
    });

    //可用余额
    var canusemoney = 0;

    //可用余额
    function getCanUseMoney() {
        $.ajax({
            url: "http://iweb.hanxinbank.com//account/findUserDetail.do",
            type: "post",
            data: {"loginToken": $.cookie('logintoken')},
            dataType: 'jsonp',
            jsonp: 'callback',
            success: function (resultvalue) {
                if (resultvalue.status == "1" && resultvalue.data.user != null) {
                    canusemoney = parseFloat(resultvalue.data.user.canUseAmnout1);
                }
            }
        });


    }

    $('body').on('click','.buytransferbtn',function(e) {
        e.stopPropagation();
        $.buyTransfer(e,transferDialog,Handlebars,canusemoney);
    });

    $.setNavTitleNum();

    $(document).ready(function () {

        $.inintHeader();
        getCanUseMoney();

    });

});