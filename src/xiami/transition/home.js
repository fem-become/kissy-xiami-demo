KISSY.add(function (S, Node, Transition, Event, header) {

  var $ = Node.all;
  var el;
  var myName=this.getName();
  var body=$('#body');

  return {

    init: function (cfg) {

      if (!el) {
        el = $('<div class="mod-page"></div>').appendTo(body);
        el.html('<button>go to list</button>');
        el.one('button').on(Event.Gesture.tap, function () {
            Transition.forward(myName, 'xiami/transition/albums');
        });

        S.log(myName+' is new');
      } else {
        S.log(myName+' is coming again');
      }
      
      
      var headerEl=header.getHeader(myName);
      if (!headerEl.contents().length) {
        headerEl.append(myName);
      }

    },

    getEl: function () {
      return el;
    }

  };

}, {
  requires: ['node', './index','event','../header']
});