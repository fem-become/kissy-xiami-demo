﻿/*
Copyright 2013, KISSY UI Library v1.40dev
MIT Licensed
build time: May 15 20:33
*/
/**
 * @ignore
 * Component.Extension.Align
 * @author yiminghe@gmail.com, qiaohua@taobao.com
 */
KISSY.add('component/extension/align', function (S, DOM, Node) {

    var win = S.Env.host,
        UA= S.UA;

    // var ieMode = document.documentMode || UA.ie;

    /*
     inspired by closure library by Google
     see http://yiminghe.iteye.com/blog/1124720
     */

    /**
     * @ignore
     * 得到会导致元素显示不全的祖先元素
     */
    function getOffsetParent(element) {
        // ie 这个也不是完全可行
        /*
         <div style="width: 50px;height: 100px;overflow: hidden">
         <div style="width: 50px;height: 100px;position: relative;" id="d6">
         元素 6 高 100px 宽 50px<br/>
         </div>
         </div>
         */
        // element.offsetParent does the right thing in ie7 and below. Return parent with layout!
        //  In other browsers it only includes elements with position absolute, relative or
        // fixed, not elements with overflow set to auto or scroll.
//        if (UA.ie && ieMode < 8) {
//            return element.offsetParent;
//        }
        // 统一的 offsetParent 方法
        var doc = element.ownerDocument,
            body = doc.body,
            parent,
            positionStyle = DOM.css(element, 'position'),
            skipStatic = positionStyle == 'fixed' || positionStyle == 'absolute';

        if (!skipStatic) {
            return element.nodeName.toLowerCase() == 'html' ? null : element.parentNode;
        }

        for (parent = element.parentNode; parent && parent != body; parent = parent.parentNode) {
            positionStyle = DOM.css(parent, 'position');
            if (positionStyle != "static") {
                return parent;
            }
        }
        return null;
    }

    /**
     * @ignore
     * 获得元素的显示部分的区域
     */
    function getVisibleRectForElement(element) {
        var visibleRect = {
                left:0,
                right:Infinity,
                top:0,
                bottom:Infinity
            },
            el,
            scrollX,
            scrollY,
            winSize,
            doc = element.ownerDocument,
            body = doc.body,
            documentElement = doc.documentElement;

        // Determine the size of the visible rect by climbing the dom accounting for
        // all scrollable containers.
        for (el = element; el = getOffsetParent(el);) {
            // clientWidth is zero for inline block elements in ie.
            if ((!UA.ie || el.clientWidth != 0) &&
                // body may have overflow set on it, yet we still get the entire
                // viewport. In some browsers, el.offsetParent may be
                // document.documentElement, so check for that too.
                (el != body && el != documentElement && DOM.css(el, 'overflow') != 'visible')) {
                var pos = DOM.offset(el);
                // add border
                pos.left += el.clientLeft;
                pos.top += el.clientTop;

                visibleRect.top = Math.max(visibleRect.top, pos.top);
                visibleRect.right = Math.min(visibleRect.right,
                    // consider area without scrollBar
                    pos.left + el.clientWidth);
                visibleRect.bottom = Math.min(visibleRect.bottom,
                    pos.top + el.clientHeight);
                visibleRect.left = Math.max(visibleRect.left, pos.left);
            }
        }

        // Clip by window's viewport.
        scrollX = DOM.scrollLeft();
        scrollY = DOM.scrollTop();
        visibleRect.left = Math.max(visibleRect.left, scrollX);
        visibleRect.top = Math.max(visibleRect.top, scrollY);
        winSize = {
            width:DOM.viewportWidth(),
            height:DOM.viewportHeight()
        };
        visibleRect.right = Math.min(visibleRect.right, scrollX + winSize.width);
        visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + winSize.height);
        return visibleRect.top >= 0 && visibleRect.left >= 0 &&
            visibleRect.bottom > visibleRect.top &&
            visibleRect.right > visibleRect.left ?
            visibleRect : null;
    }

    function getElFuturePos(elRegion, refNodeRegion, points, offset) {
        var xy,
            diff,
            p1,
            p2;

        xy = {
            left:elRegion.left,
            top:elRegion.top
        };

        p1 = getAlignOffset(refNodeRegion, points[0]);
        p2 = getAlignOffset(elRegion, points[1]);

        diff = [p2.left - p1.left, p2.top - p1.top];

        return {
            left:xy.left - diff[0] + (+offset[0]),
            top:xy.top - diff[1] + (+offset[1])
        };
    }

    function isFailX(elFuturePos, elRegion, visibleRect) {
        return elFuturePos.left < visibleRect.left ||
            elFuturePos.left + elRegion.width > visibleRect.right;
    }

    function isFailY(elFuturePos, elRegion, visibleRect) {
        return elFuturePos.top < visibleRect.top ||
            elFuturePos.top + elRegion.height > visibleRect.bottom;
    }

    function adjustForViewport(elFuturePos, elRegion, visibleRect, overflow) {
        var pos = S.clone(elFuturePos),
            size = {
                width:elRegion.width,
                height:elRegion.height
            };

        if (overflow.adjustX && pos.left < visibleRect.left) {
            pos.left = visibleRect.left;
        }

        // Left edge inside and right edge outside viewport, try to resize it.
        if (overflow['resizeWidth'] &&
            pos.left >= visibleRect.left &&
            pos.left + size.width > visibleRect.right) {
            size.width -= (pos.left + size.width) - visibleRect.right;
        }

        // Right edge outside viewport, try to move it.
        if (overflow.adjustX && pos.left + size.width > visibleRect.right) {
            // 保证左边界和可视区域左边界对齐
            pos.left = Math.max(visibleRect.right - size.width, visibleRect.left);
        }

        // Top edge outside viewport, try to move it.
        if (overflow.adjustY && pos.top < visibleRect.top) {
            pos.top = visibleRect.top;
        }

        // Top edge inside and bottom edge outside viewport, try to resize it.
        if (overflow['resizeHeight'] &&
            pos.top >= visibleRect.top &&
            pos.top + size.height > visibleRect.bottom) {
            size.height -= (pos.top + size.height) - visibleRect.bottom;
        }

        // Bottom edge outside viewport, try to move it.
        if (overflow.adjustY && pos.top + size.height > visibleRect.bottom) {
            // 保证上边界和可视区域上边界对齐
            pos.top = Math.max(visibleRect.bottom - size.height, visibleRect.top);
        }

        return S.mix(pos, size);
    }


    function flip(points, reg, map) {
        var ret = [];
        S.each(points, function (p) {
            ret.push(p.replace(reg, function (m) {
                return map[m];
            }));
        });
        return ret;
    }

    function flipOffset(offset, index) {
        offset[index] = -offset[index];
        return offset;
    }


    /**
     * @class KISSY.Component.Extension.Align
     * Align extension class.Align component with specified element.
     */
    function Align() {
    }


    Align.__getOffsetParent = getOffsetParent;

    Align.__getVisibleRectForElement = getVisibleRectForElement;

    Align.ATTRS =
    {

        /**
         * alignment config.
         * @type {Object}
         * @property align
         *
         * for example:
         *      @example
         *      {
         *        node: null,         // 参考元素, falsy 或 window 为可视区域, 'trigger' 为触发元素, 其他为指定元素
         *        points: ['cc','cc'], // ['tr', 'tl'] 表示 overlay 的 tl 与参考节点的 tr 对齐
         *        offset: [0, 0]      // 有效值为 [n, m]
         *      }
         */


        /**
         * alignment config.
         * @cfg {Object} align
         *
         * for example:
         *      @example
         *      {
         *        node: null,         // 参考元素, falsy 或 window 为可视区域, 'trigger' 为触发元素, 其他为指定元素
         *        points: ['cc','cc'], // ['tr', 'tl'] 表示 overlay 的 tl 与参考节点的 tr 对齐
         *        offset: [0, 0]      // 有效值为 [n, m]
         *      }
         */


        /**
         * @ignore
         */
        align:{
            value:{}
        }
    };

    function getRegion(node) {
        var offset, w, h;
        if (!S.isWindow(node[0])) {
            offset = node.offset();
            w = node.outerWidth();
            h = node.outerHeight();
        } else {
            offset = { left:DOM.scrollLeft(), top:DOM.scrollTop() };
            w = DOM.viewportWidth();
            h = DOM.viewportHeight();
        }
        offset.width = w;
        offset.height = h;
        return offset;
    }

    /**
     * 获取 node 上的 align 对齐点 相对于页面的坐标
     * @param region
     * @param align
     * @ignore
     */
    function getAlignOffset(region, align) {
        var V = align.charAt(0),
            H = align.charAt(1),
            w = region.width,
            h = region.height,
            x, y;

        x = region.left;
        y = region.top;

        if (V === 'c') {
            y += h / 2;
        } else if (V === 'b') {
            y += h;
        }

        if (H === 'c') {
            x += w / 2;
        } else if (H === 'r') {
            x += w;
        }

        return { left:x, top:y };
    }

    // for augment, no need constructor
    Align.prototype =    {

        '_onSetAlign':function (v) {
            if (v && v.points) {
                this.align(v.node, v.points, v.offset, v.overflow);
            }
        },

        /*
         * 对齐 Overlay 到 node 的 points 点, 偏移 offset 处
         * @ignore
         * @param {Element} node 参照元素, 可取配置选项中的设置, 也可是一元素
         * @param {String[]} points 对齐方式
         * @param {Number[]} [offset] 偏移
         * @chainable
         */
        align:function (refNode, points, offset, overflow) {
            refNode = Node.one(refNode || win);
            offset = offset && [].concat(offset) || [0, 0];
            overflow = overflow || {};

            var self = this,
                el = self.get("el"),
                fail = 0,
            // 当前节点可以被放置的显示区域
                visibleRect = getVisibleRectForElement(el[0]),
            // 当前节点所占的区域, left/top/width/height
                elRegion = getRegion(el),
            // 参照节点所占的区域, left/top/width/height
                refNodeRegion = getRegion(refNode),
            // 当前节点将要被放置的位置
                elFuturePos = getElFuturePos(elRegion, refNodeRegion, points, offset),
            // 当前节点将要所处的区域
                newElRegion = S.merge(elRegion, elFuturePos);

            // 如果可视区域不能完全放置当前节点时允许调整
            if (visibleRect && (overflow.adjustX || overflow.adjustY)) {

                // 如果横向不能放下
                if (isFailX(elFuturePos, elRegion, visibleRect)) {
                    fail = 1;
                    // 对齐位置反下
                    points = flip(points, /[lr]/ig, {
                        l:"r",
                        r:"l"
                    });
                    // 偏移量也反下
                    offset = flipOffset(offset, 0);
                }

                // 如果纵向不能放下
                if (isFailY(elFuturePos, elRegion, visibleRect)) {
                    fail = 1;
                    // 对齐位置反下
                    points = flip(points, /[tb]/ig, {
                        t:"b",
                        b:"t"
                    });
                    // 偏移量也反下
                    offset = flipOffset(offset, 1);
                }

                // 如果失败，重新计算当前节点将要被放置的位置
                if (fail) {
                    elFuturePos = getElFuturePos(elRegion, refNodeRegion, points, offset);
                    S.mix(newElRegion, elFuturePos);
                }

                var newOverflowCfg = {};

                // 检查反下后的位置是否可以放下了
                // 如果仍然放不下只有指定了可以调整当前方向才调整
                newOverflowCfg.adjustX = overflow.adjustX &&
                    isFailX(elFuturePos, elRegion, visibleRect);

                newOverflowCfg.adjustY = overflow.adjustY &&
                    isFailY(elFuturePos, elRegion, visibleRect);

                // 确实要调整，甚至可能会调整高度宽度
                if (newOverflowCfg.adjustX || newOverflowCfg.adjustY) {
                    newElRegion = adjustForViewport(elFuturePos, elRegion,
                        visibleRect, newOverflowCfg);
                }
            }

            // 新区域位置发生了变化
            if (newElRegion.left != elRegion.left) {
                self.setInternal("x", null);
                self.get("view").setInternal("x", null);
                self.set("x", newElRegion.left);
            }

            if (newElRegion.top != elRegion.top) {
                // https://github.com/kissyteam/kissy/issues/190
                // 相对于屏幕位置没变，而 left/top 变了
                // 例如 <div 'relative'><el absolute></div>
                // el.align(div)
                self.setInternal("y", null);
                self.get("view").setInternal("y", null);
                self.set("y", newElRegion.top);
            }

            // 新区域高宽发生了变化
            if (newElRegion.width != elRegion.width) {
                el.width(el.width() + newElRegion.width - elRegion.width);
            }
            if (newElRegion.height != elRegion.height) {
                el.height(el.height() + newElRegion.height - elRegion.height);
            }

            return self;
        },

        /**
         * Make current element center within node.
         * @param {undefined|String|HTMLElement|KISSY.NodeList} node
         * Same as node config of {@link KISSY.Component.Extension.Align#cfg-align}
         * @chainable
         */
        center:function (node) {
            var self = this;
            self.set('align', {
                node:node,
                points:["cc", "cc"],
                offset:[0, 0]
            });
            return self;
        }
    };

    return Align;
}, {
    requires:["dom", "node"]
});
/**
 * @ignore
 *
 *  2012-04-26 yiminghe@gmail.com
 *   - 优化智能对齐算法
 *   - 慎用 resizeXX
 *
 *  2011-07-13 yiminghe@gmail.com note:
 *   - 增加智能对齐，以及大小调整选项
 **//**
 * common content box render
 * @author yiminghe@gmail.com
 */
