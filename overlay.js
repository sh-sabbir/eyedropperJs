var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({
                    __proto__: []
                }
                instanceof Array && function (d, b) {
                    d.__proto__ = b;
                }) ||
            function (d, b) {
                for (var p in b)
                    if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);

        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import {
    createNode
} from './helpers.js';
var Overlay = /** @class */ (function () {
    function Overlay(args) {
        this.tools = [];
        console.log("overlay: Enabling overlay " + args.width + "x" + args.height + " with cursor " + args.cursor);
        // set options
        this.cursor = args.cursor;
        // toolbox
        if (args.enableToolbox) {
            this._toolbox = new ToolBox();
            this.tools.push(this._toolbox);
        }
        // tooltip
        if (args.enableTooltip) {
            this._tooltip = new ToolTip();
            this.tools.push(this._tooltip);
        }
        // create element
        this.el = createNode('div', {
            id: 'eye-dropper-overlay',
            style: [
                'position: absolute',
                "width: " + args.width + "px",
                "height: " + args.height + "px",
                'opacity: 1',
                'background: none',
                'border: none',
                'z-index: 5000',
            ].join(';'),
        });
        for (var _i = 0, _a = this.tools; _i < _a.length; _i++) {
            var tool = _a[_i];
            this.el.append(tool.el);
        }
        document.body.prepend(this.el);
    }
    Overlay.prototype.hook = function (hook, args) {
        for (var _i = 0, _a = this.tools; _i < _a.length; _i++) {
            var tool = _a[_i];
            tool[hook](args);
        }
    };
    Overlay.prototype.screenshoting = function (state) {
        if (state) {
            console.log('overlay: screenshoting on. Hiding tools.');
            this.hook('hookHide', {});
            this.el.style.cursor = 'progress';
        } else {
            console.log('overlay: screenshoting off. Showing tools.');
            this.hook('hookShow', {});
            this.el.style.cursor = this.cursor;
            // TODO - set new tooltip color - where from without event?
        }
    };
    Overlay.prototype.resized = function (args) {
        console.log("overlay: Resizing overlay " + args.width + "x" + args.height);
        // also don't forget to set overlay
        this.el.style.width = args.width + "px";
        this.el.style.height = args.height + "px";
    };
    Overlay.prototype.deactivate = function () {
        // remove tools
        this.hook('hookDeactivate', {});
        // remove overlay
        // FIXME: kdyz odstranime tak asi neni nutny menit kurzor ne?
        // page.elOverlay.style.cursor = 'default'
        this.el.remove();
    };
    Overlay.prototype.tooltip = function (args) {
        this.hook('hookColor', args);
    };
    return Overlay;
}());
var Tool = /** @class */ (function () {
    function Tool() {}
    Tool.prototype.hookColor = function (args) {
        this.color = args.color;
        this.x = args.x;
        this.y = args.y;
    };
    Tool.prototype.hookDeactivate = function (_args) {
        this.el.remove();
    };
    Tool.prototype.hookShow = function (_args) {
        this.el.style.display = '';
    };
    Tool.prototype.hookHide = function (_args) {
        this.el.style.display = 'none';
    };
    return Tool;
}());
var ToolTip = /** @class */ (function (_super) {
    __extends(ToolTip, _super);

    function ToolTip() {
        var _this = _super.call(this) || this;
        _this.el = createNode('div', {
            id: 'color-tooltip',
            style: [
                'z-index: 1000',
                'color: black',
                'position: absolute',
                'display: none',
                'font-size: 15px',
                'border: 1px solid black',
                'width: 10px',
                'height: 10px',
            ].join(';'),
        });
        return _this;
    }
    ToolTip.prototype.hookColor = function (args) {
        _super.prototype.hookColor.call(this, args);
        // offset is used for positioning element on screen
        var yOffset = Math.round(document.documentElement.scrollTop);
        var xOffset = Math.round(document.documentElement.scrollLeft);
        var fromTop = args.y - yOffset > args.screenHeight / 2 ? -15 : 20;
        var fromLeft = args.x - xOffset < args.screenWidth / 2 ? 15 : -30;
        this.el.style.backgroundColor = "#" + args.color.rgbhex;
        this.el.style.borderColor = "#" + args.color.opposite;
        this.el.style.top = args.y + fromTop + "px";
        this.el.style.left = args.x + fromLeft + "px";
    };
    return ToolTip;
}(Tool));
var ToolBox = /** @class */ (function (_super) {
    __extends(ToolBox, _super);

    function ToolBox() {
        var _this = _super.call(this) || this;
        _this.el = createNode('div', {
            id: 'color-toolbox',
            style: [
                'z-index: 1000',
                'color: black',
                'position: absolute',
                'display: none',
                'font-size: 15px',
                'border: 1px solid black',
                'width: 160px',
                'height: 42px',
                'bottom: 4px',
                'right: 4px',
                'border-radius: 2px',
                '-webkit-box-shadow: 2px 2px 0px rgba(0,0,128,0.25)',
                'background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#0f0f0f), to(#3f3f3f))',
                'color: white',
                'font-family: monospace',
                'border: 1px solid transparent',
                'position: fixed',
            ].join(';'),
        });
        _this.elColor = createNode('div', {
            id: 'color-toolbox-color',
            style: [
                'width: 32px',
                'height: 32px',
                'margin: 4px',
                'margin-right: 8px',
                'float: left',
                'border: 1px solid white',
                'background-color: #ffbbca',
            ].join(';'),
        });
        _this.elText = createNode('div', {
            id: 'color-toolbox-text',
            style: [
                'font-size: 11px',
                'padding: 5px 0px',
                'overflow: hidden',
                'text-align: center',
                'color: white',
            ].join(';'),
        });
        _this.el.append(_this.elColor);
        _this.el.append(_this.elText);
        return _this;
    }
    ToolBox.prototype.hookColor = function (args) {
        _super.prototype.hookColor.call(this, args);
        // let debug_info = DEV_MODE
        //     ? `<div style="font-size: 0.8em">coord: ${args.x},${args.y}</div>`
        //     : ''
        this.elText.innerHTML = "#" + this.color.rgbhex + "<br/>rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")";
        this.elColor.style.backgroundColor = "#" + this.color.rgbhex;
    };
    return ToolBox;
}(Tool));
export default Overlay;
