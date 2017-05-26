var Common = function() {
	var initTime;
	var pageRefreshInteral = 2*3600*1000; //2小时
	var app_key = "47acc60ea99b11e6927000163e03a4cf";
	var switchDivNum = 0;//切换的div层个数
	var main_url="https://api.creditsaas.com/ext/v1.0/hx_data_api";

	var formatTime = function(d){
		var vYear = d.getFullYear();
		var vMon = d.getMonth() + 1;
		var vDay = d.getDate();
		var h = d.getHours(); 
		var m = d.getMinutes(); 
		var se = d.getSeconds(); 
		var s = vYear+"-"+(vMon<10 ? "0" + vMon : vMon)+"-"+(vDay<10 ? "0"+ vDay : vDay)+" "+(h<10 ? "0"+ h : h)+":"+(m<10 ? "0" + m : m)+":"+(se<10 ? "0" +se : se);
		return s;
	};
	
	var formatDay = function(d){
		var vYear = d.getFullYear();
		var vMon = d.getMonth() + 1;
		var vDay = d.getDate();
		var h = d.getHours(); 
		var m = d.getMinutes(); 
		var se = d.getSeconds(); 
		var s = vYear+"-"+(vMon<10 ? "0" + vMon : vMon)+"-"+(vDay<10 ? "0"+ vDay : vDay);
		return s;
	};
	
	var formatMinute = function(d){
		var vYear = d.getFullYear();
		var vMon = d.getMonth() + 1;
		var vDay = d.getDate();
		var h = d.getHours(); 
		var m = d.getMinutes(); 
		var se = d.getSeconds(); 
		var s = vYear+"-"+(vMon<10 ? "0" + vMon : vMon)+"-"+(vDay<10 ? "0"+ vDay : vDay)+" "+(h<10 ? "0"+ h : h)+":"+(m<10 ? "0" + m : m)+":00";
		return s;
	};

	//大屏播放切换
	var play = 1; //0.地图显示， 1:每小时统计显示
	var areaPlay = function(){
		for(var i = 0; i < switchDivNum; i++){
			if(i != play) $('.switchDiv' + i).hide(1000);
		}
		$('.switchDiv' + play).show(500);
		
		if(play == 0 && (new Date().getTime() - initTime) > pageRefreshInteral){
			console.log('window reload...');
			window.location.reload();
		}else{
			//设置下次显示的div序号
			play += 1;
			if(play >= switchDivNum) play = 0;
		}
	}
	
	var getParameter = function(item) {
		var svalue = location.search.match(new RegExp("[\?\&]" + item
						+ "=([^\&]*)(\&?)", "i"));
		value = svalue ? svalue[1] : svalue;
		if(value == null){
			return "";
		}
		return decodeURIComponent(value);
	}
	
	var checkVarLegal = function(param){
		if(typeof(param) == 'undefined' || null == param || '' == param){
			return false;
		}else{
			return true;
		}
	}
	
	var generateTokenURL = function(url, params){
		//渠道以及参数
		var src = getParameter("uid");
		var token = getParameter("token");
		if(url.indexOf("?") == -1){
			url += "?token=" + token;
		}else{
			url += "&token=" + token;
		}
		if(checkVarLegal(src)){
			url += "&src=" + src;
		}
		//参数
		if(checkVarLegal(params)){
			url += "&params=" + encodeURIComponent(params);
		}
		return url;
	}
	
	return {
		getMainUrl:function(){
			return main_url;
		},
		getAppKey:function(){
			return app_key;
		},
		init: function(){
		   Metronic.init(); // init metronic core componets
		   Layout.init(); // init layout
		},
		getCurrentTime: function(){
			var d = new Date();
			return formatTime(d);
		},
		getCurrentMinute: function(){
			var d = new Date();
			return formatMinute(d);
		},
		getTodayDay: function(){
			var d = new Date();
			return formatDay(d);
		},
		getTimePlus: function(msCount){
			var d = new Date();
			d.setTime(d.getTime() + msCount);
			return formatTime(d);
		},
		getDayPlus: function(msCount){
			var d = new Date();
			d.setTime(d.getTime() + msCount);
			return formatDay(d);
		},
		getDayPlusOnDay: function(d, msCount){
			d.setTime(d.getTime() + msCount);
			return formatDay(d);
		},
		getCurrentHour: function(){
			var d = new Date();
			var h = d.getHours(); 
			return (h<10 ? "0"+ h : h);
		},
		createUUID : function() {
			var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			var chars = CHARS, uuid = new Array(36), rnd = 0, r;
			for (var i = 0; i < 36; i++) {
				if (i == 8 || i == 13 || i == 18 || i == 23) {
					uuid[i] = '-';
				} else if (i == 14) {
					uuid[i] = '4';
				} else {
					if (rnd <= 0x02)
						rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
					r = rnd & 0xf;
					rnd = rnd >> 4;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
			return uuid.join('');
		},
		areaSwitch: function(num, switchInterval) {
			initTime = new Date().getTime();
			
			switchDivNum = num;
			setInterval(areaPlay , switchInterval);
		},
		getParameter: function(item) {
			return getParameter(item)
		},
		requestVerify: function(){ //请求验证
			return checkToken();
		},
		isVarLegal: function(param){
			return checkVarLegal(param);
		},
		checkToken: function(){
			var isLegal = true;
			var token = getParameter("token");
			if(checkVarLegal(token)){
		    	var url = "/api/token/parse/" + token + ".x?r="+ new Date().valueOf();
		    	$.ajax({
					type:"get",
					url: url,
					cache: false,
					async: true,
					success:function(data){
						if(data.success == false){
							isLegal = false;
						}
					},
					error:function(data){
						isLegal = false;
					},
					complete: function(msg) {
						//异常跳转
						if(isLegal == false){
							//TODO 跳转
						}
					}
				});
			}else{
				//TODO 跳转
			}
		},
		getTokenParseInfo: function(){
	    	var result = null;
	    	$.ajax({
				type:"post",
				url: main_url,
				data:{
					"app_key":app_key,
					"interface":"donless/generateUserId"
				},
				cache: false,
				async: false,
				success:function(data){
					result = data;
				}
			});
			return result;
		},
		loadCSS : function(pathPrefix){
			var color = getParameter("color");
			if(color == null || color == ''){
				document.writeln('<link href="' + pathPrefix + 'assets/page/css/dock/themes/blue.css"	rel="stylesheet" type="text/css" id="style_color"/>'); //默认蓝色
			}else{
				document.writeln('<link href="' + pathPrefix + 'assets/page/css/dock/themes/' + color + '.css"	rel="stylesheet" type="text/css" id="style_color"/>');
			}
		},
		isCardIdLegal: function(cardId){
			if(checkVarLegal(cardId)){
				// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
			   	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
			   	return reg.test(cardId);
		    }else{
		  		return false;
		    }
		},
		getDataTypeHint : function(dataType){
			var dateType = new Object();
			dateType.mobile = '运营商';
			dateType.bank_card = '网银';
			dateType.taobao = '淘宝';
			dateType.credit_report = '征信报告';
			dateType.credit_card = '信用卡邮箱';
			dateType.fund = '社保';
			dateType.insurance = '公积金';
			dateType.jingdong = '京东';
			
			var _return = dateType[dataType];
			if(checkVarLegal(_return) == false){
				_return = dataType;
			}
			return _return;
		},
		getTokenURL : function(url, params){
			return generateTokenURL(url, params);
		},
		getTokenProcessorURL: function(productType){
	    	var url = generateTokenURL(openapiURL, ("tokenProcessor/getToken?durex=true&productType=" + productType));
	    	return url;
	    },
		getImageProxyURL:function(url){
			var captchaProxyURL = url;
			var endIndex = captchaProxyURL.lastIndexOf("/");
			captchaProxyURL = captchaProxyURL.substring(endIndex + 1);
			return generateTokenURL(captchaURL, captchaProxyURL);
		},
		illegalRequestAction: function(res){
			if('illegal-request' != res){
				window.location.href = webDockURL+"illegal.html";
			}
		},
		showLoading: function(elementId){
			$(elementId).waitMe({
    			effect: 'win8',//none、bounce、rotateplane、stretch、orbit、roundBounce、win8、win8_linear、ios、facebook、rotation、timer、pulse、progressBar、bouncePulse、img
    			text: '处理中，请稍候...',
    			bg: 'rgba(255,255,255,0.8)',
    			color: '#99a5c2', //'#26a69a',
    			sizeW:'',
    			sizeH:'',
    			source: ''
    		});
		},
		hideLoading: function(elementId){
			$(elementId).waitMe('hide');
		},
		saveRelationalParams:function(relationalParams,uid,ctm,ictoken,userid,dataType){
	    	if(relationalParams != null && relationalParams != ''){
	    		console.log("saveRelationalParams " + relationalParams);
	    		var params = ("donless/relationalParams/save?" + 
	    				"uid=" + uid + 
	    				"&ctm=" + ctm + 
	    				"&token=" + ictoken + 
	    				"&userid=" + userid + 
	    				"&dataType=" + dataType +
	    				"&relationalParams=" + encodeURIComponent(relationalParams));
	    		var url = generateTokenURL(openapiURL, params);
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
	    	}else{
	    		console.log("relationalParams is null, skip ...");
	    	}
		}
	}
}();