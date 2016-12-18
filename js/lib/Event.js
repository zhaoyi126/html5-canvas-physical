(function($){
	Events = function(t,options){	
		this.settings = $.extend({}, options);
		
		this.renderTo = t;
		this.jRenderTo = $("#" + t);
		//if (0 == this.jRenderTo.length) return;
	};
	
	Events.prototype = {
		"notify" : function(url,callback) {
	        //var es = new EventSource("/coach/job-check/");
			if(typeof(EventSource)!=="undefined") {
				var es = new EventSource(url);
		        es.addEventListener("message",function(e){
		            eval('data='+e.data);
		            if(data.notify=='0'){//全局控制，如果服务器端禁止发送通知，则移除监听
		                es.close();
		                return;
		            }
		            
		            if (data.status && data.feedback==1) {
		            	if (typeof callback == "function") {
		            		callback();
		            	}
		            	es.close();
		            }
		        },false);	
			} else {
            	if (typeof callback == "function") {
            		callback();
            	}				
			}
		},		
		
		"test" : function() {
			alert('test');
		},
		

	}
})(jQuery)
