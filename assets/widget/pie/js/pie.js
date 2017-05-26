var Pie = function() {
	//标题
	var title;
	var subTitle;
	var option;
	//展示数据
	var data = [];
	//显示模式，环或者圆
	var displayModel = "circular"; //ring\circular\rose\angle
	var showLabel = true;
	
	
	//初始化option
	var initOption = function(title, subTitle, displayModel){
		this.title = title;
		this.subTitle = subTitle;
		if(typeof(displayModel) != "undefined") this.displayModel = displayModel;
		
		option = {
			    title : {
			        text: title,
			        subtext: subTitle,
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient: 'vertical',
			        x: 'left',
			        left: 10,
			        top: 20,
			        data: ['中国电信','中国移动','中国联通']
			    },
			    series : [
			        {
			        	name: "占比",
			        	selectedMode: 'single',
			            type: 'pie',
			            radius : '55%',
			            center: ['50%', '60%'],
			            data: data,
			            itemStyle: {
			            	normal:{ 
                                label:{ 
                                   show: true, 
                                   formatter: '{b}:{d}%' 
                                }, 
                                labelLine :{show:true}
                            },
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			    ]
		};
	}
	
	//加载 
	var loadData = function(obj, data){
		var myChart = obj.myChart;
		if(typeof(obj.displayModel) != "undefined") this.displayModel = obj.displayModel;
		
		if(this.displayModel == 'ring'){
			myChart.setOption({
		        series: [
		        {
		        	radius: ['30%', '70%'],
		            data: data
		        }
		        ]
		    });
		}else if(this.displayModel == 'rose'){
            myChart.setOption({
		        series: [
		        {
		        	radius : [20, '70%'],
		            center : ['50%', '60%'],
		            roseType : 'radius',
		            data: data
		        }
		        ]
		    });
		}else if(this.displayModel == 'angle'){
            myChart.setOption({
		        series: [
		        {
		        	radius : '50%',
		            center: ['50%', '50%'],
		            roseType : 'angle',
		            data: data
		        }
		        ]
		    });
		}else{
			myChart.setOption({
		        series: [
		        {
		            data: data
		        }
		        ]
		    });
		}
	}

	return {
		init: function(showDivID, title, subTitle, displayModel) {
			var myChart = echarts.init(document.getElementById(showDivID));
			initOption(title, subTitle, displayModel);
			myChart.setOption(option);
			
			var obj = new Object();
			obj.myChart = myChart;
			obj.displayModel = displayModel;
			return obj;
		},
		load: function(myChart, data) {
			loadData(myChart, data);
		},
		labelInner: function(obj) {
			obj.myChart.setOption({
		        series: [
		        {
		            label: {
		                normal: {
		                    position: 'inner'
		                }
		            }
		        }
		        ]
		    });
		},
		hideLabel: function(obj) {
			obj.myChart.setOption({
		        series: [
		        {
		        	itemStyle: {
		            	normal:{ 
                            label:{
                               show: false, 
                               formatter: '{b}:{d}%' 
                            }, 
                            labelLine :{show:false}
                        }
		            }
		        }
		        ]
		    });
		},
		setColors: function(obj, colors){
			obj.myChart.setOption({
				color: colors
		    });
			
		}
	}
}();