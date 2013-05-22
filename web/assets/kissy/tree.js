﻿/*
Copyright 2013, KISSY UI Library v1.40dev
MIT Licensed
build time: May 15 20:32
*/
/**
 * root node represent a simple tree
 * @author yiminghe@gmail.com
 */
KISSY.add("tree/base", function (S, Component,TreeNode, TreeRender, TreeManager) {

    /*多继承
     1. 继承基节点（包括可装饰儿子节点功能）
     2. 继承 mixin 树管理功能
     3. 继承 mixin 儿子事件代理功能
     */

    /**
     * @name Tree
     * @class
     * KISSY Tree.
     * xclass: 'tree'.
     * @extends Tree.Node
     */
    return TreeNode.extend([TreeManager], {}, {
        ATTRS: {
            xrender: {
                value: TreeRender
            },
            defaultChildCfg: {
                value: {
                    xclass:'tree-node'
                }
            }
        }
    }, {
        xclass: 'tree',
        priority: 30
    });

}, {
    requires: ['component/base', './node', './tree-render', './tree-manager']
});

/*
 Refer:
 - http://www.w3.org/TR/wai-aria-practices/#TreeView

 note bug:
 1. checked tree 根节点总是 selected ！
 2. 根节点 hover 后取消不了了



 支持 aria
 重用组件框架
 键盘操作指南

 tab 到树，自动选择根节点

 上下键在可视节点间深度遍历
 左键
 已展开节点：关闭节点
 已关闭节点: 移动到父亲节点
 右键
 已展开节点：移动到该节点的第一个子节点
 已关闭节点: 无效
 enter : 触发 click 事件
 home : 移动到根节点
 end : 移动到前序遍历最后一个节点
 *//**
 * checkable tree node
 * @author yiminghe@gmail.com
 */
KISSY.add("tree/check-node", function (S, Node, TreeNode) {
    var $ = Node.all,
        PARTIAL_CHECK = 2,
        CHECK = 1,
        EMPTY = 0;

    /**
     * @name CheckNode
     * @member Tree
     * @class
     * Checked tree node.
     * xclass: 'check-tree-node'.
     * @extends Tree.Node
     */
    var CheckNode = TreeNode.extend({
        performActionInternal: function (e) {

            var self = this,
                checkState,
                expanded = self.get("expanded"),
                expandIconEl = self.get("expandIconEl"),
                tree = self.get("tree"),
                target = $(e.target);

            // 需要通知 tree 获得焦点
            tree.focus();

            // 点击在 +- 号，切换状态
            if (target.equals(expandIconEl)) {
                self.set("expanded", !expanded);
                return;
            }

            // 单击任何其他地方都切换 check 状态
            checkState = self.get("checkState");

            if (checkState == CHECK) {
                checkState = EMPTY;
            } else {
                checkState = CHECK;
            }

            self.set("checkState", checkState);

            self.fire("click");
        },

        _onSetCheckState: function (s) {
            var self = this,
                parent = self.get('parent'),
                checkCount,
                i,
                c,
                cState,
                cs;

            if (s == CHECK || s == EMPTY) {
                S.each(self.get("children"), function (c) {
                    c.set("checkState", s);
                });
            }

            // 每次状态变化都通知 parent 沿链检查，一层层向上通知
            // 效率不高，但是结构清晰
            if (parent) {
                checkCount = 0;
                cs = parent.get("children");
                for (i = 0; i < cs.length; i++) {
                    c = cs[i];
                    cState = c.get("checkState");
                    // 一个是部分选，父亲必定是部分选，立即结束
                    if (cState == PARTIAL_CHECK) {
                        parent.set("checkState", PARTIAL_CHECK);
                        return;
                    } else if (cState == CHECK) {
                        checkCount++;
                    }
                }

                // 儿子都没选，父亲也不选
                if (checkCount === 0) {
                    parent.set("checkState", EMPTY);
                } else
                // 儿子全都选了，父亲也全选
                if (checkCount == cs.length) {
                    parent.set("checkState", CHECK);
                }
                // 有的儿子选了，有的没选，父亲部分选
                else {
                    parent.set("checkState", PARTIAL_CHECK);
                }
            }
        }
    }, {
        ATTRS: /**
         * @lends Tree.CheckNode#
         */
        {
            checkIconEl: {
                view: 1
            },

            checkable: {
                value: true,
                view: 1
            },

            /**
             * Enums for check states.
             * CheckNode.PARTIAL_CHECK: checked partly.
             * CheckNode.CHECK: checked completely.
             * CheckNode.EMPTY: not checked.
             * @type {Number}
             */
            checkState: {
                // check 的三状态
                // 0 一个不选
                // 1 儿子有选择
                // 2 全部都选了
                value: 0,
                sync: 0,
                view: 1
            },

            defaultChildCfg: {
                value: {
                    xclass: 'check-tree-node'
                }
            }
        }
    }, {
        xclass: "check-tree-node",
        priority: 20
    });

    S.mix(CheckNode,
        /**
         * @lends Tree.CheckNode
         */
        {
            /**
             * checked partly.
             */
            PARTIAL_CHECK: PARTIAL_CHECK,
            /**
             * checked completely.
             */
            CHECK: CHECK,
            /**
             * not checked at all.
             */
            EMPTY: EMPTY
        });

    return CheckNode;
}, {
    requires: ['node', './node']
});/**
 * root node represent a check tree
 * @author yiminghe@gmail.com
 */
