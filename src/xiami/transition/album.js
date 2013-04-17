KISSY.add(function(S, Node, Transition, Event, header) {

  var $ = Node.all;
  var el;
  var myName = this.getName();
  var body = $("#body");

  return {

    init: function(config) {
      if (!el) {
        el = $('<div class="mod-page"></div>').appendTo(body);
        el.html('<button id="J_Play">play music</button><button id="J_AlbumBack">back to list</button><div id="J_AlbumId"></div>');
        el.one('#J_Play').on(Event.Gesture.tap, function() {
          Transition.forward(myName, 'xiami/transition/player');
        });
        el.one('#J_AlbumBack').on(Event.Gesture.tap, function() {
          Transition.backward(myName, 'xiami/transition/albums');
        });
        S.log(myName + ' is new');
      } else {
        S.log(myName + ' is coming again');
      }

      el.one("#J_AlbumId").html('album id:' + config.id);

      var headerEl=header.getHeader(myName);
      if (!headerEl.contents().length) {
        headerEl.append(myName);
      }
    },

    getEl: function() {
      return el;
    }

  };

}, {
  requires: ["node", "./index", "event", "../header"]
});
