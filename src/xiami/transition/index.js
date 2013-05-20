KISSY.add( function (S, Node) {

    var $ = Node.all;
    var duration=0.3;

    var cache = [];

    return {

        forward: function (currentMod, nextMod, cfg) {
            
              cfg = cfg ||{};
              cfg.forwardFromMod=currentMod;

            cache.push([currentMod, nextMod, cfg]);

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

        backward: function () {// currentMod, nextMod,cfg) {
            
            var item = cache.pop();
            var currentMod = item[1];
            var nextMod = item[0];
            var lastItem = cache[cache.length - 1];

            var cfg = lastItem ? lastItem[2] : {};

                // cfg = cfg ||{};
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
