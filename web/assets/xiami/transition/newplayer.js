KISSY.add("xiami/transition/newplayer", function(S, Node, Transition, Event, header, DD, Constrain, ScrollView, ScrollbarPlugin) {
  var $ = Node.all, el, myName = this.getName(), body = $("#body");
  var re = {}, BASE_URL = "http://test.fem.taobao.net:3000/song/", TEST_URL = "http://m1.file.xiami.com/224/224/992/12345_95993_l.mp3", PLAY_CLASS = "pl-play", STOP_CLASS = "pl-pause";
  var player = null;
  var progress = null;
  var musicInfo = {};
  var isPlaying = false;
  var isStarted = false;
  var numInit = 0, eventBinded = false, scrollview = null, currentIdx = 0, storageKey = "MY_MUSIC_LIST";
  var musicList = localStorage.getItem(storageKey) ? S.JSON.parse(localStorage.getItem(storageKey)) : [];
  var elTabContent = [];
  var LIST_TEMP_HTML = '<li class="J_MusicItem" id="J_MusicItem{id}" data-id="{id}">' + '<p class="bar J_PlListBar" class="J_ItemBar"></p>' + '<p class="pl-name">' + '\t<strong class="tt" title="{title}">' + "\t\t{title}" + "\t</strong>" + "\t<em>\u6b63\u5728\u64ad\u653e</em>" + "</p>" + "</li>";
  var HANDLE_TEMPLATE = '<div id="J_PlayInfo" class="pl-play-info">' + '\t<ul class="pl-tab-icon" id="J_TabHandle">' + '\t\t<li id="J_TabImg" data-index="0" class="J_PlayTabIcon pl-hover">' + "\t\t</li>" + '\t\t<li id="J_TabList" data-index="1" class="J_PlayTabIcon">' + "\t\t</li>" + "\t</ul>" + '\t<p id="J_PlayTime" class="pl-play-time">' + '\t\t<em id="J_CurrentTime" class="pl-current">' + "\t\t\t00:00" + "\t\t</em>" + '\t\t<em id="J_TotalTime" class="pl-total">' + "\t\t\t00:00" + "\t\t</em>" + 
  "\t</p>" + '\t<div id="J_PlayBar" class="pl-play-bar">' + '\t\t<p id="J_PlayProgress" class="pl-progress"></p>' + '\t\t<em id="J_PlayBarIcon" class="pl-bar-icon"></em>' + "\t</div>" + '\t<div class="pl-player-handle">' + '\t\t<span id="J_PlayLast" class="pl-last">' + "\t\t\t<em>last</em>" + "\t\t</span>" + '\t\t<span id="J_PlaySwitch" class="pl-switch pl-pause">' + "\t\t\t<em>play/pause</em>" + "\t\t</span>" + '\t\t<span id="J_PlayNext" class="pl-next">' + "\t\t\t<em>next</em>" + "\t\t</span>" + 
  "\t</div>" + "</div>";
  var TAB_CONTENT_TEMP = '<div id="J_PlTabContent" class="pl-tab-content">' + '\t<div id="J_PlayerTab" class="pl-player-tab">' + '\t\t<div class="pl-img-tab" id="J_PlImgTab">' + '\t\t\t<div class="pl-img-content">' + '\t\t\t\t<img class="pl-img" id="J_PlImg" src="http://img04.taobaocdn.com/tps/i4/T1mAOLXtXgXXbTIWs3-128-128.gif" alt="img">' + "\t\t\t</div>\t" + "\t\t</div>" + '\t\t<div class="pl-list-tab" id="J_PlListTab" style="display:none;">' + '\t\t\t<div class="ks-scrollview-content ks-content">' + 
  '\t\t\t<ul class="pl-music-list" id="J_PlMusicList">' + "\t\t\t</ul>" + "\t\t\t</div>" + "\t\t</div>" + "\t</div>" + "</div>";
  S.Player = new S.Base;
  S.mix(re, {init:function(config) {
    var self = this;
    header.setTitle("\u64ad\u653e\u5668");
    numInit = 0;
    if(!el) {
      el = $('<div class="mod-page"></div>').appendTo(body);
      el.html(TAB_CONTENT_TEMP + HANDLE_TEMPLATE);
      S.log(myName + " is new")
    }else {
      S.log(myName + " is coming again")
    }
    var HEADER_HEIGHT = 45, PLAY_INFO_HEIGHT = $("#J_PlayInfo").height(), MAXHEIGHT = 185, PADDING = 8, tabHeight = $(window).height() - PLAY_INFO_HEIGHT - HEADER_HEIGHT, winWidth = $(window).width();
    console.log($(window).height() + " " + PLAY_INFO_HEIGHT);
    $("#J_PlayerTab").height(tabHeight);
    $("#J_PlImg").css({"margin-top":(tabHeight - MAXHEIGHT - 2 * PADDING) / 2 + "px"});
    if(!player) {
      if(musicList.length !== 0) {
        musicInfo = S.clone(musicList[0]);
        self.playSong();
        currentIdx = 0
      }else {
        alert("\u5f53\u524d\u64ad\u653e\u5217\u8868\u4e3a\u7a7a\uff0c\u60a8\u53ef\u4ee5\u8fd4\u56de\u8bd5\u542c\u6b4c\u66f2\u5662\uff01");
        return
      }
    }
    this.updateMusicControl();
    this.updateMusicInfoTab();
    this.updateMusicListTab();
    if(!eventBinded) {
      this._bindEvent();
      eventBinded = true
    }
    var headerEl = header.getHeader(myName);
    if(!headerEl.contents().length) {
      headerEl.append(myName)
    }
  }, getEl:function() {
    return el
  }, _bindEvent:function() {
    var self = this;
    self._bindTabSwitch();
    self._bindControl();
    self._bindProgressAnyPosition();
    self._bindPlayNext();
    self._bindPlayPrev();
    self._bindDoubleTap()
  }, render:function(isSwitch) {
    var self = this;
    if(player) {
      player.pause()
    }
    this.getMusicInfo(musicInfo.id, function() {
      self.createAudio(musicInfo.location, isSwitch);
      $("#J_PlImg").attr("src", musicInfo.albumCover)
    });
    return this
  }, createAudio:function(src, isSwitch) {
    var self = this;
    player = new Audio;
    player.src = src;
    player.load();
    self._switchMusic();
    if(self.isIOS()) {
      $("#J_TotalTime").html("4:02")
    }else {
      $("#J_TotalTime").html("loading");
      var initProg = S.later(function() {
        if(re.getTotalTime()) {
          re._changeProgress();
          re._setProgress();
          initProg.cancel()
        }
      }, 200, true)
    }
    if(isSwitch) {
      self.play()
    }
    numInit++;
    return player
  }, getAudio:function() {
    return player
  }, stop:function(callback) {
    player && player.pause();
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
    return player && player.duration
  }, bringRest:function() {
    if(player) {
      player.pause();
      if(player.currentTime) {
        player.currentTime = 0
      }
      if(progress) {
        progress.cancel()
      }
      $("#J_CurrentTime").html("0:00");
      $("#J_PlayProgress").css("width", 0);
      $("#J_PlayBarIcon").css("left", 0);
      $("#J_PlaySwitch").replaceClass(PLAY_CLASS, STOP_CLASS);
      player = null
    }
    return this
  }, getMusicInfo:function(id, callback) {
    S.io({type:"get", url:BASE_URL + id, dataType:"jsonp", success:function(data) {
      S.mix(musicInfo, data);
      musicInfo["id"] = id;
      callback()
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
    var elBar = $("#J_PlayProgress"), elNow = $("#J_CurrentTime"), elTotal = $("#J_TotalTime"), elDrag = $("#J_PlayBarIcon"), elList = $("#J_MusicItem" + musicInfo.id);
    var nowTime = this.progress(), totalTime = this.getTotalTime();
    var len = nowTime / totalTime * this.getWindowWidth();
    elBar.css({width:len});
    if(elList.length !== 0) {
      elList.children(".J_PlListBar").css({width:len})
    }
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
      player.currentTime = control;
      return this
    }else {
      return player.currentTime
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
      nextNode && nextNode.fire(Event.Gesture.doubleTap);
      if(self.isIOS()) {
        $("#J_PlaySwitch").removeClass(PLAY_CLASS).addClass(STOP_CLASS);
        return
      }
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
      prevNode && prevNode.fire(Event.Gesture.doubleTap);
      if(self.isIOS()) {
        $("#J_PlaySwitch").removeClass(PLAY_CLASS).addClass(STOP_CLASS);
        return
      }
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
  }, _bindProgressAnyPosition:function() {
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
    var localArr = localStorage.getItem(storageKey) ? localStorage.getItem(storageKey).split(",") : [];
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
    var self = this;
    $(".J_PlayTabIcon").on("click", function(e) {
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
    $(".J_MusicItem").each(function(v, index) {
      if(index === currentIdx) {
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
  }, addToList:function(songs) {
    if(!S.isArray(songs)) {
      songs = [songs]
    }
    var listLength = musicList.length, m, i;
    for(m = 0;m < songs.length;m++) {
      for(i = 0;i < listLength;i++) {
        if(musicList[i]["id"] === songs[m]["id"]) {
          break
        }
      }
      if(i === listLength) {
        if(songs[m]["location"]) {
          console.log(S.JSON.stringify(songs[m]));
          musicList.push(songs[m]);
          localStorage.setItem(storageKey, S.JSON.stringify(musicList))
        }else {
          var songId = songs[m]["id"];
          S.io({type:"get", url:BASE_URL + songId, dataType:"jsonp", success:function(data) {
            musicList.push({id:songId, title:data["title"], albumCover:data["albumCover"], location:data["location"]});
            localStorage.setItem(storageKey, S.JSON.stringify(musicList))
          }, error:function() {
            alert("error")
          }})
        }
      }
    }
  }, playSongNow:function(info) {
    var self = this;
    for(var i = 0;i < musicList.length;i++) {
      if(musicList[i]["id"] === info.id) {
        break
      }
    }
    if(i === musicList.length) {
      if(info["location"]) {
        musicInfo = info;
        musicList.push(S.clone(musicInfo));
        localStorage.setItem(storageKey, S.JSON.stringify(musicList));
        currentIdx = musicList.length - 1;
        self.playSong()
      }else {
        self.getMusicInfo(info.id, function() {
          musicList.push({id:musicInfo["id"], title:musicInfo["title"], albumCover:musicInfo["albumCover"], location:musicInfo["location"]});
          localStorage.setItem(storageKey, S.JSON.stringify(musicList));
          currentIdx = musicList.length - 1;
          self.playSong()
        })
      }
    }else {
      musicInfo = S.clone(musicList[i]);
      currentIdx = i;
      self.playSong()
    }
  }, playSong:function() {
    var self = this;
    if(!player) {
      player = new Audio;
      player.addEventListener("ended", function(e) {
        self._bringRest();
        self.playSongNow(musicList[(currentIdx + 1) % musicList.length]);
        self.updateMusicControl();
        self.updateMusicInfoTab();
        self.updateCurrentInMusicList()
      })
    }
    player.src = musicInfo["location"];
    player.load();
    player.play();
    S.Player.fire("playSong", {musicInfo:musicInfo})
  }, updateMusicControl:function() {
    var self = this;
    if(!player.paused) {
      $("#J_PlaySwitch").removeClass(STOP_CLASS).addClass(PLAY_CLASS);
      self._changeProgress();
      self.updateProgress()
    }else {
      $("#J_PlaySwitch").removeClass(PLAY_CLASS).addClass(STOP_CLASS);
      self._changeProgress()
    }
  }, updateMusicInfoTab:function() {
    $("#J_PlImg").attr("src", musicInfo.albumCover);
    header.setTitle(musicInfo.title)
  }, updateMusicListTab:function() {
    var self = this, htmlArray = [];
    for(var i = 0;i < musicList.length;i++) {
      htmlArray.push(S.substitute(LIST_TEMP_HTML, musicList[i]))
    }
    $("#J_PlMusicList").html(htmlArray.join(""));
    if(!scrollview) {
      scrollview = scrollview = (new ScrollView({srcNode:"#J_PlListTab", plugins:[new ScrollbarPlugin({})]})).render()
    }
    S.later(function() {
      scrollview.sync()
    }, 3E3);
    self._changeColor()
  }, _bindControl:function() {
    $("#J_PlaySwitch").detach("click").on("click", function(e) {
      var switcher = $("#J_PlaySwitch");
      if(switcher.hasClass(PLAY_CLASS) && player && !player.paused) {
        switcher.removeClass(PLAY_CLASS).addClass(STOP_CLASS);
        player.pause()
      }else {
        if(switcher.hasClass(STOP_CLASS) && player && player.paused) {
          switcher.removeClass(STOP_CLASS).addClass(PLAY_CLASS);
          player.play()
        }
      }
    })
  }, _bindPlayNext:function() {
    var self = this;
    $("#J_PlayNext").on("click", function(e) {
      e.halt();
      self._bringRest();
      self.playSongNow(musicList[(currentIdx + 1) % musicList.length]);
      self.updateMusicControl();
      self.updateMusicInfoTab();
      self.updateCurrentInMusicList()
    });
    return this
  }, _bindPlayPrev:function() {
    var self = this;
    $("#J_PlayLast").on("click", function(e) {
      e.halt();
      self._bringRest();
      self.playSongNow(musicList[(currentIdx + musicList.length - 1) % musicList.length]);
      self.updateMusicControl();
      self.updateMusicInfoTab();
      self.updateCurrentInMusicList()
    });
    return this
  }, _bringRest:function() {
    if(player) {
      player.pause();
      if(player.currentTime) {
        player.currentTime = 0
      }
      $("#J_CurrentTime").html("0:00");
      $("#J_TotalTime").html("0:00");
      $("#J_PlayProgress").css("width", 0);
      $("#J_PlayBarIcon").css("left", 0);
      $("#J_PlaySwitch").removeClass(PLAY_CLASS).addClass(STOP_CLASS)
    }
    return this
  }, updateCurrentInMusicList:function() {
    $("#J_MusicItem" + musicInfo.id).addClass(".is-playing").siblings().removeClass(".is-playing")
  }, _bindDoubleTap:function() {
    var self = this;
    Event.delegate("#J_PlMusicList", Event.Gesture.doubleTap, ".J_MusicItem", function(e) {
      var li = $(e.target), songId = li.attr("data-id");
      for(var i = 0;i < musicList.length;i++) {
        if(musicList[i]["id"] === songId) {
          self.playSongNow(musicList[i]);
          self.updateMusicControl();
          self.updateMusicInfoTab();
          self.updateCurrentInMusicList()
        }
      }
    })
  }});
  return re
}, {requires:["node", "./index", "event", "../header", "dd", "dd/plugin/constrain", "scrollview", "scrollview/plugin/scrollbar", "./player.css"]});

