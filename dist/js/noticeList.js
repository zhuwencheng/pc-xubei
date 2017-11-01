/**
 * Created by Administrator on 2017/5/23.
 */
require(['jquery', 'handlebars', 'tools', 'pager', 'js-site/handlebar-tool'], function ($, Handlebars) {


    var articlecategoryid = $.getQueryString('articlecategoryid');
    var pagesize = 6;
    if(articlecategoryid == 6) {
        pagesize = 3;
    }
    //��վ����
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
                //��json�����øո�ע���Handlebarsģ���װ���õ����յ�html�����뵽����table�С�
                $('#tempContent').html(noticeTemplate(data.list));
              //  $('.hx-pagination').before(noticeTemplate(data.list));
            } else {
                layer.msg('��������ʧ��');
            }
        },
        failFun: function (data) {
            layer.msg('��������ʧ��');
        }
    })








});
