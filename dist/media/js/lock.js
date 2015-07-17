// var Lock = function () {

//     return {
//         //main function to initiate the module
//         init: function () {

//              $.backstretch([
// 		        ../media/image/bg/1.jpg',
// 		        ../media/image/bg/2.jpg',
// 		        ../media/image/bg/3.jpg',
// 		        ../media/image/bg/4.jp'"
// 		        ], {
// 		          fade: 1000,
// 		          duration: 8000
// 		      });
//         }

//     };

// }();

jQuery(document).ready(function() {
    'use strict';
    App.init();
    var account = $.parseJSON($.cookie('WP.account'));
    if (account === null) {
        window.location.href = 'login.html';
    }
     $.backstretch([
     '../media/image/bg/1.jpg',
     '../media/image/bg/2.jpg',
     '../media/image/bg/3.jpg',
     // '../media/image/bg/4.jpg'
     ], {
       fade: 1000,
       duration: 8000
    });
    $('#name').text(account.username);
    $('#_name').text('不是 '+account.username+' ?');
    $('.form-lock button').click(function() {
        var password = md5($('input[name="password"]').val());
        var pwd = $.cookie('WP.password');
        if (password === pwd) {
            window.location.href = '/';
            $.cookie('WP.lock',false);
        }else {
            $('#lock-msg').text('密码错误');
            $('#lock-msg').removeClass('hidden');
        }
    });
});
