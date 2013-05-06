KISSY.add(function(S, Node, Event, Transition) {

  var $ = S.all,
      suspender = $('#suspender'),
      STATUS = {
        NORMAL: 0,
        LOADING: 1,
        PLAYING: 2
      },
      status = STATUS.NORMAL,
      currentMod;

  function toPlayer(){
    Transition.forward(currentMod, 'xiami/transition/player');
  }

  suspender.on(Event.Gesture.tap, function(e){
    toPlayer();
  });
  
  return {

    getSuspender: function(mod){     
      return suspender;
    },

    setCurrentMod: function(mod){
      currentMod = mod;
    },

    show: function(){
      suspender.show().attr('class','');
    },

    hide: function(){
      suspender.hide();
    },

    playOne: function(id){
      suspender.addClass('playing');
    },

    addToList: function(){

    }

  
  };
  
},{
  requires:['node','event','./transition/index']
});