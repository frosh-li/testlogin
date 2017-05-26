var MeterSingle = function() {
	
	//初始化option
	var initOption = function(){
		option = {
			    tooltip : {
			        formatter: "{a} <br/>{b} : {c}%"
			    },
//			    toolbox: {
//			        feature: {
//			            restore: {},
//			            saveAsImage: {}
//			        }
//			    },
			    series: [
			        {
			            name: '业务指标',
			            type: 'gauge',
			            detail: {formatter:'{value}%'},
			            data: [{value: 50, name: '完成率'}]
			        }
			    ]
			};
		return option;
	}
	
	//加载 
	var loadData = function(obj, option){
		var myChart = obj.myChart;
		myChart.setOption(option);
	}
	
	return {
		init: function(showDivID, option) {
			var myChart = echarts.init(document.getElementById(showDivID));
			//option = initOption();
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