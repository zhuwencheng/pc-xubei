/**
 * Created by Administrator on 2017/5/23.
 */
require(['jquery', 'layer', 'handlebars','js-site/com-transferdialog', 'cookie', 'tools', 'pager', 'js-site/handlebar-tool', 'lazyLoad'], function ($, layer, Handlebars,transferdialog) {
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

        $.hxToolTip();


        var borrowid = $.getQueryString('borrowid');

        var transferid = $.getQueryString('transferid');

        initData();

        //获取债权信息
        function initData() {
            if (transferid == null || transferid == "") {
                transferid = $.cookie("transferid");
            } else {
                $.cookie('transferid', transferid, {path: '/', domain: '.hanxinbank.com'});
            }
            if (borrowid == null || borrowid == "") {
                borrowid = $.cookie("borrowid");
            } else {
                $.cookie('borrowid', borrowid, {path: '/', domain: '.hanxinbank.com'});
            }

            $.ajax({
                url: 'http://iweb.hanxinbank.com/transfer/queryCreditTransferPageById.do',
                data: {"id": transferid},
                type: 'post',
                dataType: 'jsonp',
                jsonp: 'callback',
                success : function(returnJson) {
                    if (returnJson.code == "0000") {
                       // $('.old-detail').attr('href', 'http://www.hanxinbank.com/productDetail.html?borrowid=' + returnJson.result.borrowinfoid);
                        $('.borrowcard').data(returnJson.result);
                        $('#hyield').val(returnJson.result.yield);

                        $('#spborrowtitle').text(returnJson.result.borrowInfoTitle);
                        $('#cuttransferprice').text(returnJson.result.cutTransferPrice);//
                        $('#spyield').text(returnJson.result.cost);
                        $('#yield').text(returnJson.result.yield);
                        $('#spborrowday').text(returnJson.result.transferDays);//
                        $("#borrowType").val(returnJson.result.borrowType);
                        $.cookie('borrowday', returnJson.result.remainDays, {path: '/', domain: '.hanxinbank.com'});
                        $('#creditValue').text(returnJson.result.transferCost);//
                        var today = (new Date()).toLocaleDateString().replace(/\//g, '-');
                        $('#valueDate').text(returnJson.result.investStart || today);//起息日
                        $('#transferAmount').text(returnJson.result.buyAmount);//
                        $('#investAmount').val(returnJson.result.buyAmount);//
                        //$('#discount').text(returnJson.result.discount)//折让率
                        $('#investAmount').attr("readonly", "readonly");
                        $('#textresultnumber').text(returnJson.result.prospective);//

                        /*if (returnJson.result.borrowType == 1 || returnJson.result.borrowInfoTitle.indexOf("校园") >= 0) {
                         $("#thirdpart").html("多重保障");
                         }
                         */

                        //transferNum
                        $('#transfernum').text(returnJson.result.amount);//
                        $('#proDetail').attr('href','http://www.hanxinbank.com/new/borrowDetail.html?borrowid='+returnJson.result.borrowinfoid);
                        var time = new Date(returnJson.result.expiresTimeStr).valueOf();
                        var expireDate = new Date(returnJson.result.expiresTimeStr).getTime();
                        $.setExpireDate($('#leftTime'), expireDate)

                        //先注销掉
                        //$('#spnSurplus').html(returnJson.result.raiseenddate);//结束时间returnJson.result.remainDays

                        window.LazyLoadImg();

                    }

                },
                error : function(e) {
                    //alert(e);
                    console.info('ajax报错+:'+ e);
                }
            });

        }

        //获取可用余额
        $.queryCanUserAmount();
        getDescriton();
        getCanUseMoney();

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
      //  $('body').on('click', '#btntoInvest', $.buyTransfer);
        $('#btntoInvest').unbind('click').bind('click',function() {
            $.buyTransfer(event,transferdialog,Handlebars,canusemoney);
        })

//获取项目详情
        function getDescriton() {

            $.ajax({
                url: 'http://iweb.hanxinbank.com//borrowInfo/getBorrowinfo.do',
                data: {"id": borrowid},
                type: 'post',
                dataType: 'jsonp',
                jsonp: 'callback',
                success : function(resultvalue) {
                    if (resultvalue.code == "0000" && resultvalue.result != null) {

                        $('#description').html(resultvalue.result.description);
                        $('.bd').html(resultvalue.result.description);
                    }

                },
                error : function(e) {
                    //alert(e);
                    console.info('ajax报错+:'+ e);
                }
            });
        }


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
                        "borrowId": borrowid,
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


    }
)
;


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
