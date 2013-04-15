KISSY.add(function (S, Node, Transition,Event,header) {
    var $ = Node.all;
    var el;

var myName=this.getName();

var body=$('#body');

    return {

        init: function () {
            if (!el) {
                el = $('<div class="mod-page"></div>').appendTo(body);


                el.html('<div>mod2,please scroll<div style="height:1000px"></div><button>back</button><div style="height:100px"></div></div>');

                el.one('button').on(Event.Gesture.tap, function () {
                    Transition.backward(myName, 'xiami/transition/mod1');
                });
                S.log(myName+' is new');
            } else {
                S.log(myName+' is coming again');
            }
            
            
            var headerEl=header.getHeader(myName);
						
						if(!headerEl.contents().length){
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