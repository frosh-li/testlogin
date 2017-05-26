var Realtime = function() {
	//标题
	var title;
	var subTitle;
	var option;
	//展示数据
	var data = [];
	var barTitle = [];
	var barData = [];
	//是否柱状图显示topn
	var displayTopBar = true;
	
	var geoCoordMap = {
			'吉林':[125.35,43.88],
			'辽宁':[123.38,41.8],
			'北京':[116.46,39.92],
			'天津':[117.2,39.13],
			'河北':[114.48,38.03],
			'上海':[121.48,31.22],
			'重庆':[106.54,29.59],
			'新疆':[87.68,43.77],
			'河南':[113.65,34.76],
			'西藏':[91.11,29.97],
			'湖北':[114.31,30.52],
			'湖南':[113,28.21],
			'江苏':[118.78,32.04],
			'江西':[115.89,28.68],
			'陕西':[108.95,34.27],
			'山西':[112.53,37.87],
			'山东':[117,36.65],
			'四川':[104.06,30.67],
			'青海':[101.74,36.56],
			'安徽':[117.27,31.86],
			'海南':[110.35,20.02],
			'广东':[113.23,23.16],
			'贵州':[106.71,26.57],
			'浙江':[120.19,30.26],
			'福建':[119.3,26.08],
			'甘肃':[103.73,36.03],
			'云南':[102.73,25.04],
			'宁夏':[106.27,38.47],
			'广西':[108.33,22.84],
			'黑龙江':[126.63,45.75],
			'内蒙古':[111.65,40.82]
	};

	var convertData = function (data) {
	    var res = [];
	    for (var i = 0; i < data.length; i++) {
	        var geoCoord = geoCoordMap[data[i].name];
	        if (geoCoord) {
	        	if(typeof(data[i].type) == "undefined" || data[i].type == 'today'){
	        		res.push({
		                name: data[i].name,
//		                value: geoCoord.concat(data[i].value)
		                value: geoCoord.concat(20),
		                realValue: data[i].value
		            });
	        	}else{
		            res.push({
		                name: data[i].name,
	//	                value: geoCoord.concat(data[i].value)
		                value: geoCoord.concat(230),
		                realValue: data[i].value
		            });
	        	}
	        }
	    }
	    return res;
	};
	
	//初始化option
	var initOption = function(title, subTitle, displayTopBar){
		this.title = title;
		this.subTitle = subTitle;
		if(typeof(displayTopBar) != "undefined") this.displayTopBar = displayTopBar;
		
		if(displayTopBar){
			option = {
				    backgroundColor: '#404a59',
				    animation: true,
				    animationDuration: 1000,
				    animationEasing: 'cubicInOut',
				    animationDurationUpdate: 1000,
				    animationEasingUpdate: 'cubicInOut',
				    title: [{
				        text: title,
				        subtext: subTitle,
				        //sublink: 'http://www.pm25.in',
				        left: 'center',
				        textStyle: {
				            color: '#fff'
				        }
				    },
			        {
			            id: 'statistic',
			            right: 120,
			            top: 40,
			            width: 100,
			            textStyle: {
			                color: '#fff',
			                fontSize: 12
			            }
			        }],
				    tooltip : {
				        trigger: 'item',
//				        formatter: '{b}{a}: {c}'
				        formatter: function (params, ticket, callback){
				        	if(params.componentSubType == 'bar'){
				        		return params.name + ": " + params.value;
				        	}else{
				        		return params.name + params.seriesName + ": " + params.data.realValue;
				        	}
				        }
				    },
				    brush: {
				        outOfBrush: {
				            color: '#abc'
				        },
				        brushStyle: {
				            borderWidth: 2,
				            color: 'rgba(0,0,0,0.2)',
				            borderColor: 'rgba(0,0,0,0.5)',
				        },
				        seriesIndex: [0, 1],
				        throttleType: 'debounce',
				        throttleDelay: 300,
				        geoIndex: 0
				    },
				    geo: {
				        map: 'china',
				        left: '10',
				        right: '30%',
				        zoom: 0.8,
				        label: {
				            emphasis: {
				                show: false
				            }
				        },
				        roam: false,
				        itemStyle: {
				            normal: {
				                areaColor: '#323c48',
				                borderColor: '#111'
				            },
				            emphasis: {
				                areaColor: '#2a333d'
				            }
				        }
				    },
				    grid: {
				        right: 100,
				        top: 200,
				        bottom: 300,
				        width: '25%'
				    },
				    xAxis: {
				        type: 'value',
				        scale: true,
				        position: 'top',
				        boundaryGap: false,
				        splitLine: {show: false},
				        axisLine: {show: false},
				        axisTick: {show: false},
				        axisLabel: {margin: 2, textStyle: {color: '#aaa'}},
				    },
				    yAxis: {
				        type: 'category',
				        name: '排行',
				        nameTextStyle: {
				        	fontSize: 14
				        },
				        splitLine: 'interval',
				        nameGap: 16,
				        axisLine: {show: false, lineStyle: {color: '#ddd'}},
				        axisTick: {show: false, lineStyle: {color: '#ddd'}},
				        axisLabel: {interval: 0, textStyle: {color: '#ddd'}},
				        data: barTitle
				    },
				    series : [
				        {
				            type: 'scatter',
				            coordinateSystem: 'geo',
				            data: convertData(data),
				            symbolSize: function (val) {
				                return val[2] / 10;
				            },
				            label: {
				                normal: {
				                    formatter: '{b}',
				                    position: 'right',
				                    show: false
				                },
				                emphasis: {
				                    show: true
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#ddb926'
				                }
				            }
				        },
				        {
				            name: '进件量',
				            type: 'effectScatter',
				            coordinateSystem: 'geo',
				            data: convertData(data.sort(function (a, b) {
				                return b.value - a.value;
				            }).slice(0, data.length)),
				            symbolSize: function (val) {
				                return val[2] / 10;
				            },
				            showEffectOn: 'render',
				            rippleEffect: {
				                brushType: 'stroke'
				            },
				            hoverAnimation: true,
				            label: {
				                normal: {
//				                    formatter: '{b}',
				                	formatter: function (params, ticket, callback){
							        	if(params.componentSubType == 'bar'){
							        		return params.name + ": " + params.value;
							        	}else{
							        		return params.name + params.data.realValue;
							        	}
							        },
				                    position: 'right',
				                    show: true
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#f4e925',
				                    shadowBlur: 10,
				                    shadowColor: '#333'
				                }
				            },
				            zlevel: 1
				        },
				        {
				            id: 'bar',
				            zlevel: 2,
				            type: 'bar',
				            symbol: 'none',
				            label: {
				                normal: {
				                    show: true,
				                    position: 'right'
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#ddb926',
				                    show: true
				                }
				            },
				            data: barData
				        }
				    ]
				};
		}else{
			option = {
				    backgroundColor: '#404a59',
				    animation: true,
				    animationDuration: 1000,
				    animationEasing: 'cubicInOut',
				    animationDurationUpdate: 1000,
				    animationEasingUpdate: 'cubicInOut',
				    title: [{
				        text: title,
				        subtext: subTitle,
				        //sublink: 'http://www.pm25.in',
				        left: 'center',
				        textStyle: {
				            color: '#fff'
				        }
				    },
			        {
			            id: 'statistic',
			            right: 120,
			            top: 40,
			            width: 100,
			            textStyle: {
			                color: '#fff',
			                fontSize: 12
			            }
			        }],
				    tooltip : {
				        trigger: 'item'
				    },
				    brush: {
				        outOfBrush: {
				            color: '#abc'
				        },
				        brushStyle: {
				            borderWidth: 2,
				            color: 'rgba(0,0,0,0.2)',
				            borderColor: 'rgba(0,0,0,0.5)',
				        },
				        seriesIndex: [0, 1],
				        throttleType: 'debounce',
				        throttleDelay: 300,
				        geoIndex: 0
				    },
				    geo: {
				        map: 'china',
				        label: {
				            emphasis: {
				                show: false
				            }
				        },
				        roam: true,
				        itemStyle: {
				            normal: {
				                areaColor: '#323c48',
				                borderColor: '#111'
				            },
				            emphasis: {
				                areaColor: '#2a333d'
				            }
				        }
				    },
				    series : [
				        {
				            type: 'scatter',
				            coordinateSystem: 'geo',
				            data: convertData(data),
				            symbolSize: function (val) {
				                return val[2] / 10;
				            },
				            label: {
				                normal: {
				                    formatter: '{b}',
				                    position: 'right',
				                    show: false
				                },
				                emphasis: {
				                    show: true
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#ddb926'
				                }
				            }
				        },
				        {
				            name: '进件量',
				            type: 'effectScatter',
				            coordinateSystem: 'geo',
				            data: convertData(data.sort(function (a, b) {
				                return b.value - a.value;
				            }).slice(0, data.length)),
				            symbolSize: function (val) {
				                return val[2] / 10;
				            },
				            showEffectOn: 'render',
				            rippleEffect: {
				                brushType: 'stroke'
				            },
				            hoverAnimation: true,
				            label: {
				                normal: {
				                    formatter: '{b}',
				                    position: 'right',
				                    show: true
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#f4e925',
				                    shadowBlur: 10,
				                    shadowColor: '#333'
				                }
				            },
				            zlevel: 1
				        }
				    ]
				};
		}
	};
	
	//
	var isNameExisted = function(name, data){
		var index = -1;
		for(var i = 0; i < data.length; i++){
			if(data[i].name == name){
				index = i;
			}
		}
		return index;
	}
	
	
	//合并数据
	var mergeData = function(todayData, realData){
		var newData = [];
		
		for(var i = 0; i < realData.length; i++){
			var index = isNameExisted(realData[i].name, todayData);
			if(index == -1){
				var obj = realData[i];
				obj.type = 'realtime';
				newData.push(obj);
			}else{
				todayData[index].type = 'realtime';
			}
//			var obj = realData[i];
//			obj.type = 'realtime';
//			newData.push(obj);
		}
		
		for(var i = 0; i < todayData.length; i++){
			var obj = todayData[i];
//			obj.type = 'today';
			newData.push(obj);
		}
		return newData;
	}
	
	//加载 
	var loadData = function(myChart, todayData, data){
		data = mergeData(todayData, data);
		
		
		data = data.sort(function (a, b) {
	        return a.value - b.value;
	    });
		this.data = data;
		
		if(displayTopBar){
			barTitle = [];
			barData = [];
			if(typeof(data) != "undefined"){
				for(var i = 0; i < data.length; i++){
					barTitle.push(data[i].name);
					barData.push(data[i]);
				}
			}
			
			myChart.setOption({
		        yAxis: {
		            data: barTitle
		        },
		        series: [
		        {
		            data: convertData(data)
		        },
		        {
		            name: '进件量',
		            data: convertData(data.sort(function (a, b) {
		                return b.value - a.value;
		            }).slice(0, data.length))
		        },
		        {
		            id: 'bar',
		            data: barData
		        }
		        ]
		    });
		}else{
			myChart.setOption({
		        series: [
		        {
		            data: convertData(data)
		        },
		        {
		            name: '进件量',
		            data: convertData(data.sort(function (a, b) {
		                return b.value - a.value;
		            }).slice(0, data.length))
		        }
		        ]
		    });
		}
	};
	
	return {
		init: function(showDivID, title, subTitle, displayTopBar) {
			myChart = echarts.init(document.getElementById(showDivID));
			initOption(title, subTitle, displayTopBar);
			myChart.setOption(option);
			return myChart;
		},
		load: function(myChart, todayData, realData) {
			loadData(myChart, todayData, realData);
		}
	}
}();