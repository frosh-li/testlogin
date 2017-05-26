var Message = function() {
	var init = function(){
		var  num = 0;
		setInterval(function(){
			$('#audioError')[0].play();
			
			if(num%2 ==0 ){
				$().toastmessage('showToast', {
		            text     : '手机运营商通话记录为空检查结果：在 2016-07-21 09:55:05~2016-07-21 11:55:00  时间段内共76条，其中下载失败的有：18条。sent@' + Common.getCurrentTime(),
		            sticky   : false,
		            inEffectDuration:  600,   // in effect duration in miliseconds
		            stayTime:         6000,   // time in miliseconds before the item has to disappear
		            position : 'top-right',
		            type     : 'warning',
		            closeText: '',
		            close    : function () {
		                console.log("toast is closed ...");
		            }
		        });
			}else{
				$().toastmessage('showToast', {
		            text     : '手机运营商通话记录为空检查结果：在 2016-07-21 09:55:05~2016-07-21 11:55:00  时间段内共76条，其中下载失败的有：18条。sent@' + Common.getCurrentTime(),
		            sticky   : false,
		            inEffectDuration:  600,   // in effect duration in miliseconds
		            stayTime:         6000,   // time in miliseconds before the item has to disappear
		            position : 'top-right',
		            type     : 'error',
		            closeText: '',
		            close    : function () {
		                console.log("toast is closed ...");
		            }
		        });
			}
			num = num + 1;
		}, 300000);
	}
	return {
		init: function() {
			init();
		}
	}
}();