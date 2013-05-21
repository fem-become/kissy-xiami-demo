KISSY.add(function (S, Node, IO, XTemplate, Transition, Event, Slide, header, suspender) {

  var $ = Node.all;
  var el;
  var myName=this.getName();
  var body=$('#body');


  if (!localStorage.getItem("MUSIC_LIST")) {
    var test = [12345, 11024, 11020, 11026, 12024];
    localStorage.setItem('MUSIC_LIST', test.toString());
  }

  (function() {
    // Init Cat Event.
    $("#cat li").on(Event.Gesture.tap, function(e) {
      switch (e.currentTarget.className) {
        case "s1":
          // Transition.forward(myName, "xiami/transition/home");
          break;
        case "s2":
          alert("// TODO");
          break;
        case "s3":
          alert("// TODO");
          break;
        case "s4":
          alert("// TODO");
          break;
        case "s5":
          $("#page").removeClass("cat-show");
          $("#cat").hide();
          Transition.forward(myName, "xiami/transition/discover");
          break;
      }
    });

    // Swipe Event.
    // $("body").on("swipe", function(e) {
    //   if (e.direction != "right") return;
    //   // console.log(e.distance, e.duration);
    // });

    return;

    var x = 0;
    var pEl = $("#page");
    pEl.on("mousedown", function(e) {
      x = e.pageX;
      pEl.on("mousemove", function(e) {
        var diff = e.pageX - x;
        if (diff < 0) return;
        if (diff > 260) return;
        $("#cat").show();
        pEl.css("-webkit-transition", "0ms");
        pEl.css("transition", "0ms");
        pEl.css("-webkit-transform", "translate3d("+diff+"px, 0, 0)");
      });
    });
    pEl.on("mouseup", function() {
      pEl.detach("mousemove");
      pEl.css("-webkit-transition", "300ms");
      pEl.css("transition", "300ms");
      if (x > 200) {
        pEl.css("-webkit-transform", "translate3d(260px, 0, 0)");
      } else {
        pEl.css("-webkit-transform", "translate3d(0, 0, 0)");
        setTimeout(function() {
          $("#cat").hide();
        }, 400);
      }
      x = 0;
    });
    
  })();

  var TPL_promotion =
      '<div id="J_promotion_slider" class="promotion_slider">'+
          '<ul class="tab-nav clearfix">'+
            '<li></li>'+
            '<li class="selected"></li>'+
            '<li></li>'+
            '<li></li>'+
          '</ul>'+
        '<div class="tab-content clearfix">'+
          '{{#each data}}'+'<div class="tab-pannel hidden">'+
            '<a href="#"><img src="{{img}}" alt="img"></a>'+
            '</div>'+'{{/each}}'+
        '</div>';

  var TPL_hotAlbums =
      '<div class="hot-albums blocks J_hotAlbums">'+
          '<div class="block-title">'+
              '<h2>推荐专辑</h2>'+
              '<a href="#" class="icon">....</a>'+
          '</div>'+
          '<ul class="albums-items">'+
          '{{#each data}}'+'<li class="log url albums-item" data-url="{{id}}">'+
                  '<img alt="{{title}}" src="{{img}}">'+
                      '<div class="info">'+
                          '<span class="title">{{title}}</span>'+
                      '</div>'+
                  '</li>'+'{{/each}}'+
          '</ul></div>';

  var TPL_hotStyle =
      '<div class="blocks hot-styles">'+
          '<div class="block-title ">'+
              '<h2>热门风格</h2>'+
              '<a href="#" class="icon">....</a>'+
          '</div>'+
          '<ul class="style-items" url-id={{id}}>'+
            '{{#each data}}'+'<li>{{name}}</li>'+'{{/each}}'+
          '</ul>'+
      '</div>';

  var TPL_collect =
      '<div class="blocks collect">'+
          '<div class="block-title ">'+
              '<h2>精选集推荐</h2>'+
              '<a href="#" class="icon">....</a>'+
          '</div>'+
          '{{#each data}}'+'<div class="collect_item {{#if xindex%2 !== 0}}right{{/if}}">'+
              '<p class="cover">'+
                  '<span>'+
                      '<a href="{{id}}" title="{{title}}">'+
                          '<img src="{{img}}" alt="{{title}}">'+
                          '</a>'+
                      '</span>'+
                  '</p>'+
                  '<div class="collect_main">'+
                      '<strong class="collect_title">'+
                          '<a href="{{id}}" title="{{title}}">{{title}}</a>'+
                      '</strong>'+
                      '<p class="num">25首精选</p>'+
                      '<p class="brief">{{des}}</p>'+
                      '<a class="play big-icon"></a>'+
                      '<a class="add-list icon"></a>'+
                  '</div>'+
              '</div>'+'{{/each}}'+
          '</div>';

  var TPL_Song =
      '<div class="blocks song">'+
          '<div class="block-title">'+
              '<h2>推荐金曲</h2>'+
              '<a href="#" class="icon">....</a>'+
          '</div>'+
          '<ul class="song-list J_songList">'+
          '{{#each data}}'+'<li>'+
            '<a>{{title}}</a>'+
            '<a class="play icon" song-id ="{{id}}"></a>'+
            '<a class="add-list icon" song-id ="{{id}}"></a>'+
          '</li>'+'{{/each}}'+
      '</ul></div>';



    var data = {
        promotion :[{
            "id":"123",
            "img":"http://img.xiami.com/images/common/promotion/13668928395959.gif"
        },{
            "id":"234",
            "img":"http://img.xiami.com/images/common/promotion/13668930421433.gif"
        },{
            "id":"",
            "img":"http://img.xiami.com/images/common/uploadpic/76/13545037766588.jpg"
        },{
            "id":"",
            "img":"http://img.xiami.com/images/common/promotion/13668929958435.jpg"
        }],
        hotAlbums:[
        {
            "id": "763919549",
            "title": "初.爱",
            "artist": {
                "id": "7319",
                "title": "杨宗纬"
            },
            "img": "http://img.xiami.com/./images/album/img19/7319/7639195491364525725_1.jpg",
            "company": "环球唱片",
            "pub": "2013年03月",
            "des": "有时活得很复杂 有时唱得很感慨&nbsp;\r\n这一次 只想找回音乐的「初.爱」……&nbsp;\r\n只有自己懂得的..."
        },
        {
            "id": "2064478588",
            "title": "我是歌手第一季 半决赛",
            "artist": {
                "id": "127544",
                "title": "我是歌手"
            },
            "img": "http://img.xiami.com/./images/album/img87/478587/4785871364478587_1.jpg",
            "company": "湖南卫视",
            "pub": "2013年04月",
            "des": "半决赛不介入淘汰制，而是将选票计入总决赛成绩的40%（选票依旧单投）"
        },
        {
            "id": "406532",
            "title": "夜的钢琴曲 Demo集",
            "artist": {
                "id": "77201",
                "title": "石进"
            },
            "img": "http://img.xiami.com/./images/album/img1/77201/4065321287132984_1.jpg",
            "company": "独立发行",
            "pub": "2009年06月",
            "des": "从2006年开始，历时3年半，共31首。首首都是不同的心情，记录着一个又一个夜晚，欢乐的、忧伤的、难过的、当然也包括幸福的。\r\n不知道多少个..."
        },
        {
            "id": "414285",
            "title": "Everything in the World",
            "artist": {
                "id": "78980",
                "title": "曲婉婷"
            },
            "img": "http://img.xiami.com/./images/album/img80/78980/4142851346074714_1.jpg",
            "company": "Nettwerk",
            "pub": "2012年04月",
            "des": "曲婉婷Wanting 首张正式个人创作专辑，在2012年4月24日于北美发行，2012年8月初由环球唱片发行亚洲特别版。虾米同时收录两个版本..."
        },
        {
            "id": "1765561490",
            "title": "陪我去流浪",
            "artist": {
                "id": "79332",
                "title": "阿悄"
            },
            "img": "http://img.xiami.com/./images/album/img32/79332/17655614901365561490_1.jpg",
            "company": "海蝶音乐",
            "pub": "2013年04月",
            "des": "内地90后小花旦——“文艺莎”阿悄，从只闻其声不见其人的幕后合唱者，成为拥有新生代歌手与MV..."
        },
        {
            "id": "577206",
            "title": "因你而在",
            "artist": {
                "id": "615",
                "title": "林俊杰"
            },
            "img": "http://img.xiami.com/./images/album/img15/615/5772061362987839_1.jpg",
            "company": "华纳唱片",
            "pub": "2013年03月",
            "des": "「这张专辑属于你们，没有你们就没有我。\r\n我，林俊杰，因你而在。」\r\n&nbsp;\r\n10年前写下的 10年后成为故事\r\nJJ林俊杰 因你而..."
        }
        ],
        hotStyles:[{
            "id":"123456",
            "name":"流行"
        },{
            "id":"123456",
            "name":"摇滚"
        },{
            "id":"123456",
            "name":"民谣"
        },{
            "id":"123456",
            "name":"中国风"
        },{
            "id":"123456",
            "name":"蓝调"
        },{
            "id":"123456",
            "name":"慢摇"
        },{
            "id":"123456",
            "name":"民歌"
        },{
            "id":"123456",
            "name":"清心"
        },{
            "id":"123456",
            "name":"寂寞"
        },{
            "id":"123456",
            "name":"幸福"
        },{
            "id":"123456",
            "name":"浪漫"
        },{
            "id":"123456",
            "name":"安静"
        }],
        collect:[
            {
                "id": "466359345",
                "title": "All Around Us",
                "artist": {
                    "id": "7390",
                    "title": "洪卓立"
                },
                "img": "http://img.xiami.com/./images/album/img90/7390/4663593451366960487_1.jpg",
                "company": "英皇娱乐",
                "pub": "2013年04月",
                "des": "2013洪卓立( Ken )将推出广东大碟《All Around Us》，主打歌曲《Last Dance》及《无声占有》现已派台。今次大碟继续与合作无间的the..."
            },
            {
                "id": "575761",
                "title": "Volume 3",
                "artist": {
                    "id": "32884",
                    "title": "She & Him"
                },
                "img": "http://img.xiami.com/./images/album/img88/505188/5051881359505188_1.jpg",
                "company": "Merge",
                "pub": "2013年05月",
                "des": "M. Ward and Zooey Deschanel have teamed up once again for a new She &amp; Him al..."
            },
            {
                "id": "1763586909",
                "title": "Now What?!",
                "artist": {
                    "id": "10141",
                    "title": "Deep Purple"
                },
                "img": "http://img.xiami.com/./images/album/img41/10141/17635869091364706121_1.jpg",
                "company": "Edel",
                "pub": "2013年04月",
                "des": "在发行《Rapture Of The Deep》八年后，Deep Purple这支英国最有影响力的摇滚乐队之一终于发行了他们的全新作品。这张专辑的作品大多完成于..."
            },
            {
                "id": "365666189",
                "title": "Iron Man 3: Heroes Fall (Music Inspired by the Motion Picture)",
                "artist": {
                    "id": "23256",
                    "title": "Soundtrack"
                },
                "img": "http://img.xiami.com/./images/album/img56/23256/3656661891365666190_1.jpg",
                "company": "Hollywood Records",
                "pub": "2013年04月",
                "des": "Twelve super heroes of indie and alternative rock have banded together to create..."
            }
        ],
        song:[
        {
            "id": "1771808837",
            "title": "致青春",
            "hot": "204452",
            "artist": {
                "id": "2177",
                "title": "王菲"
            }
        },
        {
            "id": "1771829246",
            "title": "亲爱的路人",
            "hot": "70022",
            "artist": {
                "id": "1930",
                "title": "刘若英"
            }
        },
        {
            "id": "1771829247",
            "title": "幸福不是情歌",
            "hot": "52889",
            "artist": {
                "id": "1930",
                "title": "刘若英"
            }
        },
        {
            "id": "1771734083",
            "title": "其实都没有",
            "hot": "48904",
            "artist": {
                "id": "7319",
                "title": "杨宗纬"
            }
        },
        {
            "id": "1769234480",
            "title": "Johnny B.",
            "hot": "46540",
            "artist": {
                "id": "67663",
                "title": "Down Low"
            }
        }]
    };



  return {

    init: function (cfg) {

        header.setTitle("午后音乐");

        if (!el) {
            el = $('<div class="home-page home"></div>').appendTo(body);

//            S.IO({
//                dataType:'jsonp',
//                url:API_Song,
//                success:function(data){
//                    data.song=data['48h'];
//                }
//            });

            this.promoInit();
            this.hotAlbumsInit();
            this.hotStylesInit();
            this.collectInit();
            this.songListInit();

            S.log(myName+' is new');
        } else {
            S.log(myName+' is coming again');
        }
        var headerEl=header.getHeader(myName);
        if (!headerEl.contents().length) {
            headerEl.append(myName);
        }
        suspender.setCurrentMod(myName);
    },

    getEl: function () {
      return el;
    },

    promoInit: function(){
        var render = new XTemplate(TPL_promotion).render({data:data.promotion});
        $(render).appendTo(el);
        window.s = new Slide('#J_promotion_slider',{
            contentClass:'tab-content',
            pannelClass:'tab-pannel',
            effect:'hSlide',
            touchmove:true
        }).next();
    },

    hotAlbumsInit:function(){
        var albums = data.hotAlbums;
        if(window.innerWidth < 480){
            albums.length = 4;
        }else{
            albums.length = 6;
        }
        var render = new XTemplate(TPL_hotAlbums).render({data:albums});
        $(render).appendTo(el);
        $('.albums-item','.J_hotAlbums').on(Event.Gesture.tap, function () {
            var id = $(this).attr('data-url');
            Transition.forward(myName, 'xiami/transition/album',{
                id:id
            });
        });
    },

    hotStylesInit:function(){
        var render = new XTemplate(TPL_hotStyle).render({data:data.hotStyles});
        $(render).appendTo(el);
    },

    collectInit:function(){
        var collectData = data.collect;
        collectData.length = 4;
        var render = new XTemplate(TPL_collect).render({data:collectData});
        $(render).appendTo(el);
    },

    songListInit: function(){
        var self = this;
        var song = data.song;
        song.length = 5;
        var render = new XTemplate(TPL_Song).render({data:song});
        $(render).appendTo(el);

        $('.play', '.J_songList').on(Event.Gesture.tap, function () {
            var song_id = $(this).attr('song-id');
            Transition.forward(myName, 'xiami/transition/player',{
                id:song_id
            });
        });
        $('.add-list', '.J_songList').on(Event.Gesture.tap, function () {
            var song_id = $(this).attr('song-id');
            suspender.addToList(song_id);
        });
    },

    addToList:function(song){
        var list = localStorage.getItem('MUSIC_LIST')? localStorage.getItem('MUSIC_LIST').split(','):[];
        list.push(song);
        localStorage.setItem('MUSIC_LIST', S.unique(list).join(','));
    }

  };

}, {
  requires: [
      'node',
      'io',
      'xtemplate',
      './index',
      'event',
      'gallery/slide/1.0/',
      '../header',
      '../suspender'
      ]
});
