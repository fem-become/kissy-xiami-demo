KISSY.add("xiami/suspender", function(S, Node, Event, Transition, Player) {
  var $ = S.all, suspender = $("#suspender"), STATUS = {NORMAL:0, LOADING:1, PLAYING:2}, status = STATUS.NORMAL, currentMod, popup = $(".s-popup"), loaded = 0;
  function toPlayer() {
    Transition.forward(currentMod, "xiami/transition/newplayer")
  }
  suspender.on(Event.Gesture.tap, function(e) {
    toPlayer()
  });
  if(S.Player) {
    S.Player.on("playSong", function(e) {
      if(e.musicInfo && e.musicInfo.albumCover) {
        suspender.one(".s-inner").css({"background-image":'url("' + e.musicInfo.albumCover + '")'})
      }
    })
  }
  return{getSuspender:function(mod) {
    return suspender
  }, setCurrentMod:function(mod) {
    currentMod = mod
  }, show:function() {
    suspender.show().attr("class", "")
  }, hide:function() {
    suspender.hide()
  }, playOne:function(musicInfo) {
    var self = this, albumCover = "http://img.xiami.com/images/album/img78/64778/4059921286936374_1.jpg";
    if(musicInfo.albumCover) {
      albumCover = musicInfo.albumCover
    }
    suspender.one(".s-inner").css({"background-image":'url("' + albumCover + '")'});
    suspender.addClass("playing");
    setTimeout(self._updateLoading, 100, false, self);
    Player.playSongNow(musicInfo)
  }, _updateLoading:function() {
    if(loaded < 100) {
      suspender.removeClass("loading-" + loaded);
      loaded += 25;
      suspender.addClass("loading-" + loaded);
      setTimeout(arguments.callee, 100)
    }else {
      S.later(function() {
        suspender.removeClass("loading-" + loaded);
        loaded = 0
      }, 500)
    }
  }, addToList:function(songs) {
    if(!S.isArray(songs)) {
      songs = [songs]
    }
    Player.addToList(songs);
    popup.one(".J_PopupMsg").text(songs.length + "\u9996\u6b4c\u66f2\u5df2\u6dfb\u52a0\u5230\u64ad\u653e\u5217\u8868").end().show(0.3);
    S.later(function() {
      popup.hide(0.3)
    }, 1500)
  }}
}, {requires:["node", "event", "./transition/index", "./transition/newplayer"]});

