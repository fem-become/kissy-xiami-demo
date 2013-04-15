KISSY.add(function(S,Node) {

  var $             = S.all;
  var header        = $('#header');
  var currentHeader = null;
  var headerMap     = {};
  
  return {
  
    getHeader: function(mod){
      if (currentHeader) {
        currentHeader.hide();
      }
      
      if (headerMap[mod]) {
        headerMap[mod].show();
        currentHeader = headerMap[mod];
      } else {
        currentHeader = headerMap[mod] = $('<div class="header-page">').appendTo(header);
      }

      return currentHeader;
    }
  
  };
  
},{
  requires:['node']
});
