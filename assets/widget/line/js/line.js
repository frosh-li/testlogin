var Line = function() {
	//标题
	var title;
	var subTitle;
	var option;
	
	//初始化option
	var initOption = function(title, subTitle, legendData){
		this.title = title;
		this.subTitle = subTitle;
		
		option = {
				title : {
			        text: title,
			        subtext: subTitle,
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    legend: {
			        data:legendData,
			        x: 'left',
			        left: 20
			    },
//			    toolbox: {
//			        feature: {
//			            saveAsImage: {}
//			        }
//			    },
			    grid: [{
			        left: '3%',
			        right: '3%',
			        bottom: '3%',
			        containLabel: true
			    }, {
			        left: 50,
			        right: 50,
			        top: '55%',
			        height: '35%'
			    }],
			    xAxis : [
			        {
			            type : 'category',
			            boundaryGap : false,
			            
			            /*倾斜*/
//			            axisLabel: {
//			                rotate: 60,
//			            },
			              
			            data : [],
			            splitLine: {
			                show: false
			            }
			        }
			    ],
			    yAxis : [
					{
						name : legendData[0],
					    type : 'value'
					},
			        {
						name : legendData[1],
			            type : 'value'
//			            ,
//			            inverse: true
			        }
			    ]

			};
	}
	
	//加载 
	var loadData = function(obj, option){
		var myChart = obj.myChart;
		myChart.setOption(option);
	}

	return {
		init: function(showDivID, title, subTitle, legendData) {
			var myChart = echarts.init(document.getElementById(showDivID));
			initOption(title, subTitle, legendData);
			myChart.setOption(option);
			
			var obj = new Object();
			obj.myChart = myChart;
			obj.option = option;
			return obj;
		},
		initOption: function(showDivID, option){
			var myChart = echarts.init(document.getElementById(showDivID));
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