KISSY.add('component/extension/content-render', function (S) {

    function ContentRender() {
        S.mix(this.get('childrenElSelectors'), {
            contentEl: '#ks-content{id}'
        });
    }

    ContentRender.prototype = {
        getChildrenContainerEl: function () {
            return this.get('contentEl');
        },
        _onSetContent: function (v) {
            var contentEl = this.get('contentEl');
            contentEl.html(v);
            // ie needs to set unselectable attribute recursively
            if (S.UA.ie < 9 && !this.get('allowTextSelection')) {
                contentEl.unselectable();
            }
        }
    };

    S.mix(ContentRender, {
        ATTRS: {
            contentTpl:{
                value:'<div id="ks-content{{id}}" ' +
                    'class="{{prefixCls}}content {{getCssClassWithState "content"}}">' +
                    '{{{content}}}' +
                    '</div>'
            },
            content: {
                sync: 0
            }
        },
        HTML_PARSER: {
            content: function (el) {
                return el.one('.' + this.get('prefixCls') + 'content').html();
            },
            contentEl: function (el) {
                return el.one('.' + this.get('prefixCls') + 'content')
            }
        }
    });

    ContentRender.ContentTpl=ContentRender.ATTRS.contentTpl.value;

    return ContentRender;
});/**
 * @ignore
 * decorate its children from one element
 * @author yiminghe@gmail.com
 */
