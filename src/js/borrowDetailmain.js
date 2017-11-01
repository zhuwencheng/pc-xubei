/**
 * Created by Administrator on 2017/5/23.
 */
require(['jquery', 'layer', 'handlebars', 'cookie', 'tools', 'pager', 'js-site/handlebar-tool', 'placeholders', 'lazyLoad'], function ($, layer, Handlebars) {
    layer.config({
        path: '../js-site/lib/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
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

    var productId = GetQueryString('borrowid');
    $.cookie('borrowid', productId, {path: '/', domain: '.hanxinbank.com'});

    function formatAmount(amount) {
        amount = String(amount.toFixed(2));
        var re = /(-?\d+)(\d{3})/;
        while (re.test(amount)) {

            amount = amount.replace(re, "$1,$2");
        }
        return amount;
    }

    $.ajax({
        url: 'http://iweb.hanxinbank.com/borrowInfo/getBorrowinfo.do',
        type: 'post',
        data: {
            "id": productId
        },
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function (data) {

            var json = data.result;
            $('#residualAmount').text($.fmoney(json.remainAmount.replaceAll(',', ''), 2));
            $('#usercount').text(json.investSumPerson);
            var now = new Date().valueOf();
            var time = new Date(json.raiseEnddateStr).valueOf();
            $('.pdc-detail').data(data.result);
            if ((json.status != 4 && json.status != '4') || now >= time) {
                var status = json.status;
                if (now >= time) {
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
                $('#percent').text((json.investProgress) + '%');
                $('.progressbar p').css('width', json.investProgress + '%');
                var expireDate = new Date(json.raiseEnddateStr).getTime();
                $.setExpireDate($('#leftTime'), expireDate)
            }
            $('.borrowTitle').text(json.borrowtitle);
            $('.yield').text(parseFloat(json.yield).toFixed(2));
            $('#borrowDay').text(json.borrowday);
            if (json.borrowType == 11) {
                $('#borrowDay').text(json.borrowMonth);
                $('#borrowUnit').text('个月');
            } else if ((json.borrowType == 1) && (json.id > 4079)) {
                $('#borrowDay').text(json.borrowMonth);
                $('#borrowUnit').text('个月');
            } else if(json.paymethodid == 4) {
                $('#borrowDay').text(json.borrowMonth);
                $('#borrowUnit').text('个月');
            }
            $('#BorrowAmount').text(parseFloat(json.borrowamount).toFixed(2));

            $('.MinAmount').text(parseFloat(json.minamount).toFixed(2));
            $('.MaxInvest').text(json.maxAmount);
            $('#investStart').text(json.investStartDateStr)
            $('.bd').html(json.description);
            $('#increment').val(json.increment);

            $('#investAmount').attr('placeholder', parseFloat(json.minamount).toFixed(2) + "元起投");
            $('input').placeholder();
            //还款方式
            var payMethod = json.paymethodid;
            if (payMethod == 2) {
                $('#payMethod').text('一次性还本付息');
            } else if (payMethod == 3) {
                $('#payMethod').text('等额本息');
            } else if (payMethod == 4) {
                $('#payMethod').text('先息后本');
            }

            if(json.borrowType == 2 ) {
                $('#titleDesc').text('第三方担保');
            }

            //$('#paymethodid').val(json.paymethodid);
            $.cookie('paymethodid', json.paymethodid);

            /* $('.increment').text(json.increment);
             $('#investFee').text(json.investFee);
             $('#quitFee').text(json.quitFee);
             $('#forwardQuitFee').text(json.forwardQuitFee);*/


//图片懒加载，不要删除 要放在#description复制之后
            window.LazyLoadImg();


        },
        error: function (e) {
            //alert(e)
            console.info('ajax报错,http://iweb.hanxinbank.com/borrowInfo/getBorrowinfo.do+:' + e);
        }
    });

    //加入记录列表
    $('.hx-pagination').setPager({
        pageindex: 1,
        pagesize: 8,
        showFirstAndLast: false,
        ajax_function: function (pageindex, pagesize) {
            return $.ajax({
                url: 'https://mobileservers.hanxinbank.com/smart/findInvestRecordList.action',
                data: {
                    "begin": (pageindex - 1) * pagesize + 1,
                    "end": pageindex * pagesize,
                    "borrowId": productId,
                    "type": 1
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


    $('#investAmount').on("keyup", function () {
        calProfit();
    });

    //输入金额计算利息
    function calProfit() {
        var investAmount = parseFloat($('#investAmount').val());
        //var borrowDay = parseFloat($('#borrowDay').text());
        var borrowDay = parseFloat($('.pdc-detail').data().borrowday);
        var yield = parseFloat($('.yield').eq(0).text());
        var paymethodid = $.cookie("paymethodid");
        var profit = 0;
        if (paymethodid == 3) {
            $.ajax({
                url: 'http://iweb.hanxinbank.com//repay/calculatePrice.do',
                type: 'post',
                data: {
                    "id": $.cookie('borrowid'),
                    "price": investAmount
                },
                dataType: 'jsonp',
                jsonp: 'callback',
                success: function (returnJson) {
                    profit = returnJson;
                    $('#textresultnumber').text($.round(profit));

                },
                error: function (e) {
                    //alert(e)
                    console.info('ajax报错,http://iweb.hanxinbank.com//repay/calculatePrice.do+:' + e);
                }
            });

        } else {
            profit = investAmount * yield * borrowDay / 36500;
            if (isNaN(profit)) {
                profit = 0;
            }
            $('#textresultnumber').text($.round(profit));
        }

    }


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

        if ($.cookie("hxusertype") == "1" && $.cookie("wdtype") != 3) {
            //借款人
            layer.msg('暂不能进行投资哦');
            return false;
        }

        var investAmount = parseFloat($('#investAmount').val());
        var increment = parseFloat($('#increment').val());
        var minamount = parseFloat($('.MinAmount').eq(0).text());
        var spleftmoney = parseFloat($('#residualAmount').text().replaceAll(",", ""));
        //验证新手
        if (borrowlevel == "1") {
            $.ajax({
                url: 'http://iweb.hanxinbank.com//account/judgeNewUser.do',
                type: 'post',
                data: {
                    "loginToken": $.cookie('logintoken')
                },
                dataType: 'jsonp',
                jsonp: 'callback',
                success: function (resultvalue) {
                    if (resultvalue == 1) {
                        layer.msg('该项目为新手标，只有未进行投资的新用户可投');
                        return false;
                    } else {
                        //判断投资金额为数字
                        if (isNaN(investAmount)) {
                            layer.msg("投资金额须满足" + minamount + "元起投");
                            return false;
                        }
                        //判断是否为最低起投金额
                        if (isNaN(minamount) || investAmount < minamount) {
                            layer.msg("投资金额须满足" + minamount + "元起投");
                            return false;
                        }
                        //判断是否按照递增金额递增
                        if (isNaN(increment) || (investAmount - minamount) % increment != 0) {
                            layer.msg("投资金额须满足" + increment + "元递增");
                            return false;
                        }
                        if (spleftmoney < investAmount) {
                            $('#investAmount').val(spleftmoney);
                            layer.msg("土豪，标的余额只有" + spleftmoney + "元了。买完这个，再去看看其他产品吧^_^");
                            return false;
                        }

                        //新手标
                        if (borrowlevel == "1" && investAmount > 40000) {
                            layer.msg('投资金额须小于等于新手标的最高限额40000元');
                            return false;
                        }


                        ////判断余额是否充足
                        //if (isNaN(canusemoney)) {
                        //    canusemoney = 0;
                        //}
                        //if (canusemoney < investAmount) {
                        //    $("#investAmount").showInputTip();  //余额不足
                        //    return false;
                        //}

                        //var borrowid = $.cookie("borrowid");
                        //if (borrowid == null) {
                        //    return false;
                        //}


                        $.cookie('investamount', investAmount, {path: '/', domain: '.hanxinbank.com'});
                        $.cookie('borrowtitle', $('#spborrowtitle').text(), {path: '/', domain: '.hanxinbank.com'});
                        $.cookie('yield', $('#spyield').text(), {path: '/', domain: '.hanxinbank.com'});
                        $.cookie('addyield', $('#addyield').val(), {path: '/', domain: '.hanxinbank.com'});
                        $.cookie('profit', $('#textresultnumber').text(), {path: '/', domain: '.hanxinbank.com'});
                        window.location.href = "https://cashs.hanxinbank.com/cashiers.html"
                    }
                },
                error: function (e) {
                    //alert(e)
                    console.info('ajax报错:' + e);
                }
            });


        } else {
            //判断投资金额为数字
            if (spleftmoney < minamount && investAmount < spleftmoney) {
                layer.msg("剩余金额小于起投金额" + minamount + "元时，需全部购买");
                return;
            }

            if (isNaN(investAmount)) {
                layer.msg("投资金额须满足" + minamount + "元起投");
                return false;
            }
            //判断是否为最低起投金额
            if ((isNaN(minamount) || investAmount < minamount) && spleftmoney > minamount) {
                layer.msg("投资金额须满足" + minamount + "元起投");
                return false;
            }
            //判断是否按照递增金额递增
            if (isNaN(increment) || (investAmount - minamount) % increment != 0) {
                layer.msg("投资金额须满足" + increment + "元递增");
                return false;
            }


            if (spleftmoney < investAmount) {
                $('#investAmount').val(spleftmoney);
                layer.msg("土豪，标的余额只有" + spleftmoney + "元了。买完这个，再去看看其他产品吧^_^");
                return false;
            }


            //判断实名


            var borrowid = $.cookie("borrowid");
            if (borrowid == null) {
                return false;
            }


            //3、弹出短信验证码弹窗
            //utl.showLittleSmsCodePopbox();
            /*utl.jsonpRequest("http://iweb.hanxinbank.com/account/findUserDetail.do", {"loginToken":$.cookie("logintoken")},function (returnJson) {

             if (returnJson.status==1){
             if (returnJson.data.user.accountId==null || returnJson.data.user.accountId==""){//开户
             $("#accountDialog").css("display","block");
             }else if (returnJson.data.user.isSetTransactionPassword==null || returnJson.data.user.isSetTransactionPassword=="" || returnJson.data.user.isSetTransactionPassword=="0"){//设置交易密码
             $("#pwdDialog").css("display","block");
             }else{
             //4.相关参数写入cookie
             $.cookie('investamount', investAmount, { path: '/',domain: '.hanxinbank.com' });
             $.cookie('borrowtitle', $('#spborrowtitle').text(), { path: '/',domain: '.hanxinbank.com' });
             $.cookie('yield',  $('#spyield').text(), { path: '/',domain: '.hanxinbank.com' });
             $.cookie('addyield', $('#addyield').val(), { path: '/',domain: '.hanxinbank.com' });
             $.cookie('borrowtype',$("#borrowType").val(), { path: '/',domain: '.hanxinbank.com' });
             $.cookie('startYield',$("#startYield").val(), { path: '/',domain: '.hanxinbank.com' });
             $.cookie('endYield',$("#endYield").val(), { path: '/',domain: '.hanxinbank.com' });
             window.location.href="https://cashs.hanxinbank.com/cashiers.html"
             }
             }

             });*/
            $.cookie('investamount', investAmount, {path: '/', domain: '.hanxinbank.com'});
            $.cookie('borrowtitle', $('#spborrowtitle').text(), {path: '/', domain: '.hanxinbank.com'});
            $.cookie('yield', $('#spyield').text(), {path: '/', domain: '.hanxinbank.com'});
            $.cookie('addyield', $('#addyield').val(), {path: '/', domain: '.hanxinbank.com'});
            $.cookie('profit', $('#textresultnumber').text(), {path: '/', domain: '.hanxinbank.com'});
            window.location.href = "https://cashs.hanxinbank.com/cashiers.html";

        }

    });

    //全部替换
    String.prototype.replaceAll = function (str1, str2) {
        var str = this;
        var result = str.replace(eval("/" + str1 + "/gi"), str2);
        return result;
    }

    //查询余额

    $(document).ready(function () {

        $.queryCanUserAmount();
    });

    //充值
    $('#recharge').click(function () {
        if ($.cookie('accountId') == null || $.cookie('accountId') == '') {
            layer.alert('为保障您的账户及资金安全，请尽快开通银行存管账户！', {
                icon: 0,
                skin: 'layer-ext-moon',
                title: '提示',
                btn: ['开通存管账户']
            }, function () {
                window.location.href = 'http://iweb.hanxinbank.com/html/trains/user/accountOpen.html';
            })
            return false;
        }

        window.location = "http://iweb.hanxinbank.com/html/trains/payment/recharge.html";
    });




});

//详情图片点击方法
function showBigImage(url){

    var $win = $(window);
    var src=url;
    var win_h = window.innerHeight || document.documentElement.clientHeight;
    var    win_w = window.innerWidth || document.documentElement.clientWidth;
    var    sroll_t = $win.scrollTop();
    var    sroll_l = $win.scrollLeft();
    var $img = $("<img style='position:absolute;z-index:9999998;left:50%;border-radius:8px;opacity:0;border:2px solid white;' src='" + src + "' />");

    var $bg = $("<div style='position:fixed;z-index:9999997;top:0;bottom:0;left:0;right:0;" +
        "background:black;filter: alpha(opacity=70);-moz-opacity:0.7;opacity: 0.7;'></div>");
    var    $close = $("<a title='关闭' style='position:absolute;z-index:9999999;left:50%;cursor:pointer;width:39px;height:39px;border-radius:50%;font-family:Arial;font-size:14px;text-decoration:none;'></a>");
    $close.css({"background": "url('images/imgviewer-close.png') no-repeat center center", "text-decoration": "none"})
    $bg.appendTo("body").hide().fadeIn(200);
    $close.appendTo("body").hover(function () {
        $(this).css({"background": "url('images/imgviewer-close.png') no-repeat center center", "text-decoration": "none"})
    }, function () {
        $(this).css("background", "url('images/imgviewer-close.png') no-repeat center center");
    }).hide();
    $(document).off("click", $img.get(0));
    $img.appendTo("body");
    $img.load(function () {

        var img_w = $(this).width(),
            img_h = $(this).height();
        /* if(win_h*0.8<img_h||win_w*0.8<img_w){ //处理图片大过屏幕的问题
         var win_scale = win_w/win_h,
         img_scale = img_w/img_h,
         temp = 0;
         if(win_scale>img_scale){ //由图片高度着手处理
         temp = img_h;
         img_h = win_h*0.8;
         img_w = img_w*img_h/temp;
         }else{  //由图片宽度着手处理
         temp = img_w;
         img_w = win_w*0.8;
         img_h = img_w*img_h/temp;
         }
         }*/
        $(this).css({"top": win_h / 2 + sroll_t, "margin-left": -img_w / 2, "margin-top":-img_h / 2, "width": img_w, "height": img_h,"opacity": "1"})
//                .animate({"opacity": "1", "margin-left": -img_w / 2, "margin-top": -img_h / 2, "width": img_w, "height": img_h}, 300,
//                function () {
        $close.css({"top": win_h / 2 + sroll_t, "margin-left": img_w / 2 - 20 + sroll_l, "margin-top": -10 - img_h / 2}).show();
//                    $("html").css({
//                        "overflowY":"hidden",
//                        "overflowX":"hidden"
//                    });
//
//
//                }
//            );
        $close.add($bg).click(function () {
            $img.add($bg).add($close).remove();
            $("html").css({
                "overflowY":"auto",
                "overflowX":"auto"
            });
            $img = $bg = $close = null;
        })
    })

}