KISSY.add("tree/check-tree", function (S, Component, CheckNode, TreeRender, TreeManager) {
    /**
     * @name CheckTree
     * @extends Tree.CheckNode
     * @class
     * KISSY Checked Tree.
     * xclass: 'check-tree'.
     * @member Tree
     */
    return  CheckNode.extend([TreeManager], {
    }, {
        ATTRS: /**
         * @lends Tree.CheckTree#
         */
        {
            /**
             * Readonly. Render class.
             * @type {Function}
             */
            xrender: {
                value: TreeRender
            },

            defaultChildCfg: {
                value: {
                    xclass:'check-tree-node'
                }
            }
        }
    }, {
        xclass: 'check-tree',
        priority: 40
    });
}, {
    requires: ['component/base', './check-node', './tree-render', './tree-manager']
});/**
 * common render for node
 * @author yiminghe@gmail.com
 */
KISSY.add("tree/node-render", function (S, Node, Component, TreeNodeTpl, Extension) {

    var SELECTED_CLS = "tree-node-selected",
        COMMON_EXPAND_EL_CLS = "tree-expand-icon-{t}",

    // refreshCss 实际使用顺序
    // expandIconEl
    // iconEl
    // contentEl
        EXPAND_ICON_EL_FILE_CLS = [
            COMMON_EXPAND_EL_CLS
        ].join(" "),
        EXPAND_ICON_EL_FOLDER_EXPAND_CLS = [
            COMMON_EXPAND_EL_CLS + "minus"
        ].join(" "),
        EXPAND_ICON_EL_FOLDER_COLLAPSE_CLS = [
            COMMON_EXPAND_EL_CLS + "plus"
        ].join(" "),
        ICON_EL_FILE_CLS = [
            "tree-file-icon"
        ].join(" "),
        ICON_EL_FOLDER_EXPAND_CLS = [
            "tree-expanded-folder-icon"
        ].join(" "),
        ICON_EL_FOLDER_COLLAPSE_CLS = [
            "tree-collapsed-folder-icon"
        ].join(" "),
    // 实际使用，结束

        ROW_EL_CLS = 'tree-node-row',
        CHILDREN_CLS = "tree-children",
        CHILDREN_CLS_L = "tree-lchildren";

    var CHECK_CLS = "tree-node-checked",
        ALL_STATES_CLS = "tree-node-checked0 tree-node-checked1 tree-node-checked2";

    return Component.Render.extend([Extension.ContentRender],{
        initializer: function () {
            var self = this,
                renderData = self.get('renderData');
            S.mix(self.get('elAttrs'), {
                role: 'tree-node',
                'aria-labelledby': 'ks-content' + renderData.id,
                'aria-expanded': renderData.expanded ? 'true' : 'false',
                'aria-selected': renderData.selected ? 'true' : 'false',
                'aria-level': renderData.depth,
                'title': renderData.tooltip
            });
            S.mix(self.get('childrenElSelectors'), {
                expandIconEl: '#ks-tree-expand-icon{id}',
                rowEl: '#ks-tree-node-row{id}',
                iconEl: '#ks-tree-icon{id}',
                childrenEl: '#ks-tree-children{id}',
                checkIconEl: '#ks-tree-node-checked{id}'
            });
        },

        refreshCss: function (isNodeSingleOrLast, isNodeLeaf) {
            var self = this,
                iconEl = self.get("iconEl"),
                iconElCss,
                expandElCss,
                expandIconEl = self.get("expandIconEl"),
                childrenEl = self.get("childrenEl");

            if (isNodeLeaf) {
                iconElCss = ICON_EL_FILE_CLS;
                expandElCss = EXPAND_ICON_EL_FILE_CLS;
            } else {
                var expanded = self.get("expanded");
                if (expanded) {
                    iconElCss = ICON_EL_FOLDER_EXPAND_CLS;
                    expandElCss = EXPAND_ICON_EL_FOLDER_EXPAND_CLS;
                } else {
                    iconElCss = ICON_EL_FOLDER_COLLAPSE_CLS;
                    expandElCss = EXPAND_ICON_EL_FOLDER_COLLAPSE_CLS;
                }
            }

            iconEl[0].className = self.getCssClassWithPrefix(iconElCss);
            expandIconEl[0].className = self.getCssClassWithPrefix(
                S.substitute(expandElCss, {
                    "t": isNodeSingleOrLast ? "l" : "t"
                })
            );
            childrenEl[0].className =
                self.getCssClassWithPrefix((isNodeSingleOrLast ?
                    CHILDREN_CLS_L : CHILDREN_CLS));
        },

        _onSetExpanded: function (v) {
            var self = this,
                childrenEl = self.get("childrenEl");
            childrenEl[v ? "show" : "hide"]();
            self.get("el").attr("aria-expanded", v);
        },

        _onSetSelected: function (v) {
            var self = this,
                rowEl = self.get("rowEl");
            rowEl[v ? "addClass" : "removeClass"](self.getCssClassWithPrefix(SELECTED_CLS));
            self.get("el").attr("aria-selected", v);
        },

        '_onSetDepth': function (v) {
            this.get("el")[0].setAttribute("aria-level", v);
        },

        _onSetCheckState: function (s) {
            var self = this,
                checkIconEl = self.get("checkIconEl");
            checkIconEl.removeClass(self.getCssClassWithPrefix(ALL_STATES_CLS))
                .addClass(self.getCssClassWithPrefix(CHECK_CLS) + s);
        },

        getChildrenContainerEl: function () {
            return this.get('childrenEl');
        }
    }, {
        ATTRS: {
            contentTpl: {
                value: TreeNodeTpl
            },
            childrenEl: {},
            expandIconEl: {},
            tooltip: {},
            iconEl: {},
            expanded: {
                sync: 0
            },
            rowEl: {},
            depth: {
                sync: 0
            },
            isLeaf: {},
            selected: {
                sync: 0
            },
            checkIconEl: {},
            checkable: {},
            checkState: {
                sync: 0
            }
        },

        HTML_PARSER: {
            rowEl: function (el) {
                return el.one('.' + this.getCssClassWithPrefix(ROW_EL_CLS))
            },
            childrenEl: function (el) {
                return el.one("." + this.getCssClassWithPrefix(CHILDREN_CLS));
            },
            isLeaf: function (el) {
                var self = this;
                if (el.hasClass(self.getCssClassWithPrefix("tree-node-leaf"))) {
                    return true;
                } else if (el.hasClass(self.getCssClassWithPrefix("tree-node-folder"))) {
                    return false;
                }
                return undefined;
            },
            expanded: function (el) {
                return el.one("." + this.getCssClassWithPrefix(CHILDREN_CLS))
                    .css("display") != "none";
            },
            expandIconEl: function (el) {
                return el.one('.' + this.getCssClassWithPrefix('tree-expand-icon'));
            },
            checkState: function (el) {
                var checkIconEl = el.one('.' + this.getCssClassWithPrefix(CHECK_CLS));
                if (checkIconEl) {
                    var allStates = ALL_STATES_CLS.split(/\s+/);
                    for (var i = 0; i < allStates.length; i++) {
                        if (checkIconEl.hasClass(this.getCssClassWithPrefix(allStates[i]))) {
                            return i;
                        }
                    }
                }
                return 0;
            },
            iconEl: function (el) {
                return el.one('.' + this.getCssClassWithPrefix('tree-icon'));
            },
            checkIconEl: function (el) {
                return el.one('.' + this.getCssClassWithPrefix(CHECK_CLS));
            }
        }

    });

}, {
    requires: ['node', 'component/base', './node-tpl','component/extension']
});/*
  Generated by kissy-tpl2mod.
*/
KISSY.add('tree/node-tpl',function(){
 return '<div id="ks-tree-node-row{{id}}" class="{{prefixCls}}tree-node-row {{#if selected}} {{prefixCls}}tree-node-selected {{/if}} "> <div id="ks-tree-expand-icon{{id}}" class="{{prefixCls}}tree-expand-icon"> </div> {{#if checkable}} <div id="ks-tree-node-checked{{id}}" class="{{prefixCls}}tree-node-check {{prefixCls}}tree-node-checked{{checkState}}"></div> {{/if}} <div id="ks-tree-icon{{id}}" class="{{prefixCls}}tree-icon"> </div> <span id="ks-content{{id}}" class="{{prefixCls}}content {{getCssClassWithState "content"}}">{{{content}}}</span> </div> <div id="ks-tree-children{{id}}" class="{{prefixCls}}tree-children" {{#if expanded}} {{else}} style="display:none" {{/if}} > </div>';
});
/**
 * abstraction of tree node ,root and other node will extend it
 * @author yiminghe@gmail.com
 */
