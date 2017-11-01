/**
 * Created by Administrator on 2017/5/25.
 */
require(['jquery', 'underscore'], function ($,underscore) {
    var _ = underscore;
    var getParamUrl = function (name) { //传入参数名
        var url = window.location.href;
        if (url.indexOf('?') != -1) {
            url = url.substr(url.lastIndexOf('?') + 1);
        } else {
            return null;
        }
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = url.match(reg);
        if (r != null) return r[2];
        return null;
    }
    var queryContractData = function (data) {
        $.ajax({
            url: 'http://mobileserver.hanxinbank.com//smart/findContractData.action',
            data: data,
            dataType: "jsonp",
            success: function (result) {
                if (result.code === '0000') {
                    if (result.lendList && result.lendList.length > 0) {
                        var tpl = $('#table-list').html();
                        var cHtml= _.template(tpl)({tableList:result.lendList});
                         $('.hide-table').html(cHtml);
                    }
                    for (var i in result.queryData) {
                        var text=result.queryData[i];
                        if(text===null){
                            text='';
                        }
                        $('[data-name=' + i + ']').text(text);
                    }
                }
            }

        });
    }
    var params = {};
    params.contractId = getParamUrl('contractId');
    params.id = getParamUrl('id');
    params.assetId = getParamUrl('assetId');
    params.type = getParamUrl('type');
    if (params.type === '1') {
        require(['text!new-contract/cTpl' + params.contractId + '.html'], function (tpl) {
            $('.contract').html(tpl);
            params.userId = getParamUrl('userId');
            $.each($('[data-hidedes]'),function(i,item){
               $(item).text($(item).attr('data-hidedes'));
            });
            queryContractData(params);
        });
    } else {
        require(['text!new-contract/cTplZ.html'], function (tpl) {
            $('.contract').html(tpl);
            queryContractData(params);
        });
    }

});