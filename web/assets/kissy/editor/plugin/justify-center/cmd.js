﻿/*
Copyright 2013, KISSY UI Library v1.40dev
MIT Licensed
build time: Apr 17 00:18
*/
/**
 * Add justifyCenter command identifier for Editor.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/justify-center/cmd", function (S, justifyUtils) {

    return {
        init:function (editor) {
            justifyUtils.addCommand(editor, "justifyCenter", "center");
        }
    };

}, {
    requires:['../justify-cmd']
});
