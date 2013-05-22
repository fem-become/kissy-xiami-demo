KISSY.add(function(S, Node, Transition, Event, header, suspender, Overlay, ScrollView, ScrollbarPlugin) {

    var $ = Node.all,
        el,
        myName = this.getName(),
        body = $("#body"),
        headerEl = header.getHeader(myName),
        pid = 0;
    var Album = { pop: null, pageName: null };

    return {

        init: function(config) {
            var _this = this;
            header.setTitle(''); 
            
            if(config.id != pid){
                el = $('<div class="mod-page"><div class="album-loading"></div></div>').appendTo(body);
                header.setTitle("loading...");
                _this.fetchData(config);
            } else {
                header.setTitle(Album.pageName);
            }
            
            if (!headerEl.contents().length) {
                headerEl.append(myName);
            }
            suspender.setCurrentMod(myName);
        },

        getEl: function() {
            return el;
        },

        fetchData: function(config){
            var _this = this;
            pid = config.id;
            S.IO({
                dataType: 'jsonp',
                url: 'http://test.fem.taobao.net:3000/album/' + config.id,
                success: function(data){
                    var _html       = _this.getTemplate(), 
                        _list_html  = '',
                        list_songs  = data['songs'],
                        albumCover = data['img'];
                    //渲染主页面
                    _html = _html.replace(new RegExp('\{\{album_id\}\}', 'gi'), data['id']);
                    _html = _html.replace(new RegExp('\{\{author\}\}', 'gi'), data['artist'].title);
                    _html = _html.replace(new RegExp('\{\{desc\}\}', 'gi'), data['desc']);
                    _html = _html.replace(new RegExp('\{\{img\}\}', 'gi'), data['img']);
                    _html = _html.replace(new RegExp('\{\{list_count\}\}', 'gi'), list_songs.length);

                    _html += '<ul class="album-list">';
                    for( var i = 0; i < list_songs.length; i ++){
                        var temp_list = _this.getListTemplate();
                        temp_list = temp_list.replace(new RegExp('\{\{song_id\}\}', 'gi'), list_songs[i]['id']);
                        temp_list = temp_list.replace(new RegExp('\{\{song_location\}\}', 'gi'), list_songs[i]['location']);
                        temp_list = temp_list.replace(new RegExp('\{\{title\}\}', 'gi'), list_songs[i]['title']);
                        temp_list = temp_list.replace(new RegExp('\{\{hot\}\}', 'gi'), list_songs[i]['hot']);
                        _html += temp_list;
                    }
                    _html += '</ul>';
                    el.html(_html);

                    // 点击播放
                    el.all('.J_album_play').on(Event.Gesture.tap, function() {
                        var target = $(this),
                            song_id = target.attr('data-id'),
                            location = target.attr('data-location'),
                            title = target.parent('li').one('.album-title').text(),
                            cover = albumCover;
                        suspender.playOne({'id':song_id,'location':location,'albumCover': cover,'title':title});
                    });

                    // 点击加入播放列表
                    el.all('.J_album_add_list').on(Event.Gesture.tap, function(e){
                        var target = $(this),
                            song_id = target.attr('data-id'),
                            location = target.attr('data-location'),
                            title = target.parent('li').one('.album-song-title').text(),
                            cover = albumCover;
                        suspender.addToList({'id':song_id,'location':location,'albumCover': cover,'title':title});
                    });

                    // 点击简介 弹框显示全部内容
                    el.all('.J_album_desc').on(Event.Gesture.tap, function(){
                        _this.getAlbumDescPopup(data);
                    });

                    // 整张专辑加入播放列表
                    el.all('.J_album_add_list_all').on(Event.Gesture.tap, function(e){
                        var songs = [];
                        for(var i = 0; i < list_songs.length; i++){
                            songs.push(list_songs[i]['id']);
                        }
                        suspender.addToList(songs);
                    });
                    Album.pageName = data['title'];
                    header.setTitle(Album.pageName);   
             
                }
            });
        },

        getTemplate: function(){
            var _html = [
                '<div class="album-title">',
                    '<div class="album-img"><img src="{{img}}"></div>',
                    '<div class="album-info album-inline">',
                        '<h3>{{author}}</h3>',
                        '<div class="album-desc J_album_desc">{{desc}}</div>',
                        '<div class="album-control">',
                            '<button class="play inline">&nbsp;</button>',
                            '<button class="list inline J_album_add_list_all">&nbsp;</button>',
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
                    '<h3 class="album-song-title">{{title}}</h3>',
                    '<div class="album-btn-group">',
                        '<button class="J_album_play play inline" data-id="{{song_id}}" data-location="{{song_location}}">&nbsp;</button>',
                        '<button class="J_album_add_list list inline" data-id="{{song_id}}" data-location="{{song_location}}">&nbsp;</button>',
                    '</div>',
                '</li>'
            ].join('');
            return _html;
        },

        getAlbumDescPopup: function(data){
            if(Album.pop){
                return false;
            }
            var _html = [
                '<dl class="desc-container">',
                    '<dt class="desc-header">',
                        '<h4 class="title">{{title}}</h4>',
                        '<h4 class="article">{{author}}</h4>',
                    '</dt>',
                    '<dd class="desc"><div class="ks-scrollview-content ks-content">{{desc}}</div></dd>',
                '</dl>',
                '<i class="J_close album-close">×</i>'
            ].join('');

            _html = _html.replace(new RegExp('\{\{title\}\}', 'gi'), data['title']);
            _html = _html.replace(new RegExp('\{\{desc\}\}', 'gi'), data['desc']);
            _html = _html.replace(new RegExp('\{\{author\}\}', 'gi'), data['artist'].title);
          


          //alert('!!');
            var cfg = {
                width: document.documentElement.clientWidth*0.98,
                height: (document.documentElement.clientHeight - $('#suspender').outerHeight() - document.documentElement.clientHeight * 0.05 - 20)*0.98,
                closeable: true,
                align: {
                    points: ['tc','tc']
                },
                content: _html,
                elCls: 'album-popup'
            };

            Album.pop = new Overlay(cfg);
            Album.pop.on('afterRenderUI',function(){
                (function(){
                    var _descHeight     = Album.pop.get('el').all('.desc').height();
                        _titleHeight    = Album.pop.get('el').all('dt').height();
                        _contentHeight  = Album.pop.get('el').height();
                    
                        if(_descHeight > _contentHeight - 80 - _titleHeight );
                        Album.pop.get('el').all('.desc').css('height', (_contentHeight - _titleHeight - 80) + 'px');

                    var scrollview = new ScrollView({
                            srcNode: Album.pop.get('el').all('.desc'),
                            plugins: [new ScrollbarPlugin({})]
                        }).render();
                })();

                Album.pop.get('el').all('.J_close').on('click', function(){
                    Album.pop.get('el').remove();
                    Album.pop = null;
                });
            });

            Album.pop.render().show();
        }

    };

}, {
    requires: ["node", "./index", "event", "../header","../suspender", 'overlay', 'scrollview', 'scrollview/plugin/scrollbar','./album.css']
});

