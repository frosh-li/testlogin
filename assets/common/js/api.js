var Api = function() {
	return {
		getErrorInfoByCode : function(url, isAsync){
			var result = null;
	    	$.ajax({
				type:"get",
				url: url,
				cache: true,
				async: isAsync,
				success:function(data){
					result = data;
					return result;
				},
				error:function(data){
				},
				complete: function(msg) {
				}
			});
			return result;
		}
		
	}
}();