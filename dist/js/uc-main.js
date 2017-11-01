/**
 * Created by Administrator on 2017/5/25.
 */
require(['jquery', 'js-site/com-wplandialog', 'handlebars', 'calendar', 'charts', 'tools', 'js-site/handlebar-tool','cookie'], function ($, wpDialog, Handlebars) {
    var loginToken = $.cookie('logintoken');
    $(function () {
        //  wpDialog();//授权事例  弹窗
        $.hxToolTip();

        $.ajax({
            url: 'http://iweb.hanxinbank.com/UserCenterMain/findPersonInfo.do',
            type: 'post',
            dataType: 'jsonp',
            jsonp: 'callback',
            data: {'logintoken': loginToken},
            success: function (data) {
                var myTemplate = Handlebars.compile($("#asset-template").html());
                //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                $('.hxuc-assets').html(myTemplate(data));
                var isShowMoney = data.isShowMoney;
                $('.show-money').click(function () {
                    var hidemoneys = $('[data-hidemoney]');
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        $.each(hidemoneys, function (i, item) {
                            $(item).html($(item).attr('data-spare'));
                        });
                        showMoney("1");//关闭
                    } else {
                        $(this).addClass('active');
                        hidemoneys.html('--');
                        showMoney("2");//打开
                    }
                });//显示隐藏金额数目
                if (isShowMoney == "false") {
                    $('.show-money').trigger('click');
                }
                if (data.todayIntegral != "0") {
                    $("#uc-sign").text("今日+" + data.todayIntegral);
                    $("#uc-sign").addClass("disabled");

                }
                if (data.threeDays != "0") {
                    $(".clock").css("display", "inline-block");
                } else {
                    $(".clock").css("display", "none");
                }

                addActive();

                //计算总资产
                $.ajax({
                    url: 'http://iweb.hanxinbank.com//userTrains/balanceQuery.do',
                    type: 'post',
                    data: {
                        "phoneNumber":'11102799016',
                        "loginToken":loginToken
                    },
                    dataType: 'jsonp',
                    jsonp: 'callback',
                    success:function(resultvalue) {
                        if (resultvalue.retCode == "00000000") {
                            var fixAmount = data.fixAmount.replaceAll(",", "");
                            var fixAmount1 = data.fixAmount1.replaceAll(",", "");
                            var fullAmount = data.fullAmount.replaceAll(",", "");
                            var a = /^[0-9]*(\.[0-9]{1,})?$/;
                            if (!a.test(fixAmount)) {
                                fixAmount = 0.00;
                            }
                            if (!a.test(fullAmount)) {
                                fullAmount = 0.00;
                            }
                            if (!a.test(fixAmount1)) {
                                fixAmount1 = 0.00;
                            }
                            var all = parseFloat(resultvalue.currBal) + parseFloat(fixAmount) + parseFloat(fixAmount1)
                                - parseFloat(fullAmount);


                            $('#totalAmount').attr('data-spare', fmoney(all));
                            $('#spcanusemoney').attr('data-spare', fmoney(resultvalue.availBal));
                            $('#spfreeze').attr('data-spare', fmoney(resultvalue.freezeBal));
                            if (isShowMoney != "false") {
                                $('#totalAmount').text(fmoney(all));
                                $('#spcanusemoney').text(fmoney(resultvalue.availBal))
                            }

                            if (parseFloat(resultvalue.freezeBal) - parseFloat(fullAmount) > 0 && isShowMoney != "false") {
                                $('#spfreeze').html(fmoney(resultvalue.freezeBal - fullAmount));
                            } else {
                                $('.freeze').hide();
                            }
                        }
                    },
                    error:function(e) {
                        //alert(e)
                        console.info('ajax报错+:'+ e);
                    }
                });


                $('#uc-sign').click(function () {
                    if (!$(this).hasClass('disabled')) {
                        var btn = $(this);
                        var em = $(this).find('.intergral-num');
                        $.ajax({
                            url:"http://mobileserver.hanxinbank.com/integral/sign.action",
                            type:"post",
                            data:{"logintoken":loginToken,"channel":1},
                            dataType:'jsonp',
                            jsonp: 'callback',
                            success:function(data){
                                em.text("+"+data.todaySign).css({top: -20}).show().animate({top: -30}, 200);
                                window.setTimeout(function () {
                                    btn.addClass('disabled').find('i').text('今日+'+data.todaySign);
                                    em.hide();
                                    $("#integral").text(data.integral+"积分");
                                }, 1000);
                            }
                        });

                    }
                });//签到
            },
            error: function (e) {
                //alert(e)
                console.info('ajax报错+:'+ e);
            }
        });

        initPie();

        initCalendar();

        initBorrowinfo();
    });


    function initPie() {
        $.ajax({
            url: 'http://iweb.hanxinbank.com/UserCenterMain/findInvestTypeAmount.do',
            type: 'post',
            data: {
                "logintoken":loginToken
            },
            dataType: 'jsonp',
            jsonp: 'callback',
            success:function(data) {
                var title = eval('(' + data + ')').title;
                var pic = eval('(' + data + ')').pic;
                for (var i = 0; i < title.length; i++) {
                    var html = '<li><em class="c' + (i + 1) + '"></em>' + title[i].name + '<span data-spare="' + title[i].amount + '" data-hidemoney="true">' + title[i].amount + '</span></li>';
                    $("#picTitle").append(html);
                }

                // Create the chart
               // pic[0].name = "资产占比:";
                if (pic[0].name == "资产占比:") {
                   $('.payment-records').before($('.recom-shop').after($('.re-allocators')));
                    $('#container').html("<img src='../images-site/pie.png' />");
                } else {
                    $('#container').highcharts({
                        chart: {
                            type: 'pie'
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            valueSuffix: '%',
                            headerFormat: '<span></span>',
                            itemStyle: {
                                "color": "#fff",
                                "font-size": "18px",
                                "font-family": "微软雅黑",
                                "font-weight": "normal"
                            }
                        },
                        series: [{
                            name: '投资比例',
                            data: pic,
                            size: '90%',
                            innerSize: '80%',
                            dataLabels: {
                                formatter: function () {
                                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
                                }
                            }
                        }]
                    });
                }
            },
            error:function(e) {
                //alert(e)
                console.info('ajax报错+:'+ e);
            }
        });

    }

    function initCalendar(thisMonth){
        if (thisMonth==null){
            thisMonth = getNowFormatDate();
        }
     //   var cokie=$.cookie("logintoken");

        $.ajax({
            url:"http://iweb.hanxinbank.com/UserCenterMain/findcalendars.do",
            type:"post",
            data:{"logintoken":loginToken,"thisMonth":thisMonth},
            dataType: 'jsonp',
            jsonp: 'callback',
            success:function(data){

                $('#ca').calendar({
                    width: 590,
                    height: 360,
                    data: data.cal,
                    onSelected: function (view, date, data) {
                        if(data || thisMonth.substring(0,7)==todayYearMonth){

                            var dt = new Date(date);
                            var year = dt.getFullYear();
                            var month;
                            if (9>=dt.getMonth()+1>=1){
                                month = "-0"+(dt.getMonth()+1);
                            }else{
                                month = "-"+(dt.getMonth()+1);
                            }
                            var day ;
                            if (9>=dt.getDate()>=1){
                                day = "-0"+dt.getDate();
                            }else{
                                day = "-"+dt.getDate();
                            }

                            var thisDay = year+month+day;

                            selectCalendar(thisDay);

                        }else{
                            alert("无回款信息!")
                        }

                    }
                });
                if (thisMonth.substring(0,7)==todayYearMonth){
                    $("#first1").text(data.firstLabel);
                    $("#first2").text(data.firstVal);
                    $("#second1").text(data.secondLabel);
                    $("#second2").text(data.secondVal);
                    $("#third1").text(data.thirdLabel);
                    $("#third2").text(data.thirdVal);
                }

            }
        });

    }


    function selectCalendar(thisMonth){
        if (thisMonth==null){
            thisMonth = getNowFormatDate();
        }
       // var cokie=$.cookie("logintoken");

        $.ajax({
            url:"http://iweb.hanxinbank.com/UserCenterMain/selectCalendars.do",
            type:"post",
            data:{"logintoken":loginToken,"thisMonth":thisMonth},
            dataType: 'jsonp',
            jsonp: 'callback',
            success:function(data){

                $("#first1").text(data.firstLabel);
                $("#first2").text(data.firstVal);
                $("#second1").text(data.secondLabel);
                $("#second2").text(data.secondVal);
                $("#third1").text(data.thirdLabel);
                $("#third2").text(data.thirdVal);

            }
        });

    }

    //选择最新的3个标展示
    function initBorrowinfo(){

        $.ajax({
            url:"http://iweb.hanxinbank.com/UserCenterMain/findLastestBorrow.do",
            type:"post",
            data:{},
            dataType: 'jsonp',
            jsonp: 'callback',
            success:function(data){
                if (data==null || data.length==0){
                    $(".recom-shop").css("display","none");
                    return;
                }
                var reTemplate = Handlebars.compile($("#recommend-template").html());
                //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                $('.recom-shop .bd').html(reTemplate(data));
            }
        });
    }

    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        todayYearMonth = date.getFullYear() + seperator1 + month;
        month = month;
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        return currentdate;
    }


    function addActive() {
        if ($('.coupon').text().substring(0, 1) != "0") {
            $(".coupon").addClass("active");
        }
        if ($('.inc').text().substring(0, 1) != "0") {
            $(".inc").addClass("active");
        }
        if ($('.integral').text().substring(0, 1) != "0") {
            $(".integral").addClass("active");
        }
        /*if ($("#expergold").text().substring(0,1)=="0"){
         $("#expergold").closest("li").removeClass("active");
         }  体验金现在没有了*/
        if ($(".fri").text().indexOf("已邀请0个好友") < 0) {
            $(".fri").addClass("active");
        }
    }


    function fmoney(s, n)
    {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
        var l = s.split('.') [0].split('').reverse(),
            r = s.split('.') [1];
        var  t = '';
        for (var i = 0; i < l.length; i++)
        {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
        }
        return t.split('').reverse().join('') + '.' + r;
    }


    //全部替换
    String.prototype.replaceAll = function (str1, str2) {
        var str = this;
        var result = str.replace(eval("/" + str1 + "/gi"), str2);
        return result;
    }

    function showMoney(type){

        $.ajax({
            url:"http://iweb.hanxinbank.com/UserCenterMain/updateShowMoney.do",
            type:"post",
            data:{"logintoken":loginToken,"type":type},
            dataType:'jsonp',
            jsonp: 'callback',
            success:function(data){

            }
        });

    }


});