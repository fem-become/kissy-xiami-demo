KISSY.add(function (S, Node, Transition,Event) {
    var $ = Node.all;
    var el;

    return {

        init: function () {
            if (!el) {
                el = $('<div class="mod-page"><div class="mod-page-inner"></div></div>').appendTo('body');


                el.one('.mod-page-inner').html('mod1');

                el.on(Event.Gesture.tap, function () {
                    Transition.forward('xiami/transition/mod1', 'xiami/transition/mod2');
                });

                S.log('mod1 is new');
            } else {
                S.log('mod1 is coming again')
            }


        },

        getEl: function () {
            return el;
        }

    };

}, {
    requires: ['node', './index','event']
});