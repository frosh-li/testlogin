var modeVal = "";
var bankname = "";
//开始执行查询工作
var currentQueryMaxTimes = 0;
var resultQueryTimesMax = 100;
var intervalMS = 1000;
var apiUrl = "http://localhost:8080";
apiUrl = "http://10.10.217.68";
//apiUrl = "http://10.10.217.68/proxy";

var startResultQuery = function(applyNo, token) {
	currentQueryMaxTimes = 0;
	setTimeout(function() {
		queryResult(applyNo, token);
	}, intervalMS); //延时intervalMS
}

/**
 * 获取Token
 */
function getToken(productType) {
	//验证
	console.info("获取Token,传入productType:" + productType);
	var tokenVal = "";
	$.ajax({
		type: "get",
		url: "http://10.10.217.68/openapi/tokenProcessor/getToken?durex=true&productType=" + productType,
		//url: apiUrl + "/openapi/tokenProcessor/getToken?durex=true&productType=" + productType,
		cache: false,
		async: false,
		success: function(token) {
			console.info("获得token:" + token);
			tokenVal = token;
		},
		error: function(data) {
			showErrorMsg("无法获取token信息");
		}
	});

	return tokenVal;
}

/**
 * 普通登录
 */
function loginByUser() {

	//清除错误提示
	clearErrorMsg();
	//验证
	var userName = $('#username').val();
	if(modeVal == '03' && !validateIdCard(userName)) {
		//请输入正确的卡号
		showErrorMsg("请输入正确的身份证")
		return;
	} else if(modeVal == '01' && !userName.match("^[0-9]{16,20}$")) {
		//请输入正确的卡号
		showErrorMsg("请输入正确的卡号");
		return;
	} else if(modeVal == '02' && !userName.match("^.{6,25}$")) {
		//请输入正确的用户名
		showErrorMsg("请输入正确的用户名");
		return;
	}

	var passWord = $('#password').val();
	if(!passWord.match("^.{6,30}$")) {
		showErrorMsg("请输入正确的密码");
		return;
	}
	$("#div_loading").show();
	var applyNo = GetQueryString("applyNo");
	var accountNo = GetQueryString("accountNo");
	var idCardNo = GetQueryString("idCardNo");
	bankname = GetQueryString("bankname");
	var productType = GetQueryString("productType");

	var batchNo = 1;
	var dataVal = {
		applyNo: applyNo,
		accountNo: accountNo,
		idCardNo: idCardNo,
		productType: productType,
		userName: userName,
		passWord: passWord,
		bankType: 1,
		loginType: modeVal,
		bankName: bankname,
		batchNo: 1
	};
	dataVal.token = getToken(productType);
	console.info("dataVal:" + dataVal.token);
	$.ajax({
		type: "POST",
		url: apiUrl + "/openapi/bank/loginByUser",
		async: false,
		cache: false,
		data: dataVal,
		dataType: "json",
		success: function(data) {
			$("#div_loading").hide();
			console.log("登录请求成功：" + data);
			//显示进度条
			startResultQuery(applyNo, dataVal.token);
		},
		error: function(data) {
			$("#div_loading").hide();
			console.log("登录失败")
		}
	});
}

/**
 * 短信登录
 */
function loginByMessage() {
	$("#div_loading").show();
	//清除错误提示
	clearErrorMsg();
	//验证
	var msg_info = $('#txt_message').val();
	var msg_cat = $('#txt_captcha').val();
	bankname = GetQueryString("bankname");
	var productType = GetQueryString("productType");
	var applyNo = GetQueryString("applyNo");

	var dataVal = {
		applyNo: applyNo,
		bankType: 1,
		bankName: bankname,
		messageCode: msg_info,
		captchaCode: msg_cat
	};
	dataVal.token = getToken(productType);
	$('#message').hide();
	console.info("dataVal:" + dataVal);

	$.ajax({
		type: "POST",
		url: apiUrl + "/openapi/bank/loginByMessage",
		async: false,
		cache: false,
		data: dataVal,
		dataType: "json",
		success: function(data) {
			console.log("登录请求成功");
			//显示进度条
			$("#div_loading").hide();
			startResultQuery(applyNo, dataVal.token);
		},
		error: function(data) {
			$("#div_loading").hide();
			console.log("短信登录失败")
		}
	});
}

/**
 * 图片验证码登录
 */
function loginByCaptchaCode() {
	//清除错误提示
	clearErrorMsg();
	$("#div_loading").show();
	//验证
	var applyNo = GetQueryString("applyNo");
	bankname = GetQueryString("bankname");
	var captchaCode = $("#txt_captcha").val();
	var productType = GetQueryString("productType");
	var dataVal = {
		applyNo: applyNo,
		productType: productType,
		bankType: 1,
		bankName: bankname,
		captchaCode: captchaCode,
		batchNo: 1
	};

	dataVal.token = getToken(productType);
	console.info("dataVal:" + dataVal.token);
	$.ajax({
		type: "POST",
		url: apiUrl + "/openapi/bank/loginByCaptchaCode",
		async: false,
		cache: false,
		data: dataVal,
		dataType: "json",
		success: function(data) {
			console.log("登录请求成功");
			//显示进度条
			$("#div_loading").hide();
			startResultQuery(applyNo, dataVal.token);
		},
		error: function(data) {
			$("#div_loading").hide();
			console.log("登录失败")
		}
	});
}

/**
 * 轮询查询结果
 */
