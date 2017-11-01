/**
 * Created by Administrator on 2015/9/15.
 */
;
(function () {
    var LazyLoad = function (obj) {
        this.lazy = typeof obj === 'string' ? document.getElementById(obj) : document.getElementsByTagName('body')[0];
        this.aImg = this.lazy.getElementsByTagName('img');

        this.fnLoad = this.bind(this, this.load);
        this.load();
        window.onscroll = this.fnLoad;
        $('body').on('resize', this.fnLoad);

    };
    LazyLoad.prototype = {
        opts: {
            scrollArea: $('body')
        },
        load: function () {
            var iScrollTop = document.body.scrollTop | document.documentElement.scrollTop;
            // 屏幕上边缘
            var iClientHeight = document.documentElement.clientHeight + iScrollTop;
            // 屏幕下边缘
            var i = 0;
            var iTop = 0;
            var iBottom = 0;
            var aNotLoaded = this.loaded(0);
            if (this.loaded(1).length != this.aImg.length) {
                var notLoadedLen = aNotLoaded.length;
                for (i = 0; i < notLoadedLen; i++) {
                    iTop = this.pageY(aNotLoaded[i])-50;
                    iBottom = this.pageY(aNotLoaded[i]) + aNotLoaded[i].offsetHeight + 10;
                    var isTopArea = (iTop > iScrollTop && iTop < iClientHeight) ? true : false;
                    var isBottomArea = (iBottom > iScrollTop && iBottom < iClientHeight) ? true : false;

                    if (isTopArea || isBottomArea) {
                        // 把预存在自定义属性中的真实图片地址赋给src
                        aNotLoaded[i].src = this.attr(aNotLoaded[i], 'data-src') || aNotLoaded[i].src;
                        var pl = aNotLoaded[i].src.indexOf('_180x180.jpg');
                        if (pl > 0) {
                            aNotLoaded[i].src = aNotLoaded[i].src.substring(0, pl);
                            aNotLoaded[i].src = aNotLoaded[i].src.replace("HxBank-Image/image/", "");
                        }
                        if (!this.hasClass(aNotLoaded[i], 'loaded')) {
                            if ('' != aNotLoaded[i].className) {
                                aNotLoaded[i].className = aNotLoaded[i].className.concat(" loaded");
                            }
                            else {
                                aNotLoaded[i].className = 'loaded';
                            }
                        }
                    }
                }
            }
        },
        loaded: function (status) {
            var array = [];
            for (var i = 0; i < this.aImg.length; i++) {
                var hasClass = this.hasClass(this.aImg[i], 'loaded');
                if (!status) {
                    if (!hasClass)
                        array.push(this.aImg[i])
                }
                if (status) {
                    if (hasClass)
                        array.push(this.aImg[i])
                }
            }
            return array;
        },
        on: function (element, type, handler) {
            return element.addEventListener ? element.addEventListener(type, handler, false) : element.attachEvent('on' + type, handler)
        },
        bind: function (object, handler) {
            return function () {
                return handler.apply(object, arguments)
            }
        },
        pageY: function (El) {
            var top = 0;
            do {
                top += El.offsetTop;
            } while (El.offsetParent && (El = El.offsetParent).nodeName.toUpperCase() != 'BODY');
            return top;
        },
        hasClass: function (element, className) {
            return new RegExp('(^|\\s)' + className + '(\\s|$)').test(element.className);
        },
        attr: function (element, attr, value) {
            if (arguments.length == 2) {
                return element.attributes[attr] ? element.attributes[attr].nodeValue : undefined
            }
            else if (arguments.length == 3) {
                element.setAttribute(attr, value)
            }
        }
    }

    var LazyLoadImg = function () {
        return new LazyLoad()
    };

    window.LazyLoadImg = LazyLoadImg;
})(window);