KISSY.add("component/extension/decorate-child", function (S, DecorateChildren) {
    
    function DecorateChild() {
    }

    S.augment(DecorateChild, DecorateChildren, {
        decorateInternal: function (element) {
            var self = this,
                prefixCls = self.get('defaultChildCfg').prefixCls,
                child = element.one("." + (prefixCls + self.get("decorateChildCls")));
            // 可以装饰?
            if (child) {
                var ChildUI = self.findChildConstructorFromNode(prefixCls, child);
                if (ChildUI) {
                    // 可以直接装饰
                    self.decorateChildrenInternal(ChildUI, child);
                } else {
                    // 装饰其子节点集合
                    self.decorateChildren(child);
                }
            }
        }
    });

    return DecorateChild;
}, {
    requires: ['./decorate-children']
});/**
 * @ignore
 * decorate function for children render from markup
 * @author yiminghe@gmail.com
 */
KISSY.add("component/extension/decorate-children", function (S, Component) {

    var Manager = Component.Manager;

    function DecorateChildren() {

    }

    S.augment(DecorateChildren, {
        /**
         * Generate child component from root element.
         * @protected
         * @param {KISSY.NodeList} el Root element of current component.
         */
        decorateInternal: function (el) {
            this.decorateChildren(el);
        },

        /**
         * Get component's constructor from KISSY Node.
         * @protected
         * @param prefixCls
         * @param {KISSY.NodeList} childNode Child component's root node.
         */
        findChildConstructorFromNode: function (prefixCls, childNode) {
            var cls = childNode[0].className || "";
            // 过滤掉特定前缀
            if (cls) {
                cls = cls.replace(new RegExp("\\b" + prefixCls, "ig"), "");
                return Manager.getConstructorByXClass(cls);
            }
            return null;
        },

        // 生成一个子组件
        decorateChildrenInternal: function (ChildUI, childNode, childConfig) {
            var self = this;
            // html_parser 值优先
            childConfig = S.merge(self.get('defaultChildCfg'), childConfig, {
                srcNode: childNode
            });
            delete childConfig.xclass;
            return self.addChild(new ChildUI(childConfig));
        },

        /**
         * decorate child element from parent component's root element.
         * @private
         * @param {KISSY.NodeList} el component's root element.
         */
        decorateChildren: function (el) {
            var self = this,
                defaultChildCfg = self.get('defaultChildCfg'),
                prefixCls = defaultChildCfg.prefixCls,
                defaultChildXClass = self.get('defaultChildCfg').xclass,
                children = el.children();
            children.each(function (c) {
                var ChildUI = self.findChildConstructorFromNode(prefixCls, c) ||
                    defaultChildXClass &&
                        Manager.getConstructorByXClass(defaultChildXClass);
                if (ChildUI) {
                    self.decorateChildrenInternal(ChildUI, c);
                }
            });
        }
    });

    return DecorateChildren;

}, {
    requires: ['component/base']
});/**
 * @ignore
 * delegate events for children
 * @author yiminghe@gmail.com
 */
