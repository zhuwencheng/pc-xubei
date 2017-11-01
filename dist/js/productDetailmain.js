/**
 * Created by Administrator on 2017/5/23.
 */
require(['jquery', 'layer','handlebars','tools','pager','js-site/handlebar-tool','cookie','placeholders'], function ($, layer,Handlebars) {
    layer.config({
        path: '../js-site/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
    });
    $('#notice-risk').on('click', function () {
        layer.open({
            type: 1,
            title: '风险提示书',
            btn: ['确定'],
            area: ['950px', '600px'],
            content: $('#notice-risk-tem').html() //这里content是一个普通的String
        });
    });//弹窗实例，后续都使用该插件进行弹窗操作

    //获取url中的参数
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    }

    var productId =  GetQueryString('productId');
    $.cookie('borrowid', productId, {path: '/', domain: '.hanxinbank.com'});


    function formatAmount(amount){
        amount = String(amount.toFixed(2));
        var re = /(-?\d+)(\d{3})/;
        while(re.test(amount)) {

            amount = amount.replace(re,"$1,$2");
        }
        return amount;
    }


    $.ajax({
        url: 'http://mobileserver.hanxinbank.com/smart/productDetail.action',
        type: 'post',
        data: {
            "borrowId":productId
        },
        dataType: 'jsonp',
        jsonp: 'callback',
        success:function(data) {
            var json = data.borrowInfoListBo[0];
            $('#residualAmount').text(formatAmount(json.residualAmount));
            $('#usercount').text(json.usercount);
            var now = new Date().valueOf();
            var time = json.RaiseEndTime;
            if ((json.status != 4 && json.status != '4') || now >= time) {
                var status = json.status;
                if(now >= time) {
                    status = 5;
                }
                var statusDesc = $.getStatusDesc(status);
                $('#usercount').parent('span').next('em').text(statusDesc);
                $('.fr.pdc-fr').eq(0).css('display', 'none');
                $('.fr.pdc-fr').eq(1).css('display', 'inline');
                $('#percent').text('100%');
                $('.progressbar p').css('width', '100%');
                $('#leftTime').text('已结束');
            } else {
                $('#percent').text((json.percent*100).toFixed(0) + '%');
                $('.progressbar p').css('width', (json.percent*100) + '%');
                var expireDate = json.RaiseEndTime;
                $.setExpireDate($('#leftTime'), expireDate)
            }
            $('.borrowTitle').text(json.borrowTitle);
            $('.yield').text((json.yield*100).toFixed(2));
            $('.borrowDay').text(json.borrowDay);
            $('#BorrowAmount').text(formatAmount(json.BorrowAmount));
            $('#percent').text((json.percent*100).toFixed(0)+'%');
            $('.progressbar p').css('width',json.percent*100+'%');
            $('.MinAmount').text(json.MinAmount);
            $('.MaxInvest').text(formatAmount(json.MaxInvest));
            $('.increment').text(json.increment);
            $('#investFee').text(json.investFee);
            $('#quitFee').text(json.quitFee);
            $('#forwardQuitFee').text(json.forwardQuitFee);
            $('#investAmount').attr('placeholder',json.MinAmount+"元起投");
            $('input').placeholder();
            $("#borrowType").val(json.borrowType);



        },
        error:function(e) {
            //alert(e)
            console.info('ajax报错+:'+ e);
        }
    });



    //加入记录列表
    $('.hx-pagination').setPager({
        pageindex: 1,
        pagesize: 8,
        showFirstAndLast :false,
        ajax_function: function (pageindex, pagesize) {
            return $.ajax({
                url: 'https://mobileservers.hanxinbank.com/smart/findInvestRecordList.action',
                data: {
                    "begin": (pageindex - 1) * pagesize + 1,
                    "end": pageindex * pagesize,
                    "borrowId":productId
                },
                type: 'post',
                dataType: 'jsonp',
                jsonp: 'callback'
            });
        },
        successFun: function (data) {
            if (data.code == '0000') {
                var investTemplate = Handlebars.compile($("#investTemplate").html());
                //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                $('#investList').html(investTemplate(data.data));
            } else {
                layer.msg('加载数据失败');
            }
        },
        failFun: function (data) {
            layer.msg('加载数据失败');
        }
    })

    //省心计划计算收益
    $('#investAmount').on("keyup", function () {
        $('#investAmount').val($('#investAmount').val().replaceAll(/[^0-9-]+/, ''));
        var borrowDay = parseFloat($('#borrowDay').text());
        var investAmount = parseFloat($('#investAmount').val());
        var yield = parseFloat($('.yield').eq(0).text()/100);
        var profit =0;
        profit = investAmount * yield *borrowDay / 365;
        if (isNaN(profit)) {
            profit = 0;
        }
        $('#textresultnumber').text($.round(profit));

    });

    //立即投资 按钮事件
    $('#btntoInvest').click(function () {


        var logintoken = $.cookie('logintoken');
        var borrowlevel = $.cookie('borrowlevel');
        if (logintoken == null) {
            //去登陆
             window.location.href = "http://passport.hanxinbank.com/login.html?returnurl=" + window.location.href;
            //$('#gotologin').click();
            return false
        }
        if (!$.pageRoleCheck()) {
            return;
        }


        //判断是否开通了自动投标和自动债权
        if (($.cookie('isBidSign') && $.cookie('isBidSign') != '0') && ($.cookie('isCreditSign') && $.cookie('isCreditSign') != '0')) {
            //
        } else {
            window.location.href = "http://iweb.hanxinbank.com/html/userCenter/autosign.html?v=" + Math.random();
            return;
        }

        if ($.cookie("hxusertype") == "1" && $.cookie("wdtype") != 3) {
            //借款人
            layer.msg('暂不能进行投资哦');
            return false;
        }

        var investAmount = parseFloat($('#investAmount').val());
        var increment = parseFloat($('.increment').text());
        var minamount = parseFloat($('.MinAmount').eq(0).text());
        var spleftmoney = parseFloat($('#residualAmount').text().replaceAll(",",""));

        //判断投资金额为数字
        if (isNaN(investAmount)) {
            layer.msg("投资金额须满足"+minamount+"元起投");
            return false;
        }
        //判断是否为最低起投金额
        if (isNaN(minamount) || investAmount < minamount) {
            layer.msg("投资金额须满足"+minamount+"元起投");
            return false;
        }
        //判断是否按照递增金额递增
        if (isNaN(increment)   ||(  investAmount - minamount) % increment != 0 ) {
            layer.msg("投资金额须满足"+increment+"元递增");
            return false;
        }

        if (spleftmoney<investAmount){
            $('#investAmount').val(spleftmoney);
            layer.msg("土豪，标的余额只有"+spleftmoney+"元了。买完这个，再去看看其他产品吧^_^");
            return false;
        }



        var reg = new RegExp(",", "g"); //创建正则RegExp对象
        var stringcanusemoney = $('#spcanusemoney').text();
        var canusemoney = parseFloat(stringcanusemoney.replaceAll(",", ""));
        if (isNaN(canusemoney)) {
            canusemoney = 0;
        }
        /* if (canusemoney < investAmount) {
         $("#investAmount").showInputTip();
         setTimeout(function () {
         $("#input-tip").hide();
         }, 4000);
         return false;
         }*/

        var borrowid = $.cookie("borrowid");
        if (borrowid == null) {
            return false;
        }
///////////////////////新手 铂金///////////////////////////////////////////////
//        var borrowlevel = parseInt($.cookie('borrowlevel'));
//        if (isNaN(borrowlevel)) {
//            borrowlevel = 0;
//        } ;
//
//        var userlevel = parseInt($.cookie('userlevel'));
//        if (isNaN(userlevel)) {
//            userlevel = 0;
//        };
//
//        //userlevel: 0 可投普通
//        //userlevel: 1 可投新手
//        //userlevel: 2 可投铂金
//        //新手标
//        if (borrowlevel == 1&&userlevel!=1) {
//
//            $('#investAmount').showCustomInputTip("仅限新手等级用户可投");
//                return;
//        }
//
//        //铂金标
//        if (borrowlevel == 2&&userlevel!=2) {
//
//            $('#investAmount').showCustomInputTip("仅限铂金等级用户可投");
//                return;
//        }
/////////////////////////////////////////////////////////////////////////////////


       /*重复判断开户和设置交易密码
       $.ajax({
            url: 'http://iweb.hanxinbank.com/account/findUserDetail.do',
            type: 'post',
            data: {
                "loginToken": $.cookie('logintoken')
            },
            dataType: 'jsonp',
            jsonp: 'callback',
            success:function(returnJson) {
                if (returnJson.data.user.accountId==null || returnJson.data.user.accountId==""){//开户
                    $("#accountDialog").css("display","block");
                }else if (returnJson.data.user.isSetTransactionPassword==null || returnJson.data.user.isSetTransactionPassword=="" || returnJson.data.user.isSetTransactionPassword=="0"){//设置交易密码
                    $("#pwdDialog").css("display","block");
                }else{
                    //4.相关参数写入cookie
                    $.cookie('investamount', investAmount, {path: '/',domain: '.hanxinbank.com'});
                    $.cookie('borrowtitle', $('#spborrowtitle').text(), {path: '/',domain: '.hanxinbank.com'});
                    $.cookie('yield',  $('#spyield').text(), { path: '/',domain: '.hanxinbank.com' });
                    $.cookie('addyield', $('#addyield').val(), { path: '/',domain: '.hanxinbank.com' });
                    $.cookie('borrowtype',$("#borrowType").val(), { path: '/',domain: '.hanxinbank.com' });
                    $.cookie('borrowday', parseFloat($('#spborrowday').text()), { path: '/', domain: '.hanxinbank.com' });
                    window.location.href = "https://cashs.hanxinbank.com/smartCashiers.html"
                }
            },
            error:function(e) {
                alert(e)
            }
        });*/
        $.cookie('investamount', investAmount, {path: '/',domain: '.hanxinbank.com'});
        $.cookie('borrowtitle', $('#spborrowtitle').text(), {path: '/',domain: '.hanxinbank.com'});
        $.cookie('yield',  $('#spyield').text(), { path: '/',domain: '.hanxinbank.com' });
      //  $.cookie('addyield', $('#addyield').val(), { path: '/',domain: '.hanxinbank.com' });  加息，无
        $.cookie('borrowtype',$("#borrowType").val(), { path: '/',domain: '.hanxinbank.com' });
        $.cookie('borrowday', parseFloat($('#borrowDay').text()), { path: '/', domain: '.hanxinbank.com' });
        window.location.href = "https://cashs.hanxinbank.com/smartCashiers.html";



    });


    //全部替换
    String.prototype.replaceAll = function (str1,str2){
        var str = this;
        var result = str.replace(eval("/"+str1+"/gi"),str2);
        return result;
    }


    //查询余额

    $(document).ready(function(){

        $.queryCanUserAmount();
    });


    //充值
    $('#recharge').click(function () {
        if ($.cookie('accountId') == null || $.cookie('accountId') == '') {
            layer.alert('为保障您的账户及资金安全，请尽快开通银行存管账户！', {
                icon: 0,
                skin: 'layer-ext-moon',
                title : '提示',
                btn: ['开通存管账户']
            },function() {
                window.location.href = 'http://iweb.hanxinbank.com/html/trains/user/accountOpen.html';
            })
            return false;
        }

        window.location = "http://iweb.hanxinbank.com/html/trains/payment/recharge.html";
    });
});
