var Table = function() {
	
	var init = function(tableID, option){
		/*
		var thead = 
			'<tr>' +
	            '<th rowspan="2">名称</th>' +
	            '<th colspan="2">时段1</th>' +
	            '<th colspan="3">时段2</th>' +
	        '</tr>' +
	        '<tr>' +
	            '<th>Position</th>' +
	            '<th>Salary</th>' +
	            '<th>Office</th>' +
	            '<th>Extn.</th>' +
	            '<th>E-mail</th>' +
	        '</tr>';
		$(tableID + 'Thead').append(thead);
		
		var data = [
	                   [
	                    "Tiger Nixon",
	                    "System Architect",
	                    "Edinburgh",
	                    "5421",
	                    "2011/04/25",
	                    "$3,120"
	                ],
	                [
	                    "Garrett Winters",
	                    "Director",
	                    "Edinburgh",
	                    "8422",
	                    "2011/07/25",
	                    "$5,300"
	                ]
	            ];
		$(tableID).DataTable( {
			//"lengthMenu": [[-1], ["All"]],
	        "columnDefs": [ {
	            "visible": false,
	            "targets": -1
	        } ],
	        data: data
	    });
	    
		if(typeof(columns) == "undefined") {
			$("#" + tableID).DataTable( {
				//"lengthMenu": [[-1], ["All"]],
				"scrollX":   true,
		        "columnDefs": [ {
		            "visible": false,
		            "targets": -1
		        } ]
		    });
		}else{
			
		}
		*/
		$("#" + tableID).DataTable(option);
	}
	
	return {
		init: function(tableID, option) {
			init(tableID, option);
		},
		load: function(tableID, data) {
			$("#" + tableID).DataTable().clear().draw();
			$("#" + tableID).DataTable().rows.add(data).draw();
		}
	}
}();