/**
 * Created by Administrator on 2016/7/6.
 */
(function ($) {
    var load = (function () {
        var temHtml = '<div class="hx-dialog"><div class="hd-mask"></div><div class="loadcontent"></div></div>';
        var isFisrt = false;
        var Load = function () {
            this.loadDom = $(temHtml);
            this.init();
        };
        Load.prototype = {
            constructor: Load,
            init: function () {
                $('body').append(this.loadDom);
                return this;
            },
            close: function () {
                $(this.loadDom).hide();
                return this;
            },
            _show: function () {
                $(this.loadDom).show();
                return this;
            }
        }
        return function () {
            if (!isFisrt) {
                isFisrt = new Load()
                return isFisrt;
            } else {
                return isFisrt._show();
            }
        };
    })();
    $.extend({
        selectCom: function (domSelector) {
            var domSelector = domSelector || '.hx-select-com';
            $('body').on('click', domSelector, function (e) {
                $(this).find('ul').show();
                e.stopPropagation();
            });
            $('body').on('click', domSelector + ' li', function (e) {
                $(this).closest('ul').hide();
                $(this).closest(domSelector).find('.current').text($(this).text());
                $(this).closest(domSelector).find('.current').attr('data-value', $(this).attr('data-value'));
                e.stopPropagation();
            });
            $(document).click(function () {
                $('body').find(domSelector + ' ul').hide();
            });
        }
        ,
        selectAll: function (domSelector, chlidSelector) {
            var domSelector = domSelector || '.s-num-all';
            var chlidSelector = chlidSelector || '.s-num';
            $('body').on('change', domSelector, function () {
                var that = $(this);
                var checkboxArray = $(this).closest('table').find(chlidSelector);
                $.each(checkboxArray, function (i, item) {
                    item.checked = that[0].checked;
                });
            });
        }
        ,
        hxToolTip: (function () {
            var toopTipContentHtml = '<div class="hx-tooltip"><div class="bd"></div><span class="after"></span></div>';
            var isRender = false;
            var ToolTip = function () {
                this.toolTipDom = $(toopTipContentHtml);
                this.init();
            };
            ToolTip.prototype = {
                constructor: ToolTip,
                init: function () {
                    var that = this;
                    $('body').append(this.toolTipDom);
                    that.initEvents();
                    return this;
                },
                initEvents: function () {
                    var that = this;
                    $('body').on('mouseover', '[data-tooltip]', {main: that}, that._show);
                    $('body').on('mouseout', '[data-tooltip]', {main: that}, that._hide);
                    return that;
                },
                _hide: function (e) {
                    var that;
                    e ? that = e.data.main : that = this;
                    $(that.toolTipDom).fadeOut();
                    return this;
                },
                _show: function (e) {
                    var that;
                    e ? that = e.data.main : that = this;
                    var left = $(this).offset().left;
                    var top = $(this).offset().top;
                    var width = $(this).width() / 2;
                    $(that.toolTipDom).find('.bd').text($(this).attr('data-title'));
                    $(that.toolTipDom).fadeIn().css({
                        left: left + width,
                        top: top - $(that.toolTipDom).outerHeight() - 10,
                        marginLeft: -$(that.toolTipDom).outerWidth() / 2
                    });
                    return this;
                }
            }
            return function () {
                if (!isRender) {
                    isRender = new ToolTip()
                    return isRender;
                } else {
                    return isRender._show();
                }
            };
        })(),
        loading: function () {
            return load();
            //浣跨敤鏂瑰紡 var a=$.loading();鍏抽棴 a.close();
        }

        ,
        _navTab: function (parent, child, content) {
            var menuParent = $(parent);
            var menu = menuParent.find(child);
            menu.on('click', function (e) {
                if (!$(this).hasClass('active')) {
                    var index = $(this).index(child);
                    $(this).addClass('active').siblings(child).removeClass('active');
                    menuParent.siblings(menuParent).children().hide().eq(index).show();
                }
            });
            return this;
        }
        ,
        setExpireDate: function ($expireDateDiv, expireDate) {

            //expireDate注意是 getTime格式
            var timer1;
            var show_date_time_0 = function () {

                var today = new Date();
                //计算目标时间与当前时间间隔(毫秒数)
                var timeold = expireDate - today.getTime(); //getTime 方法返回一个整数值，这个整数代表了从 1970 年 1 月 1 日开始计算到 Date 对象中的时间之间的毫秒数。

                //计算目标时间与当前时间的秒数
                var sectimeold = timeold / 1000;

                //计算目标时间与当前时间的秒数(整数)
                var secondsold = Math.floor(sectimeold);

                //计算一天的秒数
                var msPerDay = 24 * 60 * 60 * 1000;

                //得到剩余天数
                var e_daysold = timeold / msPerDay;
                //得到剩余天数(整数)
                var daysold = Math.floor(e_daysold);

                //得到剩余天数以外的小时数
                var e_hrsold = (e_daysold - daysold) * 24;
                //得到剩余天数以外的小时数(整数)
                var hrsold = Math.floor(e_hrsold);

                //得到尾剩余分数
                var e_minsold = (e_hrsold - hrsold) * 60;
                //得到尾剩余分数(整数)
                var minsold = Math.floor((e_hrsold - hrsold) * 60);

                //得到尾剩余秒数(整数)
                var seconds = Math.floor((e_minsold - minsold) * 60);
                //判断过期
                if (secondsold < 0) {
                    $expireDateDiv.html("已结束");
                    clearInterval(timer1);
                }
                else {
                    //小时取两位,不足补0
                    if (hrsold < 10) {
                        hrsold = "0" + hrsold;
                    }
                    //分数取两位,不足补0
                    if (minsold < 10) {
                        minsold = "0" + minsold;
                    }
                    //秒数取两位,不足补0
                    if (seconds < 10) {
                        seconds = "0" + seconds;
                    }
                    $expireDateDiv.html(daysold + "天" + hrsold + "小时" + minsold + "分" + seconds + "秒");
                }


            }

            timer1 = setInterval(show_date_time_0, 1000);
        }
        ,
        getQueryString: function (key) {
            key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        /*批量赋值*/
        setOptionsData: function (options) {
            for (i in options) {
                if ($('[data-key="' + i + '"]')) {
                    $('[data-key="' + i + '"]').html(options[i]).attr('data-spare', options[i]);
                }
                ;
            }
            //实例:hxucLMain._setOptionsData({yhq:1,tyj:3})
        }, round: function (num) {
            var bb = num + "";
            var dian = bb.indexOf('.');
            var result = "";
            if (dian == -1) {
                result = num.toFixed(2);
            } else {
                var cc = bb.substring(dian + 1, bb.length);
                if (cc.length >= 3) {
                    result = bb.substring(0, dian + 3)//js小数计算小数点后显示多位小数
                } else {
                    result = num.toFixed(2);
                }
            }
            return result;
        }, pageRoleCheck: function (type) {
            layer.config({
                path: '../js-site/layer/'
            });
            if ($.cookie('accountId') == null || $.cookie('accountId') == '') {
                //开通存管弹框
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
            if (type == "cz") {
                return true;
            }
            if ($.cookie('isSetTransactionPassword') == null
                || $.cookie('isSetTransactionPassword') == false) {
                //设密
                layer.alert('为了保障您的账户及资金安全，请尽快设置存管账户交易密码!', {
                    icon: 0,
                    skin: 'layer-ext-moon',
                    title: '提示',
                    btn: ['设置交易密码']
                }, function () {
                    window.location.href = "http://iweb.hanxinbank.com/userTrains/userPasswordSet.do?logintoken=" + $.cookie("logintoken");
                })
                return false;
            }
            if ($.cookie('bankcardno') == null || $.cookie('bankcardno') == '') {
                //绑卡
                layer.alert('请尽快绑定银行卡，以便进行充值和投资！', {
                    icon: 0,
                    skin: 'layer-ext-moon',
                    title: '提示',
                    btn: ['绑定银行卡']
                }, function () {
                    window.location.href = "http://www.hanxinbank.com/cunguan/changebankcard2.html";
                })
                return false;
            }

            return true;

        },
        queryCanUserAmount: function () {
            if ($.cookie('logintoken') == null) {
                //未登录
                $('#onlineuser').hide();
                $('#loginpart').show();
                $('#login-btn').attr('href', "https://passport.hanxinbank.com/login.html?returnurl=" + window.location.href);
                $('#sign-btn').attr('href', "https://passport.hanxinbank.com/register.html?returnurl=" + window.location.href);
            } else {
                $('#timeduring').text($.getHelloStr());
                $('#spusername').text($.cookie('username'));
                $('#onlineuser').show();
                $('#loginpart').hide();

                $.ajax({
                    url: 'http://iweb.hanxinbank.com/userTrains/balanceQuery.do',
                    type: 'post',
                    data: {
                        "phoneNumber": $.cookie('phonenumber'),
                        "loginToken": $.cookie('logintoken')
                    },
                    dataType: 'jsonp',
                    jsonp: 'callback',
                    success: function (resultvalue) {
                        try {
                            if (resultvalue.retCode == "00000000") {
                                if (resultvalue.availBal != null && resultvalue.availBal != "") {
                                    $('#spcanusemoney').text(resultvalue.availBal);
                                } else {
                                    $('#spcanusemoney').text("0");
                                }
                            }
                        } catch (e) {
                        }
                    },
                    error: function (e) {
                        //alert(e)
                        console.info('ajax报错+:'+ e);
                    }
                });

            }

        },
        inintHeader: function () {
            setTimeout(function () {
                if ($.cookie('logintoken') == null && $.cookie('username') == null) {
                    //未登录
                    $('#onlineuser').hide();
                    $('#loginpart').show();
                    $('#login-btn').attr('href', "https://passport.hanxinbank.com/login.html?returnurl=" + window.location.href);
                    $('#sign-btn').attr('href', "https://passport.hanxinbank.com/register.html?returnurl=" + window.location.href);
                } else {
                    $('#timeduring').text($.getHelloStr());
                    $('#spusername').text($.cookie('username'));
                    $('#onlineuser').show();
                    $('#loginpart').hide();

                }
            }, 50);

        },
        getHelloStr: function () {
            now = new Date(), hour = now.getHours();
            //if(hour < 6){document.write("凌晨好！")}
            //else if (hour < 9){document.write("早上好！")}
            //else if (hour < 12){document.write("上午好！")}
            //else if (hour < 14){document.write("中午好！")}
            //else if (hour < 17){document.write("下午好！")}
            //else if (hour < 19){document.write("傍晚好！")}
            //else if (hour < 22){document.write("晚上好！")}
            //else {document.write("夜里好！")}
            var strHello = "";
            now = new Date(), hour = now.getHours()
            if (hour < 12) {
                strHello = "上午好";
            }
            else {
                strHello = "下午好";
            }

            return strHello;
        },
        setNavTitleNum: function () {
            //省心计划 精选直投 债权转让数量
            $.ajax({
                url: "http://api.hanxinbank.com/Borrow/QueryBorrowCount",
                type: "post",
                data: {},
                dataType: 'jsonp',
                jsonp: 'callback',
                success: function (resultvalue) {
                    var smartNum;
                    var productNum;
                    var stagNum;
                    var credtNum;
                    $.each(resultvalue.Data, function (i, n) {
                        if (n.rows == 'smart-num') {
                            smartNum = n.total;
                        } else if (n.rows == 'product-num') {
                            productNum = n.total;
                        } else if (n.rows == 'stag-num') {
                            stagNum = n.total;
                        } else if (n.rows == 'cred-num') {
                            credtNum = n.total;
                        }
                    });
                    if((productNum+stagNum) >0) {
                        $('.navNum').eq(0).text("("+(productNum+stagNum)+")");
                    }
                    if(credtNum > 0) {
                        $('.navNum').eq(1).text("("+credtNum+")");
                    }

                }
            });

        }, buyTransfer: function (event, transferDialog, Handlebars, canusemoney) {
            // 1、判断登录
            if ($.cookie("logintoken") == null) {
                //未登录
                window.location.href = "http://passport.hanxinbank.com/login.html?returnurl=" + window.location.href;
                return;
            }

            //判断是否开户和绑卡
            if (!$.pageRoleCheck()) {
                return;
            }

            if ($.cookie("hxusertype") == "1" && $.cookie("wdtype") != 3) {
                //借款人
                layer.msg('暂不能进行投资哦');
                return false;
            }

            // var investAmount = parseFloat($btn.siblings("input.input").val());
            //判断余额是否充足  在点击债转的弹框时判断


            //3、弹出图形验证码弹窗


            var $btn = $(event.currentTarget);
            event.stopPropagation();

            var box_data = $btn.parent().data();
            var investAmount = parseFloat(box_data.buyAmount);

            //4.相关参数写入cookie
            var transferId = box_data.investRecordId;
            $.cookie("transferid", transferId.toString(), {path: '/', domain: '.hanxinbank.com'});
            $.cookie("investamount", box_data.buyAmount, {path: '/', domain: '.hanxinbank.com'});

            $._navTab('.menu-tab', '.tab', '.tab-content');
            var tem = transferDialog;//获取弹窗的html
            tem = Handlebars.compile(tem); //用handlebar进行编译
            tem = tem(box_data);
            layer.ready(function () {
                layer.open({
                    type: 1,
                    title: '购买',
                    area: ['760px', '550px'],
                    btn: ['确认购买'],
                    yes: function (index, layero) {
                        $('.layui-layer-btn0').addClass('btn disabled');


                        //判断余额
                        if (isNaN(canusemoney)) {
                            canusemoney = 0;
                        }


                        if (canusemoney < investAmount) {
                            var tipHtml = "<span >您的账户余额不足</span><a href='http://iweb.hanxinbank.com/html/trains/payment/recharge.html'>充值</a>"
                            $('.error-bd').html(tipHtml);
                            $('.error-bd').show();  //余额不足
                            return false;
                        }

                        try {
                            if (window.isquerying) {
                                return;
                            }

                            event.stopPropagation();
                            event.preventDefault();


                            if ($.cookie('sourcetype') == null) {
                                $.cookie('sourcetype', 1, {path: '/', domain: '.hanxinbank.com'});
                            }

                            window.isquerying = true;


                            //开始购买债转让操作
                            if (window.parent.location.href.indexOf("creditList.html") != -1
                                || window.parent.location.href.indexOf("creditDetail.html") != -1) {
                                var logintoken = $.cookie("logintoken");
                                var transferId = $.cookie("transferid");

                                $.ajax({
                                    url: "http://iweb.hanxinbank.com/transfer/buyTransfer.do",
                                    type: "post",
                                    data: {
                                        "loginToken": logintoken,
                                        "id": transferId
                                    },
                                    dataType: 'jsonp',
                                    jsonp: 'callback',
                                    success: function (resultvalue) {
                                        window.isquerying = false;
                                        if (resultvalue.code == "0000") {
                                            $('#m_main_form', window.parent.document).attr("action", resultvalue.result.jiXinHost);
                                            $('#sign', window.parent.document).val(resultvalue.result.sign);
                                            $('#version', window.parent.document).val(resultvalue.result.version);
                                            $("#txCode", window.parent.document).val(resultvalue.result.txCode);
                                            $("#instCode", window.parent.document).val(resultvalue.result.instCode);
                                            $("#bankCode", window.parent.document).val(resultvalue.result.bankCode);
                                            $("#txDate", window.parent.document).val(resultvalue.result.txDate);
                                            $("#txTime", window.parent.document).val(resultvalue.result.txTime);
                                            $("#seqNo", window.parent.document).val(resultvalue.result.seqNo);
                                            $("#channel", window.parent.document).val(resultvalue.result.channel);
                                            $("#accountId", window.parent.document).val(resultvalue.result.accountId);
                                            $("#orderId", window.parent.document).val(resultvalue.result.orderId);
                                            $("#txAmount", window.parent.document).val(resultvalue.result.txAmount);
                                            $("#frzFlag", window.parent.document).val(resultvalue.result.frzFlag);
                                            $("#bonusFlag", window.parent.document).val(resultvalue.result.bonusFlag);
                                            $("#bonusAmount", window.parent.document).val(resultvalue.result.bonusAmount);
                                            $("#txFee", window.parent.document).val(resultvalue.result.txFee);
                                            $("#tsfAmount", window.parent.document).val(resultvalue.result.tsfAmount);
                                            $("#forAccountId", window.parent.document).val(resultvalue.result.forAccountId);
                                            $("#orgOrderId", window.parent.document).val(resultvalue.result.orgOrderId);
                                            $("#orgTxAmount", window.parent.document).val(resultvalue.result.orgTxAmount);
                                            $("#productId", window.parent.document).val(resultvalue.result.productId);
                                            $("#forgotPwdUrl", window.parent.document).val(resultvalue.result.forgotPwdUrl);
                                            $("#retUrl", window.parent.document).val(resultvalue.result.retUrl);
                                            $("#notifyUrl", window.parent.document).val(resultvalue.result.notifyUrl);
                                            $("#acqRes", window.parent.document).val(resultvalue.result.acqRes);
                                            $("#sign", window.parent.document).val(resultvalue.result.sign);
                                            var myForm = $('#m_main_form', window.parent.document);
                                            myForm.submit();
                                        } else {
                                            if (resultvalue.message) {
                                                $('.error-bd').html(resultvalue.message).show();
                                                setTimeout(function () {
                                                    $('.error-bd').hide();
                                                }, 4000);
                                            } else {
                                                $('.error-bd').html("购买产品失败").show();
                                                setTimeout(function () {
                                                    $('.error-bd').hide();
                                                }, 4000);
                                            }
                                        }
                                    }
                                });

                            }
                        } catch (e) {
                            window.isquerying = false;
                        }

                    },
                    content: tem //这里content是一个普通的String
                });
            })

            return;
            //$.hxToolTip();
            //exitDialog();//弹窗实例，不需要的地方就删除掉
        },
        getStatusDesc : function (status) {
            if(status == 4) {
                return '立即抢购';
            } else if (status == 5) {
                return '已抢完';
            } else if (status == 6 || status==10) {
                return '还款中';
            } else if (status == 11) {
                return '已完结';
            }
        },
        fmoney : function (s, n) {
            //转化成千分位并保留两位小数
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

    });
})
(jQuery);