var Timeline = function() {
	var option;
	
	//初始化option
	var initOption = function(playInterval, data){
		option = {
            timeline: {
                axisType: 'category',
                // realtime: false,
                // loop: false,
                autoPlay: true,
                // currentIndex: 2,
                playInterval: playInterval,
                // controlStyle: {
                //     position: 'left'
                // },
                grid: {
                    top: 80,
                    bottom: 100
                },
                data: data,
            }
        };
	}
	
	//加载 
	var loadData = function(obj, option){
		var myChart = obj.myChart;
		myChart.setOption(option);
	}

	return {
		init: function(showDivID, playInterval, data) {
			var myChart = echarts.init(document.getElementById(showDivID));
			initOption(playInterval, data);
			myChart.setOption(option);
			
			var obj = new Object();
			obj.myChart = myChart;
			obj.option = option;
			return obj;
		},
		load: function(myChart, option) {
			loadData(myChart, option);
		}
	}
}();