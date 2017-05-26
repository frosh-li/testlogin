var Mobile = function() {
   
    var mobileReg = new RegExp("^[1][345789][0-9]{9}$");
    var intervalMS = 2000; //间隔毫秒
    
	var smsIntervalSecond = 60;
	
    var captchaIdentifyMaxTimes = 3;
    var captchaIdentifyIndex = 0;
	var isDoCaptchaIdentify = true; //是否执行验证码识别
	var step = '';
	//图片验证码
	var captchaCode = '';
	var noAgreement = false;
 
    var successDirectUrl = webDockURL + "success.html";
    var errorDirectUrl = webDockURL + "error_.html";
    var callbackUrl = "";
    
    var uid = "";
    var ukey = "";
    var ctm = "";
    var userid = "";
    var phoneNumber = "";
    var ictoken = "";
    var emergencyContact = "";
    //获取USERID
    var getTokenProcessorURL = function(){
    	var url = Common.getMainUrl();
    	var app_key = Common.getAppKey();
    	console.log(url, app_key);
    	$.ajax({
			type:"post",
			url: url,
			data:JSON.stringify({
				"app_key":app_key,
				"interface":"donless/generateUserId"
			}),
			cache: false,
			async: false,
			success:function(data){
				if(data.code == 0){
					userid = data.msg;
					showLoading(false, '');
					var phoneNumber = $('#txt_mobile').val();
					if(phoneNumber != null &&　phoneNumber　!= ""){
						$('#txt_mobile').attr("readonly",true)
						checkCarrierOperator(phoneNumber);
			    	}
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
    
    //合法性验证
    var validate = function(){
    	var errorHint = '';
    	
    	var custCardId = $('#txt_cardId').val();
    	var custName = $('#txt_userName').val();
    	var password  = '';
    	var websitePassword = '';
    	var randomCode = ''; //登录短信密码
    	
    	if($("#div_password_service").is(":visible")){
    		password = $('#txt_password_service').val();
    		if(password == ''){
    			errorHint += "<p>" + '请输入服务密码' + '</p>';
    		}
    	}
    	
    	if($("#div_password_website").is(":visible")){
    		password = $('#txt_password_website').val();
    		if(password == ''){
    			errorHint += "<p>" + '请输入网站密码' + '</p>';
    		}
    	}
     
    	if($("#div_captcha").is(":visible")){
    		captchaCode = $('#txt_captcha').val();
    		if(captchaCode == ''){
    			errorHint += "<p>" + '请输入图片验证码' + '</p>';
    		}
    	}
    	
    	
    	if($("#txt_userName").is(":visible")){
    		var custName = $('#txt_userName').val();
    		if(custName == ''){
    			errorHint += "<p>" + '请输入真实姓名' + '</p>';
    		}
    	}
    	
    	if($("#txt_cardId").is(":visible")){
    		var custCardId = $('#txt_cardId').val();
    		if(custCardId == ''){
    			errorHint += "<p>" + '请输入真实身份证号' + '</p>';
    		}
    	}
    	
    	if(step == 'login' && !noAgreement) {
			var xieyi = $("input[id='checkbox15']").is(':checked');
			
			if(!xieyi) {
				errorHint += "<p>" + '请先同意《数据授权服务协议》' + '</p>';
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
    //1.检查手机号
    var checkCarrierOperator = function (phone){
    	//合法性验证
    	var mobile = $('#txt_mobile').val();
    	if(mobile == ''){
    		errorHint += "<p>" + '请输入手机号码' + '</p>';
    		showAlert(true, errorHint);
    		return false;
    	}
    	if(!mobileReg.test(mobile)){ 
			$("#div_password_website").hide();
			$("#div_password_service").hide();
			$("#div_login_sms_code").hide();
			$("#div_captcha").hide();
			showAlert(true, "手机号码不正确，请刷新页面后重试");
			return false;
		}
    	//登陆逻辑
		showLoading(true, '');
		phoneNumber = phone;
		var txtCardId = $('#txt_cardId').val();
		var txtUserName = $('#txt_userName').val();
		var params = {
			app_key:Common.getAppKey(),
			interface:"mobile/checkCarrierOperator",
			userid:userid,
			mobilePhone:mobile
		};
		$.ajax({
			type:"post",
			url: Common.getMainUrl(),
			data:JSON.stringify(params),
			cache: false,
			async: false,
			dataType:"json",
			success:function(data){
					dealQueryResult(data);
		    	console.log("是合法的手机号码......");
		    	console.log(data);
		    	console.log("是否需要验证码:" + data.msg.needCaptchaImg);
		    	// 支持
		    	if(data.result && data.msg.supported == true){
					if(data.code == "21002"){//只需要网站密码
						console.log("只需要网站密码");
						$("#div_password_website").show();
						$("#div_password_service").hide();
					}else if(data.code == "21003"){//需要网站密码和服务密码
						console.log("需要网站密码和服务密码");
						$("#div_password_website").show();
						$("#div_password_service").show();
					}else if(data.code == "21009"){//需要登录短信密码和服务密码
						console.log("需要登录短信验证码");
						$("#div_password_website").hide();
						$("#div_password_service").show();
						$("#div_login_sms_code").show();
					}else{//服务密码
						console.log("只需要服务密码");
						$("#div_password_website").hide();
						$("#div_password_service").show();
					}
					
					if(data.code == "21009"){//需要登录短信
						$("#div_login_sms_code").show();
					}else{
						$("#div_login_sms_code").hide();
					}
					
					if(data.msg.needCaptchaImg == true){//需要验证码
						$("#div_captcha").show();
						loadCaptchaImg();
					}else{
						$("#div_captcha").hide();
					}
		    	}else{
		    		alert("对不起，系统暂不支持您手机号所在的运营商");
    				showLoading(false, '');
				}
		    	// save mobile additional info
		    	// saveMobileAdditionalInfo();
			},
			error:function(data){
				alert("对不起，手机号码检查失败！请稍后重试。");
				showLoading(false, '');
			}
		});
		Common.saveRelationalParams(relationalParams,uid,ctm,ictoken,userid,"mobile");
	}
    
    //save mobile additional info
    var saveMobileAdditionalInfo = function(){
		var params = ("donless/mobileAdditionalInfo/save?" + 
				"uid=" + uid + 
				"&ctm=" + ctm + 
				"&token=" + ictoken + 
				"&userid=" + userid + 
				"&mobilePhone=" + phoneNumber +  
				"&idCardNo=" + encodeURIComponent($("#txt_cardId").val()) + 
				"&realName=" + encodeURIComponent($("#txt_userName").val()) +
				"&emergencyContact=" + encodeURIComponent(emergencyContact));
		var url = Common.getTokenURL(openapiURL, params);
		$.ajax({
			type:"get",
			url: url,
			cache:false,
			async: true,
			success:function(data){
				console.dir(data);
			},
			error:function(data){
				console.dir(data);
			}
		});
	}
    
    //2.获取图片验证码
    var loadCaptchaImg = function(){
    	showLoading(true, '');
		// var params = ("mobile/loadCaptchaImg?" + 
		// 		"uid=" + uid + 
		// 		"&ctm=" + ctm + 
		// 		"&token=" + ictoken + 
		// 		"&userid=" + userid + 
		// 		"&mobilePhone=" + phoneNumber);
		var params = {
			app_key:Common.getAppKey(),
			userid:userid,
			interface:"mobile/loadCaptchaImg",
			mobilePhone:phoneNumber
		};
		var url = Common.getMainUrl();
		$.ajax({
			type:"post",
			url: url,
			cache:false,
			async: true,
			data:JSON.stringify(params),
			dataType:"json",
			success:function(data){
				dealQueryResult(data);
	    		try{
	    			var imgUrl = data.msg.toString();
	    			$("#img_captcha").attr("src",  imgUrl);
	    			if(uid.substring(0,3) == "100" && uid != "100001"){
	    				captchaIdentifyUrl('captcha',  imgUrl); //验证码识别
	    			}
	    		}catch(e){
	    		}
			},
			error:function(data){
				alert("对不起，获取图片验证码失败！请稍后重试。");
				showLoading(false, '');
			}
		});
			 
	}
    
    //3.获取登录短信密码
    var sendLoginSmsCode = function(){
    	showLoading(true, '');
		// var params = ("mobile/sendLoginSmsCode?" + 
		// 		"uid=" + uid + 
		// 		"&ctm=" + ctm + 
		// 		"&token=" + ictoken + 
		// 		"&userid=" + userid + 
		// 		"&mobilePhone=" + phoneNumber+
		// 		"&captchaCode=" + $("#txt_captcha").val());
		var params = {
			app_key:Common.getAppKey(),
			userid:userid,
			interface:"mobile/sendLoginSmsCode",
			mobilePhone:phoneNumber,
			captchaCode:$("#txt_captcha").val()
		}
		var url = Common.getMainUrl();
		$.ajax({
			type:"post",
			dataType:"json",
			data:JSON.stringify(params),
			url: url,
			cache:false,
			async: true,
			success:function(data){
				dealQueryResult(data);
	    		if(data.result == true){
		    		alert('请查收您的登录短信验证码');
					cycleShowing('#btn_login_sms_code');
	    		}else{
	    			$('#btn_login_sms_code').attr('disabled', false);
	    		}
			},
			error:function(data){
				alert("对不起，获取短信验证码失败！请稍后重试。");
				showLoading(false, '');
			}
		});
	}
    
    //4.登陆
    var login = function(){
    	step = 'login';
    	//合法性验证
    	var isValidate = validate();
    	
    	//登陆逻辑
    	if(isValidate){
    		showLoading(true, '');
	    	var mobile = $('#txt_mobile').val();
	    	var	password = $('#txt_password_service').val();
	    	var	websitePassword = $('#txt_password_website').val();
	    	var	captchaCode = $('#txt_captcha').val();
	    	var	randomCode = $('#txt_login_sms_code').val();
	    	
			// var params = ("mobile/login?" + 
			// 		"uid=" + uid + 
			// 		"&ctm=" + ctm + 
			// 		"&token=" + ictoken + 
			// 		"&userid=" + userid + 
			// 		"&mobilePhone=" + mobile+
			// 		"&password=" + password + 
			// 		"&websitePassword=" + websitePassword + 
			// 		"&captchaCode=" + captchaCode + 
			// 		"&smsCode=" + randomCode);
			var url = Common.getMainUrl();
			var params = {
				interface:"mobile/login",
				app_key:Common.getAppKey(),
				userid:userid,
				mobilePhone:mobile,
				password:password,
				websitePassword:websitePassword,
				captchaCode:captchaCode,
				smsCode:randomCode
			};
			$.ajax({
				type:"post",
				url: url, 
				cache:false,
				async: true,
				dataType:"json",
				data:JSON.stringify(params),
				success:function(data){
					//dealQueryResult(data);
					showLoading(false, '');
			    	try{
			    		if(data.result == false){
			    			var errorHint = data.msg
			    			if(errorHint != null){
			    				showAlert(true, '错误: ' + errorHint);
			    			}else{
			    				showAlert(true, '错误: ' + data.code);
			    			}
			    			if(data.code == 20002){//图片验证码错误
			    				$("#div_captcha").show();
								loadCaptchaImg();
								return;
			    			}
			    		}else{
			    			showAlert(false, '');
			    		}
			    	}catch(e){
			    		console.log(e);
			    	}
		    		console.log("发送手机随机短信前是否需要图片验证码:" + data.msg.needSmsCaptchaImg);
					console.log("是否需要随机短信码:" + data.msg.needRandomSmsCode);
		    		var needSmsCaptchaImg = data.msg.needSmsCaptchaImg;
		    		var needRandomSmsCode = data.msg.needRandomSmsCode;
		    		if(data.result == true){
		    			if(needSmsCaptchaImg || needRandomSmsCode){
		    				$("#div_step_2").show();
		    				$("#form").hide();
		    			}else{
		    				$("#div_step_2").hide();
		    			}
		    			
		    			if(needSmsCaptchaImg){
		    				$("#div_captcha_second").show();
		    				loadSmsCaptchaImg();
		    			}else{
		    				$("#div_captcha_second").hide();
		    			}
		    			if(needRandomSmsCode){
		    				$("#div_radom_sms_code").show();
		    			}else{
		    				$("#div_radom_sms_code").hide();
		    				Common.saveRelationalParams(relationalParams,uid,ctm,ictoken,userid,"mobile");
			    			//跳转
			    			setTimeout(function(){
			    				if(successDirectUrl.indexOf("?") == -1){
			    					successDirectUrl += "?userid=" + userid+"&mobilePhone=" + phoneNumber;
			    				}else{
			    					successDirectUrl += "&userid=" + userid+"&mobilePhone=" + phoneNumber;
			    				}
			    				if("100001" == uid){
			    					successDirectUrl = webDockURL+"mobileSuccess.html?uid="+uid+"&ctm="
			    					+ctm+"&token="+ictoken+"&userid="+userid+"&mobilePhone="+phoneNumber;
			    				}
			    				top.location.href = successDirectUrl;
			    			}, 1000); 
		    			}
		    		}
				},
				error:function(data){
					alert("对不起，登陆失败失败！请稍后重试。");
					showLoading(false, '');
				}
			});
    	}
    }
    
    //5.二次获取图片验证码
    var loadSmsCaptchaImg = function(){
    	showLoading(true, '');
		var params = ("mobile/loadSmsCaptchaImg?" + 
				"uid=" + uid + 
				"&ctm=" + ctm + 
				"&token=" + ictoken + 
				"&userid=" + userid);
		var url = Common.getMainUrl();
		var params = {
			interface:"mobile/loadSmsCaptchaImg",
			app_key:Common.getAppKey(),
			userid:userid,
			mobilePhone:phoneNumber
		}
		$.ajax({
			type:"post",
			dataType:"json",
			data:JSON.stringify(params),
			url: url, 
			cache:false,
			async: true,
			success:function(data){
				dealQueryResult(data);
	    		try{
	    			var imgUrl = data.msg.toString();
	    			$("#img_captcha_second").attr("src",  Common.getImageProxyURL(imgUrl));
	    			if(uid.substring(0,3) == "100" && uid != "100001"){
	    				captchaIdentifyUrl('captcha_second',  imgUrl); //验证码识别
	    			}
	    		}catch(e){
	    		}
	    	
			},
			error:function(data){
				alert("对不起，二次获取图片验证码失败！请稍后重试。");
				showLoading(false, '');
			}
		});
	}
    
    //6.获取登录短信密码
    var sendSmsCode = function(){
    	showLoading(true, '');
    	var captchaCodeSecond = $('#txt_captcha_second').val();
    	
		// var params = ("mobile/sendSmsCode?" + 
		// 		"uid=" + uid + 
		// 		"&ctm=" + ctm + 
		// 		"&token=" + ictoken + 
		// 		"&userid=" + userid + 
		// 		"&mobilePhone=" + phoneNumber +
		// 		"&captchaCode=" + captchaCodeSecond);
		var url = Common.getMainUrl();
		var params = {
			app_key:getAppKey(),
			interface:"mobile/sendSmsCode",
			userid:userid,
			mobilePhone:phoneNumber
		}
		$.ajax({
			type:"post",
			url: url, 
			dataType:"json",
			data:JSON.stringify(params),
			cache:false,
			async: true,
			success:function(data){
				dealQueryResult(data);
	    		if(data.result == true){
		    		alert('短信已发送');
					cycleShowing('#btn_radom_sms_code');
	    		}else{
	    			$('#btn_radom_sms_code').attr('disabled', false);
	    		}
			},
			error:function(data){
				alert("对不起，获取登录短信密码失败！请稍后重试。");
				showLoading(false, '');
			}
		});
	}
    
    //7.验证短信，二次登录
    var validateSmsCode = function(){
    	//合法性验证
    	var mobile = $('#txt_mobile').val();
    	var captchaCodeSecond = $('#txt_captcha_second').val();
    	var randomCode = $('#txt_radom_sms_code').val();
    	
    	//下载账单
    	showLoading(true, '');
    	
		// var params = ("mobile/validateSmsCode?" + 
		// 		"uid=" + uid + 
		// 		"&ctm=" + ctm + 
		// 		"&token=" + ictoken + 
		// 		"&userid=" + userid + 
		// 		"&mobilePhone=" + phoneNumber +
		// 		"&randomCode=" + randomCode +
		// 		"&captchaCode=" + captchaCodeSecond);
		var url = Common.getMainUrl();
		var params = {
			app_key:Common.getAppKey(),
			interface:"mobile/validateSmsCode",
			userid:userid,
			mobilePhone:phoneNumber,
			captchaCode:captchaCodeSecond,
			randomCode:randomCode
		};

		$.ajax({
			type:"post",
			url: url, 
			cache:false,
			async: true,
			dataType:"json",
			data:JSON.stringify(params),
			success:function(data){
				dealQueryResult(data);
	    		if(data.result == true){
	    			$("#div_alert").hide();
	    			$("#form").hide();
	    			$("#div_step_2").hide();
	    			Common.saveRelationalParams(relationalParams,uid,ctm,ictoken,userid,"mobile");
	    			//跳转
	    			if(Common.isVarLegal(successDirectUrl)){
		    			setTimeout(function(){
		    				if(successDirectUrl.indexOf("?") == -1){
		    					successDirectUrl += "?userid=" + userid+"&mobilePhone=" + phoneNumber;
		    				}else{
		    					successDirectUrl += "&userid=" + userid+"&mobilePhone=" + phoneNumber;
		    				}
		    				if("100001" == uid){
		    					successDirectUrl = webDockURL+"mobileSuccess.html?uid="+uid+"&ctm="
		    					+ctm+"&token="+ictoken+"&userid="+userid+"&mobilePhone="+phoneNumber;
		    				}
		    				top.location.href = successDirectUrl;
		    			}, 1000); 
	    			}
	    		}
			},
			error:function(data){
				alert("对不起，登陆失败失败！请稍后重试。");
				showLoading(false, '');
			}
		});
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
    var dealQueryResult = function(data){
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
    	}else if($("#div_step_2").is(":visible")){
    		elementId = "#div_step_2";
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
    		$(elementId).html('获取验证码');
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
    	successDirectUrl = webDockURL + "success.html";
        errorDirectUrl = webDockURL + "error_.html";
        
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
    	var cardId = Common.getParameter("cardId");
    	if(cardId != null && cardId != ''){
    		$('#txt_cardId').val(cardId);
    		$("#txt_cardId").attr('readonly',true);
    	}
    	var custName = Common.getParameter("userName");
    	if(custName != null && custName != ''){
    		$('#txt_userName').val(custName);
    		$("#txt_userName").attr('readonly',true);
    	}
    	
    	var phoneNumber = Common.getParameter("mobile");
    	if(phoneNumber != null && phoneNumber != ''){
    		$("#txt_mobile").val(phoneNumber);
    		$("#txt_mobile").attr('readonly',true);
    	}
    	emergencyContact = Common.getParameter("emergencyContact");
    	getTokenProcessorURL();
    }
    
    //初始化事件
    var initEvent = function(){
    	$('#txt_mobile').bind('input propertychange', function() {
			var mobile = $('#txt_mobile').val();
			if(mobileReg.test(mobile)){ 
				checkCarrierOperator(mobile);
			}else{
				$("#div_password_website").hide();
				$("#div_password_service").hide();
				$("#div_login_sms_code").hide();
				$("#div_captcha").hide();
			}
		});
    	 
		$("#img_captcha").click(function(){
			loadCaptchaImg();
		});
		$("#img_captcha_second").click(function(){
			loadSmsCaptchaImg();
		});
		
		$('#btn_login').click(function(e){
			login();
		});

		$('#btn_forgetPW').click(function(e){
			$("#div_forgetPW").show();
		});
		
		$('#i_see_password_service').click(function(e){//#ccc
			if ($("#txt_password_service").attr("type") == "password") {
	            $("#txt_password_service").attr("type", "text");
	            //$("#i_see_password_service").css('color','#26a69a');
	            $("#i_see_password_service").addClass('tone');
	            
	        }else{
	            $("#txt_password_service").attr("type", "password");
	            //$("#i_see_password_service").css('color','#ccc');
	            $("#i_see_password_service").removeClass('tone');
	        }
		});
		
		$('#i_see_password_website').click(function(e){
			if ($("#txt_password_website").attr("type") == "password") {
	            $("#txt_password_website").attr("type", "text");
	            $("#i_see_password_website").addClass('tone');
	        }else{
	            $("#txt_password_website").attr("type", "password");
	            $("#i_see_password_website").removeClass('tone');
	        }
		});
		
		$('#btn_radom_sms_code').click(function(e){
			$("#btn_radom_sms_code").attr('disabled', true);
			sendSmsCode();
		});
		$('#btn_login_sms_code').click(function(e){
			$("#btn_login_sms_code").attr('disabled', true);
			sendLoginSmsCode();
		});
		$('#btn_validateSmsCode').click(function(e){
			validateSmsCode();
		});
		
		$('#btn_alert').click(function(e){
			$("#div_alert").hide();
		});
		
    }
    
    //初始化
    var init = function(){
    	//页面元素初始化
//		$("#btn_validateSmsCode").attr('disabled', true);
		
		//初始化事件
		initEvent();
		
		//初始化请求
    	initRequestParam();
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
			document.writeln("<script src=\'assets/module/js/dock/mobile-step1-" + inputstyle + ".js\' type=\'text/javascript\'></script>");
			document.writeln("<script src=\'assets/module/js/dock/mobile-step2-" + inputstyle + ".js\' type=\'text/javascript\'></script>");
		}
	}
}();
