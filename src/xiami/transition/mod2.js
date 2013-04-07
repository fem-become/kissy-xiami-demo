KISSY.add(function (S, Node, Transition,Event) {
    var $ = Node.all;
    var el;

    return {

        init: function () {
            if (!el) {
                el = $('<div class="mod-page"><div class="mod-page-inner"></div></div>').appendTo('body');


                el.one('.mod-page-inner').html('mod2');

                el.on(Event.Gesture.tap, function () {
                    Transition.backward('xiami/transition/mod2', 'xiami/transition/mod1');
                });
                S.log('mod2 is new');
            } else {
                S.log('mod2 is coming again');
            }
        },

        getEl: function () {
            return el;
        }

    };

}, {
    requires: ['node', './index','event']
});