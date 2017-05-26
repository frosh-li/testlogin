var FormWizard = function () {
	
	var selectedBank;
	
	var bankList = ['zgyh','jsyh','zxyh','zsyh','gsyh','gdyh','msyh','nyyh','jtyh','xyyh','yzyh','pfyh']; 
	
	var addr = "/api/monitor/redirect?params=";
	
	var initEvent = function(){
		for(var i= 0; i < bankList.length; i++){
			var bank = bankList[i];
			$('.a_' + bank).click(function(e){
				selectedBank = $(this)[0].id;
				$.ajax({
					type:"get",
					url:perfMonitor + addr + encodeURIComponent("netBankCard/isSupportBank?1=1&bankType=1&applyNo=99920160823710500&bankName="+selectedBank+"&productType=201"),
					async:true,
					success:function(res){
						if(res == null){
							alert("请求出错，请刷新页面后再试！！");
						}else{
							loadCaptchaCode(selectedBank);//加载图片验证码
						}
					}
				});
			})
	}
		}
	
	var initTable = function(){
		//表格的列名
		var errorCodesTableColumns =  
			[
		    { title: "卡号" },
		    { title: "交易日期" },
		    { title: "交易金额" },
		    { title: "余额" },
		    { title: "币种" }
		    ];
		var option = {
				//"lengthMenu": [[-1], ["All"]],
				//"scrollX":   true,
				columns: errorCodesTableColumns,
				"aaSorting": [[ 3, "desc" ]]
		};
		Table.init('transInfo', option);
	}
	
	var loadCaptchaCode = function(selectedBank){
		$.ajax({
			type:"get",
			DataType: "json",
			url:perfMonitor + addr + encodeURIComponent("netBankCard/captcha?1=1&bankType=1&applyNo=99920160823710500&bankName="+selectedBank+"&productType=201"),
			async:true,
			success:function(res){
				if(res.errorCode == '00000'){
					var url = res.result.result;
					if(url == null || url == ''){
						$('.captcha').hide();
					}else{
						$('.captcha').show();
						$('#captchaUrl').attr('src',url);
					}
				}
			}
		});
	}
	
	//加载抓取的流水数据
	var loadData = function(){
		var data = [];
		$.ajax({
			type:"get",
			url:perfMonitor+"/api/monitor/v2/bank/loadData?applyNo=99920160823710500&bankName="+selectedBank,
			async:true,
			success:function(res){
				if(res.errorCode == "00000"){
					var results = res.result;
					if(results.length>0){
						var basic = results[0];
						$('#basic').append('&nbsp;&nbsp;<span style="font-size: 20px;">姓名:'+basic[0].customer_name+'</span>&nbsp;&nbsp;&nbsp;'+
											'<span style="font-size: 20px;">身份证号:'+basic[0].card_num+'</span>&nbsp;&nbsp;&nbsp;'+
											'<span style="font-size: 20px;">银行卡归属地:'+basic[0].bank_branch_name+'</span>&nbsp;&nbsp;&nbsp;');
						if('jianshe' == basic[0].bank_name){
							$('#basic').append('<span style="font-size: 20px;">银行名称:建设银行</span>');
						}else if('zhongguo' == basic[0].bank_name){
							$('#basic').append('<span style="font-size: 20px;">银行名称:中国银行</span>');
						}
						$('#basic').append('&nbsp;&nbsp;&nbsp;<span style="font-size: 20px;">进件号:99920160823710500</span>');
						var trans = results[1];
						for(var i = 0; i<trans.length; i++){
							var obj = [];
							obj.push(trans[i].card_no);
							obj.push(trans[i].trans_date);
							obj.push(trans[i].transNum);
							obj.push(trans[i].balance);
							obj.push(trans[i].currency_type);
							data.push(obj);
						}
					var tfootId = '#transInfoTFoot';
					//加载表格
					Table.load('transInfo', data);
					if($(tfootId).length > 0){
						$(tfootId).empty();
						var footTR = 
							'<tr>' + 
				                '<th>总计</th>' + 
				                '<th></th>' + 
				                '<th></th>' + 
				                '<th>' + trans.length + '</th>' + 
				            '</tr>';
						$(tfootId).append(footTR);
					}
					}
					$('.form-actions').find('.button-next').text('点击查看抓取结果');
					$('.form-actions').find('.button-next').show();
				}
			}
		});
	}
	
	//填补信息后登录请求
	var startLogin  = function(){
		var accountNo = $('input[name=accountNo]').val();
		var idCardNo = $('input[name=idCardNo]').val();
		var loginName = $('input[name=loginName]').val();
		var passWord = $('input[name=password]').val();
		var captchaCode = $('input[name=captchaCode]').val();
		var a = 1;
		Progress.loadProgress(100);
		$('#progress').append('<span style="font-size:20px">初始化程序......'+Common.getCurrentTime()+'</span><br /><br />');
		$('#progress').append('<span style="font-size:20px">调用抓取引擎......'+Common.getCurrentTime()+'</span><br /><br />');
		$.ajax({
			type:"get",
			DataType: "json",
			url:perfMonitor + addr + encodeURIComponent("netBankCard/loginByUser?1=1&bankType=1&applyNo=99920160823710500&bankName="+selectedBank+"&productType=201&idCardNo="+idCardNo+"&userName="+loginName+"&passWord="+passWord+"&accountNo="+accountNo+"&captchaCode="+captchaCode+"&batchNo=1&loginType=02"),
			async:true,
			success:function(res){
				if(res.errorCode == '00000'){
					if(res.result.errorCode == 'L0001'){
						Progress.loadProgress(500);//登陆成功后就成功了百分之五十
						$('#progress').append('<span style="font-size:20px">成功开始抓取......'+Common.getCurrentTime()+'</span><br /><br />');
						queryProgress();
					}else if(res.result.errorCode == '00000'){
						Progress.loadProgress(999);
						//加载数据
						loadData();
					}
				}
			}
		});
		

	}
	
	
	var queryProgress = function(){
		$.ajax({
			type:"get",
			url:perfMonitor + "/api/monitor/queryProgress?params=0",
			async:true,
			success: function(res){
				if(res.errorCode == "00000"){
					if(res.result.errorCode == '00000'){
						Progress.loadProgress(999);//这次一百了
						$('#progress').append('<span style="font-size:20px">获取数据成功......'+Common.getCurrentTime()+'</span>');
						//加载数据
						loadData();
					}
				}
			}
		});
		
	}
	
    return {
        //main function to initiate the module
        init: function () {
            if (!jQuery().bootstrapWizard) {
                return;
            }
            
            initEvent();
            
            initTable();

            function format(state) {
                if (!state.id) return state.text; // optgroup
                return "<img class='flag' src='../../assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
            }

            $("#country_list").select2({
                placeholder: "Select",
                allowClear: true,
                formatResult: format,
                formatSelection: format,
                escapeMarkup: function (m) {
                    return m;
                }
            });

            var form = $('#submit_form');
            var error = $('.alert-danger', form);
            var success = $('.alert-success', form);
            
            form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
//                  //account
//                  accountNo: {
//                      minlength: 5,
//                      required: true
//                  },
//                  password: {
//                      minlength: 5,
//                      required: true
//                  },
//                  rpassword: {
//                      minlength: 5,
//                      required: true,
//                      equalTo: "#submit_form_password"
//                  },
//                  //profile
//                  fullname: {
//                      required: true
//                  },
//                  email: {
//                      required: true,
//                      email: true
//                  },
//                  phone: {
//                      required: true
//                  },
//                  gender: {
//                      required: true
//                  },
//                  address: {
//                      required: true
//                  },
//                  city: {
//                      required: true
//                  },
//                  country: {
//                      required: true
//                  },
//                  //payment
//                  card_name: {
//                      required: true
//                  },
//                  card_number: {
//                      minlength: 16,
//                      maxlength: 16,
//                      required: true
//                  },
//                  card_cvc: {
//                      digits: true,
//                      required: true,
//                      minlength: 3,
//                      maxlength: 4
//                  },
//                  card_expiry_date: {
//                      required: true
//                  },
//                  'payment[]': {
//                      required: true,
//                      minlength: 1
//                  }
                }

//              messages: { // custom messages for radio buttons and checkboxes
//                  'payment[]': {
//                      required: "Please select at least one option",
//                      minlength: jQuery.validator.format("Please select at least one option")
//                  }
//              },
//
//              errorPlacement: function (error, element) { // render error placement for each input type
//                  if (element.attr("name") == "gender") { // for uniform radio buttons, insert the after the given container
//                      error.insertAfter("#form_gender_error");
//                  } else if (element.attr("name") == "payment[]") { // for uniform checkboxes, insert the after the given container
//                      error.insertAfter("#form_payment_error");
//                  } else {
//                      error.insertAfter(element); // for other inputs, just perform default behavior
//                  }
//              },
//
//              invalidHandler: function (event, validator) { //display error alert on form submit   
//                  success.hide();
//                  error.show();
//                  Metronic.scrollTo(error, -200);
//              },
//
//              highlight: function (element) { // hightlight error inputs
//                  $(element)
//                      .closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
//              },
//
//              unhighlight: function (element) { // revert the change done by hightlight
//                  $(element)
//                      .closest('.form-group').removeClass('has-error'); // set error class to the control group
//              },
//
//              success: function (label) {
//                  if (label.attr("for") == "gender" || label.attr("for") == "payment[]") { // for checkboxes and radio buttons, no need to show OK icon
//                      label
//                          .closest('.form-group').removeClass('has-error').addClass('has-success');
//                      label.remove(); // remove error label here
//                  } else { // display success icon for other inputs
//                      label
//                          .addClass('valid') // mark the current input as valid and display OK icon
//                      .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
//                  }
//              },
//
//              submitHandler: function (form) {
//                  success.show();
//                  error.hide();
//                  //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
//              }

            });


            var displayConfirm = function() {
                $('#tab4 .form-control-static', form).each(function(){
                    var input = $('[name="'+$(this).attr("data-display")+'"]', form);
                    if (input.is(":radio")) {
                        input = $('[name="'+$(this).attr("data-display")+'"]:checked', form);
                    }
                    if (input.is(":text") || input.is("textarea")) {
                        $(this).html(input.val());
                    } else if (input.is("select")) {
                        $(this).html(input.find('option:selected').text());
                    } else if (input.is(":radio") && input.is(":checked")) {
                        $(this).html(input.attr("data-title"));
                    } else if ($(this).attr("data-display") == 'payment[]') {
                        var payment = [];
                        $('[name="payment[]"]:checked', form).each(function(){ 
                            payment.push($(this).attr('data-title'));
                        });
                        $(this).html(payment.join("<br>"));
                    }
                });
            }

            var handleTitle = function(tab, navigation, index) {
                var total = navigation.find('li').length;
                var current = index + 1;
                // set wizard title
                $('.step-title', $('#form_wizard_1')).text('请按顺序执行 ' + (index + 1) + ' of ' + total);
                // set done steps
                jQuery('li', $('#form_wizard_1')).removeClass("done");
                var li_list = navigation.find('li');
                for (var i = 0; i < index; i++) {
                    jQuery(li_list[i]).addClass("done");
                }
//
                if (current == 1) {
                    $('#form_wizard_1').find('.button-previous').hide();
                    $('#captchaUrl').attr('src','assets/global/img/loading1.gif');
                    $('#captchaUrl').show();
                } else {
                    $('#form_wizard_1').find('.button-previous').show();
                    $('.form-actions').find('.button-next').show();
                }

                if (current >= total) {
                    $('#form_wizard_1').find('.button-next').hide();
                    $('#form_wizard_1').find('.button-submit').show();
                    displayConfirm();
                } else {
                    $('#form_wizard_1').find('.button-next').show();
                    $('#form_wizard_1').find('.button-submit').hide();
                }
                Metronic.scrollTo($('.page-title'));
            }

            // default form wizard
            $('#form_wizard_1').bootstrapWizard({
                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',
                onTabClick: function (tab, navigation, index, clickedIndex) {
                    return false;
                    /*
                    success.hide();
                    error.hide();
                    if (form.valid() == false) {
                        return false;
                    }
                    handleTitle(tab, navigation, clickedIndex);
                    */
                },
                onNext: function (tab, navigation, index) {
                    success.hide();
                    error.hide();
                    var s = $(this).tab();
                   
                    if (form.valid() == false) {
                        return false;
                    }

                    handleTitle(tab, navigation, index);
                    if(index == 2){
                    	$('.form-actions').find('.button-next').hide();
                    	startLogin();
               		}
                },
                onPrevious: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    handleTitle(tab, navigation, index);
                },
                onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#form_wizard_1').find('.progress-bar').css({
                        width: $percent + '%'
                    });
                }
            });

            $('#form_wizard_1').find('.button-previous').hide();
            $('.form-actions').find('.button-next').hide();
            $('#form_wizard_1 .button-submit').click(function () {
                alert('Finished! Hope you like it :)');
            }).hide();

            //apply validation on select2 dropdown value change, this only needed for chosen dropdown integration.
            $('#country_list', form).change(function () {
                form.validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
            });
        }
    };
}();