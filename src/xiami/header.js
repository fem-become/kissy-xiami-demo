KISSY.add(function(S,Node, Transition, Event) {

  var $             = S.all;
  var header        = $('#header');
  var currentHeader = null;
  var headerMap     = {};

  var TPL = '<div class="header-page">'+
    '<div class="go-cat"></div>' +
    '<a href="javascript:;" class="go-back"></a>' +
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
        currentHeader.all("a.go-back").on(Event.Gesture.tap, function() {
          Transition.backward();
        });
      }

      return currentHeader;
    }
  
  };
  
},{
  requires:['node', "./transition/index", "event"]
});
