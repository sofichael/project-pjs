var Login = function () {
	'use strict';
    return {
        //main function to initiate the module
        init: function () {
           $('.login-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: true, // do not focus the last invalid input
	            rules: {
	                account: {
	                    required: true,
	                    digits: true,
	                    minlength: 11,
	                    maxlength:11
	                },
	                password: {
	                    required: true,
	                    minlength: 6,
	                    maxlength:12
	                },
	                remember: {
	                    required: false
	                }
	            },

	            messages: {
	                account: {
	                    required: '手机号必填!',
	                    digits: '手机号格式不正确!',
	                    minlength: jQuery.format('手机号长度不正确!'),
	                    maxlength: jQuery.format('手机号长度不正确!')
	                },
	                password: {
	                    required: '密码必填!',
	                    minlength: jQuery.format('至少输入6位密码字符!'),
	                    maxlength: jQuery.format('输入超过12位密码字符!')
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit
	                $('.alert-error', $('.login-form')).show();
	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element).closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	                // $('#login-submit')[0].disabled = false;
	            },

	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
			  }

	        });

	        //show pwd
	        jQuery('.input-append .add-on').click(function () {
	        		if ($(this).children().hasClass('icon-eye-close')) {
		            $(this).prev().attr('type','text');
		            $(this).prev().prev().removeClass('icon-lock').addClass('icon-unlock');
		            $(this).children().removeClass('icon-eye-close').addClass('icon-eye-open');
	        		} else{
		            $(this).prev().attr('type','password');
		            $(this).prev().prev().removeClass('icon-unlock').addClass('icon-lock');
		            $(this).children().removeClass('icon-eye-open').addClass('icon-eye-close');
	        		}
	        });

	        $('.forget-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: '',
	            rules: {
	                mobile: {
	                    required: true,
	                    digits: true,
	                    minlength: 11,
	                    maxlength:11
	                },
	                mobileCode: {
	                    required: true,
	                    digits: true,
	                    minlength: 4,
	                    maxlength:4
	                }
	            },

	            messages: {
	                mobile: {
	                    required: '手机号必填!',
	                    digits: '手机号格式不正确!',
	                    minlength: jQuery.format('手机号长度不正确!'),
	                    maxlength: jQuery.format('手机号长度不正确!')
	                },
	                mobileCode: {
	                    required: '验证码必填!',
	                    digits: '验证码格式不正确!',
	                    minlength: jQuery.format('验证码长度不正确!'),
	                    maxlength: jQuery.format('验证码长度不正确!')
	                },
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit

	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element).closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
	            }
	        });

	        jQuery('#forget-password').click(function () {
	            jQuery('.login-form').hide();
	            jQuery('.forget-form').show();
	        });

	        jQuery('#reset-form-next').click(function () {
				if ($('.forget-form').validate().form()) {
					jQuery('.forget-form').hide();
					jQuery('.reset-form').show();
	                }
	        });

	        jQuery('#reset-back-btn').click(function () {
	            jQuery('.forget-form').show();
	            jQuery('.reset-form').hide();
	        });

	        jQuery('#back-btn').click(function () {
	            jQuery('.login-form').show();
	            jQuery('.forget-form').hide();
	        });

	        $('.reset-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: '',
	            rules: {
	                password: {
	                    required: true,
	                    minlength: 6,
	                    maxlength:12
	                },
	                rpassword: {
	                    equalTo: '#reset_password'
	                }
	            },

	            messages: { // custom messages for radio buttons and checkboxes
	                password: {
	                    required: '密码必填!',
	                    minlength: jQuery.format('密码长度至少6位!'),
	                    maxlength: jQuery.format('密码长度最多12位!')
	                },
	                rpassword: {
	                    equalTo: jQuery.format('密码不一致!')
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit

	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element).closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
	            }
	        });

	        $('.register-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: '',
	            rules: {
	                mobile: {
	                    required: true,
	                    digits: true,
	                    minlength: 11,
	                    maxlength:11
	                },
	                mobileCode: {
	                    required: true,
	                    digits: true,
	                    minlength: 4,
	                    maxlength:4
	                },
	                password: {
	                    required: true,
	                    minlength: 6,
	                    maxlength:12
	                },
	                rpassword: {
	                    equalTo: '#register_password'
	                }
	            },

	            messages: { // custom messages for radio buttons and checkboxes
	                mobile: {
	                    required: '手机号必填!',
	                    digits: '手机号格式不正确!',
	                    minlength: jQuery.format('手机号长度不正确!'),
	                    maxlength: jQuery.format('手机号长度不正确!')
	                },
	                mobileCode: {
	                    required: '验证码必填!',
	                    digits: '验证码格式不正确!',
	                    minlength: jQuery.format('验证码长度不正确!'),
	                    maxlength: jQuery.format('验证码长度不正确!')
	                },
	                password: {
	                    required: '密码必填!',
	                    minlength: jQuery.format('密码长度至少6位!'),
	                    maxlength: jQuery.format('密码长度最多12位!')
	                },
	                rpassword: {
	                    equalTo: jQuery.format('密码不一致!')
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit

	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element).closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
	            }
	        });

	        jQuery('#register-btn').click(function () {
	            jQuery('.login-form').hide();
	            jQuery('.register-form').show();
	        });

	        jQuery('#register-back-btn').click(function () {
	            jQuery('.login-form').show();
	            jQuery('.register-form').hide();
	        });
        }

    };

}();