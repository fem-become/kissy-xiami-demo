KISSY.add("xiami/transition/discover", function(S, Node, Event, Transition, header, DD, ScrollView, ScrollbarPlugin, IO, XTemplate, suspender, Shake) {
  var $ = Node.all, timer = null, scrollview = null, draggable = null, myName = this.getName(), el, mode = "radar", shaking = 0;
  var HTML = ['<div class="display-area">', '<div class="radar-area center">', '<ul class="switch-way J_Switch">', '<li class="active"></li>', "<li></li>", "</ul>", '<div class="panel J_RadarPanel">', '<canvas id="radar-canvas" class="opt-area"></canvas>', '<div class="radar">', '<div class="radar-bg"></div>', '<div class="radar-handler"></div>', "</div>", '<div id="message">', '<div class="mask"></div>', '<div class="result-msg">\u53d1\u73b015\u9996\u597d\u6b4c</div>', "</div>", "</div>", '<div class="panel J_ShakePanel" style="display:none;">', 
  '<div class="opt-area">', '<div class="battery-container">', '<div class="battery-energy"></div>', "</div>", '<div class="battery-anode"></div>', "</div>", "</div>", "</div><!-- end of .radar-area --\>", '<div class="songs-area center">', '<div class="songs-list J_SongsList">', '<div class="ks-scrollview-content ks-content">', '<ul class="unstyled">', "</ul>", "</div>", "</div>", "</div><!-- end of .songs-area --\>", "</div><!-- end of .display-area --\>", '<div class="illustration-area">', '<div class="radar-illustration center J_RadarIllus">', 
  "<h2>\u97f3\u4e50\u96f7\u8fbe</h2>", "<p>\u79fb\u52a8\u6ed1\u5757\uff0c\u6839\u636e\u60a8\u7684\u5fc3\u60c5\u53d1\u73b0\u97f3\u4e50</p>", "</div>", '<div class="radar-illustration center J_ShakeIllus" style="display: none;">', "<h2>\u97f3\u4e50\u6447\u6446\u5f15\u64ce</h2>", "<p>\u6447\u6eda\u4f60\u7684\u624b\u673a\uff0c\u6839\u636e\u8282\u594f\u53d1\u73b0\u597d\u97f3\u4e50</p>", "</div>", "</div><!-- end of .illustration-area --\>", '<script type="text/template" id="songs-list-tpl">', "{{#each songs}}", 
  '<li data-id="{{id}}">{{title}}<button class="play-btn"/><button class="addtolist-btn"/></li>', "{{/each}}", "<\/script>"].join("");
  var emotion = {sadness:[[{tag:"\u7ca4\u8bed", key:""}, {tag:"\u6c11\u8c23", key:""}, {tag:"\u4e94\u6708\u5929", key:""}], [{tag:"\u4f24\u611f", key:""}, {tag:"\u91d1\u5c5e", key:""}, {tag:"\u8f7b\u5feb", key:""}], [{tag:"\u52b1\u5fd7", key:""}, {tag:"\u6e29\u6696", key:""}, {tag:"\u5fe7\u4f24", key:""}], [{tag:"\u5409\u4ed6", key:""}, {tag:"\u6000\u65e7", key:""}, {tag:"\u7eaf\u97f3\u4e50", key:""}], [{tag:"\u6447\u6eda", key:""}, {tag:"\u6cbb\u6108", key:""}, {tag:"\u8212\u670d", key:""}]], happiness:[[{tag:"\u6768\u5b97\u7eac", 
  key:""}, {tag:"\u6df1\u60c5", key:""}, {tag:"\u6e05\u65b0", key:""}], [{tag:"\u8282\u594f", key:""}, {tag:"\u6175\u61d2", key:""}, {tag:"Rock", key:""}], [{tag:"\u7535\u5b50", key:""}, {tag:"\u94a2\u7434", key:""}, {tag:"\u97e9\u56fd", key:""}], [{tag:"\u5c0f\u63d0\u7434", key:""}, {tag:"\u7535\u97f3", key:""}, {tag:"\u60a0\u7136\u81ea\u5728", key:""}], [{tag:"\u7235\u58eb", key:""}, {tag:"\u6d41\u884c", key:""}, {tag:"\u8212\u7f13", key:""}]], calm:[[{tag:"\u6292\u60c5", key:""}, {tag:"Electronic", 
  key:""}, {tag:"\u8f7b\u97f3\u4e50", key:""}], [{tag:"Folk", key:""}, {tag:"Jazz", key:""}, {tag:"\u6797\u5fd7\u70ab", key:""}], [{tag:"\u5c0f\u6e05\u65b0", key:""}, {tag:"Adele", key:""}, {tag:"\u53e4\u98ce", key:""}], [{tag:"\u4e2d\u56fd\u6447\u6eda", key:""}, {tag:"\u6cbb\u6108\u7cfb", key:""}, {tag:"\u4e94\u6708\u5929", key:""}], [{tag:"\u7ca4\u8bed", key:""}, {tag:"\u6c11\u8c23", key:""}, {tag:"\u4e94\u6708\u5929", key:""}]], excite:[[{tag:"\u7235\u58eb", key:""}, {tag:"\u5c0f\u63d0\u7434", 
  key:""}, {tag:"\u8212\u7f13", key:""}], [{tag:"\u6797\u5fd7\u70ab", key:""}, {tag:"\u5c0f\u6e05\u65b0", key:""}, {tag:"Adele", key:""}], [{tag:"\u6d41\u884c", key:""}, {tag:"\u5409\u4ed6", key:""}, {tag:"\u8282\u594f", key:""}], [{tag:"\u91d1\u5c5e", key:""}, {tag:"\u6447\u6eda", key:""}, {tag:"\u52b2\u7206", key:""}], [{tag:"\u4e2d\u56fd\u6447\u6eda", key:""}, {tag:"\u7535\u97f3", key:""}, {tag:"Rock", key:""}]]};
  var rhythm = [{tag:"\u8212\u7f13"}, {tag:"\u7235\u58eb"}, {tag:"\u6292\u60c5"}, {tag:"\u6cbb\u6108"}, {tag:"\u6000\u65e7"}, {tag:"\u9648\u7eee\u8d1e"}, {tag:"\u6d41\u884c"}, {tag:"\u9648\u5955\u8fc5"}, {tag:"\u5409\u4ed6"}, {tag:"\u6175\u61d2"}, {tag:"\u8f7b\u5feb"}, {tag:"\u4e94\u6708\u5929"}, {tag:"Adele"}, {tag:"\u7535\u5b50"}, {tag:"\u4e2d\u56fd\u6447\u6eda"}, {tag:"Rock"}, {tag:"\u8282\u594f"}, {tag:"\u91d1\u5c5e"}];
  var TAG_URL = "http://test.fem.taobao.net:3000/song/tag/";
  return{init:function(cfg) {
    var self = this;
    if(!el) {
      el = $('<div class="mod-page"></div>').appendTo(body);
      el.html(HTML);
      self._drawCanvas();
      self._bindEvent();
      S.log("discover music is new")
    }else {
      S.log("discover music is coming again")
    }
    var headerEl = header.getHeader("discover");
    if(!headerEl.contents().length) {
      headerEl.html('<h1>\u53d1\u73b0\u97f3\u4e50</h1><a href="#" class="list-icon icon">\u5217\u8868</a><a href="#" class="search-icon icon">\u641c\u7d22</a>')
    }else {
      header.setTitle("\u53d1\u73b0\u97f3\u4e50")
    }
    suspender.setCurrentMod(myName)
  }, getEl:function() {
    return el
  }, _drawCanvas:function() {
    var canvas = S.one("#radar-canvas"), cxt = canvas[0].getContext("2d");
    width = canvas.width(), height = canvas.height(), LINE_WIDTH = 2, PADDING = 5, COLOR = "#FFF";
    function init() {
      S.one(canvas).attr("width", width).attr("height", height);
      cxt.strokeStyle = COLOR;
      cxt.fillStyle = COLOR;
      cxt.lineWidth = LINE_WIDTH
    }
    function draw() {
      cxt.shadowColor = "#8999b4";
      cxt.shadowBlur = 0;
      cxt.shadowOffsetX = 0;
      cxt.shadowOffsetY = -2;
      cxt.beginPath();
      cxt.moveTo(PADDING, height / 2);
      cxt.lineTo(width - PADDING, height / 2);
      cxt.stroke();
      cxt.shadowOffsetX = 2;
      cxt.shadowOffsetY = 0;
      cxt.beginPath();
      cxt.moveTo(width / 2, PADDING);
      cxt.lineTo(width / 2, height - PADDING);
      cxt.stroke();
      cxt.shadowOffsetX = cxt.shadowOffsetY = 0;
      cxt.font = "16px Times New Roman";
      cxt.fillText("\u5fe7\u4f24", PADDING, height / 2 - LINE_WIDTH * 3);
      cxt.textAlign = "right";
      cxt.fillText("\u5feb\u4e50", width - PADDING, height / 2 - LINE_WIDTH * 3);
      cxt.fillText("\u5e73\u9759", width / 2 - LINE_WIDTH * 2, PADDING + 14);
      cxt.fillText("\u6fc0\u52a8", width / 2 - LINE_WIDTH * 2, height - PADDING * 2)
    }
    init();
    draw()
  }, _recommendSongsByRadar:function(position) {
    var self = this, canvas = S.one("#radar-canvas"), w = canvas.width(), h = canvas.height(), PADDING = 5, x = position.x, y = position.y, coorX = x - w / 2, coorY = y - h / 2, intervalX = w / 2 / 5, intervalY = h / 2 / 5, idxX = Math.floor(Math.abs(coorX) / intervalX), idxY = Math.floor(Math.abs(coorY) / intervalY);
    var xArray = coorX < 0 ? emotion["sadness"][idxX] : emotion["happiness"][idxX], yArray = coorY < 0 ? emotion["excite"][idxY] : emotion["calm"][idxY];
    var xTag = xArray[Math.floor(Math.random() * xArray.length)], yTag = yArray[Math.floor(Math.random() * yArray.length)];
    var received = false, songs = [];
    new IO({type:"GET", url:TAG_URL + xTag["tag"], dataType:"jsonp", crossDomain:true, complete:function(response, textStatus, xhrObj) {
      if(textStatus == "success" && response.songs) {
        songs = songs.concat(response.songs);
        if(received) {
          self._showResult(songs)
        }else {
          received = true
        }
      }
    }});
    new IO({type:"GET", url:TAG_URL + yTag["tag"], dataType:"jsonp", crossDomain:true, complete:function(response, textStatus, xhrObj) {
      if(textStatus == "success" && response.songs) {
        songs = songs.concat(response.songs);
        if(received) {
          self._showResult(songs)
        }else {
          received = true
        }
      }
    }})
  }, _updateEnergy:function(e) {
    var energy = S.one(".battery-energy"), anode = S.one(".battery-anode"), count = e.count, time = e.time, speed = time / count, ratio = speed < 200 ? 1 : speed > 600 ? 0 : 1.5 - speed / 400;
    shaking = 1;
    energy.css("width", ratio * 100 + "%");
    ratio === 1 ? anode.css("background", "#90d5fe") : anode.css("background", "#cad0d3");
    return ratio
  }, _recommendSongsByShake:function(e) {
    var self = this, energy = S.one(".battery-energy"), anode = S.one(".battery-anode");
    var ratio = self._updateEnergy(e), idx = Math.floor(ratio * rhythm.length);
    if(idx === rhythm.length) {
      idx = rhythm.length - 1
    }
    new IO({type:"GET", url:TAG_URL + rhythm[idx]["tag"], dataType:"jsonp", crossDomain:true, complete:function(response, textStatus, xhrObj) {
      if(textStatus == "success" && response.songs) {
        var html = (new XTemplate(S.one("#songs-list-tpl").html())).render({songs:response.songs});
        S.one(".J_SongsList").one("ul").html(html).end().show();
        scrollview.show().sync();
        shaking = 0
      }
    }})
  }, _updateMsgPosition:function() {
    var MASK_WIDTH = 35, INTERVAL = 5, canvas = S.one("#radar-canvas"), canvasWidth = canvas.width(), canvasHeight = canvas.height(), radar = S.one(".radar"), pos = radar.offset(), posL = pos.left - S.one(".J_RadarPanel").offset().left, posT = pos.top - S.one(".J_RadarPanel").offset().top, radarWidth = radar.width(), radarHeight = radar.height(), msg = S.one("#message"), mEdgeS = Math.min(msg.width(), msg.height()), mEdgeL = Math.max(msg.width(), msg.height()), overlap = MASK_WIDTH - INTERVAL, left = 
    0, top = 0;
    if(posL + radarWidth + mEdgeS - overlap < canvasWidth && posT >= 0 && posT + radarHeight < canvasHeight) {
      msg.addClass("right");
      left = posL + radarWidth - overlap;
      top = posT
    }else {
      if(posL - mEdgeS + overlap > 0 && posT >= 0 && posT + radarHeight < canvasHeight) {
        msg.addClass("left");
        left = posL - mEdgeS + overlap;
        top = posT
      }else {
        if(posT + radarHeight + mEdgeS - overlap < canvasHeight && posL >= 0 && posL + radarWidth < canvasWidth) {
          msg.addClass("bottom");
          left = posL;
          top = posT + radarHeight - overlap
        }else {
          if(posT - mEdgeS + overlap > 0 && posL >= 0 && posL + radarWidth < canvasWidth) {
            msg.addClass("top");
            left = posL;
            top = posT - mEdgeS + overlap
          }else {
            if(posL < canvasWidth / 2 && posT < canvasHeight / 2) {
              msg.addClass("lefttop").addClass("right");
              left = posL + radarWidth - overlap;
              top = posT
            }else {
              if(posL > canvasWidth / 2 && posT < canvasHeight / 2) {
                msg.addClass("righttop").addClass("left");
                left = posL - mEdgeS + overlap;
                top = posT
              }else {
                if(posL < canvasWidth / 2 && posT > canvasHeight / 2) {
                  msg.addClass("leftbottom").addClass("right");
                  left = posL + radarWidth - overlap;
                  top = posT
                }else {
                  if(posL > canvasWidth / 2 && posT > canvasHeight / 2) {
                    msg.addClass("rightbottom").addClass("left");
                    left = posL - mEdgeS + overlap;
                    top = posT
                  }
                }
              }
            }
          }
        }
      }
    }
    msg.css({left:left + "px", top:top + "px"})
  }, _randomSort:function(a, b) {
    return Math.random() > 0.5 ? -1 : 1
  }, _showResult:function(songs) {
    var self = this, html = (new XTemplate(S.one("#songs-list-tpl").html())).render({songs:songs.sort(self._randomSort)});
    S.one(".J_SongsList").one("ul").html(html).end().show();
    scrollview.show().sync();
    var self = this, radar = S.one(".radar"), msg = S.one("#message");
    msg.attr("class", "");
    radar.removeClass("detecting");
    clearTimeout(timer);
    self._updateMsgPosition();
    msg.one(".result-msg").text("\u53d1\u73b0" + songs.length + "\u9996\u597d\u6b4c");
    msg.show();
    draggable.set("disabled", false)
  }, _bindEvent:function() {
    var self = this, radar = S.one(".radar"), light = S.one(".radar-bg"), handler = S.one(".radar-handler"), msg = S.one("#message");
    draggable = new DD.Draggable({node:".radar", handlers:[".radar-handler"], move:true});
    var deg = 5, startRotate = function() {
      light.css({"-webkit-transform":"rotate(" + deg % 360 + "deg)", "-moz-transform":"rotate(" + deg % 360 + "deg)", transform:"rotate(" + deg % 360 + "deg)"});
      deg += 30;
      timer = setTimeout(startRotate, 100)
    };
    draggable.on("dragstart", function(e) {
      msg.hide();
      radar.removeClass("active")
    });
    draggable.on("dragend", function(e) {
      var pos = radar.offset(), posL = pos.left - S.one(".J_RadarPanel").offset().left, posT = pos.top - S.one(".J_RadarPanel").offset().top, width = radar.width(), height = radar.height();
      radar.addClass("active").addClass("detecting");
      draggable.set("disabled", true);
      startRotate();
      self._recommendSongsByRadar({x:posL + width / 2, y:posT + height / 2})
    });
    scrollview = (new ScrollView({srcNode:".songs-list", plugins:[new ScrollbarPlugin({})]})).render();
    S.one(".J_SongsList").hide();
    var shakePanel = S.one(".J_ShakePanel"), radarPanel = S.one(".J_RadarPanel"), shakeIllus = S.one(".J_ShakeIllus"), radarIllus = S.one(".J_RadarIllus"), switcher = S.one(".J_Switch"), panelWidth = radarPanel.width(), panelHeight = radarPanel.height(), switchToShake = function() {
      shakePanel.show();
      shakeIllus.show();
      radarIllus.hide();
      radarPanel.animate({left:panelWidth}, 0.5, undefined, function() {
        shakePanel.css("top", 0)
      });
      shakePanel.animate({left:0}, 0.5, undefined, function() {
        radarPanel.hide().css("top", 0)
      });
      switcher.all("li").item(1).addClass("active").siblings().removeClass("active");
      S.one(".J_SongsList").one("ul").empty().end().hide();
      mode = "shake"
    }, switchToRadar = function() {
      radarPanel.show();
      shakePanel.css("top", -panelHeight + "px");
      shakeIllus.hide();
      radarIllus.show();
      shakePanel.animate({left:panelWidth}, 0.5, undefined, function() {
        radarPanel.css("top", 0)
      });
      radarPanel.animate({left:0}, 0.5, undefined, function() {
        shakePanel.hide().css("top", -panelHeight + "px")
      });
      switcher.all("li").item(0).addClass("active").siblings().removeClass("active");
      S.one(".J_SongsList").one("ul").empty().end().hide();
      mode = "radar"
    };
    shakePanel.css({top:-panelHeight + "px", left:panelWidth});
    var shake = new Shake;
    Event.on(".display-area", "swipe", function(e) {
      if(mode === "radar" && e.direction === "left") {
        switchToShake();
        shake.start()
      }else {
        if(mode === "shake" && e.direction === "right") {
          switchToRadar();
          shake.stop()
        }else {
          if(e.direction === "up") {
            window.scrollBy(0, 100)
          }else {
            if(e.direction === "down") {
              window.scrollBy(0, -100)
            }
          }
        }
      }
    });
    shake.on("shakestart", function(e) {
      if(shaking === 0) {
        var energy = S.one(".battery-energy"), anode = S.one(".battery-anode");
        energy.css("width", "0");
        anode.css("background", "#cad0d3")
      }
      shaking = shaking ^ 1
    });
    shake.on("shaking", function(e) {
      if(shaking === 1) {
        self._updateEnergy(e)
      }
    });
    shake.on("shakeend", function(e) {
      if(shaking === 1) {
        self._recommendSongsByShake.call(self, e)
      }
    });
    Event.delegate(".J_SongsList", "click", ".play-btn", function(e) {
      var target = S.one(e.target);
      suspender.playOne({id:target.parent("li").attr("data-id")})
    });
    Event.delegate(".J_SongsList", "click", ".addtolist-btn", function(e) {
      var target = S.one(e.target), songId = target.parent("li").attr("data-id");
      suspender.addToList({id:songId})
    });
    S.one(".J_Switch").all("li").each(function(li, idx) {
      if(idx == 0) {
        li.on(Event.Gesture.tap, function() {
          switchToRadar()
        })
      }else {
        li.on(Event.Gesture.tap, function() {
          switchToShake()
        })
      }
    })
  }}
}, {requires:["node", "event", "./index", "../header", "dd", "scrollview", "scrollview/plugin/scrollbar", "ajax", "xtemplate", "../suspender", "./shake", "./discover.css"]});

