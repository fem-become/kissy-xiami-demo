KISSY.add("xiami/transition/min-player", function(S, Node) {
  var $ = Node.all;
  var re = {};
  var player;
  var musicInfo = {};
  S.mix(re, {render:function(src) {
    this.bringRest();
    musicInfo.src = src || TEST_URL;
    this.createAudio(src)
  }, createAudio:function(src) {
    var self = this;
    player = new Audio;
    player.src = src;
    player.load();
    self.play();
    return player
  }, getAudio:function() {
    return player
  }, stop:function(callback) {
    player.pause();
    if(callback) {
      callback()
    }
    return this
  }, play:function(callback) {
    player.play();
    if(callback) {
      callback()
    }
    return this
  }, getTotalTime:function() {
    return player.duration
  }, bringRest:function() {
    if(player) {
      player.pause();
      player.currentTime = 0
    }
    return this
  }});
  return re
}, {requires:["node"]});

