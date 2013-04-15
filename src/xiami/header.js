KISSY.add(function(S,Node){
	
	var $=S.all,
	header=$('#header');
	
	var currentHeader=null;
	
	var headerMap={
	};
	
	return {
	
		getHeader:function(mod){
			if(currentHeader){
				currentHeader.hide();
			}
			
			if(headerMap[mod]){
					headerMap[mod].show();
					return currentHeader=headerMap[mod];
			}else{
				return currentHeader=headerMap[mod]=$('<div class="header-page">').appendTo(header);				
			}
		}
	
	};
	
},{
	requires:['node']
});