KISSY.add("component/extension/delegate-children", function (S, Event) {

    var UA = S.UA,
        ie = S.Env.host.document.documentMode || UA.ie,
        Features = S.Features,
        Gesture = Event.Gesture,
        isTouchSupported = Features.isTouchSupported();

    function DelegateChildren() {
    }

    function handleChildMouseEvents(e) {
        if (!this.get("disabled")) {
            var control = this.getOwnerControl(e.target, e);
            if (control && !control.get("disabled")) {
                // Child control identified; forward the event.
                switch (e.type) {
                    case Gesture.start:
                        control.handleMouseDown(e);
                        break;
                    case Gesture.end:
                        control.handleMouseUp(e);
                        break;
                    case Gesture.tap:
                        control.performActionInternal(e);
                        break;
                    case "mouseover":
                        control.handleMouseOver(e);
                        break;
                    case "mouseout":
                        control.handleMouseOut(e);
                        break;
                    case "contextmenu":
                        control.handleContextMenu(e);
                        break;
                    case "dblclick":
                        control.handleDblClick(e);
                        break;
                    default:
                        S.error(e.type + " unhandled!");
                }
            }
        }
    }

    S.augment(DelegateChildren, {

        __bindUI: function () {
            var self = this,
                events;

                events = Gesture.start + " " + Gesture.end + " " + Gesture.tap + " touchcancel ";

                if (!isTouchSupported) {
                    events += "mouseover mouseout contextmenu " +
                        (ie && ie < 9 ? "dblclick " : "");
                }

                self.get("el").on(events, handleChildMouseEvents, self);
        },

        /**
         * Get child component which contains current event target node.
         * @protected
         * @param {HTMLElement} target Current event target node.
         * @return {KISSY.Component.Controller}
         */
        getOwnerControl: function (target) {
            var self = this,
                children = self.get("children"),
                len = children.length,
                elem = self.get("el")[0];
            while (target && target !== elem) {
                for (var i = 0; i < len; i++) {
                    if (children[i].get("el")[0] === target) {
                        return children[i];
                    }
                }
                target = target.parentNode;
            }
            return null;
        }
    });

    return DelegateChildren;
}, {
    requires: ['event']
});/**
 * @ignore
 * uibase
 * @author yiminghe@gmail.com
 */
