/*
Copyright 2013, KISSY UI Library v1.40dev
MIT Licensed
build time: Mar 11 10:34
*/
KISSY.add("editor/plugin/back-color/cmd",function(e,b){var c={element:"span",styles:{"background-color":"#(color)"},overrides:[{element:"*",styles:{"background-color":null}}],childRule:function(a){return!!a.style("background-color")}};return{init:function(a){a.hasCommand("backColor")||a.addCommand("backColor",{exec:function(a,d){a.execCommand("save");b.applyColor(a,d,c);a.execCommand("save")}})}}},{requires:["../color/cmd"]});
