/**
 * Created by Administrator on 2016/4/26.
 */

(function ($,Handlebars) {
    $.fn.extend({
        Scroll: function (opt, callback) {
            if (!opt) var opt = {};
            var timerID,
                _children = opt.children ? $(this).find(opt.children) : $(this).children(),
                type = opt.type ? opt.type : "top",
                upHeight = opt.height ? opt.height : _children.height(),
                upWidth = opt.width ? opt.width : _children.width();
            var _this = this,
                speed = opt.speed ? parseInt(opt.speed, 10) : 500,
                timer = opt.timer;
            var scrollUp = function () {
                var _children = opt.children ? $(_this).find(opt.children) : $(_this).children();
                if (type == 'top') {
                    _children.eq(0).animate({
                        marginTop: -upHeight
                    }, speed, function () {
                        _this.append(_children.eq(0).css({marginTop: 0}));
                    });
                } else {
                    _children.eq(0).animate({
                        marginLeft: -upWidth
                    }, speed, function () {
                        _this.append(_children.eq(0).css({marginLeft: 0}));
                    });
                }

            }
            var autoPlay = function () {
                if (timer) {
                    timerID = window.setInterval(scrollUp, timer);
                }
            };
            var autoStop = function () {
                if (timer) {
                    window.clearInterval(timerID);
                }
            };
            _this.hover(autoStop, autoPlay).mouseout();
        }
        ,
        toggleScroll: function (opt) {
            /*opt={
             pre:'上一步按钮',
             next:'下一步按钮',
             type:'width/height',
             tabNum:'切换的数量',
             content:'做移动的div',
             distance:'单个div的距离',
             ajustDis:'调整距离（非必填项）',
             swap:'是否无缝滚动'
             }*/
            $.each($(this), function (i, item) {
                var preBtn = $(this).find(opt.pre),
                    nexBtn = $(this).find(opt.next),
                    type = opt.type,
                    tabNum = opt.tabNum || 1,//每次切换数量
                    swap = opt.swap || false,
                    content = $(this).find(opt.content),
                    max = opt.max || 1,//每行容纳的个数
                    totalNum = Math.ceil((content.children().length - max) / tabNum),//总切换次数
                    movingDistance = opt.distance,
                    ajustDis = opt.ajustDis || 0,//调整距离，用于细节调整
                    index = 0;
                if (swap) {
                    content.children().slice(0, max).clone().appendTo(content);
                }
                var isFirst = function () {
                    return index == 0;
                };
                var isLast = function () {
                    return index == totalNum;
                };
                var ajustBtn = function () {
                    if (!swap) {
                        isFirst() ? preBtn.hide() : preBtn.show();
                        isLast() ? nexBtn.hide() : nexBtn.show();
                    }
                };
                var toNext = function () {
                    if (((!isLast() && !swap) || (index < (max + totalNum) && swap)) && !content.is(":animated")) {
                        if (type == 'top') {
                            $.when(content.animate({marginTop: "-=" + (movingDistance * tabNum + ajustDis)}, 'easein')).then(function () {
                                index++;
                                ajustBtn();
                            });
                        } else {
                            $.when(content.animate({marginLeft: "-=" + (movingDistance * tabNum + ajustDis)}, 'easein')).then(function () {
                                index++;
                                ajustBtn();
                            });
                        }
                    } else if (swap && index == (max + totalNum) && !content.is(":animated")) {
                        if (type == 'top') {
                            index = 0;
                            content.css({marginTop: 0});
                        } else {
                            index = 0;
                            content.css({marginLeft: 0});
                        }
                        toNext();
                    }
                };
                var toPre = function () {
                    if (!isFirst() && !content.is(":animated")) {
                        if (type == 'top') {
                            $.when(content.animate({marginTop: "+=" + (movingDistance * tabNum + ajustDis)}, 'easein')).then(function () {
                                index--;
                                ajustBtn();
                            });
                        } else {
                            $.when(content.animate({marginLeft: "+=" + (movingDistance * tabNum + ajustDis)}, 'easein')).then(function () {
                                index--;
                                ajustBtn();
                            });
                        }
                    } else if (isFirst() && swap && !content.is(":animated")) {
                        if (type == 'top') {
                            content.css({marginTop: -(movingDistance * (content.children().length - max) + ajustDis)});
                            $.when(content.animate({marginTop: "+=" + (movingDistance * tabNum + ajustDis)}, 'easein')).then(function () {
                                index = totalNum + max - 1;
                            });
                        } else {
                            content.css({marginLeft: -(movingDistance * (content.children().length - max) + ajustDis)});
                            $.when(content.animate({marginLeft: "+=" + (movingDistance * tabNum + ajustDis)}, 'easein')).then(function () {
                                index = totalNum + max - 1;
                            });
                        }
                    }
                };
                $(preBtn).on('click', toPre);
                $(nexBtn).on('click', toNext);
                ajustBtn();
            });
        }
        ,
        navTab: function (opt) {
            var tabNav = $(this).find(opt.nav);
            var tabContent = $(this).find(opt.content).children();
            var activeClass = opt.active;
            var type = opt.type || 'click';
            tabNav.on(type, function () {
                var index = $(this).index();
                tabNav.removeClass(activeClass);
                $(this).addClass(activeClass);
                tabContent.hide();
                tabContent.eq(index).show();
            });
        }
        ,
        fixedScroll: function (className) {
            var that = $(this);
            var top = that.parent().offset().top;
            $(window).scroll(function () {
                if ($(window).scrollTop() > top) {
                    that.addClass(className);
                } else {
                    that.removeClass(className);
                }
            })
        }
        ,
        _linkGo: function (e) {
            var that = e ? e.data.main : this;
            var url = $(this).attr('data-href');
            $(this).on('click', function () {
                window.location.href = url;
            });
        }
        ,

        growNum: function () {
            var Run = function (dom) {
                this.element = $(dom);
                this.init();
            }
            Run.prototype = {
                totalNum: null,
                count: null,
                index: 0,
                current: 0,
                numArray: [],
                renderDefault: function () {
                    var that = this;
                    that.totalNum = parseFloat(that.element.attr('data-num'));
                    that.element.attr('data-count') ? that.count = parseFloat(that.element.attr('data-count')) : that.count = 30;
                    return that;
                },
                init: function () {
                    var that = this;
                    that.renderDefault().setNumArray().setText();
                    return this;
                },
                setNumArray: function () {
                    var that = this;
                    var lsNumArray = [];
                    for (var i = 0; i < that.count; i++) {
                        if (i < that.count - 1) {
                            var num = Math.ceil(Math.random() * (that.totalNum - 1));
                            lsNumArray.push(num);
                        } else {
                            lsNumArray.push(that.totalNum);
                            that.numArray = lsNumArray.sort(function (a, b) {
                                return a - b
                            });
                            ;
                        }
                    }
                    return that;
                },
                setText: function () {
                    var that = this;
                    if (that.count == that.index) {
                        var text = that.totalNum.toLocaleString().split('.00')[0];
                        that.element.text(text);
                    } else {
                        var text = that.numArray[that.index].toLocaleString().split('.00')[0];
                        that.element.text(text);
                        that.index++;
                        window.setTimeout(function () {
                            that.setText()
                        }, 100);
                    }
                    return this;
                }
            }
            $.each($(this), function (i, item) {
                new Run(item);
            });
        }
    });
    $.extend({
        linkGo: function () {
            $('body').on('click', '[data-href]', function () {
                var url = $(this).attr('data-href');
                window.location.href = url;
            });
        }
    });
})
(jQuery);