KISSY.add("xiami/transition/home", function(S, Node, IO, XTemplate, Transition, Event, Slide, header, suspender, DD) {
  var $ = Node.all;
  var el;
  var myName = this.getName();
  var body = $("#body");
  (function() {
    $("#cat li").on(Event.Gesture.tap, function(e) {
      switch(e.currentTarget.className) {
        case "s1":
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
          $("#page").css("-webkit-transform", "none");
          $("#cat").hide();
          Transition.forward(myName, "xiami/transition/discover");
          break
      }
    });
    return;
    var x = 0;
    var pEl = $("#page");
    pEl.on("mousedown", function(e) {
      x = e.pageX;
      pEl.on("mousemove", function(e) {
        var diff = e.pageX - x;
        if(diff < 0) {
          return
        }
        if(diff > 260) {
          return
        }
        $("#cat").show();
        pEl.css("-webkit-transition", "0ms");
        pEl.css("transition", "0ms");
        pEl.css("-webkit-transform", "translate3d(" + diff + "px, 0, 0)")
      })
    });
    pEl.on("mouseup", function() {
      pEl.detach("mousemove");
      pEl.css("-webkit-transition", "300ms");
      pEl.css("transition", "300ms");
      if(x > 200) {
        pEl.css("-webkit-transform", "translate3d(260px, 0, 0)")
      }else {
        pEl.css("-webkit-transform", "translate3d(0, 0, 0)");
        setTimeout(function() {
          $("#cat").hide()
        }, 400)
      }
      x = 0
    })
  })();
  var TPL_promotion = '<div id="J_promotion_slider" class="promotion_slider">' + '<ul class="tab-nav clearfix">' + "<li></li>" + '<li class="selected"></li>' + "<li></li>" + "<li></li>" + "</ul>" + '<div class="tab-content clearfix">' + "{{#each data}}" + '<div class="tab-pannel hidden">' + '<a href="#" class="J_promotion" data-url="{{id}}"><img src="{{img}}" alt="img" ></a>' + "</div>" + "{{/each}}" + "</div>";
  var TPL_hotAlbums = '<div class="hot-albums blocks J_hotAlbums">' + '<div class="block-title">' + "<h2>\u63a8\u8350\u4e13\u8f91</h2>" + "</div>" + '<ul class="albums-items">' + "{{#each data}}" + '<li class="log url albums-item" data-url="{{id}}">' + '<img alt="{{title}}" src="{{img}}" width="100" height="100">' + '<div class="info">' + '<span class="title">{{title}}</span>' + "</div>" + "</li>" + "{{/each}}" + "</ul></div>";
  var TPL_hotStyle = '<div class="blocks hot-styles">' + '<div class="block-title ">' + "<h2>\u70ed\u95e8\u98ce\u683c</h2>" + "</div>" + '<ul class="style-items" url-id={{id}}>' + "{{#each data}}" + "<li>{{name}}</li>" + "{{/each}}" + "</ul>" + "</div>";
  var TPL_collect = '<div class="blocks collect J_collect">' + '<div class="block-title ">' + "<h2>\u7cbe\u9009\u96c6\u63a8\u8350</h2>" + "</div>" + "{{#each data}}" + '<div class="collect_item {{#if xindex%2 !== 0}}right{{/if}}">' + '<p class="cover">' + "<span>" + '<a title="{{title}}" class="J_collectCover" collect-id="{{id}}">' + '<img  src="{{img}}" alt="{{title}}" >' + "</a>" + "</span>" + "</p>" + '<div class="collect_main">' + '<strong class="collect_title">' + '<a collect-id="{{id}}" title="{{title}}" class="J_collectTitle">{{title}}</a>' + 
  "</strong>" + '<p class="num">25\u9996\u7cbe\u9009</p>' + '<p class="brief">{{des}}</p>' + "{{#if xindex%2 !== 0}}" + '<a class="add-list icon" songs-id="{{songs}}"></a>' + '<a class="play big-icon" song-id="{{firstSong}}"></a>' + "{{else}}" + '<a class="play big-icon" song-id="{{firstSong}}"></a>' + '<a class="add-list icon" songs-id="{{songs}}"></a>' + "{{/if}}" + "</div>" + "</div>" + "{{/each}}" + "</div>";
  var TPL_Song = '<div class="blocks song">' + '<div class="block-title">' + "<h2>\u63a8\u8350\u91d1\u66f2</h2>" + "</div>" + '<ul class="song-list J_songList">' + "{{#each data}}" + "<li>" + "<a>{{title}}</a>" + '<a class="add-list icon" song-id ="{{id}}"></a>' + '<a class="play icon" song-id ="{{id}}"></a>' + "</li>" + "{{/each}}" + "</ul></div>";
  var data = {promotion:[{id:"410839", img:"http://img01.taobaocdn.com/tps/i1/T1GKuMXw4eXXcOrsQW-340-128.jpg"}, {id:"379797", img:"http://img04.taobaocdn.com/tps/i4/T16WSOXxVaXXcOrsQW-340-128.jpg"}, {id:"1769133591", img:"http://img.xiami.com/images/common/uploadpic/76/13545037766588.jpg"}, {id:"1468771348", img:"http://img.xiami.com/images/common/promotion/13668929958435.jpg"}], hotAlbums:[{id:"763919549", title:"\u521d.\u7231", artist:{id:"7319", title:"\u6768\u5b97\u7eac"}, img:"http://img.xiami.com/./images/album/img19/7319/7639195491364525725_1.jpg", 
  company:"\u73af\u7403\u5531\u7247", pub:"2013\u5e7403\u6708", des:"\u6709\u65f6\u6d3b\u5f97\u5f88\u590d\u6742 \u6709\u65f6\u5531\u5f97\u5f88\u611f\u6168&nbsp;\r\n\u8fd9\u4e00\u6b21 \u53ea\u60f3\u627e\u56de\u97f3\u4e50\u7684\u300c\u521d.\u7231\u300d\u2026\u2026&nbsp;\r\n\u53ea\u6709\u81ea\u5df1\u61c2\u5f97\u7684..."}, {id:"2064478588", title:"\u6211\u662f\u6b4c\u624b\u7b2c\u4e00\u5b63 \u534a\u51b3\u8d5b", artist:{id:"127544", title:"\u6211\u662f\u6b4c\u624b"}, img:"http://img.xiami.com/./images/album/img87/478587/4785871364478587_1.jpg", 
  company:"\u6e56\u5357\u536b\u89c6", pub:"2013\u5e7404\u6708", des:"\u534a\u51b3\u8d5b\u4e0d\u4ecb\u5165\u6dd8\u6c70\u5236\uff0c\u800c\u662f\u5c06\u9009\u7968\u8ba1\u5165\u603b\u51b3\u8d5b\u6210\u7ee9\u768440%\uff08\u9009\u7968\u4f9d\u65e7\u5355\u6295\uff09"}, {id:"406532", title:"\u591c\u7684\u94a2\u7434\u66f2 Demo\u96c6", artist:{id:"77201", title:"\u77f3\u8fdb"}, img:"http://img.xiami.com/./images/album/img1/77201/4065321287132984_1.jpg", company:"\u72ec\u7acb\u53d1\u884c", pub:"2009\u5e7406\u6708", 
  des:"\u4ece2006\u5e74\u5f00\u59cb\uff0c\u5386\u65f63\u5e74\u534a\uff0c\u517131\u9996\u3002\u9996\u9996\u90fd\u662f\u4e0d\u540c\u7684\u5fc3\u60c5\uff0c\u8bb0\u5f55\u7740\u4e00\u4e2a\u53c8\u4e00\u4e2a\u591c\u665a\uff0c\u6b22\u4e50\u7684\u3001\u5fe7\u4f24\u7684\u3001\u96be\u8fc7\u7684\u3001\u5f53\u7136\u4e5f\u5305\u62ec\u5e78\u798f\u7684\u3002\r\n\u4e0d\u77e5\u9053\u591a\u5c11\u4e2a..."}, {id:"414285", title:"Everything in the World", artist:{id:"78980", title:"\u66f2\u5a49\u5a77"}, img:"http://img.xiami.com/./images/album/img80/78980/4142851346074714_1.jpg", 
  company:"Nettwerk", pub:"2012\u5e7404\u6708", des:"\u66f2\u5a49\u5a77Wanting \u9996\u5f20\u6b63\u5f0f\u4e2a\u4eba\u521b\u4f5c\u4e13\u8f91\uff0c\u57282012\u5e744\u670824\u65e5\u4e8e\u5317\u7f8e\u53d1\u884c\uff0c2012\u5e748\u6708\u521d\u7531\u73af\u7403\u5531\u7247\u53d1\u884c\u4e9a\u6d32\u7279\u522b\u7248\u3002\u867e\u7c73\u540c\u65f6\u6536\u5f55\u4e24\u4e2a\u7248\u672c..."}, {id:"1765561490", title:"\u966a\u6211\u53bb\u6d41\u6d6a", artist:{id:"79332", title:"\u963f\u6084"}, img:"http://img.xiami.com/./images/album/img32/79332/17655614901365561490_1.jpg", 
  company:"\u6d77\u8776\u97f3\u4e50", pub:"2013\u5e7404\u6708", des:"\u5185\u573090\u540e\u5c0f\u82b1\u65e6\u2014\u2014\u201c\u6587\u827a\u838e\u201d\u963f\u6084\uff0c\u4ece\u53ea\u95fb\u5176\u58f0\u4e0d\u89c1\u5176\u4eba\u7684\u5e55\u540e\u5408\u5531\u8005\uff0c\u6210\u4e3a\u62e5\u6709\u65b0\u751f\u4ee3\u6b4c\u624b\u4e0eMV..."}, {id:"577206", title:"\u56e0\u4f60\u800c\u5728", artist:{id:"615", title:"\u6797\u4fca\u6770"}, img:"http://img.xiami.com/./images/album/img15/615/5772061362987839_1.jpg", 
  company:"\u534e\u7eb3\u5531\u7247", pub:"2013\u5e7403\u6708", des:"\u300c\u8fd9\u5f20\u4e13\u8f91\u5c5e\u4e8e\u4f60\u4eec\uff0c\u6ca1\u6709\u4f60\u4eec\u5c31\u6ca1\u6709\u6211\u3002\r\n\u6211\uff0c\u6797\u4fca\u6770\uff0c\u56e0\u4f60\u800c\u5728\u3002\u300d\r\n&nbsp;\r\n10\u5e74\u524d\u5199\u4e0b\u7684 10\u5e74\u540e\u6210\u4e3a\u6545\u4e8b\r\nJJ\u6797\u4fca\u6770 \u56e0\u4f60\u800c..."}], collect:[{id:"466359345", title:"All Around Us", artist:{id:"7390", title:"\u6d2a\u5353\u7acb"}, firstSong:"1771542090", 
  songs:"1771542090,1771824792,1771737720,1771824794,1771824795,1771824796,1771824797,1771824798,1771810956,1771824800", img:"http://img.xiami.com/./images/album/img90/7390/4663593451366960487_1.jpg", company:"\u82f1\u7687\u5a31\u4e50", pub:"2013\u5e7404\u6708", des:"2013\u6d2a\u5353\u7acb( Ken )\u5c06\u63a8\u51fa\u5e7f\u4e1c\u5927\u789f\u300aAll Around Us\u300b\uff0c\u4e3b\u6253\u6b4c\u66f2\u300aLast Dance\u300b\u53ca\u300a\u65e0\u58f0\u5360\u6709\u300b\u73b0\u5df2\u6d3e\u53f0\u3002\u4eca\u6b21\u5927\u789f\u7ee7\u7eed\u4e0e\u5408\u4f5c\u65e0\u95f4\u7684the..."}, 
  {id:"575761", title:"Volume 3", artist:{id:"32884", title:"She & Him"}, firstSong:"1771645975", songs:"1771645975,1771731479,1771645977,1771645978", img:"http://img.xiami.com/./images/album/img88/505188/5051881359505188_1.jpg", company:"Merge", pub:"2013\u5e7405\u6708", des:"M. Ward and Zooey Deschanel have teamed up once again for a new She &amp; Him al..."}, {id:"1763586909", title:"Now What?!", artist:{id:"10141", title:"Deep Purple"}, firstSong:"1771750295", songs:"1771750295,1771750296,1771750297,1771750298", 
  img:"http://img.xiami.com/./images/album/img41/10141/17635869091364706121_1.jpg", company:"Edel", pub:"2013\u5e7404\u6708", des:"\u5728\u53d1\u884c\u300aRapture Of The Deep\u300b\u516b\u5e74\u540e\uff0cDeep Purple\u8fd9\u652f\u82f1\u56fd\u6700\u6709\u5f71\u54cd\u529b\u7684\u6447\u6eda\u4e50\u961f\u4e4b\u4e00\u7ec8\u4e8e\u53d1\u884c\u4e86\u4ed6\u4eec\u7684\u5168\u65b0\u4f5c\u54c1\u3002\u8fd9\u5f20\u4e13\u8f91\u7684\u4f5c\u54c1\u5927\u591a\u5b8c\u6210\u4e8e..."}, {id:"365666189", title:"Iron Man 3: Heroes Fall (Music Inspired by the Motion Picture)", 
  artist:{id:"23256", title:"Soundtrack"}, firstSong:"1771805048", songs:"1771805048,1771805049,1771805050,1771805051,1771805052", img:"http://img.xiami.com/./images/album/img56/23256/3656661891365666190_1.jpg", company:"Hollywood Records", pub:"2013\u5e7404\u6708", des:"Twelve super heroes of indie and alternative rock have banded together to create..."}], song:[{id:"1771808837", title:"\u81f4\u9752\u6625", hot:"204452", artist:{id:"2177", title:"\u738b\u83f2"}}, {id:"1771829246", title:"\u4eb2\u7231\u7684\u8def\u4eba", 
  hot:"70022", artist:{id:"1930", title:"\u5218\u82e5\u82f1"}}, {id:"1771829247", title:"\u5e78\u798f\u4e0d\u662f\u60c5\u6b4c", hot:"52889", artist:{id:"1930", title:"\u5218\u82e5\u82f1"}}, {id:"1771734083", title:"\u5176\u5b9e\u90fd\u6ca1\u6709", hot:"48904", artist:{id:"7319", title:"\u6768\u5b97\u7eac"}}, {id:"1769234480", title:"Johnny B.", hot:"46540", artist:{id:"67663", title:"Down Low"}}]};
  return{init:function(cfg) {
    header.setTitle("\u5348\u540e\u97f3\u4e50");
    if(!el) {
      el = $('<div class="home-page home"></div>').appendTo(body);
      this.promoInit();
      this.hotAlbumsInit();
      this.collectInit();
      this.songListInit();
      S.log(myName + " is new")
    }else {
      S.log(myName + " is coming again")
    }
    var headerEl = header.getHeader(myName);
    if(!headerEl.contents().length) {
      headerEl.append(myName)
    }
    suspender.setCurrentMod(myName)
  }, getEl:function() {
    return el
  }, promoInit:function() {
    var render = (new XTemplate(TPL_promotion)).render({data:data.promotion});
    $(render).appendTo(el);
    window.s = (new Slide("#J_promotion_slider", {contentClass:"tab-content", pannelClass:"tab-pannel", effect:"hSlide", touchmove:true})).next();
    $(".J_promotion").on("click", function() {
      var album_id = $(this).attr("data-url");
      Transition.forward(myName, "xiami/transition/album", {id:album_id})
    })
  }, hotAlbumsInit:function() {
    var albums = data.hotAlbums;
    if(window.innerWidth < 480) {
      albums.length = 4
    }else {
      albums.length = 6
    }
    for(var i = 0;i < albums.length;i++) {
      albums[i].img = albums[i].img.replace("_1.jpg", "_2.jpg")
    }
    var render = (new XTemplate(TPL_hotAlbums)).render({data:albums});
    $(render).appendTo(el);
    $(".albums-item", ".J_hotAlbums").on(Event.Gesture.tap, function() {
      var id = $(this).attr("data-url");
      Transition.forward(myName, "xiami/transition/album", {id:id})
    })
  }, collectInit:function() {
    var self = this;
    var collectData = data.collect;
    collectData.length = 4;
    var render = (new XTemplate(TPL_collect)).render({data:collectData});
    $(render).appendTo(el);
    $(".J_collectCover, .J_collectTitle").on(Event.Gesture.tap, function() {
      var collect_id = $(this).attr("collect-id");
      Transition.forward(myName, "xiami/transition/album", {id:collect_id})
    });
    $(".play", ".J_collect").on(Event.Gesture.tap, function() {
      var song_id = $(this).attr("song-id");
      suspender.playOne({id:song_id})
    });
    $(".add-list", ".J_collect").on(Event.Gesture.tap, function() {
      var songs_id = $(this).attr("songs-id");
      var songs = songs_id.split(",");
      var i, l = songs.length, arr = [];
      for(i = 0;i < l;i++) {
        arr.push({id:songs[i]})
      }
      suspender.addToList(arr)
    })
  }, songListInit:function() {
    var self = this;
    var song = data.song;
    song.length = 5;
    var render = (new XTemplate(TPL_Song)).render({data:song});
    $(render).appendTo(el);
    $(".play", ".J_songList").on(Event.Gesture.tap, function() {
      var song_id = $(this).attr("song-id");
      suspender.playOne({id:song_id})
    });
    $(".add-list", ".J_songList").on(Event.Gesture.tap, function() {
      var song_id = $(this).attr("song-id");
      suspender.addToList({id:song_id})
    })
  }}
}, {requires:["node", "io", "xtemplate", "./index", "event", "gallery/slide/1.0/", "../header", "../suspender", "dd", "./home.css"]});

