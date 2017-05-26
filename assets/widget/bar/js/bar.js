var Bar = function() {

	//加载 
	var loadData = function(obj, option){
		var myChart = obj.myChart;
		myChart.setOption(option);
	}
	
	return {
		init: function(showDivID, option) {
			var dom = document.getElementById(showDivID);
			var myChart = echarts.init(dom);
			myChart.setOption(option);
			
			var obj = new Object();
			obj.myChart = myChart;
			return obj;
		},
		load: function(myChart, option) {
			loadData(myChart, option);
		}
	}
}();