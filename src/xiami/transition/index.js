KISSY.add( function (S, Node) {

    var $ = Node.all;

    var duration=0.3;

    return {

        forward: function (currentMod, nextMod, cfg) {
            
              cfg = cfg ||{};
                cfg.forwardFromMod=currentMod;

            KISSY.use(nextMod + ',' + currentMod, function (S, next, current) {

                next.init(cfg);

                var el = next.getEl();
                
                var preEl=current.getEl();
                

                var width = $(window).width();

                el.css({
                    left: width
                });
                
                el.show();

                el.animate({
                    left: 0
                },{
                    duration:duration,
                    useTransition:true
                });


                preEl.animate({
                    left: -width
                },{
                    duration:duration,
                    useTransition:true,
                    complete:function(){
                        preEl.hide();
                    }
                });

            });

        },


        backward: function (currentMod, nextMod,cfg) {
            
                cfg = cfg ||{};
                cfg.backwardFromMod=currentMod;

            KISSY.use(nextMod + ',' + currentMod, function (S, next, current) {

                next.init(cfg);

                var el = next.getEl();
                var preEl=current.getEl();

                var width = $(window).width();

                el.css({
                    left: -width
                });
                
                el.show();

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
                    useTransition:true,
                    complete:function(){
                        preEl.hide();
                    }
                });

            });

        }
    };

}, {
    requires: ['node']
});
