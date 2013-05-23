KISSY.add("xiami/transition/index", function(S, Node) {
  var $ = Node.all;
  var duration = 0.3;
  var cache = [];
  return{forward:function(currentMod, nextMod, cfg) {
    cfg = cfg || {};
    cfg.forwardFromMod = currentMod;
    cache.push([currentMod, nextMod, cfg]);
    KISSY.use(nextMod + "," + currentMod, function(S, next, current) {
      next.init(cfg);
      var el = next.getEl();
      var preEl = current.getEl();
      var width = $(window).width();
      var transitionSupport = S.Features.isTransitionSupported();
      var before = {left:0}, after = {left:-width};
      if(transitionSupport) {
        var css3Prefix = S.Features.getTransformPrefix();
        var transformProperty = css3Prefix ? "-" + css3Prefix.toLowerCase() + "-transform" : "transform";
        el.css(transformProperty, "translate3d(" + width + "px,0,0)");
        before = {};
        before[transformProperty] = "translate3d(0px,0,0)";
        after = {};
        after[transformProperty] = "translate3d(-" + width + "px,0,0)"
      }else {
        el.css("left", width)
      }
      el.show();
      el.animate(before, {duration:duration, useTransition:true, complete:function() {
        if(transitionSupport) {
          el.css(transformProperty, "none")
        }
      }});
      if(nextMod.indexOf("player") > -1) {
        $("#suspender").hide()
      }
      $("#header").removeClass("header-is-home");
      preEl.animate(after, {duration:duration, useTransition:true, complete:function() {
        preEl.hide();
        window.scroll(0, 0)
      }})
    })
  }, backward:function() {
    var item = cache.pop();
    var currentMod = item[1];
    var nextMod = item[0];
    var lastItem = cache[cache.length - 1];
    var cfg = lastItem ? lastItem[2] : {};
    cfg.backwardFromMod = currentMod;
    KISSY.use(nextMod + "," + currentMod, function(S, next, current) {
      next.init(cfg);
      var el = next.getEl();
      var preEl = current.getEl();
      var width = $(window).width();
      var transitionSupport = S.Features.isTransitionSupported();
      var before = {left:0}, after = {left:width};
      if(transitionSupport) {
        var css3Prefix = S.Features.getTransformPrefix();
        var transformProperty = css3Prefix ? "-" + css3Prefix.toLowerCase() + "-transform" : "transform";
        el.css(transformProperty, "translate3d(-" + width + "px,0,0)");
        before = {};
        before[transformProperty] = "translate3d(0px,0,0)";
        after = {};
        after[transformProperty] = "translate3d(" + width + "px,0,0)"
      }else {
        el.css("left", -width)
      }
      el.show();
      el.animate(before, {duration:duration, useTransition:true, complete:function() {
        if(transitionSupport) {
          el.css(transformProperty, "none")
        }
      }});
      if(nextMod.indexOf("home") > -1) {
        $("#header").addClass("header-is-home")
      }
      if(currentMod.indexOf("player") > -1) {
        $("#suspender").show()
      }
      current.getEl().animate(after, {duration:duration, useTransition:true, complete:function() {
        preEl.hide();
        window.scroll(0, 0)
      }})
    })
  }}
}, {requires:["node"]});