KISSY.add("component/extension", function (S, Align, ContentRender, Position, PositionRender, ShimRender, DelegateChildren, DecorateChildren, DecorateChild) {
    return {
        Align: Align,
        Position: Position,
        PositionRender: PositionRender,
        ContentRender: ContentRender,
        ShimRender: S.UA === 6 ? ShimRender : null,
        'DelegateChildren': DelegateChildren,
        'DecorateChild': DecorateChild,
        'DecorateChildren': DecorateChildren
    };
}, {
    requires: [
        "./extension/align",
        "./extension/content-render",
        "./extension/position",
        "./extension/position-render",
        "./extension/shim-render",
        "./extension/delegate-children",
        "./extension/decorate-children",
        "./extension/decorate-child"
    ]
});/**
 * @ignore
 * position and visible extension，可定位的隐藏层
 * @author yiminghe@gmail.com
 */
KISSY.add("component/extension/position-render", function () {

    function Position() {
        var renderData = this.get('renderData');
        this.get('elStyle')['z-index'] = renderData.zIndex;
        this.get('elCls').push(renderData.prefixCls + 'ext-position ');
    }

    Position.ATTRS = {
        x: {},
        y: {},
        zIndex: {
            sync: 0
        }
    };

    // for augment, no need constructor
    Position.prototype = {
        '_onSetZIndex': function (x) {
            this.get("el").css("z-index", x);
        },

        '_onSetX': function (x) {
            if (x != null) {
                this.get("el").offset({
                    left: x
                });
            }
        },

        '_onSetY': function (y) {
            if (y != null) {
                this.get("el").offset({
                    top: y
                });
            }
        }
    };

    return Position;
});/**
 * @ignore
 * position and visible extension，可定位的隐藏层
 * @author yiminghe@gmail.com
 */
