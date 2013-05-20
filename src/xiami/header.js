KISSY.add(function(S,Node, Transition) {

  var $             = S.all;
  var header        = $('#header');
  var currentHeader = null;
  var headerMap     = {};

  var TPL = '<div class="header-page">'+
    '<div class="go-cat"></div>' +
    '<div class="go-back"></div>' +
    '<div class="do-search"></div>' +
    '<div class="title">午后音乐</div>' +
    '</div>';
  
  return {
  
    getHeader: function(mod){
      if (currentHeader) {
        currentHeader.hide();
      }
      
      if (headerMap[mod]) {
        headerMap[mod].show();
        currentHeader = headerMap[mod];
      } else {
        currentHeader = headerMap[mod] = $(TPL).appendTo(header);
        currentHeader.all("div.go-back").on("click", function() {
          Transition.backward();
        });
      }

      return currentHeader;
    }
  
  };
  
},{
  requires:['node', "./transition/index"]
});
