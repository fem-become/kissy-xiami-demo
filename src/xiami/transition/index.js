KISSY.add( function (S, Node) {

    var $ = Node.all;

    var duration=0.3;

    return {

        forward: function (currentMod, nextMod, cfg) {

            KISSY.use(nextMod + ',' + currentMod, function (S, next, current) {

                next.init(cfg);

                var el = next.getEl();

                var width = $(window).width();

                el.css({
                    left: width
                });

                el.animate({
                    left: 0
                },{
                    duration:duration,
                    useTransition:true
                });


                current.getEl().animate({
                    left: -width
                },{
                    duration:duration,
                    useTransition:true
                });

            });

        },


        backward: function (currentMod, nextMod) {

            KISSY.use(nextMod + ',' + currentMod, function (S, next, current) {

                next.init();

                var el = next.getEl();

                var width = $(window).width();

                el.css({
                    left: -width
                });

                el.animate({
                    left: 0
                },{
                    duration:duration,
                    useTransition:true
                });


                current.getEl().animate({
                    left: width
                },{
                    duration:duration,
                    useTransition:true
                });

            });

        }
    }

}, {
    requires: ['node']
});
