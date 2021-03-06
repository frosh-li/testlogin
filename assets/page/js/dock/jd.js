var JD = function() {
	var intervalMS = 1000; //间隔毫秒

	var step = '';
	var smsIntervalSecond = 120;
	var currentQueryMaxTimes = 0;
	var resultQueryTimesMax = 60; //轮询的最大次数

	var isNative = true; //如果是异地登录的时候，就设置为false，默认为true;
	var captchaIdentifyMaxTimes = 3;
	var captchaIdentifyIndex = 0;
	var isDoCaptchaIdentify = true; //是否执行验证码识别

	//图片验证码
	var captchaCode = '';
	var noAgreement = false;

	//请求参数
	var productType = '';
    var applyNo = '';
    var cardId = '';
    var loginName = '';
    var successDirectUrl = webDockURL + "success.html";
    var errorDirectUrl = webDockURL + "error_.html";
    var callbackUrl = "";
	var userName = "";

    var uid = "";
    var ukey = "";
    var ctm = "";
    var userid = "";
    var ictoken = "";
	
  //获取USERID
    var getTokenProcessorURL = function(){
    	// var params = "/donless/generateUserId?uid="+uid+"&ctm=" + ctm+"&token="+ictoken;
    	var url = Common.getMainUrl();
    	var params = {
				app_key:Common.getAppKey(),
				interface:"donless/generateUserId",
				userid:userid
			};
    	$.ajax({
			type:"post",
			url: Common.getMainUrl(),
			data:JSON.stringify(params),
			cache: false,
			async: false,
			dataType:"json",
			success:function(data){
				if(data.code == 0){
					applyNo = data.msg;
					userid = data.result;
					showLoading(false, '');
					if(loginName != null && loginName != ''){
			    		$('#txt_user').val(loginName);
			    		$('#txt_user').attr("readonly",true)
			    		$("#btn_login").attr('disabled', false);
			    		captcha();
			    	}

					// Common.saveRelationalParams(relationalParams,uid,ctm,ictoken,userid,"jingdong");
					
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
	var captcha = function() {
		step = 'captcha';
		//合法性验证
		var isValidate = validate();
		var relationalParams = "";
		var cookie_apply_id = Common.getCookie("apply_id"),
				cookie_app_key = Common.getCookie("app_key");
				// "U2FsdGVkX19u/OtUsgp4ewpDseZfQWoHxG22id8eyzTWG3HrLGRan0YMzYXuWshj8nvntzVAl11StbjCaqBNCA==",
				// "U2FsdGVkX182TH1O0zWkzuYbiDso5Sxw3Eu+OJ7yT5P0Ojgtb/ort+ubU0V+x7RQ"
		
		if(cookie_apply_id && cookie_apply_id){

		 		relationalParams = CryptoJS.AES.decrypt(cookie_apply_id.toString(),"secret_key").toString(CryptoJS.enc.Utf8);
		 		relationalParams += "_";
				relationalParams +=  CryptoJS.AES.decrypt(cookie_app_key.toString(),"secret_key").toString(CryptoJS.enc.Utf8);

		}
		//登陆逻辑
		if(isValidate) {
			showLoading(true, '');
			var params = {
				app_key:Common.getAppKey(),
				userid:userid,
				interface:"jd/captcha",
				loginName:loginName,
				relationalParams:relationalParams
			};
			var url = Common.getMainUrl();
			$.ajax({
				type:"post",
				url: url,
				cache:false,
				async: true,
				data:JSON.stringify(params),
				dataType:"json",
				success: function(data) {
					dealQueryResult(data);
				},
				error: function(data) {
					alert("对不起，获取图片验证码失败！请稍后重试。");
					showLoading(false, '');
				}
			});
		}
	}

	//2.登录
	var login = function() {
		step = 'login';
		//合法性验证
		var isValidate = validate();

		//登陆逻辑
		if(isValidate) {
			showLoading(true, '');
			var password = $('#txt_password_website').val();
			
			var url = Common.getMainUrl();
			var params = {
				interface:"jd/login",
				app_key:Common.getAppKey(),
				userid:userid,
				loginName:userName,
				password:password,
				captchaCode:captchaCode
			};
			$.ajax({
				type:"post",
				url: url, 
				cache:false,
				async: true,
				dataType:"json",
				data:JSON.stringify(params),
				success: function(data) {
					dealQueryResult(data);
				},
				error: function(data) {
					alert("对不起，登陆失败失败！请稍后重试。");
					showLoading(false, '');
				}
			});
		}
	}

	//3.如果有异地登录，需要获取短信密码
	var sendMobileCode = function() {
		showLoading(true, '');
		step = 'sendMobileCode';
		// var params = ("jd/sendMobileCode?" + 
		// 		"uid=" + uid + 
		// 		"&ctm=" + ctm + 
		// 		"&token=" + ictoken + 
		// 		"&userid=" + userid );
		var params = {
			app_key:getAppKey(),
			interface:"jd/sendMobileCode",
			userid:userid
		};
		var url = Common.getMainUrl;
		$.ajax({
			type: "post",
			url: url,
			cache: false,
			async: true,
			dataType:"json",
			data:JSON.stringify(params),
			success: function(data) {
				dealQueryResult(data);
			},
			error: function(data) {
				alert("对不起，获取手机验证码失败！请稍后重试。");
				showLoading(false, '');
			}
		});

	}

	//4.短信登录
	var validMobile = function() {
		step = 'validMobile';
		//合法性验证
		var isValidate = validate();
		//登陆逻辑
		if(isValidate) {
			showLoading(true, '');
			var smsCode = $('#txt_login_sms_code').val();
			// var params = ("jd/validMobile?" + 
			// 		"uid=" + uid + 
			// 		"&ctm=" + ctm + 
			// 		"&token=" + ictoken + 
			// 		"&userid=" + userid +
			// 		"&smsCode="+ smsCode);
			var params = {
				app_key:Common.getAppKey(),
				interface:"jd/validMobile",
				userid:userid,
				smsCode:smsCode
			};
			var url = Common.getMainUrl();
			$.ajax({
				type: "post",
				url: url,
				cache: false,
				async: true,
				dataType:"json",
				data:JSON.stringify(params),
				success: function(data) {
					dealQueryResult(data);
				},
				error: function(data) {
					alert("对不起，登陆失败失败！请稍后重试。");
					showLoading(false, '');
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
				success:function(data){//{"errorCode":"00000","result":{"answer":null,"answerId":"060367388417514693","time":"0.321"},"success":true}
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
			success:function(data){//{"code":0,"result":{"answer":"EMUSR"}}
				try{
					if(data.code == 0){
						var result = data.result.answer;
						console.log("验证码识别结果：" + result); 
						var divId = "#div_" + captchaId; //div_captcha、div_captcha_second
						var txtId = "#txt_" + captchaId; //txt_captcha、txt_captcha_second
						if($(divId).is(":visible")){
//							if($(txtId).val() == ''){
//								$(txtId).val(result);
//							}
							$(txtId).val(result);
						}
					}
				}catch(e){}
			},
			error:function(data){
				console.log("验证码识别结果查询失败");
				showLoading(false, '');
			}
		});
    }
    

	//=======================================================================================================
	//查询结果处理
	var dealQueryResult = function(data) {
		showLoading(false, '');
    	try{
    		if(data.result == false){
    			var errorHint = data.msg
    			if(errorHint != null){
    				showAlert(true, '错误: ' + errorHint);
    			}else{
    				showAlert(true, '错误: ' + data.code);
    			}
    		}else{
    			showAlert(false, '');
    		}
    	}catch(e){
    		console.log(e);
    	}

		try {
			if(step == 'captcha') {
				try {
					var imgUrl = data.msg;
					if(imgUrl != null &&　imgUrl != ""){
						$("#div_captcha").show();
						$("#img_captcha").attr("src", imgUrl);
						if(uid.substring(0,3) == "100" && uid != "100001"){
							captchaIdentifyUrl('captcha', imgUrl); //验证码识别
						}
					}
				} catch(e) {}
			} else if(step == 'sendMobileCode') {
				if(data.code == 0) {
					alert('短信已发送');
					smsIntervalSecond = 60;
					cycleShowing('#btn_login_sms_code');
				} else {
					smsIntervalSecond = 0;
					$('#btn_login_sms_code').attr('disabled', false); //属性不可用，不可点击
				}
			} else if(step == 'login') {
				if(data.code == 0) {
					isNative = true;
					$("#txt_user").innerHTML = '';
					$("#txt_password_website").innerHTML = '';
					$("#txt_captcha").innerHTML = '';
					$('#txt_login_sms_code').innerHTML = '';
					$('#txt_login_sms_code').hide();

					Common.saveRelationalParams(relationalParams,uid,ctm,ictoken,userid,"jingdong");
					
	    			//跳转
	    			setTimeout(function(){
	    				if(successDirectUrl.indexOf("?") == -1){
	    					successDirectUrl += "?userid=" + userid;
	    				}else{
	    					successDirectUrl += "&userid=" + userid;
	    				}
	    				top.location.href = successDirectUrl;
	    			}, 1000); 
				} else if(data.code == '22005') { //有异地登录
					//需要填写短信验证码的时候，其它的标签隐藏
					$("#form").hide();
					$("#form2").show();
				} else {
					$('#btn_login_sms_code').attr('disabled', false); //属性不可用，不可点击
				}
			} else if(step == 'validMobile') {
				if(data.code == 0) {
					isNative = true;
					$("#txt_user").innerHTML = '';
					$("#txt_password_website").innerHTML = '';
					$("#txt_captcha").innerHTML = '';
					$('#txt_login_sms_code').innerHTML = '';
					$('#txt_login_sms_code').hide();

					Common.saveRelationalParams(relationalParams,uid,ctm,ictoken,userid,"jingdong");
					
	    			//跳转
	    			setTimeout(function(){
	    				if(successDirectUrl.indexOf("?") == -1){
	    					successDirectUrl += "?userid=" + userid;
	    				}else{
	    					successDirectUrl += "&userid=" + userid;
	    				}
	    				top.location.href = successDirectUrl;
	    			}, 1000); 
				} else if(data.code == '20005') { //有异地登录
					$('#btn_login_sms_code').attr('disabled', false);
					$('#btn_login_sms').attr('disabled', false);
				} else {
					$("#form").show();
					$("#form2").hide();
					//登录请求过期，需重新登录
					captcha();
					$('#btn_login_sms_code').attr('disabled', true); 
				}
			}
		} catch(e) {
			//跳转
			top.location.href = (errorDirectUrl);
		}
	}

	//合法性验证
	var validate = function() {
		var errorHint = '';
		userName = $('#txt_user').val();
		var password = '';
		var smsCode = "";

		if(userName == '') {
			errorHint += "<p>" + '请输入京东用户名' + '</p>';
		}
		if(step != 'captcha') {
			if($("#div_password_website").is(":visible")) {
				password = $('#txt_password_website').val();
				if(password == '') {
					errorHint += "<p>" + '请输入京东登录密码' + '</p>';
				}
			}
			if($("#div_captcha").is(":visible")) {
				captchaCode = $('#txt_captcha').val();
				if(captchaCode == '') {
					errorHint += "<p>" + '请输入图片验证码' + '</p>';
				}
			}
			if($("#div_login_sms_code").is(":visible")) {
				smsCode = $('#txt_login_sms_code').val();
				if(smsCode == '') {
					errorHint += "<p>" + '请输入短信验证码' + '</p>';
				}
			}
		}
		
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

	//显示警告信息
	var showAlert = function(isShow, hint) {
		if(isShow) {
			$("#div_alert").show();
			$("#content_alert").html(hint);
		} else {
			$("#div_alert").hide();
			$("#content_alert").html('');
		}
	}

	//动画显示
	var showLoading = function(isShow, hint) {
		var elementId = '';
		if($("#form").is(":visible")) {
			elementId = "#form";
		}
		if(isShow) {
			$("#div_loading").hide();
			$(elementId).waitMe({
				effect: 'win8', //none、bounce、rotateplane、stretch、orbit、roundBounce、win8、win8_linear、ios、facebook、rotation、timer、pulse、progressBar、bouncePulse、img
				text: '处理中...',
				bg: 'rgba(255,255,255,0.8)',
				color: '#99a5c2', //'#26a69a',
				sizeW: '',
				sizeH: '',
				source: ''
			});
		} else {
			$("#div_loading").hide();
			$(elementId).waitMe('hide');
		}
	}

	//循环显示
	var cycleShowing = function(elementId) {
		smsIntervalSecond -= 1;
		if(smsIntervalSecond <= 0) {
			smsIntervalSecond = 60;
			$(elementId).html('获取验证码');
			$(elementId).attr('disabled', false);
		} else {
			$(elementId).html(smsIntervalSecond + '秒后重试');
			setTimeout(function() {
				cycleShowing(elementId);
			}, 1000); //延时1s
		}
	}

	var isRequestParamException = false; //标记是否请求参数异常
	var relationalParams = null;
	//初始化请求参数
	var initRequestParam = function() {
		showLoading(true, '');
		
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
    	
    	loginName = Common.getParameter("loginName");
    	if(loginName != null && loginName != ''){
    		$('#txt_user').val(loginName);
    		$("#btn_login").attr('disabled', false);
    	}
    	getTokenProcessorURL();
	}

	//初始化事件
	var initEvent = function() {
		$('#txt_user').bind('input propertychange', function() {
			var user = $('#txt_user').val();
			if(user != '') {
				$("#btn_login").attr('disabled', false);
			} else {
				$("#btn_login").attr('disabled', true);
				$("#div_login_sms_code").hide();
				$("#div_captcha").hide();
			}
		});
		$('#txt_user').blur(function() {
			captcha();
		});
		$("#img_captcha").click(function() {
			captcha();
		});
		$('#btn_login').click(function(e) {
			login();
		});

		$('#i_see_password_website').click(function(e) {
			if($("#txt_password_website").attr("type") == "password") {
				$("#txt_password_website").attr("type", "text");
				$("#i_see_password_website").addClass('tone');
			} else {
				$("#txt_password_website").attr("type", "password");
				$("#i_see_password_website").removeClass('tone');
			}
		});
		$('#btn_login_sms_code').click(function(e) {
			$("#btn_login_sms_code").attr('disabled', true);
			sendMobileCode();
		});
		$('#btn_login_sms').click(function(e) {
			validMobile();
		});
		$('#btn_alert').click(function(e) {
			$("#div_alert").hide();
		});

	}

	//初始化
	var init = function() {
		//页面元素初始化
		$("#div_captcha").hide();
		$("#form2").hide();
		$("#btn_login").attr('disabled', true);

		//初始化事件
		initEvent();

		//初始化请求
		initRequestParam();

	}

	return {
		init: function() {
			init();
		},
		loadUI: function() {
			var inputstyle = Common.getParameter("inputstyle");
			if(inputstyle == null || inputstyle == '') {
				inputstyle = 'line';
			}
			document.writeln("<script src=\'assets/module/js/dock/jd-step1-" + inputstyle + ".js\' type=\'text/javascript\'></script>");
		}
	}
}();