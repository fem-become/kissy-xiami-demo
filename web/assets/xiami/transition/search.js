KISSY.add("xiami/transition/search", function(S, Node, Transition, Event, header, suspender, Overlay, ScrollView, ScrollbarPlugin) {
  var $ = Node.all, el, list, myName = this.getName(), body = $("#body"), headerEl = header.getHeader(myName), pid = 0;
  var Album = {pop:null, pageName:null};
  var searchTPL = '<input type="text" id="J_searchContent" class="search-txt"/>' + '<input type="button" id="J_search" value="" class="search-btn"/>' + '<div class="album-loading" style="height: 60px;background-image: none;">' + '<ul class="album-list J_searchResult"></ul>' + "</div>";
  return{init:function(config) {
    var _this = this;
    header.setTitle("");
    if(config.id != pid) {
      if(!el) {
        el = $('<div class="mod-page"></div>').appendTo(body);
        $(searchTPL).appendTo(el)
      }
      list = $(".J_searchResult");
      header.setTitle("\u6b4c\u66f2\u641c\u7d22");
      $("#J_search").on(Event.Gesture.tap, function() {
        var text = $("#J_searchContent").val();
        _this.fetchData(text)
      })
    }else {
      header.setTitle(Album.pageName)
    }
    if(!headerEl.contents().length) {
      headerEl.append(myName)
    }
    suspender.setCurrentMod(myName);
    $(".do-search").hide();
    S.Player = new S.Base;
    S.Player && S.Player.on("go-back", function() {
      $(".do-search").show()
    })
  }, getEl:function() {
    return el
  }, fetchData:function(key) {
    var _this = this;
    S.IO({dataType:"jsonp", url:"http://test.fem.taobao.net:3000/search/suggest/" + key, success:function(data) {
      var _html = "", list_songs = data["songs"];
      _html += '<div class="album-list-count song-count">\u5171' + list_songs.length + "\u9996\u6b4c\u66f2</div>";
      for(var i = 0;i < list_songs.length;i++) {
        var temp_list = _this.getListTemplate();
        temp_list = temp_list.replace(new RegExp("{{song_id}}", "gi"), list_songs[i]["id"]);
        temp_list = temp_list.replace(new RegExp("{{title}}", "gi"), list_songs[i]["title"]);
        _html += temp_list
      }
      _html += "</ul>";
      list.html(_html);
      list.all(".J_album_play").on(Event.Gesture.tap, function() {
        var pid = $(this).attr("data-id");
        pid = pid.replace("http://www.xiami.com/song/", "");
        suspender.playOne({id:pid})
      });
      list.all(".J_album_add_list").on(Event.Gesture.tap, function(e) {
        var song_id = $(e.target).attr("data-id");
        song_id.replace("http://www.xiami.com/song/", "");
        suspender.addToList({id:song_id})
      });
      Album.pageName = data["title"];
      header.setTitle(Album.pageName)
    }})
  }, getListTemplate:function() {
    var _html = ["<li>", "<h3>{{title}}</h3>", '<div class="album-btn-group">', '<button class="J_album_play play inline" data-id="{{song_id}}">&nbsp;</button>', '<button class="J_album_add_list list inline" data-id="{{song_id}}">&nbsp;</button>', "</div>", "</li>"].join("");
    return _html
  }}
}, {requires:["node", "./index", "event", "../header", "../suspender", "overlay", "scrollview", "scrollview/plugin/scrollbar", "./album.css", "./search.css"]});

