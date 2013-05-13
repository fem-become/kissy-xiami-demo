KISSY.add(function(S, Node, Transition, Event, header) {

  var $ = Node.all;
  var el;
  var myName = this.getName();
  var body = $("#body");

  return {

    init: function(config) {
      var _this = this;
      if (!el) {
        el = $('<div class="mod-page">loading...</div>').appendTo(body);
        //el.html('<button id="J_Play">play music</button><button id="J_AlbumBack">back to list</button><div id="J_AlbumId"></div>');
        //el.html(this.getTemplate());
        _this.fetchData(config);
        // el.one('#J_AlbumBack').on(Event.Gesture.tap, function() {
        //   Transition.backward(myName, 'xiami/transition/albums');
        // });
        S.log(myName + ' is new');
      } else {
        S.log(myName + ' is coming again');
      }

      //el.one("#J_AlbumId").html('album id123:' + config.id);
      //获取列表
      

      var headerEl=header.getHeader(myName);
      if (!headerEl.contents().length) {
        headerEl.append(myName);
      }
    },

    getEl: function() {
      return el;
    },

    fetchData: function(config){
      var _this = this;
      S.IO({
        dataType: 'jsonp',
        url: 'http://test.fem.taobao.net:3000/album/' + config.id,
        success: function(data){
          var _html       = _this.getTemplate(), 
              _list_html  = '',
              list_songs  = data['songs'];
          //渲染主页面
          _html = _html.replace(new RegExp('\{\{album_id\}\}', 'gi'), data['id']);
          _html = _html.replace(new RegExp('\{\{title\}\}', 'gi'), data['title']);
          _html = _html.replace(new RegExp('\{\{desc\}\}', 'gi'), data['desc']);
          _html = _html.replace(new RegExp('\{\{img\}\}', 'gi'), data['img']);
          _html = _html.replace(new RegExp('\{\{list_count\}\}', 'gi'), list_songs.length);

          _html += '<ul class="album-list">';
          for( var i = 0; i < list_songs.length; i ++){
            var temp_list = _this.getListTemplate();
            temp_list = temp_list.replace(new RegExp('\{\{song_id\}\}', 'gi'), list_songs[i]['id']);
            temp_list = temp_list.replace(new RegExp('\{\{title\}\}', 'gi'), list_songs[i]['title']);
            temp_list = temp_list.replace(new RegExp('\{\{hot\}\}', 'gi'), list_songs[i]['hot']);
            _html += temp_list;
          }
          _html += '</ul>';
          el.html(_html);

          // 点击播放
          el.all('.J_album_play').on(Event.Gesture.tap, function() {
              var pid = $(this).attr('data-id');
              Transition.forward(myName, 'xiami/transition/player');
          });
        }
      });
    },

    getTemplate: function(){
      var _html = [
        '<div class="album-title">',
            '<div class="album-img"><img src="{{img}}"></div>',
            '<div class="album-info album-inline">',
                '<h3>{{title}}</h3>',
                '<div class="album-desc">{{desc}}</div>',
                '<div class="album-control">',
                    '<button class="play inline">播放</button>',
                    '<button class="list inline">加入收藏</button>',
                '</div>',
            '</div>',
            '<div class="album-list-count">{{list_count}}首歌曲</div>',
        '</div>'
      ].join('');
      return _html;
    },

    getListTemplate: function(){
      var _html = [
            '<li>',
                '<h3>{{title}}</h3>',
                '<div class="album-btn-group">',
                    '<button class="J_album_play play inline" data-id="{{song_id}}">播放</button>',
                    '<button class="J_album_add_list list inline" data-id="{{song_id}}">加入播放列表</button>',
                '</div>',
            '</li>'
      ].join('');
      return _html;
    }

  };

}, {
  requires: ["node", "./index", "event", "../header"]
});

