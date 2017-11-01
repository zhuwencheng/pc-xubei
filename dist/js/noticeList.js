/**
 * Created by Administrator on 2017/5/23.
 */
require(['jquery', 'handlebars', 'tools', 'pager', 'js-site/handlebar-tool'], function ($, Handlebars) {


    var articlecategoryid = $.getQueryString('articlecategoryid');
    var pagesize = 6;
    if(articlecategoryid == 6) {
        pagesize = 3;
    }
    //网站公告
    $('.hx-pagination').setPager({
        pageindex: 1,
        pagesize: pagesize,
        totalType : 'totalRows',
        showFirstAndLast: true,
        ajax_function: function (pageindex, pagesize) {
            return $.ajax({
                url: 'http://iweb.hanxinbank.com//about/findProfessionLists.do',
                data: {
                    "currentPage": pageindex,
                    "pageSize": pagesize,
                    "articlecategoryid" : articlecategoryid
                },
                type: 'post',
                dataType: 'jsonp',
                jsonp: 'callback'
            });
        },
        successFun: function (data) {
            if (data.code == '200') {
                var noticeTemplate = Handlebars.compile($("#noticeTemplate").html());
                //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                $('#tempContent').html(noticeTemplate(data.list));
              //  $('.hx-pagination').before(noticeTemplate(data.list));
            } else {
                layer.msg('加载数据失败');
            }
        },
        failFun: function (data) {
            layer.msg('加载数据失败');
        }
    })








});