KISSY.add("component/extension/position", function (S) {

    /**
     * @class KISSY.Component.Extension.Position
     * Position extension class. Make component positionable.
     */
    function Position() {
    }

    Position.ATTRS = {
        /**
         * Horizontal axis
         * @type {Number}
         * @property x
         */
        /**
         * Horizontal axis
         * @cfg {Number} x
         */
        /**
         * @ignore
         */
        x: {
            view: 1
        },

        /**
         * Vertical axis
         * @type {Number}
         * @property y
         */
        /**
         * Vertical axis
         * @cfg {Number} y
         */
        /**
         * @ignore
         */
        y: {
            view: 1
        },
        /**
         * Horizontal and vertical axis.
         * @ignore
         * @type {Number[]}
         */
        xy: {
            // 相对 page 定位, 有效值为 [n, m], 为 null 时, 选 align 设置
            setter: function (v) {
                var self = this,
                    xy = S.makeArray(v);
                /*
                 属性内分发特别注意：
                 xy -> x,y
                 */
                if (xy.length) {
                    xy[0] && self.set("x", xy[0]);
                    xy[1] && self.set("y", xy[1]);
                }
                return v;
            },

            // xy 纯中转作用
            getter: function () {
                return [this.get("x"), this.get("y")];
            }
        },

        /**
         * z-index value.
         * @type {Number}
         * @property zIndex
         */
        /**
         * z-index value.
         * @cfg {Number} zIndex
         */
        /**
         * @ignore
         */
        zIndex: {
            view: 1
        },
        /**
         * Positionable element is by default visible false.
         * For compatibility in overlay and PopupMenu.
         *
         * Defaults to: false
         *
         * @ignore
         */
        visible: {
            value: false
        }
    };

    // for augment, no need constructor
    Position.prototype = {
        /**
         * Move to absolute position.
         * @ignore
         * @chainable
         */
        move: function (x, y) {
            var self = this;
            if (S.isArray(x)) {
                y = x[1];
                x = x[0];
            }
            self.set("xy", [x, y]);
            return self;
        }
    };

    return Position;
});/**
 * @ignore
 * shim for ie6 ,require box-ext
 * @author yiminghe@gmail.com
 */
KISSY.add("component/extension/shim-render", function () {
    var shimTpl = "<" + "iframe style='position: absolute;" +
        "border: none;" +
        // consider border
        // bug fix: 2012-11-07
        "width: expression(this.parentNode.clientWidth);" +
        "top: 0;" +
        "opacity: 0;" +
        "filter: alpha(opacity=0);" +
        "left: 0;" +
        "z-index: -1;" +
        "height: expression(this.parentNode.clientHeight);" + "'/>";

    // only for ie6!
    function ShimRender() {
    }

    ShimRender.prototype.__createDom = function () {
        this.get('el').prepend(S.all(shimTpl));
    };

    return ShimRender;
});
