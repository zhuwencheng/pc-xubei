/**
 * Created by Administrator on 2017/5/23.
 */
require(['jquery', 'layer', 'handlebars', 'tools', 'lazyLoad2'], function ($,layer) {
    layer.config({
        path: '../js-site/layer/' //layer.js���ڵ�Ŀ¼�������Ǿ���Ŀ¼��Ҳ���������Ŀ¼
    });


    var id = $.getQueryString('noticeId');

    $.ajax({
        url: 'http://iweb.hanxinbank.com//about/getArticleById.do',
        data: {id:id},
        dataType: "jsonp",
        success: function (result) {
            if(result != null && result.code == '200') {
                $('.title').text(result.object.articleTitle);
                $('.time').html(result.object.source+'<span class="mgl-20">'+result.object.modifiedDate+'</span>');
                $('.bd').html(result.object.articleContent);

                window.LazyLoadImg();
            } else {
                layer.msg('加载数据失败');
            }


        }

    });








});