var queryResult = function(applyNo, token) {
	currentQueryMaxTimes += 1;
	console.log("当前查询次数：" + currentQueryMaxTimes + ",最大查询次数" + resultQueryTimesMax);
	if(currentQueryMaxTimes > resultQueryTimesMax) {
		console.log("超过最大查询次数：" + resultQueryTimesMax);
		showLoading(false, '');
		showAlert(true, "超时,最大间隔(s)" + (resultQueryTimesMax * intervalMS) / 1000);
		return;
	}
	console.log("query time: " + new Date() + ", token: " + token);
	$.ajax({
		type: "get",
		url: apiUrl + "/openapi/bank/queryResult?durex=true&immediately=true&applyNo=" + applyNo + "&token=" + token,
		cache: false,
		async: true,
		success: function(data) {
			if(data == '') {
				console.log("queryResult data is empty");
				setTimeout(function() {
					queryResult(applyNo, token);
				}, intervalMS); //延时intervalMS
			} else {
				console.log("queryResult data:  " + data);
				//查询结果处理
				if(data.errorCode == '10040') {
					console.log("需要自己输入验证码登录");
					$('#progress').hide();
					$('#message').hide();
					info_message
					// 显示验证码登录按钮
					$('#div_captcha').show();
					$('#img_captcha').attr('src', data.result);
					showButton("captcha_login");
				} else if(data.errorCode == '40007') {
					console.log("短信登录");
					//显示短信输入框
					$('#div_message').show();
					var reservedMsg = data.result.reservedMsg;
					console.log("发送手机:" + reservedMsg);
					$('#info_message').html("已发送手机:" + reservedMsg);
					$('#div_captcha').hide();
					if(bankname == 'gsyh') {
						$('#div_captcha').show();
					}
					showButton("message_login");
				} else if(data.errorCode == 'L0001') {
					console.log("登录成功正在抓取");
					$('#loginDiv').hide();
					$('#div_success').show();
					$('#label_applyNo').html(applyNo)

					//	setTimeout(function() {
					//		queryResult(applyNo, token);
					//	}, intervalMS); //延时intervalMS
				} else {
					console.log(data.errorCode);
					var errMsg = error_map[data.errorCode];
					//正常的时候
					if(data.errorCode == "00000") {
						console.log("没有标记的异常:" + data.errorCode);
					} else if(errMsg == null || errMsg.length == 0) {
						console.log("没有标记的异常:" + data.errorCode);
						$('#div_alert').html("未知的异常")
					} else {
						console.log("异常:" + errMsg);
						console.log("异常码:" + data.errorCode);
						showErrorMsg(errMsg)
					}
				}
			}
		},
		error: function(data) {
			showErrorMsg("查询结果出错");
		}
	});
};

/**
 * 错误提示
 * @param {Object} msg
 */
function showErrorMsg(msg) {
	// 显示指定登录按钮
	$('#div_alert').show();
	$('#content_alert').html(msg)
}

/**
 * 错误提示删除
 */
function clearErrorMsg() {
	// 显示指定登录按钮
	$('#div_alert').hide();
	$('#content_alert').html("")
}

/**
 * 三种登录模式显示
 * @param {Object} name
 */
function showButton(name) {
	// 显示指定登录按钮
	$('#login').hide();
	$('#captcha_login').hide();
	$('#message_login').hide();
	$('#' + name).show();
}

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

var mode = GetQueryString("mode")
if(mode == null || mode.length == 0) {
	mode = "01,02";
}

$("#mode01").click(function() {
	$('#username_title').html('银行卡号');
	$('#username').attr('placeholder', '请输入银行卡号登录');
	$("#mode01").css("background-color", $("#login").css("background-color"));
	$("#mode02").css("background-color", "#fff");
	$("#mode03").css("background-color", "#fff");
	modeVal = "01";
});

$("#mode02").click(function() {
	$('#username_title').html('用户名');
	$('#username').attr('placeholder', '请输入用户名登录');
	$("#mode01").css("background-color", "#fff");
	$("#mode02").css("background-color", $("#login").css("background-color"));
	$("#mode03").css("background-color", "#fff");
	modeVal = "02";
});
$("#mode03").click(function() {
	$('#username_title').html('身份证');
	$('#username').attr('placeholder', '请输入身份证登录');
	$("#mode01").css("background-color", "#fff");
	$("#mode02").css("background-color", "#fff");
	$("#mode03").css("background-color", $("#login").css("background-color"));
	modeVal = "03";
});

jQuery(document).ready(function() {
	var modeArg = mode.split(",")
	if(modeArg.length > 1) {
		for(var i = 0; i < modeArg.length; i++) {
			//style="display: none;"
			$("#mode" + modeArg[i] + "-div").css("display", "");
		}
		//默认第一个登录
		$("#mode" + modeArg[0]).click();
	} else {
		$("#mode" + modeArg[0]).click();
	}
	var bankname = GetQueryString("bankname");
	$("#title").html(bank_name[bankname])
});

/*
 * 身份证验证
 */
function validateIdCard(idCard) {
	//15位和18位身份证号码的正则表达式
	var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
	//如果通过该验证，说明身份证格式正确，但准确性还需计算
	if(regIdCard.test(idCard)) {
		if(idCard.length == 18) {
			var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
			var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
			var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
			for(var i = 0; i < 17; i++) {
				idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
			}
			var idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
			var idCardLast = idCard.substring(17); //得到最后一位身份证号码
			//如果等于2，则说明校验码是10，身份证号码最后一位应该是X
			if(idCardMod == 2) {
				if(idCardLast == "X" || idCardLast == "x") {
					return true;
				} else {
					return false;
				}
			} else {
				//用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
				if(idCardLast == idCardY[idCardMod]) {
					return true;
				} else {
					return false;
				}
			}
		}
	} else {
		return false;
	}
}