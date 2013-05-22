KISSY.add(function (S, Node, Transition, Event, IO, header) {

  var $ = Node.all;
  var el;
  var myName=this.getName();
  var body=$('#body');

  return {

    init: function () {
      if (!el) {
        el = $('<div class="mod-page"></div>').appendTo(body);
        el.html('<div><button>Back to Home</button><div id="J_ListCat" class="listcat"></div><div id="J_List" class="list">loading...</div></div>');
        el.one('button').on(Event.Gesture.tap, function() {
          Transition.forward(myName, 'xiami/transition/home');
        });
        this.fetchData();
        S.log(myName+' is new');
      } else {
        S.log(myName+' is coming again');
      }
      
      var headerEl=header.getHeader(myName);
      if(!headerEl.contents().length){
        headerEl.append(myName);
      }
    },

    fetchData: function() {
      var url = "http://test.fem.taobao.net:3000/album/hotlist/page/1";
      S.IO.jsonp(url, function(data) {
        // Render.
        var html = "";
        S.each(data, function(item) {
          html += '<div data-id="'+item.id+'"><img src="'+item.img+'" />'+item.title+'</div>';
        });
        $("#J_List", el).html(html);
        $("#J_List div", el).on("click", function(e) {
          var id = e.currentTarget.getAttribute("data-id");
          S.log(id);
          Transition.forward(myName, 'xiami/transition/album', {
            id: id
          });
        });
      });
    },

    getEl: function () {
      return el;
    }

  };

}, {
  requires: ['node', './index', 'event', 'ajax', '../header','./albums.css']
});
