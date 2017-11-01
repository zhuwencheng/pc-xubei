/**
 * Created by Administrator on 2017/5/23.
 */
require(['jquery'], function ($) {
    $('#help-b-list').on('click','dt',function(){
       if($(this).hasClass('down')){
           $(this).removeClass('down').siblings('dd').hide();
       } else {
           $(this).addClass('down').siblings('dd').show();
       }
    });
    $('.tabnav').on('click','span',function(){
        if(!$(this).hasClass('active')){
            var index=$(this).index();
            $(this).addClass('active').siblings('span').removeClass('active');
            $(this).closest('.tabnav').siblings('.bd').children('div').hide().eq(index).show();
        }
    });
});
