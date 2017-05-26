var Countdown = function() {
	var init = function (ts){
		var note = $('#note');
		$('#countdown').html("");
		$('#countdown').countdown({
			timestamp	: ts,
			callback	: function(days, hours, minutes, seconds){
				
				var message = "";
				
				message += days + " day" + ( days==1 ? '':'s' ) + ", ";
				message += hours + " hour" + ( hours==1 ? '':'s' ) + ", ";
				message += minutes + " minute" + ( minutes==1 ? '':'s' ) + " and ";
				message += seconds + " second" + ( seconds==1 ? '':'s' ) + " <br />";
				
				note.html(message);
			}
		});
	}
	return {
		init: function() {
			init(ts);
		}
	}
}();