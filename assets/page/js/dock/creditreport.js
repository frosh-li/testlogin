var CreditReport = function() {
	var mobileReg = new RegExp("^[1][345789][0-9]{9}$");
	var idNoReg = new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
	var EmailReg = new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+(com|cn)$/);
	var loginNameReg = new RegExp(/([a-zA-Z0-9]|[_-]|[/]){6,16}$/);
	var hasSth = new RegExp(/([%@# ])/);
	var hasChinese = new RegExp(/([\u4e00-\u9fa5])/);
	var passWordReg = new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/);
	
    var intervalMS = 2000; //间隔毫秒
    
	var step = '';
	var smsIntervalSecond = 60;
	var currentQueryMaxTimes = 0;
	var resultQueryTimesMax = 60;//轮询的最大次数
	
    var captchaIdentifyMaxTimes = 3;
    var captchaIdentifyIndex = 0;
	var isDoCaptchaIdentify = true; //是否执行验证码识别
	
	//图片验证码
	var captchaCode = '';
	var noAgreement = false;
	
	//请求参数
    var productType  = "";
    var applyNo  = '999' + new Date().valueOf();
    var idCardNo  = "";
    var lendRequestUserName  = "";
    var successDirectUrl = "";
    var callbackUrl = "";
    var htmlToken = "";
    var tcId = "";
    var result = "";
    var phoneNum = "";

    var uid = "";
    var ukey = "";
    var ctm = "";
    var userid = "";
    var ictoken = "";
    
    //获取USERID
    var getTokenProcessorURL = function(){
    	var params = "/donless/generateUserId?uid="+uid+"&ctm=" + ctm+"&token="+ictoken;
    	var url = Common.getTokenURL(openapiURL, params);
    	$.ajax({
			type:"get",
			url: url,
			cache: false,
			async: true,
			success:function(data){
				if(data.code == 0){
					applyNo = data.msg;
					userid = data.msg;
					showLoading(false, '');
					$("#form").show();
			    	$("#form1").hide();
			    	$("#form2").hide();
			    	$("#form3").hide();
			    	$("#form_reg").hide();
			    	$("#form1_reg").hide();
			    	captcha("captcha");

			    	Common.saveRelationalParams(relationalParams,uid,ctm,ictoken,userid,"creditReport");
			    	
				}else{
					alert("认证失败");
					showLoading(false, '');
					//跳转
					top.location.href = (errorDirectUrl);
				}
			},
			error:function(data){
				alert("无法获取token信息");
				showLoading(false, '');
				//跳转
				top.location.href = (errorDirectUrl);
			}
    	});
    }
    
    //1.获取图片验证码
    var captcha = function(step_){
    	showLoading(true, '');
    	step = step_;
    	 
		var params = ("Report/captcha?" + 
			"uid=" + uid + 
			"&ctm=" + ctm + 
			"&token=" + ictoken + 
			"&userid=" + userid + 
			"&applyNo=" + applyNo +
			"&relationalParams=" + encodeURIComponent(relationalParams));
		var url = Common.getTokenURL(openapiURL, params);
		$.ajax({
			type:"get",
			url: url,
			cache:false,
			async: true,
			success:function(data){
				dealQueryResult(data);
			},
			error:function(data){
				showLoading(false, '');
				$("#modalBody").html("对不起，获取图片验证码失败！请稍后重试。");
    	    	$("#myModal").modal();
    	    	$("#modalOk").one("click",function(){
    	    		$("#form").show();
			    	$("#form1").hide();
			    	$("#form2").hide();
			    	$("#form3").hide();
			    	$("#form_reg").hide();
			    	$("#form1_reg").hide();
			    	captcha(step);
    	    	});
			}
		});
			 
	}
     
    //2.登陆
    var login = function(){
    	step = 'login';
    	//合法性验证
    	var isValidate = validate();
    	//登陆逻辑
    	if(isValidate){
    		showLoading(true, '');
	    	var loginname = $("#txt_loginname").val();
			var password = $("#txt_password").val();
	    	var captchaCode = $('#txt_captcha').val();
	    	 
			var loginParams = ("Report/login?" + 
				"uid=" + uid + 
				"&ctm=" + ctm + 
				"&token=" + ictoken + 
				"&userid=" + userid +
				"&loginName=" + loginname + 
				"&passWord=" + password + 
				"&captchaCode=" + captchaCode + 
				"&applyNo=" + applyNo );
			var loginUrl = Common.getTokenURL(openapiURL, loginParams);
			$.ajax({
				type:"get",
				url: loginUrl,  
				cache:false,
				async: true,
				success:function(data){
					dealQueryResult(data);
				},
				error:function(data){
					showLoading(false, '');
					$("#modalBody").html("对不起，登陆失败失败！请稍后重试。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").show();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
				    	captcha("captcha");
	    	    	});
				}
			});
    	}
    }
    function ReplaceAll(str, sptr, sptr1){
        while (str.indexOf(sptr) >= 0){
           str = str.replace(sptr, sptr1);
        }
        return str;
    }
    //3.提交问题集
    var sendKBA = function(){
    	//合法性验证
    	var countDays = $(".countDays").text();
    	var countMinutes = $(".countMinutes").text();
    	countMinutes = ReplaceAll(countMinutes,"	","");
    	var countSeconds = $(".countSeconds").text();
    	countSeconds = ReplaceAll(countSeconds,"	","");
    	if(countMinutes == "00" && countSeconds == "00"){
    		showLoading(false, '');
			$("#modalBody").html("对不起，已超时！请重试。");
	    	$("#myModal").modal();
	    	$("#modalOk").one("click",function(){
	    		$("#form").show();
		    	$("#form1").hide();
		    	$("#form2").hide();
		    	$("#form3").hide();
		    	$("#form_reg").hide();
		    	$("#form1_reg").hide();
		    	captcha("captcha");
	    	});
	    	return false;
    	}
    	var isValidate = validate();
    	//登陆逻辑
    	if(isValidate){
    		showLoading(true, '');
    		step = 'sendKBA';
    		var element = JSON.stringify(result);//转换对象
    		element = JSON.parse(element);
    		for (var i = 0; i <5; i++) {
    			var an="kbaList["+i+"].answerresult";//删除以前的result
    			delete element[an];
    			var option = $("input:radio[name='option"+i+"']:checked").val();
    			var  op= "kbaList["+i+"].options";//添加问题与答案
    			element[op]=option;
    			var at = "kbaList["+i+"].answerresult";
    			element[at] = option;
    		}
    		var questions = JSON.stringify(element);
    		 
			var mappedUrl = "Report/submitKBA";
			var url = Common.getTokenURL(openapiURL);
			var datas={uid:uid,ctm:ctm,token:ictoken,userid:userid,mappedUrl:mappedUrl,applyNo:applyNo,questions:questions,productType:productType};
			$.ajax({
				type:"post",
				url: url,
				data:datas,
				cache:false,
				async: true,
				success:function(data){
					dealQueryResult(data);
				},
				error:function(data){
					showLoading(false, '');
					$("#modalBody").html("对不起，提交问题集失败！请重试。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").show();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
				    	captcha("captcha");
	    	    	});
				}
			});
    	}
	}

    //4.登陆成功，输入手机动态码申请查询码
    var submitQS = function(){
    	//合法性验证
    	var isValidate = validate();
    	//登陆逻辑
    	if(isValidate){
    		showLoading(true, '');
        	step = 'submitQS';
        	var verifyCode = $("#txt_verifyCode").val();
        	 
			var params = ("Report/submitQS?" + 
					"uid=" + uid + 
					"&ctm=" + ctm + 
					"&token=" + ictoken + 
					"&userid=" + userid +
					"&applyNo=" + applyNo +  
					"&verifyCode=" + verifyCode +
					"&htmlToken=" + htmlToken +
					"&productType=" + productType);
			var url = Common.getTokenURL(openapiURL, params);
			$.ajax({
				type:"get",
				url: url,
				cache:false,
				async: true,
				success:function(data){
					dealQueryResult(data);
				},
				error:function(data){
					showLoading(false, '');
					$("#modalBody").html("对不起，下载征信报告失败！请稍后重试。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").show();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
				    	captcha("captcha");
	    	    	});
				}
			});
    	}
	}
    //5.登陆成功，重新获取手机动态码
    var sendPhoneMsg = function(){
    	showLoading(true, '');
    	step = 'sendPhoneMsg';
    	var loginName = $("#txt_loginname").val();
		var tradeCode = $("#txt_phoneCode").val();
    	 
		var params = ("Report/sendPhoneMsg?" + 
				"applyNo=" + applyNo + 
				"&uid=" + uid + 
				"&ctm=" + ctm + 
				"&token=" + ictoken + 
				"&userid=" + userid +
				"&productType=" + productType);
		var url = Common.getTokenURL(openapiURL, params);
		$.ajax({
			type:"get",
			url: url,
			cache:false,
			async: true,
			success:function(data){
				dealQueryResult(data);
			},
			error:function(data){
				showLoading(false, '');
				$("#modalBody").html("对不起，发送手机动态码失败！请稍后重试。");
    	    	$("#myModal").modal();
    	    	$("#modalOk").one("click",function(){
    	    		$("#form").show();
			    	$("#form1").hide();
			    	$("#form2").hide();
			    	$("#form3").hide();
			    	$("#form_reg").hide();
			    	$("#form1_reg").hide();
			    	captcha("captcha");
    	    	});
			}
		});
	}
    
    //6.下载征信报告
    var downloadCreditR = function(){
    	//合法性验证
    	var isValidate = validate();
    	//登陆逻辑
    	if(isValidate){
    		showLoading(true, '');
    		step = 'downloadCreditR';
    		var loginName = $("#txt_loginname").val();
    		var tradeCode = $("#txt_tradeCode").val();
    		idCardNo = $("#txt_idCardNo").val();
    		 
			var params = ("Report/downloadCreditR?" + 
					"uid=" + uid + 
					"&ctm=" + ctm + 
					"&token=" + ictoken + 
					"&userid=" + userid +
					"&productType=" + productType +
					"&loginName=" + loginName +
					"&idCardNo=" + idCardNo +
					"&tradeCode=" + tradeCode +
					"&htmlToken=" + htmlToken +
					"&applyNo=" + applyNo);
			var url = Common.getTokenURL(openapiURL, params);
			$.ajax({
				type:"get",
				url: url,
				cache:false,
				async: true,
				success:function(data){
					dealQueryResult(data);
				},
				error:function(data){
					showLoading(false, '');
					$("#modalBody").html("对不起，下载征信报告失败！请稍后重试。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").show();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
				    	captcha("captcha");
	    	    	});
				}
			});
    	}
	}
    
    //注册-第一步
    var register = function(){
    	//合法性验证
    	var isValidate = validate();
    	//登陆逻辑
    	if(isValidate){
    		showLoading(true, '');
    		$("#btn_register").attr('disabled', true);
    		step = 'register';
	    	var idNo = $("#txt_idNo").val();
			var name = $("#txt_name").val();
	    	var captchaCode = $('#txt_captcha_reg').val();
    		 
			var params = ("Report/register?" + 
					"uid=" + uid + 
					"&ctm=" + ctm + 
					"&token=" + ictoken + 
					"&userid=" + userid +
					"&productType=" + productType +
					"&name=" + name +
					"&idType=0" +
					"&idNo=" + idNo +
					"&captchaCode=" + captchaCode +
					"&applyNo=" + applyNo);
			var url = Common.getTokenURL(openapiURL, params);
			$.ajax({
				type:"get",
				url: url,
				cache:false,
				async: true,
				success:function(data){
					dealQueryResult(data);
				},
				error:function(data){
					showLoading(false, '');
					$("#modalBody").html("对不起，注册征信报告失败！请稍后重试。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").hide();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").show();
				    	$("#form1_reg").hide();
				    	captcha("captchaReg");
				    	$("#btn_register").attr('disabled', false);
	    	    	});
				}
			});
    	}
	}
    
    //注册-验证登录名是否存在
    var checkRegLoginnameHasUsed = function(loginName){
    	if(!loginNameReg.test(loginName) || hasChinese.test(loginName) || hasSth.test(loginName)){
    		$("#modalBody").html("请输入正确的登录名。");
	    	$("#myModal").modal();
	    	$("#modalOk").one("click",function(){
		    	$("#txt_loginName").val('');
	    	});
	    	return false;
    	}
    	showLoading(true, '');
		$("#btn_pbccrcSaveUser").attr('disabled', true);
		step = 'checkRegLoginnameHasUsed';
		 
		var params = ("Report/checkRegLoginnameHasUsed?" + 
				"uid=" + uid + 
				"&ctm=" + ctm + 
				"&token=" + ictoken + 
				"&userid=" + userid + 
				"&productType=" + productType +
				"&applyNo=" + applyNo +
				"&loginName=" + loginName);
		var url = Common.getTokenURL(openapiURL, params);
		$.ajax({
			type:"get",
			url: url,
			cache:false,
			async: true,
			success:function(data){
				dealQueryResult(data);
			},
			error:function(data){
				showLoading(false, '');
				$("#modalBody").html("对不起，注册征信报告失败！请稍后重试。");
    	    	$("#myModal").modal();
    	    	$("#modalOk").one("click",function(){
    	    		$("#form").hide();
			    	$("#form1").hide();
			    	$("#form2").hide();
			    	$("#form3").hide();
    	    		$("#form_reg").show();
			    	$("#form1_reg").hide();
			    	captcha("captchaReg");
			    	$("#btn_register").attr('disabled', false);
    	    	});
			}
		});
    }
    
    //注册-获取手机验证码
    var getMobileVerifyCode = function(){
    	var mobileTel = $('#txt_mobileTel').val();
    	if(mobileTel == '' || (mobileTel != '' && !mobileReg.test(mobileTel))){
    		showAlert(true, "请输入正确的手机号码");
    		return false;
    	}
    	showLoading(true, '');
		$("#btn_getMobileVerifyCode").attr('disabled', true);
		step = 'getMobileVerifyCode';
 
		var params = ("Report/getMobileVerifyCode?" + 
				"uid=" + uid + 
				"&ctm=" + ctm + 
				"&token=" + ictoken + 
				"&userid=" + userid +
				"&productType=" + productType +
				"&applyNo=" + applyNo +
				"&mobileTel=" + mobileTel);
		var url = Common.getTokenURL(openapiURL, params);
		$.ajax({
			type:"get",
			url: url,
			cache:false,
			async: true,
			success:function(data){
				dealQueryResult(data);
			},
			error:function(data){
				showLoading(false, '');
				$("#modalBody").html("对不起，注册征信报告失败！请稍后重试。");
    	    	$("#myModal").modal();
    	    	$("#modalOk").one("click",function(){
    	    		$("#form").hide();
			    	$("#form1").hide();
			    	$("#form2").hide();
			    	$("#form3").hide();
    	    		$("#form_reg").show();
			    	$("#form1_reg").hide();
			    	captcha("captchaReg");
			    	$("#btn_register").attr('disabled', false);
    	    	});
			}
		});
    }
    
    //注册-提交注册信息，完成注册
    var pbccrcSaveUser = function(){
    	//合法性验证
    	var isValidate = validate();
    	//登陆逻辑
    	if(isValidate){
    		showLoading(true, '');
    		$("#btn_pbccrcSaveUser").attr('disabled', true);
    		step = 'pbccrcSaveUser';
    		var loginName = $("#txt_loginName").val();
			var passWord = $("#txt_passWord").val();
			var confirmPassWord = $("#txt_confirmPassWord").val();
			var mobileTel = $("#txt_mobileTel").val();
			var email = $("#txt_email").val();
			var verifyCode = $("#txt_verifyCode_reg").val();
    		 
			var params = ("Report/pbccrcSaveUser?" + 
					"uid=" + uid + 
					"&ctm=" + ctm + 
					"&token=" + ictoken + 
					"&userid=" + userid +
					"&productType=" + productType +
					"&applyNo=" + applyNo +
					"&loginName=" + loginName +
					"&passWord=" + passWord +
					"&confirmPassWord=" + confirmPassWord +
					"&mobileTel=" + mobileTel +
					"&email=" + email +
					"&verifyCode=" + verifyCode +
					"&tcId=" + tcId +
					"&htmlToken=" + htmlToken);
			var url = Common.getTokenURL(openapiURL, params);
			$.ajax({
				type:"get",
				url: url,
				cache:false,
				async: true,
				success:function(data){
					dealQueryResult(data);
				},
				error:function(data){
					showLoading(false, '');
					$("#modalBody").html("对不起，注册征信报告失败！请稍后重试。");
					$("#myModal").modal();
					$("#modalOk").one("click",function(){
						$("#form").hide();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
						$("#form_reg").show();
						$("#form1_reg").hide();
						captcha("captchaReg");
						$("#btn_register").attr('disabled', false);
					});
				}
			});
    	}
    }
    //=======================================================================================================
    //8. 根据验证码地址获取验证码
    var captchaIdentifyUrl = function(captchaId, imageUrl){ //captcha首次验证码、captcha_second二次验证码
    	if(isDoCaptchaIdentify == true && captchaIdentifyIndex < captchaIdentifyMaxTimes){ //需要打码并且小于最大打码次数
	    	imageUrl = encodeURIComponent(imageUrl);
	    	
	    	var params = ("type=6&waitFlg=false&captchaUrl=" +imageUrl+
	    	"&uid=" + uid + 
			"&ctm=" + ctm + 
			"&token=" + ictoken + 
			"&userid=" + userid);
			var url = Common.getTokenURL(ocrURL, params);	
	    	$.ajax({
	    		type:"GET",
				url: url,
				cache:false,
				async: true,
				dataType:"json",
				data:params,
				success:function(data){
					try{
						captchaIdentifyIndex += 1;
						var answerId = data.result.answerId;
						queryCaptchaIdentifyResult(captchaId, answerId);
					}catch(e){
						console.log("验证码识别服务 获取结果失败" + e);
					}
				},
				error:function(data){
					console.log("验证码识别服务调用失败");
				}
			});
		}else{
			console.log("不执行验证码识别，isDoCaptchaIdentify ： " + isDoCaptchaIdentify + "，captchaIdentifyIndex ： " + captchaIdentifyIndex + "， captchaIdentifyMaxTimes：" + captchaIdentifyMaxTimes);
		}
    }
    
    //验证码识别结果
    var queryCaptchaIdentifyResult = function(captchaId, answerId){
    	
    	var params = ("waitFlg=true&answerId=" + answerId+
    	"&uid=" + uid + 
		"&ctm=" + ctm + 
		"&token=" + ictoken + 
		"&userid=" + userid);
		var url = Common.getTokenURL(ocrURL, params);
    	$.ajax({
			type:"GET",
			url: url,
			cache:false,
			async: true,
			dataType:"json",
			success:function(data){ 
				try{
					if(data.code == 0){
						var result = data.result.answer;
						console.log("验证码识别结果：" + result); 
						var divId = "#div_" + captchaId;  
						var txtId = "#txt_" + captchaId; 
						if($(divId).is(":visible")){
							$(txtId).val(result);
						}
					}
				}catch(e){}
			},
			error:function(data){
				console.log("验证码识别结果查询失败");
			}
		});
    }
    
    //=======================================================================================================
    //查询结果处理
    var dealQueryResult = function(data){
    	showLoading(false, '');
    	var massage = "";
    	try{
    		if(data.code != 0){
    			var errorHint = data.msg
    			if(errorHint != null){
    				massage = errorHint;
    			}else{
    				massage = data.code;
    			}
    		}
    	}catch(e){
    		console.log(e);
    	}
    	
    	try{
	    	if(step == 'captcha'){
	    		try{
	    			if(data.code == '0'){
	    				var imgUrl = data.msg.toString();
	    				$("#img_captcha").attr("src", Common.getImageProxyURL(imgUrl));
	    				if(uid.substring(0,3) == "100" && uid != "100001"){
	    					captchaIdentifyUrl('captcha', imgUrl); //验证码识别
	    				}
	    			}else{
	    				$("#modalBody").html(massage);
		    	    	$("#myModal").modal();
		    	    	$("#modalOk").one("click",function(){
		    	    		$("#form").show();
					    	$("#form1").hide();
					    	$("#form2").hide();
					    	$("#form3").hide();
					    	$("#form_reg").hide();
					    	$("#form1_reg").hide();
		    	    	});
	    			}
	    		}catch(e){
	    		}
	    	}else if(step == 'captchaReg'){
	    		try{
	    			if(data.code == '0'){
	    				var imgUrl = data.msg.toString();
	    				$("#img_captcha_reg").attr("src", Common.getImageProxyURL(imgUrl));
	    				if(uid.substring(0,3) == "100" && uid != "100001"){
	    					captchaIdentifyUrl('captcha_reg', imgUrl); //验证码识别
	    				}
	    			}else{
	    				$("#modalBody").html(massage);
		    	    	$("#myModal").modal();
		    	    	$("#modalOk").one("click",function(){
		    	    		$("#form").show();
					    	$("#form1").hide();
					    	$("#form2").hide();
					    	$("#form3").hide();
					    	$("#form_reg").hide();
					    	$("#form1_reg").hide();
		    	    	});
	    			}
	    		}catch(e){
	    		}
	    	}else if(step == 'login'){
	    		 
    			console.log("登录成功");
				if(data.code == "23006"){//登录成功，查询码任然有效
					console.log("登录成功，查询码任然有效");
					result = data.msg;
					htmlToken = result['htmlToken'];
					$("#form").hide();
			    	$("#form1").show();
			    	$("#form2").hide();
			    	$("#form3").hide();
			    	$("#form_reg").hide();
			    	$("#form1_reg").hide();
				}else if(data.code == "23007"){//登录成功，查询码需重新申请，获取申请问题集成功
					console.log("登录成功，查询码需重新申请，获取申请问题集成功");
					ts = (new Date()).getTime() + 10*60*1000;
					Countdown.init(ts);
					result = data.msg;
					console.log(eval(result));
				        //获取问题
				        var question1 = result['kbaList[0].question'];
						var question2 = result['kbaList[1].question'];
						var question3 = result['kbaList[2].question'];
						var question4 = result['kbaList[3].question'];
						var question5 = result['kbaList[4].question'];
					for (var i = 0; i < 5; i++) {
						$("#td_option"+(i+1)).html("");
						for (var j = 1; j <= 5; j++) {
							var option = 'option'+i;
							$("#td_option"+(i+1)).append("<label> <input type='radio' id='"+option+"' value='"+j+"' name='"+option+"'class='icheck' /> "+result['kbaList['+i+'].options'+j]+"</label>");
						}
					}
					//输出问题
					$("#div_option1").html("问题1："+question1);
					$("#div_option2").html("问题2："+question2);
					$("#div_option3").html("问题3："+question3);
					$("#div_option4").html("问题4："+question4);
					$("#div_option5").html("问题5："+question5);
					$("#form").hide();
			    	$("#form1").hide();
			    	$("#form2").hide();
			    	$("#form3").show();
			    	$("#form_reg").hide();
			    	$("#form1_reg").hide();
			    	Metronic.init();
				}else if(data.code == "23008"){//登录成功，查询码需重新申请，获取申请问题集失败
					console.log("登录成功，查询码需重新申请，获取申请问题集失败");
					$("#modalBody").html("登录超时，请重试。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").show();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
				    	captcha("captcha");
	    	    	});
				}else if(data.code == "23022"){//登录成功，查询码需重新申请，发送短信验证码成功
					console.log("登录成功，查询码需重新申请，发送短信验证码成功");
					$("#form").hide();
			    	$("#form1").hide();
			    	$("#form2").show();
			    	$("#form3").hide();
			    	$("#form_reg").hide();
			    	$("#form1_reg").hide();
			    	result = data.msg;
					htmlToken = result['htmlToken'];
					phoneNum = result['phoneNum'];
					$("#div_phoneNum").html(phoneNum);
				}else if(data.code == "23009"){//登录成功，用户个人征信报告申请处理中
					console.log("登录成功，用户个人征信报告申请处理中");
					showAlert(true,"您的信用信息查询请求已提交，请在24小时后访问平台获取结果。为保障您的信息安全，您申请的信用信息将于7日后自动清理，请及时获取查询结果。");
				} else{
	    			$("#modalBody").html(massage);
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").show();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
				    	captcha("captcha");
	    	    	});
	    		}
	    	}else if(step == 'sendKBA'){
	    		if(data.code == "0"){
	    			console.log("申请查询码成功");
	    			$("#modalBody").html("您的信用信息查询请求已提交，请在24小时后访问平台获取结果。为保障您的信息安全，您申请的信用信息将于7日后自动清理，请及时获取查询结果。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#div_alert").hide();
		    			$("#form").hide();
		    			$("#form1").hide();
		    			$("#form2").hide();
		    			$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
	    	    		//跳转
		    			if(Common.isVarLegal(successDirectUrl)){
			    			setTimeout(function(){
			    				window.location.href = successDirectUrl;
			    			}, 1000); 
		    			}
	    	    	});
	    		} else{
	    			//从头开始
	    			console.log("页面过期，请重新操作。");
	    			$("#modalBody").html("页面过期，请重新操作。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").show();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
				    	captcha("captcha");
	    	    	});
	    		}
	    	}else if(step == 'submitQS'){
	    		if(data.code == "0"){
	    			console.log("申请查询码成功");
	    			$("#modalBody").html("您的信用信息查询请求已提交，请在24小时后访问平台获取结果。为保障您的信息安全，您申请的信用信息将于7日后自动清理，请及时获取查询结果。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#div_alert").hide();
		    			$("#form").hide();
		    			$("#form1").hide();
		    			$("#form2").hide();
		    			$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
	    	    		//跳转
		    			if(Common.isVarLegal(successDirectUrl)){
			    			setTimeout(function(){
			    				window.location.href = successDirectUrl;
			    			}, 1000); 
		    			}
	    	    	});

	    		}else if(data.code == "23015"){
	    			//重新发短信，再提交
	    			console.log("申请查询码失败，短信验证码错误");
	    			$('#btn_sendPhoneMsg').attr('disabled', false);
	    			showAlert(true,"短信验证码错误，请重新输入。");
	    		}else{
	    			//从头开始
	    			console.log("页面过期，请重新操作。");
	    			$("#modalBody").html("页面过期，请重新操作。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").show();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
				    	captcha("captcha");
	    	    	});
	    		}
	    	}else if(step == 'sendPhoneMsg'){
	    		if(data.code == "23022" || data.code == "0"){
	    			$("#modalBody").html("动态码已发送到您的手机中，请注意查收。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		smsIntervalSecond = 120;
	    	    		cycleShowing('#btn_sendPhoneMsg');
	    	    	});
	    		}else if(data.code == "10007"){
	    			$("#modalBody").html("手机动态验证码发送失败，请重试。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		smsIntervalSecond = 0;
	    	    		$("#btn_sendPhoneMsg").html('获取动态码');
	    	    		$('#btn_sendPhoneMsg').attr('disabled', false);
	    	    	});
	    		}else{
	    			//从头开始
	    			console.log("页面过期，请重新操作。");
	    			$("#modalBody").html("页面过期，请重新操作。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").show();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
				    	captcha("captcha");
	    	    	});
	    		}
	    	}else if(step == 'downloadCreditR'){
	    		if(data.code == "0"){
	    			$("#div_alert").hide();
	    			$("#form").hide();
	    			$("#form1").hide();
	    			$("#form2").hide();
	    			$("#form3").hide();
			    	$("#form_reg").hide();
			    	$("#form1_reg").hide();
			    	
			    	Common.saveRelationalParams(relationalParams,uid,ctm,ictoken,userid,"creditReport");
			    	
					//跳转
	    			if(Common.isVarLegal(successDirectUrl)){
	    				setTimeout(function(){
		    				if(successDirectUrl.indexOf("?") == -1){
		    					successDirectUrl += "?userid=" + userid + "&msg=" + data.msg;
		    				}else{
		    					successDirectUrl += "&userid=" + userid + "&msg=" + data.msg;
		    				}
		    				top.location.href = successDirectUrl;
		    			}, 1000); 
	    			}
				}else if(data.code == "23001"){
	    			//重新发短信，再提交
	    			console.log("征信报告查询码错误");
	    			showAlert(true,"征信报告身份验证码错误，请重试。");
	    		}else{
	    			console.log("获取征信报告失败，请重新操作。");
	    			$("#modalBody").html("获取征信报告失败，请重新操作。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").show();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
				    	captcha("captcha");
	    	    	});
				}
	    	}else if(step == 'register'){
	    		if(data.code == "0"){
	    			//成功，到下一步
	    			result = data.msg;
	    			htmlToken = result['htmlToken'];
	    			$("#form_reg").hide();
	    			$("#form1_reg").show();
	    			$("#txt_loginName").val("");
	    			$("#txt_passWord").val("");
	    			$("#txt_confirmPassWord").val("");
	    			$("#txt_email").val("");
	    			$("#txt_mobileTel").val("");
	    			$("#txt_verifyCode_reg").val("");
					$("#btn_pbccrcSaveUser").attr('disabled', false);
				}else if(data.code == "23003"){
					console.log("目前系统尚未收录您的个人信息，无法进行注册。");
	    			$("#modalBody").html("目前系统尚未收录您的个人信息，无法进行注册。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").hide();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").show();
				    	$("#form1_reg").hide();
				    	$("#txt_captcha_reg").val("");
				    	captcha("captchaReg");
				    	$("#btn_register").attr('disabled', false);
	    	    	});
	    		}else if(data.code == "23012"){
					console.log("您已注册过用户，请返回首页直接登录。");
	    			$("#modalBody").html("您已注册过用户，请返回首页直接登录。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").show();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
				    	captcha("captcha");
	    	    	});
	    		}else{
	    			$("#modalBody").html(massage);
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form_reg").show();
	    	    		$("#form1_reg").hide();
	    	    		$("#txt_captcha_reg").val("");
				    	captcha("captchaReg");
				    	$("#btn_register").attr('disabled', false);
	    	    	});
	    		}
	    		
	    	}else if(step == 'checkRegLoginnameHasUsed'){
	    		if(data.code == "0"){
					console.log("登录名可以");
					$("#btn_pbccrcSaveUser").attr('disabled', false);
	    		}else if(data.code == "23004"){
					console.log("登录名已经存在");
	    			$("#modalBody").html("登录名已经存在，请更换后重试。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form_reg").hide();
	    	    		$("#form1_reg").show();
	    	    		$("#txt_loginName").val("");
	    	    	});
	    		}else{
	    			$("#modalBody").html(massage);
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form_reg").show();
	    	    		$("#form1_reg").hide();
				    	captcha("captchaReg");
				    	$("#btn_register").attr('disabled', false);
	    	    	});
	    		}
	    	}else if(step == 'getMobileVerifyCode'){
	    		if(data.code == "0"){
					console.log("动态码发送成功");
					result = data.msg;
					tcId = result['tcId'];
					$("#btn_pbccrcSaveUser").attr('disabled', false);
					smsIntervalSecond = 60;
					cycleShowing('#btn_getMobileVerifyCode');
	    		}else if(data.code == "10007"){
					console.log("动态码发送失败，请稍后重试");
	    			$("#modalBody").html("动态码发送失败，请稍后重试。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form_reg").hide();
	    	    		$("#form1_reg").show();
	    	    		smsIntervalSecond = 0;
		    			$("#btn_getMobileVerifyCode").html('获取动态码');
	    	    		$("#btn_getMobileVerifyCode").attr('disabled', false);
	    	    		$("#btn_pbccrcSaveUser").attr('disabled', true);
	    	    	});
	    		}else{
	    			$("#modalBody").html(massage);
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form_reg").show();
	    	    		$("#form1_reg").hide();
				    	captcha("captchaReg");
				    	$("#btn_register").attr('disabled', false);
	    	    	});
	    		}
	    	}else if(step == 'pbccrcSaveUser'){
	    		if(data.msg != null){
	    			result = data.msg;
	    			htmlToken = result['htmlToken'];
	    		}
	    		if(data.code == "0"){
					console.log("注册成功");
					$("#modalBody").html("注册成功，直接登录。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form").show();
				    	$("#form1").hide();
				    	$("#form2").hide();
				    	$("#form3").hide();
				    	$("#form_reg").hide();
				    	$("#form1_reg").hide();
				    	captcha("captcha");
	    	    	});
	    		}else if(data.code == "23013"){
					console.log("此手机号码已注册");
	    			$("#modalBody").html("此手机号码已注册，请更换后重试。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form_reg").hide();
	    	    		$("#form1_reg").show();
	    	    		$("#txt_mobileTel").val("");
	    	    		smsIntervalSecond = 0;
	    	    		$("#btn_getMobileVerifyCode").html('获取动态码');
	    	    		$("#btn_getMobileVerifyCode").attr('disabled', false);
	    	    		$("#btn_pbccrcSaveUser").attr('disabled', true);
	    	    	});
	    		}else if(data.code == "23015"){
					console.log("征信报告手机验证码错误/过期");
	    			$("#modalBody").html("征信报告手机验证码错误或过期，请重新获取。");
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form_reg").hide();
	    	    		$("#form1_reg").show();
	    	    		$("#txt_verifyCode_reg").val("");
	    	    		smsIntervalSecond = 0;
	    	    		$("#btn_getMobileVerifyCode").html('获取动态码');
	    	    		$("#btn_getMobileVerifyCode").attr('disabled', false);
	    	    		$("#btn_pbccrcSaveUser").attr('disabled', false);
	    	    	});
	    		}else{
	    			$("#modalBody").html(massage);
	    	    	$("#myModal").modal();
	    	    	$("#modalOk").one("click",function(){
	    	    		$("#form_reg").show();
	    	    		$("#form1_reg").hide();
	    	    		$("#txt_captcha_reg").val("");
	    	    		$("#txt_verifyCode_reg").val("");
				    	captcha("captchaReg");
				    	$("#btn_register").attr('disabled', false);
	    	    	});
	    		}
	    	}
    	}catch(e){
    		
    	}
    }
    
    //合法性验证
    var validate = function(){
    	var errorHint = '';
    	if($("#form").is(":visible")){
    		var loginname = $("#txt_loginname").val();
    		var password = $("#txt_password").val();
        	var captchaCode = $('#txt_captcha').val();
        	var idCardNo =  $('#txt_idCardNo').val();

        	if(loginname == ''){
        		errorHint += "<p>" + '请输入登录名' + '</p>';
        	}
        	if(loginname != '' && loginname.length < 6){
        		errorHint += "<p>" + '登录名不能小于6位字符' + '</p>';
        	}
        	if(password == ''){
        		errorHint += "<p>" + '请输入密码' + '</p>';
        	}
        	if(password != '' && password.length < 6){
        		errorHint += "<p>" + '密码不能小于6位字符' + '</p>';
        	}
        	
    		if(captchaCode == ''){
    			errorHint += "<p>" + '请输入图片验证码' + '</p>';
    		}
        	if(captchaCode != '' && captchaCode.length != 6){
        		errorHint += "<p>" + '请输入6位图片验证码' + '</p>';
        	}

        	if(idCardNo == ''){
    			errorHint += "<p>" + '请输入身份证号码' + '</p>';
    		}
        	if(idCardNo != '' && !idNoReg.test(idCardNo)){
        		errorHint += "<p>" + '请输入正确的身份证号码' + '</p>';
        	}

        	if(step == 'login' && !noAgreement) {
    			var xieyi = $("input[id='checkbox15']").is(':checked');
    			
    			if(!xieyi) {
    				errorHint += "<p>" + '请先同意《数据授权服务协议》' + '</p>';
    			}
    		}
    	}
		
		if($("#form1").is(":visible")){
    		var tradeCode = $('#txt_tradeCode').val();
    		if(tradeCode == ''){
    			errorHint += "<p>" + '请输入身份验证码' + '</p>';
    		}
    	}

		if($("#form2").is(":visible")){
    		var verifyCode = $('#txt_verifyCode').val();
    		if(verifyCode == ''){
    			errorHint += "<p>" + '请输入短信验证码' + '</p>';
    		}
    	}

		if($("#form3").is(":visible")){
			var isoption = false;
			for (var i = 0; i < 5; i++) {
				var option = $("input:radio[name='option"+i+"']:checked").val();
				if(option == null){
					isoption = true;
				}
			}
			if(isoption){
				errorHint += "<p>" + '请填写完所有问题，再提交。' + '</p>';
			}
    		
    	}
		
		if($("#form_reg").is(":visible")){
			var idNo = $("#txt_idNo").val();
    		var name = $("#txt_name").val();
        	var captcha_reg = $('#txt_captcha_reg').val();
        	if(idNo == ''){
        		errorHint += "<p>" + '请输入身份证号码' + '</p>';
        	}
        	if(name == ''){
    			errorHint += "<p>" + '请输入姓名' + '</p>';
    		}
        	if(captcha_reg == ''){
    			errorHint += "<p>" + '请输入图片验证码' + '</p>';
    		}
        	if(captcha_reg != '' && captcha_reg.length != 6){
        		errorHint += "<p>" + '请输入6位图片验证码' + '</p>';
        	}
        	if(idNo != '' && !idNoReg.test(idNo)){
        		errorHint += "<p>" + '请输入正确的身份证号码' + '</p>';
        	}
        	
		}
		
		if($("#form1_reg").is(":visible")){
			var loginName = $("#txt_loginName").val();
    		var passWord = $("#txt_passWord").val();
        	var confirmPassWord = $('#txt_confirmPassWord').val();
        	var mobileTel = $('#txt_mobileTel').val();
        	var verifyCode = $('#txt_verifyCode_reg').val();
        	var email = $("#txt_email").val();
        	
        	if(loginName == ''){
        		errorHint += "<p>" + '请输入登录名' + '</p>';
        	}
        	if(loginName != '' && (!loginNameReg.test(loginName) || hasChinese.test(loginName) || hasSth.test(loginName))){
        		errorHint += "<p>" + '请输入正确的登录名' + '</p>';
        	}
        	if(passWord == ''){
    			errorHint += "<p>" + '请输入密码' + '</p>';
    		}
        	if(confirmPassWord == ''){
    			errorHint += "<p>" + '请输入确认密码' + '</p>';
    		}
        	if(passWord != '' && confirmPassWord != '' && passWord != confirmPassWord){
    			errorHint += "<p>" + '密码和确认密码不匹配' + '</p>';
    		}
        	if(passWord != '' && !passWordReg.test(passWord)){
        		errorHint += "<p>" + '请输入正确的密码' + '</p>';
        	}
        	
        	if(mobileTel == ''){
        		errorHint += "<p>" + '请输入手机号码' + '</p>';
        	}
        	if(mobileTel != '' && !mobileReg.test(mobileTel)){ 
        		errorHint += "<p>" + '请输入正确的手机号码' + '</p>';
        	}
        	if(verifyCode == ''){
        		errorHint += "<p>" + '请输入手机动态码' + '</p>';
        	}
        	if(email != '' && !EmailReg.test(email)){
        		errorHint += "<p>" + '请输入正确的电子邮箱' + '</p>';
        	}
		}
    	if(errorHint == ''){
    		showAlert(false, '');
    		return true;
    	}else{
    		showAlert(true, errorHint);
    		return false;
    	}
    	
    }

    //显示警告信息
    var showAlert = function(isShow, hint){
    	if(isShow){
    		$("#div_alert").show();
    		$("#content_alert").html(hint);
    	}else{
    		$("#div_alert").hide();
    		$("#content_alert").html('');
    	}
    }
    
    //动画显示
    var showLoading = function(isShow, hint){
    	var elementId = '';
    	if($("#form").is(":visible")){
    		elementId = "#form";
    	}else if($("#form1").is(":visible")){
    		elementId = "#form1";
    	}else if($("#form2").is(":visible")){
    		elementId = "#form2";
    	}else if($("#form3").is(":visible")){
    		elementId = "#form3";
    	}else if($("#form_reg").is(":visible")){
    		elementId = "#form_reg";
    	}else if($("#form1_reg").is(":visible")){
    		elementId = "#form1_reg";
    	}
    	if(isShow){
    		$("#div_loading").hide();
    		Common.showLoading(elementId);
    	}else{
    		$("#div_loading").hide();
    		Common.hideLoading(elementId);
    	}
    }
    
    //循环显示
    var cycleShowing = function(elementId){
    	smsIntervalSecond -= 1;
    	if(smsIntervalSecond <= 0){
    		smsIntervalSecond = 60;
    		$(elementId).html('获取动态码');
    		$(elementId).attr('disabled', false);
    	}else{
    		$(elementId).html(smsIntervalSecond + '秒后重试');
        	setTimeout(function(){
        		cycleShowing(elementId);
        	}, 1000); //延时1s
    	}
    }
    
    var isRequestParamException = false; //标记是否请求参数异常
    var relationalParams = null;
    //初始化请求参数
    var initRequestParam = function(){
    	showLoading(true, '');
    	//图片验证码
    	captchaCode = '';
    	
    	//请求参数
        productType = '';
        applyNo = '';
        loginName = '';
        
    	successDirectUrl = webDockURL + "success.html";
        errorDirectUrl = webDockURL + "error_.html";
        callbackUrl = "";
         
        uid = "";
        ukey = "";
        ctm = "";
        userid = "";
        ictoken = "";
         
     	uid = Common.getParameter("uid");
     	ctm = Common.getParameter("ctm");
     	ictoken = Common.getParameter("token");
     	ukey = Common.getParameter("ukey");
     	idCardNo = Common.getParameter("cardId");
     	if(idCardNo != null && idCardNo != ''){
    		$('#txt_idCardNo').val(idCardNo);
    		$("#txt_idCardNo").attr('readonly',true);
    	}
     	var Surl = Common.getParameter("Surl");
     	if(Surl != ""){
     		successDirectUrl = Surl;
     	}
     	var Eurl = Common.getParameter("Eurl");
     	if(Eurl != ""){
     		errorDirectUrl = Eurl;
     	}
     	
     	var isNoAgreement = Common.getParameter("noAgreement");
     	if(isNoAgreement != ""){
     		noAgreement = isNoAgreement;
     	}
     	if(!noAgreement){
     		$("#agreement").show();
     	}
     	
     	relationalParams = Common.getParameter("relationalParams");
    	console.log("relationalParams is " + relationalParams);
    	
     	getTokenProcessorURL();
    }
    
    //初始化事件
    var initEvent = function(){
    	 
		$("#img_captcha").click(function(){
			captcha("captcha");
		});
		
		$('#btn_login').click(function(e){
			login();
		});

		$('#btn_toRegister').click(function(e){
			initReg();
		});
		
		$("#btn_downloadCreditR").click(function(){
			downloadCreditR();
		});

		$("#btn_sendKBA").click(function(){
			sendKBA();
		});
		
		$("#btn_submitQS").click(function(){
			submitQS();
		});

		$(".btn_back2Login").click(function(){
			$("#form").show();//登录
	    	$("#form1").hide();//查询码
	    	$("#form2").hide();//短信验证码
	    	$("#form3").hide();//问题集
	    	$("#form_reg").hide();//注册
    		$("#form1_reg").hide();
	    	$('#txt_captcha').val("");
	    	$("#div_alert").hide();
    		$("#content_alert").html('');
	    	//获取图片验证码
	    	captcha("captcha");
		});
		
		$('#i_see_password').click(function(e){
			if ($("#txt_password").attr("type") == "password") {
	            $("#txt_password").attr("type", "text");
	            $("#i_see_password").addClass('tone');
	            
	        }else{
	            $("#txt_password").attr("type", "password");
	            $("#i_see_password").removeClass('tone');
	        }
		});
		
		$('#btn_sendPhoneMsg').click(function(e){
			$("#btn_sendPhoneMsg").attr('disabled', true);
			sendPhoneMsg();
		});
		$('#btn_login_sms_code').click(function(e){
			$("#btn_login_sms_code").attr('disabled', true);
			sendLoginRandomcode();
		});
		
		$('#btn_alert').click(function(e){
			$("#div_alert").hide();
		});
    }
    //初始化事件--注册
    var initEventReg = function(){
    	 
		$("#img_captcha_reg").click(function(){
			captcha("captchaReg");
		});

		$("#btn_register").click(function(){
			register();
		});

		$("#btn_back2Register").click(function(){
			$("#form").hide();//登录
	    	$("#form1").hide();//查询码
	    	$("#form2").hide();//短信验证码
	    	$("#form3").hide();//问题集

	    	$("#form_reg").show();//注册
    		$("#form1_reg").hide();
	    	$('#txt_captcha_reg').val("");
	    	$("#btn_register").attr('disabled', false);

	    	$("#div_alert").hide();
    		$("#content_alert").html('');
	    	//获取图片验证码
	    	captcha("captchaReg");
		});
		
		$('#txt_loginName').focus(function() {
			$('#div_loginName_hint').show();
		});
		$('#txt_loginName').blur(function() {
			var loginName = $('#txt_loginName').val();
			$('#div_loginName_hint').hide();
			if(loginName != ''){
				checkRegLoginnameHasUsed(loginName);
			}
		});

		$('#txt_passWord').focus(function() {
			$('#div_passWord_hint').show();
		});
		$('#txt_passWord').blur(function() {
			$('#div_passWord_hint').hide();
		});
		
		$('#i_see_passWord').click(function(e){
			if ($("#txt_passWord").attr("type") == "password") {
	            $("#txt_passWord").attr("type", "text");
	            $("#i_see_passWord").addClass('tone');
	        }else{
	            $("#txt_passWord").attr("type", "password");
	            $("#i_see_passWord").removeClass('tone');
	        }
		});
		
		$('#i_see_confirmPassWord').click(function(e){
			if ($("#txt_confirmPassWord").attr("type") == "password") {
	            $("#txt_confirmPassWord").attr("type", "text");
	            $("#i_see_confirmPassWord").addClass('tone');
	        }else{
	            $("#txt_confirmPassWord").attr("type", "password");
	            $("#i_see_confirmPassWord").removeClass('tone');
	        }
		});
		
		$('#btn_getMobileVerifyCode').click(function(e){
			getMobileVerifyCode();
		});
		$('#btn_pbccrcSaveUser').click(function(e){
			pbccrcSaveUser();
		});
		
		$('#btn_alert').click(function(e){
			$("#div_alert").hide();
		});
    }
    //初始化
    var init = function(){
    	$("#form").show();//登录
    	$("#form1").hide();//查询码
    	$("#form2").hide();//短信验证码
    	$("#form3").hide();//问题集

    	$("#form_reg").hide();//注册
		$("#form1_reg").hide();
		//初始化事件
		initEvent();
		
		//初始化请求
    	initRequestParam();
    }
    
    //注册初始化
    var initReg = function(){
    	idCardNo = $("#txt_idCardNo").val();
    	$("#form").hide();//登录
    	$("#form1").hide();//查询码
    	$("#form2").hide();//短信验证码
    	$("#form3").hide();//问题集
    	
    	$("#form_reg").show();//注册
		$("#form1_reg").hide();
    	$('#txt_idNo').val(idCardNo);
    	$('#txt_name').val("");
    	$('#txt_captcha_reg').val("");
    	$("#btn_register").attr('disabled', false);

    	$("#div_alert").hide();
		$("#content_alert").html('');
		//初始化事件
		initEventReg();
    	
    	//获取图片验证码
    	captcha("captchaReg");
    }
	
	return {
		init: function() {
			init();
		},
		loadUI: function(){
			var inputstyle = Common.getParameter("inputstyle");
			if(inputstyle == null || inputstyle == ''){
				inputstyle = 'line';
			}
			document.writeln("<script src=\'assets/module/js/dock/creditreport-" + inputstyle + ".js\' type=\'text/javascript\'></script>");
			document.writeln("<script src=\'assets/module/js/dock/creditreport-register-" + inputstyle + ".js\' type=\'text/javascript\'></script>");
		}
	}
}();