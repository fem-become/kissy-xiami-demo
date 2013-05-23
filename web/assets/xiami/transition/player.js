KISSY.add("xiami/transition/player", function(S, Node, Transition, Event, header, DD, Constrain, ScrollView, ScrollbarPlugin) {
  var $ = Node.all;
  var el;
  var myName = this.getName();
  var body = $("#body");
  var re = {};
  var BASE_URL = "http://test.fem.taobao.net:3000/song/";
  var TEST_URL = "http://m1.file.xiami.com/224/224/992/12345_95993_l.mp3";
  var PLAY_CLASS = "pl-play";
  var STOP_CLASS = "pl-pause";
  var progress = null;
  var musicInfo = {};
  var isPlaying = false;
  var isStarted = false;
  var elTabContent = [];
  var LIST_TEMP_HTML = '<li class="J_MusicItem" id="J_MusicItem{id}" data-url="{location}" data-id="{id}">' + '<p class="bar J_PlListBar" class="J_ItemBar"></p>' + '<p class="pl-name">' + '\t<strong class="tt" title="{title}">' + "\t\t{title}" + "\t</strong>" + "\t<em>\u6b63\u5728\u64ad\u653e</em>" + "</p>" + "</li>";
  var HANDLE_TEMPLATE = '<div id="J_PlayInfo" class="pl-play-info">' + '\t<ul class="pl-tab-icon" id="J_TabHandle">' + '\t\t<li id="J_TabImg" data-index="0" class="J_PlayTabIcon pl-hover">' + "\t\t</li>" + '\t\t<li id="J_TabList" data-index="1" class="J_PlayTabIcon">' + "\t\t</li>" + "\t</ul>" + '\t<p id="J_PlayTime" class="pl-play-time">' + '\t\t<em id="J_CurrentTime" class="pl-current">' + "\t\t\t00:00" + "\t\t</em>" + '\t\t<em id="J_TotalTime" class="pl-total">' + "\t\t\t4:02" + "\t\t</em>" + 
  "\t</p>" + '\t<div id="J_PlayBar" class="pl-play-bar">' + '\t\t<p id="J_PlayProgress" class="pl-progress"></p>' + '\t\t<em id="J_PlayBarIcon" class="pl-bar-icon"></em>' + "\t</div>" + '\t<div class="pl-player-handle">' + '\t\t<span id="J_PlayLast" class="pl-last">' + "\t\t\t<em>last</em>" + "\t\t</span>" + '\t\t<span id="J_PlaySwitch" class="pl-switch pl-pause">' + "\t\t\t<em>play/pause</em>" + "\t\t</span>" + '\t\t<span id="J_PlayNext" class="pl-next">' + "\t\t\t<em>next</em>" + "\t\t</span>" + 
  "\t</div>" + "</div>";
  var TAB_CONTENT_TEMP = '<div id="J_PlTabContent" class="pl-tab-content">' + '\t<div id="J_PlayerTab" class="pl-player-tab">' + '\t\t<div class="pl-img-tab" id="J_PlImgTab">' + '\t\t\t<div class="pl-img-content">' + '\t\t\t\t<img class="pl-img" id="J_PlImg" src="http://www.lettersmarket.com/uploads/lettersmarket/blog/loaders/common_metal/ajax_loader_metal_64.gif" alt="img">' + "\t\t\t</div>\t" + "\t\t</div>" + '\t\t<div class="pl-list-tab" id="J_PlListTab" style="display:none">' + '\t\t\t<div class="ks-scrollview-content ks-content">' + 
  '\t\t\t<ul class="pl-music-list" id="J_PlMusicList">' + '\t\t\t\t<li><img class="pl-img" src="http://www.lettersmarket.com/uploads/lettersmarket/blog/loaders/common_metal/ajax_loader_metal_64.gif" alt="img"></li>' + "\t\t\t</ul>" + "\t\t\t</div>" + "\t\t</div>" + "\t</div>" + "</div>";
  var numInit = 0;
  var initProg;
  var scrollview = null;
  S.Player = new S.Base;
  S.plScrollView = null;
  var localArr = localStorage.getItem("MUSIC_LIST") ? localStorage.getItem("MUSIC_LIST").split(",") : [];
  S.mix(re, {init:function(config) {
    this.bringRest();
    header.setTitle("\u64ad\u653e\u5668");
    numInit = 0;
    if(!config || !config.id) {
      musicInfo.id = localArr[0];
      musicInfo.src = TEST_URL
    }else {
      musicInfo.id = config.id;
      musicInfo.src = config.src || TEST_URL
    }
    if(!el) {
      el = $('<div class="mod-page"></div>').appendTo(body);
      el.html(TAB_CONTENT_TEMP + HANDLE_TEMPLATE);
      S.log(myName + " is new")
    }else {
      S.log(myName + " is coming again")
    }
    this.render();
    this.fillList();
    this._bindEvent();
    var HEADER_HEIGHT = 45, PLAY_INFO_HEIGHT = $("#J_PlayInfo").height(), MAXHEIGHT = 185, PADDING = 8, tabHeight = $(window).height() - PLAY_INFO_HEIGHT - HEADER_HEIGHT, winWidth = $(window).width();
    console.log($(window).height() + " " + PLAY_INFO_HEIGHT);
    $("#J_PlayerTab").height(tabHeight);
    $("#J_PlImg").css({"margin-top":(tabHeight - MAXHEIGHT - 2 * PADDING) / 2 + "px"});
    scrollview = (new ScrollView({srcNode:"#J_PlListTab", plugins:[new ScrollbarPlugin({})]})).render();
    var headerEl = header.getHeader(myName);
    if(!headerEl.contents().length) {
      headerEl.append(myName)
    }
  }, getEl:function() {
    return el
  }, setScrollView:function() {
    if(!S.plScrollView) {
      S.plScrollView = new ScrollView({srcNode:"#J_PlTabContent", plugins:[new ScrollbarPlugin({})]});
      S.plScrollView.render()
    }
  }, _bindEvent:function() {
    var self = this;
    this.playNext();
    this.playPrev();
    this._bindTabSwitch();
    var self = this;
    S.Player.on("go-back", function() {
      self.bringRest()
    })
  }, render:function(isSwitch) {
    var self = this;
    if(S.player) {
      S.player.pause()
    }
    this.createAudio(musicInfo.src);
    this.getMusicInfo(musicInfo.id, function() {
      $("#J_PlImg").attr("src", musicInfo.albumCover)
    });
    return this
  }, createAudio:function(src, isSwitch) {
    var self = this;
    if(!S.player) {
      S.player = new Audio
    }
    S.player.src = src;
    S.player.load();
    $("#J_TotalTime").html("loading");
    $(S.player).on("canplay", function() {
      re._changeProgress();
      re._setProgress();
      self._startPlay();
      self._switchMusic()
    });
    return S.player
  }, getAudio:function() {
    return player
  }, stop:function(callback) {
    S.player && S.player.pause();
    if(callback) {
      callback()
    }
    return this
  }, play:function(callback) {
    S.player.play();
    if(callback) {
      callback()
    }
    return this
  }, getTotalTime:function() {
    return S.player && S.player.duration || 0
  }, bringRest:function() {
    if(S.player) {
      S.player.pause();
      if(S.player.currentTime) {
        S.player.currentTime = 0
      }
      if(progress) {
        progress.cancel()
      }
      $("#J_CurrentTime").html("0:00");
      $("#J_PlayProgress").css("width", 0);
      $("#J_PlayBarIcon").css("left", 0);
      $("#J_PlaySwitch").replaceClass(PLAY_CLASS, STOP_CLASS);
      S.player = null
    }
    return this
  }, getMusicInfo:function(id, callback) {
    S.io({type:"get", url:BASE_URL + musicInfo.id, dataType:"jsonp", success:function(data) {
      S.mix(musicInfo, data);
      callback && callback()
    }, error:function() {
      alert("error");
      callback && callback()
    }});
    return this
  }, updateProgress:function(rate) {
    var realRate = rate || 200;
    var self = this;
    progress = S.later(function() {
      re._changeProgress()
    }, realRate, true);
    return this
  }, getWindowWidth:function() {
    return $(window).width()
  }, _changeProgress:function() {
    var elBar = $("#J_PlayProgress"), elNow = $("#J_CurrentTime"), elTotal = $("#J_TotalTime"), elDrag = $("#J_PlayBarIcon");
    var elListBar = $(".is-playing").children(".J_PlListBar");
    var nowTime = this.progress(), totalTime = this.getTotalTime();
    var len = nowTime / totalTime * this.getWindowWidth();
    elBar.css({width:len});
    elListBar.css({width:len});
    elDrag.css({left:len > this.getWindowWidth() - 8 ? this.getWindowWidth() - 8 : len});
    elNow.html(this.formatTime(nowTime));
    elTotal.html(this.formatTime(totalTime))
  }, formatTime:function(num) {
    var seconds = Math.floor(num % 60);
    if(seconds <= 9) {
      seconds = "0" + seconds
    }
    return Math.floor(num / 60) + ":" + seconds
  }, progress:function(control) {
    if(control) {
      S.player.currentTime = control;
      return this
    }else {
      return S.player.currentTime
    }
  }, _switchMusic:function() {
    var self = this, elTarget;
    $("#J_PlaySwitch").detach("click").on("click", function() {
      elTarget = $(this);
      if(elTarget.hasClass(STOP_CLASS)) {
        self._startPlay()
      }else {
        self.stop(function() {
          isPlaying = false;
          progress && progress.cancel();
          elTarget.replaceClass(PLAY_CLASS, STOP_CLASS)
        })
      }
    })
  }, playNext:function() {
    var elTarget = $("#J_PlayNext");
    var self = this;
    var nextNode;
    elTarget.on("click", function() {
      self.bringRest();
      nextNode = $(".is-playing").next(".J_MusicItem");
      var el = nextNode;
      if(!el) {
        return false
      }
      el.addClass("is-playing").siblings(".J_MusicItem").removeClass("is-playing");
      self.bringRest();
      progress && progress.cancel();
      musicInfo.id = el.attr("data-id");
      musicInfo.src = el.attr("data-url");
      self.render();
      self.updateProgress();
      $("#J_PlaySwitch").removeClass(STOP_CLASS).addClass(PLAY_CLASS)
    });
    return this
  }, playPrev:function() {
    var elTarget = $("#J_PlayLast");
    var self = this;
    var prevNode;
    elTarget.on("click", function() {
      self.bringRest();
      prevNode = $(".is-playing").prev(".J_MusicItem");
      var el = prevNode;
      if(!el) {
        return false
      }
      el.addClass("is-playing").siblings(".J_MusicItem").removeClass("is-playing");
      self.bringRest();
      progress && progress.cancel();
      musicInfo.id = el.attr("data-id");
      musicInfo.src = el.attr("data-url");
      self.render();
      self.updateProgress();
      $("#J_PlaySwitch").removeClass(STOP_CLASS).addClass(PLAY_CLASS)
    });
    return this
  }, _startPlay:function() {
    var self = this;
    var elTarget = $("#J_PlaySwitch");
    self.play(function() {
      isPlaying = true;
      isStarted = true;
      self.updateProgress();
      elTarget.replaceClass(STOP_CLASS, PLAY_CLASS)
    })
  }, _endMusic:function() {
    var self = this;
    $(player).on("ended", function() {
      $("#J_PlayNext").fire("click")
    })
  }, _setProgress:function() {
    var self = this;
    $("#J_PlayBar").on("click", function(e) {
      self.progress(e.offsetX / self.getWindowWidth() * self.getTotalTime());
      self._changeProgress()
    })
  }, _dragProgress:function() {
    var self = this;
    var elDrag = $("#J_Drag");
    var drag = self._createDD(elDrag);
    drag.on("drag", function(e) {
      var left = elDrag.css("left");
      elDrag.css("left", left);
      self.progress((parseFloat(left, 10) + 3) / self.getWindowWidth() * self.getTotalTime());
      self._changeProgress()
    })
  }, _createDD:function(node) {
    return new DD.Draggable({node:node, cursor:"move", move:true, plugins:[new Constrain({constrain:"#J_BarBack"})]})
  }, _pointMusic:function() {
    var self = this;
    $(".J_MusicItem").on(Event.Gesture.doubleTap, function(e) {
      var elTarget = $(e.target);
      musicInfo.id = elTarget.attr("data-id");
      musicInfo.src = elTarget.attr("data-url");
      elTarget.addClass("is-playing").siblings(".J_MusicItem").removeClass("is-playing");
      self.bringRest();
      progress && progress.cancel();
      self.render(true);
      $("#J_PlaySwitch").replaceClass(STOP_CLASS, PLAY_CLASS)
    })
  }, isIOS:function() {
    var device = navigator["userAgent"]["toLowerCase"]();
    if(device["indexOf"]("iphone") > 0 || device["indexOf"]("ipod") > 0 || device["indexOf"]("ipad") > 0 || device["indexOf"]("symbianos") > 0 || device["indexOf"]("ios") > 0) {
      return true
    }
  }, fillList:function() {
    var localArr = localStorage.getItem("MUSIC_LIST") ? localStorage.getItem("MUSIC_LIST").split(",") : [];
    localArr.unshift(musicInfo.id);
    var listArr = S.unique(localArr);
    var listA = [];
    S.each(listArr, function(value, key) {
      var self = this;
      var shopInfo = {id:value};
      S.io({type:"get", url:BASE_URL + value, dataType:"jsonp", success:function(data) {
        shopInfo = S.mix(shopInfo, data);
        listA.push(S.substitute(LIST_TEMP_HTML, shopInfo));
        if(key === listArr.length - 1) {
          $("#J_PlMusicList").html(listA.join(""));
          scrollview.sync();
          re._changeColor();
          re._pointMusic()
        }
      }, error:function() {
        S.log("error")
      }})
    });
    return this
  }, _bindTabSwitch:function() {
    $("#J_PlListTab").css("left", $(window).width());
    $("#J_PlImgTab").css("left", 0).show();
    var self = this;
    Event.delegate(document, Event.Gesture.tap, ".J_PlayTabIcon", function(e) {
      var elTarget = $(e.target);
      var index = parseInt(elTarget.attr("data-index"), 10);
      self.switchTab(index)
    });
    $("#J_PlImgTab").on("swipe", function(e) {
      if(e.direction === "left") {
        self.switchTab(1)
      }
    });
    $("#J_PlListTab").on("swipe", function(e) {
      if(e.direction === "right") {
        self.switchTab(0)
      }
    })
  }, _changeColor:function() {
    var self = this;
    $(".J_MusicItem").each(function(v, index) {
      var elName = v.children(".pl-name").children(".tt");
      var strName = elName.text();
      if(self.getWindowWidth() < 400) {
        strName = strName.substr(0, 12);
        elName.html(strName)
      }
      if(index === 0) {
        return v.addClass("is-playing")
      }
      if(index % 2 === 1) {
        v.addClass("odd")
      }
    })
  }, switchTab:function(index) {
    var width = $(window).width();
    var elTab = $("#J_PlayerTab");
    var elTabArr = [$("#J_PlImgTab"), $("#J_PlListTab")];
    var elTabIconArr = [$("#J_TabImg"), $("#J_TabList")];
    var lenArr = [0, width];
    elTabArr[index].show();
    elTabArr[0].animate({left:"-" + lenArr[index]}, 0.5, undefined, function() {
    });
    elTabArr[1].animate({left:lenArr[1 - index]}, 0.5, undefined, function() {
      elTabArr[1 - index].hide();
      elTabIconArr[index].addClass("pl-hover");
      elTabIconArr[1 - index].removeClass("pl-hover")
    });
    return this
  }});
  return re
}, {requires:["node", "./index", "event", "../header", "dd", "dd/plugin/constrain", "scrollview", "scrollview/plugin/scrollbar", "./player.css"]});

