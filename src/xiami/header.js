KISSY.add(function(S,Node, Transition, Event) {

  var $             = S.all;
  var header        = $('#header');
  var currentHeader = null;
  var headerMap     = {};

  var TPL = '<div class="header-page">'+
    '<a href="javascript:;" class="go-back"></a>' +
    '<a href="javascript:;" class="go-cat"></a>' +
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
           S.Player && S.Player.fire('go-back');
          Transition.backward();
        });
        currentHeader.all("a.go-cat").on(Event.Gesture.tap, function() {
          var el = $("#page");
          if (el.hasClass("cat-show")) {
            el.removeClass("cat-show");
            setTimeout(function() {
              $("#cat").hide();
            }, 400);
          } else {
            $("#cat").show();
            el.addClass("cat-show");
          }
        });
      }

      return currentHeader;
    },

    setTitle: function (title) {
      $("#header div.title").html(title);
    }
  
  };
  
},{
  requires:['node', "./transition/index", "event"]
});