KISSY.add("tree/node", function (S, Node, Component,Extension, TreeNodeRender) {
    var $ = Node.all,
        KeyCodes = Node.KeyCodes;

    /**
     * @class
     * Tree Node.
     * xclass: 'tree-node'.
     * @name Node
     * @member Tree
     * @extends KISSY.Component.Controller
     */
    var TreeNode = Component.Controller.extend(
        [
            // 不是所有的子节点都是子组件
            Extension.DecorateChild
        ],
        /**
         * @lends Tree.Node#
         */
        {
            bindUI: function () {
                this.on('afterAddChild', onAddChild);
                this.on('afterRemoveChild', onRemoveChild);
                this.on('afterAddChild afterRemoveChild', syncAriaSetSize);
            },

            syncUI: function () {
                // 集中设置样式
                refreshCss(this);
                syncAriaSetSize.call(this, {
                    target: this
                });
            },

            _keyNav: function (e) {
                var self = this,
                    processed = true,
                    tree = self.get("tree"),
                    expanded = self.get("expanded"),
                    nodeToBeSelected,
                    isLeaf = self.get("isLeaf"),
                    children = self.get("children"),
                    keyCode = e.keyCode;

                // 顺序统统为前序遍历顺序
                switch (keyCode) {
                    // home
                    // 移到树的顶层节点
                    case KeyCodes.HOME:
                        nodeToBeSelected = tree;
                        break;

                    // end
                    // 移到最后一个可视节点
                    case KeyCodes.END:
                        nodeToBeSelected = getLastVisibleDescendant(tree);
                        break;

                    // 上
                    // 当前节点的上一个兄弟节点的最后一个可显示节点
                    case KeyCodes.UP:
                        nodeToBeSelected = getPreviousVisibleNode(self);
                        break;

                    // 下
                    // 当前节点的下一个可显示节点
                    case KeyCodes.DOWN:
                        nodeToBeSelected = getNextVisibleNode(self);
                        break;

                    // 左
                    // 选择父节点或 collapse 当前节点
                    case KeyCodes.LEFT:
                        if (expanded && (children.length || isLeaf === false)) {
                            self.set("expanded", false);
                        } else {
                            nodeToBeSelected = self.get('parent');
                        }
                        break;

                    // 右
                    // expand 当前节点
                    case KeyCodes.RIGHT:
                        if (children.length || isLeaf === false) {
                            if (!expanded) {
                                self.set("expanded", true);
                            } else {
                                nodeToBeSelected = children[0];
                            }
                        }
                        break;

                    default:
                        processed = false;
                        break;
                }

                if (nodeToBeSelected) {
                    nodeToBeSelected.select();
                }

                return processed;
            },

            next: function () {
                var self = this,
                    parent = self.get('parent'),
                    siblings,
                    index;
                if (!parent) {
                    return null;
                }
                siblings = parent.get('children');
                index = S.indexOf(self, siblings);
                if (index == siblings.length - 1) {
                    return null;
                }
                return siblings[index + 1];
            },

            prev: function () {
                var self = this,
                    parent = self.get('parent'),
                    siblings,
                    index;
                if (!parent) {
                    return null;
                }
                siblings = parent.get('children');
                index = S.indexOf(self, siblings);
                if (index === 0) {
                    return null;
                }
                return siblings[index - 1];
            },

            /**
             * Select current tree node.
             */
            select: function () {
                this.set('selected', true);
            },

            performActionInternal: function (e) {
                var self = this,
                    target = $(e.target),
                    expanded = self.get("expanded"),
                    tree = self.get("tree");
                tree.focus();
                if (target.equals(self.get("expandIconEl"))) {
                    self.set("expanded", !expanded);
                } else {
                    self.select();
                    self.fire("click");
                }
            },

            /**
             * override root 's renderChildren to apply depth and css recursively
             */
            renderChildren: function () {
                var self = this;
                TreeNode.superclass.renderChildren.apply(self, arguments);
                // only sync child sub tree at root node
                if (self === self.get('tree')) {
                    registerToTree(self, self, -1, 0);
                }
            },

            _onSetExpanded: function (v) {
                var self = this;
                refreshCss(self);
                self.fire(v ? "expand" : "collapse");
            },

            _onSetSelected: function (v, e) {
                var tree = this.get("tree");
                if (e && e.byPassSetTreeSelectedItem) {
                } else {
                    tree.set('selectedItem', v ? this : null);
                }
            },

            /**
             * Expand all descend nodes of current node
             */
            expandAll: function () {
                var self = this;
                self.set("expanded", true);
                S.each(self.get("children"), function (c) {
                    c.expandAll();
                });
            },

            /**
             * Collapse all descend nodes of current node
             */
            collapseAll: function () {
                var self = this;
                self.set("expanded", false);
                S.each(self.get("children"), function (c) {
                    c.collapseAll();
                });
            }
        },

        {
            ATTRS: {

                xrender: {
                    value: TreeNodeRender
                },

                // 事件代理
                handleMouseEvents: {
                    value: false
                },

                /**
                 * Only For Config.
                 * Whether to force current tree node as a leaf.                 *
                 * It will change as children are added.
                 *
                 * @type {Boolean}
                 */
                isLeaf: {
                    view: 1
                },

                contentEl: {
                    view: 1
                },

                /**
                 * Element for expand icon.
                 * @type {KISSY.NodeList}
                 */
                expandIconEl: {
                    view: 1
                },

                /**
                 * Element for icon.
                 * @type {KISSY.NodeList}
                 */
                iconEl: {
                    view: 1
                },

                /**
                 * Whether current tree node is selected.
                 * @type {Boolean}
                 */
                selected: {
                    view: 1
                },

                /**
                 * Whether current tree node is expanded.
                 * @type {Boolean.}
                 * Defaults to: false.
                 */
                expanded: {
                    sync: 0,
                    value: false,
                    view: 1
                },

                /**
                 * html title for current tree node.
                 * @type {String}
                 */
                tooltip: {
                    view: 1
                },

                /**
                 * Tree instance current tree node belongs to.
                 * @type {Tree}
                 */
                tree: {
                    getter: function () {
                        var from = this;
                        while (from && !from.isTree) {
                            from = from.get('parent');
                        }
                        return from;
                    }
                },

                /**
                 * depth of node.
                 * @type {Number}
                 */
                depth: {
                    view: 1
                },

                focusable: {
                    value: false
                },

                decorateChildCls: {
                    value: 'tree-children'
                },

                defaultChildCfg: {
                    value: {
                        xclass: 'tree-node'
                    }
                }
            }
        }, {
            xclass: 'tree-node',
            priority: 10
        });


    // # ------------------- private start

    function onAddChild(e) {
        if (e.target == this) {
            registerToTree(this, e.component, this.get('depth'), e.index);
        }
    }

    function onRemoveChild(e) {
        var self = this;
        if (e.target == self) {
            recursiveRegister(self.get('tree'), e.component, "_unRegister");
            refreshCssForSelfAndChildren(self, e.index);
        }
    }

    function syncAriaSetSize(e) {
        var self = this;
        if (e.target === self) {
            self.get('el')[0].setAttribute('aria-setsize',
                self.get('children').length);
        }
    }

    function isNodeSingleOrLast(self) {
        var parent = self.get('parent'),
            children = parent && parent.get("children"),
            lastChild = children && children[children.length - 1];

        // 根节点
        // or
        // 父亲的最后一个子节点
        return !lastChild || lastChild == self;
    }

    function isNodeLeaf(self) {
        var isLeaf = self.get("isLeaf");
        // 强制指定了 isLeaf，否则根据儿子节点集合自动判断
        return !(isLeaf === false || (isLeaf === undefined && self.get("children").length));

    }

    function getLastVisibleDescendant(self) {
        var children = self.get("children");
        // 没有展开或者根本没有儿子节点，可视的只有自己
        if (!self.get("expanded") || !children.length) {
            return self;
        }
        // 可视的最后一个子孙
        return getLastVisibleDescendant(children[children.length - 1]);
    }

    // not same with _4e_previousSourceNode in editor !
    function getPreviousVisibleNode(self) {
        var prev = self.prev();
        if (!prev) {
            prev = self.get('parent');
        } else {
            prev = getLastVisibleDescendant(prev);
        }
        return prev;
    }

    // similar to _4e_nextSourceNode in editor
    function getNextVisibleNode(self) {
        var children = self.get("children"),
            n,
            parent;
        if (self.get("expanded") && children.length) {
            return children[0];
        }
        // 没有展开或者根本没有儿子节点
        // 深度遍历的下一个
        n = self.next();
        parent = self;
        while (!n && (parent = parent.get('parent'))) {
            n = parent.next();
        }
        return n;
    }

    /*
     每次添加/删除节点，都检查自己以及自己子孙 class
     每次 expand/collapse，都检查
     */
    function refreshCss(self) {
        if (self.get && self.get("view")) {
            self.get("view").refreshCss(isNodeSingleOrLast(self), isNodeLeaf(self));
        }
    }

    function registerToTree(self, c, depth, index) {
        var tree = self.get("tree");
        if (tree) {
            recursiveRegister(tree, c, "_register", depth + 1);
            refreshCssForSelfAndChildren(self, index);
        }
    }

    function recursiveRegister(tree, c, action, setDepth) {
        tree[action](c);
        if (setDepth !== undefined) {
            c.set("depth", setDepth);
        }
        S.each(c.get("children"), function (child) {
            if (typeof setDepth == 'number') {
                recursiveRegister(tree, child, action, setDepth + 1);
            } else {
                recursiveRegister(tree, child, action);
            }
        });
    }

    function refreshCssForSelfAndChildren(self, index) {
        refreshCss(self);
        index = Math.max(0, index - 1);
        var children = self.get('children'),
            c,
            len = children.length;
        for (; index < len; index++) {
            c = children[index];
            refreshCss(c);
            c.get("el")[0].setAttribute("aria-posinset", index + 1);
        }
    }

    // # ------------------- private end

    return TreeNode;

}, {
    requires: ['node', 'component/base', 'component/extension','./node-render']
});

