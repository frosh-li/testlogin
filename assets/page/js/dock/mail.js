var CreditCardMail = function () {
	var captchaId = "captcha";
	var applyNo = "";
	var entry;
	var qqentry = "qqphantomJs";
	var productType = "test";
	var cardId = "aaa";
	var txt_rnum = "";
	var userName;
	var mappedUrl = "";
	var netEaseMappedUrl = "mccb/simulationLogin";
	var popMappedUrl = "mccb/protocolLogin";
	var qqMappedUrl = "mccb/qqInHttp";
	var serviceType = "mccb";
	var refreshcode = true;
	var currentQueryMaxTimes = 0;
	var resultQueryTimesMax = 60;
	var intervalMS = 1000;
	var step = '';
	var currentStep = "login";
	var captchaIdentifyMaxTimes = 1;
	var captchaIdentifyIndex = 0;
	var isDoCaptchaIdentify = true;
	var successDirectUrl = "";
	var errorDirectUrl = "";
	var reqToken = '';
	var oldUserName;
	var filter = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	var isRequestParamException = false;

    var uid = "";
    var ukey = "";
    var ctm = "";
    var userid = "";
    var ictoken = "";
	var noAgreement = false;
    
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

					Common.saveRelationalParams(relationalParams,uid,ctm,ictoken,userid,"creditCard");
					
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
    
    var relationalParams = null;
    
	var initRequestParam = function () {
		
		//图片验证码
    	captchaCode = '';
    	
    	//请求参数
        productType = '';
        applyNo = '';
        cardId = '';
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
	 
	var login = function () {
		step = 'login';
		//合法性验证
		var isValidate = validate();
		//登陆逻辑
		if(isValidate) {
			showAlert(false, '');
			showLoading(true, '');
			 
			userName = $("#txt_mailaddress").val();
			password = $("#txt_password").val();
			captchaCode = $("#txt_captcha").val();
			alonePassWord = $("#txt_alonepassword").val();
			getmailType(userName);
			
			var params = (mappedUrl + "?" + 
					"uid=" + uid + 
					"&ctm=" + ctm + 
					"&token=" + ictoken + 
					"&userid=" + userid + 
					"&applyNo=" + applyNo + 
					"&step=" + currentStep + 
					"&entry=" + entry + 
					"&username=" + userName + 
					"&password=" + password + 
					"&captchaCode=" + captchaCode + 
					"&alonePassWord=" + alonePassWord + 
					"&productType=" + productType + 
					"&cardId=" + cardId  +
    				"&relationalParams=" + encodeURIComponent(relationalParams));
			var url = Common.getTokenURL(openapiURL, params);
			console.log("applyNo=" + applyNo + "request url=" + url + " currentStep=" + currentStep);
			$.ajax({
				type : "get",
				url : url,
				cache : false,
				success : function (data) {
					console.log(data);
					dealQueryResult(data);
				},
				error : function (data) {
					showLoading(false, '');
					console.log(data);
					showAlert(true, "对不起，登陆失败！请稍后重试。");
				}
			});
		}
	}
	var showCatpcha = function (data) {
		console.log("加载验证码");
		var url = data.result;
		console.log(data);
		$("#txt_captcha").val("");
		$("#div_captcha").show();
		url = Common.getImageProxyURL(url);
		$("#img_captcha").attr('src', url);
		console.log("识别验证码开始");
		captchaIdentifyUrl(captchaId, url);
		console.log("识别验证码结束");
		currentStep = data.step;
	}
	 
	var dealQueryResult = function (data) {
		console.log(data.code);
		console.log(data.step);
		showLoading(false, '');
		try {
			currentStep = data.step;
			if (data.code == "20001") {
				console.log("需要验证码");
				$("#div_password_website").show();
				showCatpcha(data);
			} else if (data.code == "10020") {
				console.log("需要独立密码");
				$("#div_alonepassword_website").show();
			} else if (data.code == "30006") {
				//搜索完成如果没有账单，回调通知调用方
				doneCallBack(successDirectUrl,"30006");
				showAlert(true, "很遗憾,没有搜索到信用卡账单,请联系银行客服重新发送账单哦!");
				resetStep();
				clearPassWordAndHidecap();
			} else if (data.code == "0") {
				
				Common.saveRelationalParams(relationalParams,uid,ctm,ictoken,userid,"creditCard");
				
				setTimeout(function () {
					var directUrl = successDirectUrl;
					if (directUrl.indexOf("?") != -1) {
						directUrl = directUrl + "&userid="+userid+"&email=" + userName;
					} else {
						directUrl = directUrl + "?userid=" + userid+ "&email="+userName;
					}
					window.location.href = directUrl;
				}, 1000);
			} else if (data.code == "20002") {
				showAlert(true, "验证码错误");
				$("#txt_captcha").val("");
			} else if (data.code == "10007") {
				$("#txt_alonepassword").val("");
				showAlert(true, "独立密码错误");
			} else if (data.code == "10001") {
				showAlert(true, "网络不稳定,请稍后再试");
				resetStep();
				clearPassWordAndHidecap();
			}else if(data.code == "10000"){
				//如果属于搜索过程中出现异常,此时流程结束,回调通知调用方	
				showAlert(true, "网络不稳定,请稍后再试");
				doneCallBack(successDirectUrl,"30022");
				resetStep();
				clearPassWordAndHidecap();
			} else if (data.code == "20003") {
				clearPassWordAndHidecap();
				showAlert(true, "用户名或者密码错误");
			} else if(data.code == "10006"){
				showAlert(true, "获取验证码失败,请稍后再试");
				resetStep();
				clearPassWordAndHidecap();
			}else if(data.result == false){
    			var errorHint = data.msg
    			if(errorHint != null && errorHint != ''){
    				showAlert(true, '错误: ' + errorHint);
    			}else{
    				showAlert(true, '错误: ' + data.code);
    			}
    		}else{
    			showAlert(false, '');
    		}
		} catch (e) {
			console.log(e);
		}
	}
	var checkName = function (name) {
		if (name != oldUserName) {
			resetStep();
			hideCapandAlonePassword();
		}
		oldUserName = name;
	}
	var resetStep = function () {
		currentStep = "";
	}
	var hideCapandAlonePassword = function () {
		if ($("#div_captcha").is(":visible")) {
			$("#txt_captcha").val("");
			$("#div_captcha").hide();
		}
		if ($("#div_alonepassword_website").is(":visible")) {
			$("#txt_alonepassword").val("");
			$("#div_alonepassword_website").hide();
		}
	}
	var clearPassWordAndHidecap = function () {
		$("#txt_password").val("");
		hideCapandAlonePassword();
		resetStep();
	}
	var showLoading = function (isShow, hint) {
		var elementId = '';
		if ($("#container").is(":visible")) {
			elementId = "#container";
		}
		var text = '处理中...';
		if (hint != '') {
			text = hint;
		}
		if (isShow) {
			$("#div_loading").hide();
			$(elementId).waitMe({
				effect : 'roundBounce',
				text : text,
				bg : 'rgba(255,255,255,0.8)',
				color : '#99a5c2',
				sizeW : '',
				sizeH : '',
				source : ''
			});
		} else {
			$("#div_loading").hide();
			$(elementId).waitMe('hide');
		}
	}
	var showAlert = function (isShow, hint) {
		if (isShow) {
			$("#div_alert").show();
			$("#content_alert").html(hint);
		} else {
			$("#div_alert").hide();
			$("#content_alert").html('');
		}
	}
	var captchaIdentifyUrl = function (captchaId, imageUrl) {
		if (isDoCaptchaIdentify == true && captchaIdentifyIndex < captchaIdentifyMaxTimes) {
			imageUrl = encodeURIComponent(imageUrl);
			var params = ("type=6&waitFlg=false&captchaUrl=" +imageUrl+
			    	"&uid=" + uid + 
					"&ctm=" + ctm + 
					"&token=" + ictoken + 
					"&userid=" + userid);
			var url = Common.getTokenURL(ocrURL, params);	
			$.ajax({
				type : "GET",
				url : url,
				cache : false,
				async : true,
				success : function (data) {
					try {
						captchaIdentifyIndex += 1;
						var answerId = data.result.answerId;
						queryCaptchaIdentifyResult(captchaId, answerId);
					} catch (e) {}

				},
				error : function (data) {
					console.log("验证码识别服务调用失败");
				}
			});
		} else {
			console.log("不执行验证码识别，isDoCaptchaIdentify ： " + isDoCaptchaIdentify + "，captchaIdentifyIndex ： " + captchaIdentifyIndex + "， captchaIdentifyMaxTimes：" + captchaIdentifyMaxTimes);
		}
	}
	var queryCaptchaIdentifyResult = function (captchaId, answerId) {
		var params = ("waitFlg=true&answerId=" + answerId+
		    	"&uid=" + uid + 
				"&ctm=" + ctm + 
				"&token=" + ictoken + 
				"&userid=" + userid);
		var url = Common.getTokenURL(ocrURL, params);
		$.ajax({
			type : "GET",
			url : url,
			cache : false,
			async : true,
			success : function (data) {
				try {
					if (data.success) {
						var result = data.result.answer;
						console.log("验证码识别结果：" + result);
						var divId = "#div_" + captchaId;
						var txtId = "#txt_" + captchaId;
						if ($(divId).is(":visible")) {
							$(txtId).val(result);
						}
					}
				} catch (e) {}

			},
			error : function (data) {
				console.log("验证码识别结果查询失败");
			}
		});
	}
	var refreshcaptcha = function () {
		if (entry == qqentry) {
			currentStep = "loadcatpcha";
		} else {
			currentStep = "login";
		}
		refreshcode = false;
		login();
	}
	var getmailType = function (username) {
		if (username.indexOf("@") > 1) {
			username = username.substring(username.indexOf("@") + 1, username.length);
			if (username.indexOf("163") > -1) {
				entry = "163simulation";
			} else
				if (username.indexOf("126") > -1) {
					entry = "126simulation";
				} else
					if (username.indexOf("qq") > -1) {
						entry = "qqphantomJs";
					} else {
						entry = "protocol";
					}
		}
		initConfig(entry);
	}
	var initConfig = function (type) {
		if (type == "163simulation" || type == "126simulation") {
			mappedUrl = netEaseMappedUrl;
		} else if (type == "qqphantomJs") {
			currentStep = "loadcatpcha";
			resultQueryTimesMax = "100";
			entry = qqentry;
			mappedUrl = qqMappedUrl;
		} else {
			mappedUrl = popMappedUrl;
			resultQueryTimesMax = "150";
		}
		if(currentStep == ''){
			currentStep = "login";
		}
	}
	function CheckMail(mail) {
		if (filter.test(mail)) {
			$("#btn_login").attr('disabled', false);
		} else {
			$("#btn_login").attr('disabled', true);
		}
	}
	var initAutocomplete = function () {
		$("#txt_mailaddress").autocomplete({
			delay : 0,
			autoFocus : true,
			position : {
				my : "left-40 top",
				at : "left bottom",
				of : "#txt_mailaddress"
			},
			select : function (e, ui) {
				var value = ui.item.value;
				if (value) {
					$('#txt_mailaddress').val(value);
					CheckMail(value);
				}
			},
			source : function (request, response) {
				var hosts;
				if (entry == '126simulation') {
					hosts = ['126.com'];
				} else if (entry == '163simulation') {
					hosts = ['163.com'];
				} else if (entry == qqentry) {
					hosts = ['qq.com'];
				} else {
					hosts = ['qq.com', '163.com', '126.com', '139.com', '188.com', '189.com', 'hotmail.com', 'yeah.net', 'sina.com', 'souhu.com'];
				}
				var term = request.term,
				name = term,
				host = '',
				ix = term.indexOf('@'),
				result = [];
				if (ix > -1) {
					name = term.slice(0, ix);
					host = term.slice(ix + 1);
				}
				if (name) {
					var findedHosts;
					if (host) {
						findedHosts = $.grep(hosts, function (value, index) {
								return value.indexOf(host) > -1;
							});
					} else {
						findedHosts = hosts;
					}
					var findedResult = $.map(findedHosts, function (value, index) {
							return name + '@' + value;
						});
					result = findedResult;
				}
				response(result);
			}
		});
	}
	//合法性验证
	var validate = function() {
		var errorHint = '';
		
		if(step == 'login' && !noAgreement) {
			var xieyi = $("input[id='checkbox15']").is(':checked');
			
			if(!xieyi) {
				errorHint += "<p>" + '请先同意《数据授权服务协议》' + '</p>';
			}
		}

		if(errorHint == '') {
			showAlert(false, '');
			return true;
		} else {
			showAlert(true, errorHint);
			return false;
		}

	}
	var init = function () {
		entry = Common.getParameter("mail");
		initConfig(entry);
		initRequestParam();
		$("#btn_login").attr('disabled', true);
		CheckMail($('#txt_mailaddress').val());
		$('#txt_mailaddress').bind('input propertychange', function () {
			var username = $('#txt_mailaddress').val();
			if (username.length > 0) {
				$("#i_remove_name").show();
			} else {
				$("#i_remove_name").hide();
			}
			CheckMail(username);
			checkName(username);
		});
		$('#btn_alert').click(function (e) {
			$("#div_alert").hide();
		});
		$("#btn_login").click(function () {
			if ($("#txt_password").is(":visible") && $("#txt_password").val() == "") {
				showAlert(true, "邮箱密码不能为空");
				return false;
			} else if ($("#txt_alonepassword").is(":visible") && $("#txt_alonepassword").val() == "") {
				showAlert(true, "qq独立密码不能为空");
				return false;
			} else if ($("#txt_captcha").is(":visible") && $("#txt_captcha").val() == "") {
				showAlert(true, "验证码不能为空");
				return false;
			} else {
				login();
			}
		});
		$('#img_captcha').click(function () {
			if ($("#div_captcha").is(':visible')) {
				refreshcaptcha();
			}
		});
		$('#i_see_password_website').click(function (e) {
			if ($("#txt_password").attr("type") == "password") {
				$("#txt_password").attr("type", "text");
				$("#i_see_password_website").addClass('tone');
			} else {
				$("#txt_password").attr("type", "password");
				$("#i_see_password_website").removeClass('tone');
			}
		});
		$('#i_see_alone_password_website').click(function (e) {
			if ($("#txt_alonepassword").attr("type") == "password") {
				$("#txt_alonepassword").attr("type", "text");
				$("#i_see_alone_password_website").addClass('tone');
			} else {
				$("#txt_alonepassword").attr("type", "password");
				$("#i_see_alone_password_website").removeClass('tone');
			}
		});
		$("#i_remove_name").click(function (e) {
			$('#txt_mailaddress').val("");
			$("#i_remove_name").hide();
			CheckMail($('#txt_mailaddress').val());
		});
		initAutocomplete();
	}
	//一个流程结束后,如果不成功的话通知下业务方
	var doneCallBack=function (url,errorcode){
		var redirectUrl = url;
		if (redirectUrl.indexOf("?") != -1) {
			redirectUrl = redirectUrl + "&email=" + userName+"&errorcode=" + errorcode;
		} else {
			redirectUrl = redirectUrl + "?email=" + userName+"&errorcode=" + errorcode;
		}
		Common.doneCallBack(redirectUrl);
	}
	
	return {
		init : function () {
			init();
		},
		loadUI : function () {
			document.writeln("<!-- step01 -->");
			document.writeln("<script src=\'assets/module/js/dock/mail-line.js\' type=\'text/javascript\'></script>");
			document.writeln("    ");
		}
	}
}
();
