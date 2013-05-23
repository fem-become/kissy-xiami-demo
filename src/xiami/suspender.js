KISSY.add(function(S, Node, Event, Transition, Player) {

  var $ = S.all,
      suspender = $('#suspender'),
      STATUS = {
        NORMAL: 0,
        LOADING: 1,
        PLAYING: 2
      },
      status = STATUS.NORMAL,
      currentMod,
      popup = $('.s-popup'),
      loaded = 0;

  function toPlayer(){
    Transition.forward(currentMod, 'xiami/transition/newplayer');
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

    playOne: function(musicInfo){
      var self = this;
      // suspender.one('.s-inner').css({
      //   'background-image':'url("' + musicInfo.albumImg + '")'
      // });
      suspender.addClass('playing');
      setTimeout(self._updateLoading,100,false,self);
      //Player.render(musicInfo.id);
      //Player.init({id: '1769374012'});
      Player.playSongNow(musicInfo);
    },

    _updateLoading: function(){
      if(loaded < 100){
        suspender.removeClass('loading-' + loaded);
        loaded += 25;
        suspender.addClass('loading-' + loaded);
        setTimeout(arguments.callee, 100);
      }else{
        S.later(function(){
          suspender.removeClass('loading-' + loaded);
          loaded = 0;
        }, 500);
      }

    },

    addToList: function(songs){
      // var list = localStorage.getItem('MUSIC_LIST')? localStorage.getItem('MUSIC_LIST').split(','):[];
      if(!S.isArray(songs)){
        songs = [songs];
      } 
      // for(var i = 0; i < songs.length; i++){
      //   list.push(songs[i]);
      // }    
      // localStorage.setItem('MUSIC_LIST', S.unique(list).join(','));
      
      Player.addToList(songs);
      popup.one('.J_PopupMsg').text(songs.length + '首歌曲已添加到播放列表').end().show(.3);
      S.later(function(){
        popup.hide(.3);
      },1500);
    }

  
  };
  
},{
  requires:['node','event','./transition/index','./transition/newplayer']
});