/**
 * 2012-09-25
 *  - 去除 dblclick 支持，该交互会重复触发 click 事件，可能会重复执行逻辑
 *//**
 * tree management utils render
 * @author yiminghe@gmail.com
 */
KISSY.add("tree/tree-manager-render", function (S) {

    function TreeManagerRender() {
        this.get('elAttrs')['role']='tree';
    }

    TreeManagerRender.ATTRS = {
        // 默认 true
        // 是否显示根节点
        showRootNode: {
        }
    };

    S.augment(TreeManagerRender, {
        __createDom: function () {
            var self = this;
            self.get("rowEl").addClass(self.get('prefixCls') + "tree-row");
        },
        '_onSetShowRootNode': function (v) {
            this.get("rowEl")[v ? "show" : "hide"]();
        }
    });

    return TreeManagerRender;
});/**
 * tree management utils
 * @author yiminghe@gmail.com
 */
KISSY.add("tree/tree-manager", function (S, Event, Component,Extension) {

    function TreeManager() {
    }

    TreeManager.ATTRS =
    /**
     * @lends Tree#
     */
    {
        /**
         * Whether show root node.
         * Defaults to: true.
         * @type {Boolean}
         */
        showRootNode: {
            value: true,
            view: 1
        },
        /**
         * Current selected tree node.
         * @type {KISSY.Tree.Node}
         * @readonly
         */
        selectedItem: {},

        // only root node is focusable
        focusable: {
            value: true
        }
    };

    function getIdFromNode(c) {
        var el = c.get("el");
        var id = el.attr("id");
        if (!id) {
            el.attr("id", id = S.guid("tree-node"));
        }
        return id;
    }

    S.augment(TreeManager,Extension.DelegateChildren, {

        isTree: 1,

        _register: function (c) {
            if (!c.__isRegisted) {
                getAllNodes(this)[getIdFromNode(c)] = c;
                c.__isRegisted = 1;
                //S.log("_register for " + c.get("content"));
            }
        },

        _unRegister: function (c) {
            if (c.__isRegisted) {
                delete getAllNodes(this)[getIdFromNode(c)];
                c.__isRegisted = 0;
                //S.log("_unRegister for " + c.get("content"));
            }
        },

        handleKeyEventInternal: function (e) {
            var current = this.get("selectedItem");
            if (e.keyCode == Event.KeyCodes.ENTER) {
                // 传递给真正的单个子节点
                return current.performActionInternal(e);
            }
            return current._keyNav(e);
        },


        /**
         * Get tree child node by comparing cached child nodes.
         * Faster than default mechanism.
         * @protected
         * @param target
         */
        getOwnerControl: function (target) {
            var self = this,
                n,
                allNodes = getAllNodes(self),
                elem = self.get("el")[0];
            while (target && target !== elem) {
                if (n = allNodes[target.id]) {
                    return n;
                }
                target = target.parentNode;
            }
            // 最终自己处理
            // 所以根节点不用注册！
            return self;
        },

        // 单选
        '_onSetSelectedItem': function (n, ev) {
            // 仅用于排他性
            if (n && ev.prevVal) {
                ev.prevVal.set("selected", false, {
                    data: {
                        byPassSetTreeSelectedItem: 1
                    }
                });
            }
        },

        _onSetFocused: function (v) {
            var self = this;
            Component.Controller.prototype._onSetFocused.apply(self, arguments);
            // 得到焦点时没有选择节点
            // 默认选择自己
            if (v && !self.get("selectedItem")) {
                self.select();
            }
        }
    });

    /*
     加快从事件代理获取原事件节点
     */
    function getAllNodes(self) {
        if (!self._allNodes) {
            self._allNodes = {};
        }
        return self._allNodes;
    }

    return TreeManager;
}, {
    requires: ['event', 'component/base','component/extension']
});/**
 * root node render
 * @author yiminghe@gmail.com
 */
KISSY.add("tree/tree-render", function (S, TreeNodeRender, TreeManagerRender) {
    return TreeNodeRender.extend([TreeManagerRender]);
}, {
    requires:['./node-render', './tree-manager-render']
});/**
 * tree component for kissy
 * @author yiminghe@gmail.com
 */
KISSY.add('tree', function (S, Tree, TreeNode, CheckNode, CheckTree) {
    Tree.Node =TreeNode;
    Tree.CheckNode = CheckNode;
    Tree.CheckTree = CheckTree;
    return Tree;
}, {
    requires: ["tree/base", "tree/node", "tree/check-node", "tree/check-tree"]
});
