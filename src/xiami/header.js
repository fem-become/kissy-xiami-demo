KISSY.add(function(S,Node, Transition, Event, DD) {

  var $             = S.all;
  var header        = $('#header');
  var currentHeader = null;
  var headerMap     = {};

  var isRunOnce = false;

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
          var val = (el.css("-webkit-transform"));

          if (val.indexOf("260") > -1) {
            el.css("-webkit-transition", "300ms");
            el.css("transition", "300ms");
            el.css("-webkit-transform", "translate3d(0px, 0, 0)");
            $("body").css("overflow", "hidden");
            // el.removeClass("cat-show");
            setTimeout(function() {
              $("#cat").hide();
            }, 400);
          } else {
            $("#cat").show();
            el.css("-webkit-transition", "300ms");
            el.css("transition", "300ms");
            el.css("-webkit-transform", "translate3d(260px, 0, 0)");
          }
        });
        //search
        currentHeader.all(".do-search").on(Event.Gesture.tap, function() {
            Transition.forward(mod, "xiami/transition/search");
        });
      }

      if(mod === "xiami/transition/home"){
          isRunOnce = true;
      }

      if (mod === "xiami/transition/home" && isRunOnce == false) {
        isRunOnce = true;

        // Bind Event.
        var cattEl = currentHeader.all("a.go-cat");
        var d = new DD.Draggable({
          node: cattEl,
          handlers: [cattEl]
        });
        var initX = null;
        var pEl = $("#page");
        d.on("dragstart", function(e) {
          initX = e.pageX;
        });
        d.on("drag", function(e) {
          if (initX === null) return;
          var diff = e.pageX - initX;
          diff = e.pageX;
          if (diff < 0) return;
          if (diff > 260) return;
          $("#cat").show();
          pEl.css("-webkit-transition", "0ms");
          pEl.css("transition", "0ms");
          pEl.css("-webkit-transform", "translate3d("+diff+"px, 0, 0)");
        });
        d.on("dragend", function(e) {
          pEl.css("-webkit-transition", "300ms");
          pEl.css("transition", "300ms");
          if (e.pageX - initX > 100) {
            pEl.css("-webkit-transform", "translate3d(260px, 0, 0)");
            $("body").css("overflow", "hidden");
          } else {
            pEl.css("-webkit-transform", "translate3d(0, 0, 0)");
            $("body").css("overflow", "hidden");
            setTimeout(function() {
              $("#cat").hide();
            }, 400);
          }
          initX = null;
        });
        // cattEl.on("swipe", function() {
        //   $("#cat").show();
        //   pEl.css("-webkit-transition", "300ms");
        //   pEl.css("transition", "300ms");
        //   pEl.css("-webkit-transform", "translate3d("+diff+"px, 0, 0)");
        // });
      }

      return currentHeader;
    },

    setTitle: function (title) {
      // if (!currentHeader) return;
      $("#header div.title").html(title);
    }
  
  };
  
},{
  requires:['node', "./transition/index", "event", "dd"]
});
