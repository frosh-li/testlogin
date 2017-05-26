var BarPie = function() {
	var option;
	//展示数据
	var data = [];
	
	
	//初始化option
	var initOption = function(title, subTitle, barName, pieName){
		option = {
				title : {
			        text: title,
			        subtext: subTitle,
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    toolbox: {
			        show : false,
			        y: 'bottom',
			        feature : {
			            mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
			            restore : {show: true},
			            saveAsImage : {show: true}
			        }
			    },
			    calculable : true,
//			    legend: {
//			        data:['百度','谷歌','必应','其他']
//			    },
			    xAxis : [
			        {
			            type : 'category',
			            splitLine : {show : false},
			            data : []
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value',
			            position: 'right'
			        }
			    ],
			    series : [
			        {
			            name:barName,
			            type:'bar',
			            tooltip : {trigger: 'item'},
			            data:[],
			            barWidth:80,
			            label: {
			                normal: {
			                    show: true,
			                    position: 'inside'
			                }
			            },
    		            markPoint : {
			                data : [
			                    {type : 'max', name: '最大值'},
			                    {type : 'min', name: '最小值'}
			                ]
			            },
//			            markLine : {
//			                data : [
//			                    {type : 'average', name: '平均值'}
//			                ]
//			            },
				        itemStyle: {
				            normal: {
//				                areaColor: '#323c48',
//				                borderColor: '#111',
//				                color: "#61a0a8"
				            }
				        }
			        },
			        {
			            name:pieName,
			            type:'pie',
			            selectedMode: 'single',
			            tooltip : {
			                trigger: 'item',
			                formatter: '{a} <br/>{b} : {c} ({d}%)'
			            },
			            center: [130,100],
			            radius : [25, 60],
			            itemStyle : {
			                normal : {
			                	label:{ 
	                                   show: true, 
	                                   formatter: '{b}:{d}%' 
	                            },
			                    labelLine : {
			                        length : 20
			                    }
			                }
			            },
			            data:[]
			        }
			    ]
			};
			                    
	}
	
	//加载 Pie
	var loadPieData = function(obj, data){
		var myChart = obj.myChart;
		
//		myChart.setOption({
//		    xAxis : [
//		        {
//		            type : 'category',
//		            splitLine : {show : false},
//		            data : barXData
//		        }
//		    ],
//		    series : [
//		        {
//		            type: 'bar',
//		            data: barData
//		        },
//		        {
//		            type:'pie',
//		            data: pieData
//		        }
//		    ]
//	    });
		
		myChart.setOption({
		    series : [
		        {
		            type:'bar', 
		        },
		        {
		            type:'pie',
		            data: data
		        }
		    ]
	    });
	}
	
	//加载 bar
	var loadBarData = function(obj, data){
		var myChart = obj.myChart;
		var barXData = []; //['周一','周二','周三888','周四','周五','周六','周日'];
		var barData = []; //[150, 232, 201, 154, 190, 330, 410];
		
		for(var i = 0; i < data.length; i++){
			barXData.push(data[i].name);
			barData.push(data[i].value);
		}
		
		myChart.setOption({
		    xAxis : [
		        {
		            type : 'category',
		            splitLine : {show : false},
		            data : barXData
		        }
		    ],
		    series : [
		        {
		            type: 'bar',
		            data: barData
		        },
		        {
		            type:'pie',
		        }
		    ]
	    });
	}

	return {
		init: function(showDivID, title, subTitle, barName, pieName) {
			var myChart = echarts.init(document.getElementById(showDivID));
			initOption(title, subTitle, barName, pieName);
			myChart.setOption(option);
			
			var obj = new Object();
			obj.myChart = myChart;
			
			return obj;
		},
		loadPie: function(myChart, data) {
			loadPieData(myChart, data);
		},
		loadBar: function(myChart, data) {
			loadBarData(myChart, data);
		}
	}
}();