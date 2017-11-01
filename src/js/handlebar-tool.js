define(['jquery', 'handlebars'], function ($, Handlebars) {

    Handlebars.registerHelper("formatAmount", function (num) {
        num = String(num.toFixed(2));
        var re = /(-?\d+)(\d{3})/;
        while (re.test(num)) {

            num = num.replace(re, "$1,$2");
        }
        return num;

    });


    Handlebars.registerHelper("formatYield", function (v1, options) {
        return (v1 * 100).toFixed(2);
    });


    Handlebars.registerHelper("formatIcon", function (channel, options) {

        if (channel == 1) {
            return 'source-pc';
        } else {
            return 'source-phone';
        }

    });

    Handlebars.registerHelper('ifSoldOut', function (v1, v2, options) {
        if (v1 == v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });


    Handlebars.registerHelper('countLeftAmount', function (obj) {
        return obj.borrowamount - obj.finishamount;
    });

    //判断奇数偶数
    Handlebars.registerHelper('oddOrEven', function (num, options) {
        if (num % 2 == 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    });

    Handlebars.registerHelper('statusDesc', function (status) {
        if (status == 4) {
            return '立即抢购';
        } else if (status == 5) {
            return '已抢完';
        } else if (status == 6 || status == 10) {
            return '还款中';
        } else if (status == 11) {
            return '已完结';
        }
    });


    Handlebars.registerHelper({
        'formaurl': function (str) {
            var result = "";
            if (str.length < 20) {
                result = "http://admin.hanxinbank.com/UploadImages/" + str;
            } else {
                result = "http://pic.hanxinbank.com/" + str;
            }
            return result;
        }, 'formatStr': function (str) {
            if (str == null || str == undefined) {
                return '';
            }

            if (str.length > 77) {
                return str.substring(0, 77) + "...";
            } else {
                return str;
            }
        }
    });


});