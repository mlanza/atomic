define(['exports', 'atomic/core', 'atomic/dom'], function (exports, _, dom) { 'use strict';

  var ns = _.partial(dom.elementns, "http://www.w3.org/2000/svg");
  var svg = _.partial(ns, "svg");
  var g = _.partial(ns, "g");
  var symbol = _.partial(ns, "symbol");
  function use(link) {
    var el = ns("use");
    el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', link);

    for (var _len = arguments.length, contents = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      contents[_key - 1] = arguments[_key];
    }

    dom.embeds.apply(void 0, [el].concat(contents));
    return el;
  }
  var defs = _.partial(ns, "defs");
  var clipPath = _.partial(ns, "clipPath");
  var metadata = _.partial(ns, "metadata");
  var path = _.partial(ns, "path");
  var line = _.partial(ns, "line");
  var circle = _.partial(ns, "circle");
  var rect = _.partial(ns, "rect");
  var ellipse = _.partial(ns, "ellipse");
  var polygon = _.partial(ns, "polygon");
  var polyline = _.partial(ns, "polyline");
  var image = _.partial(ns, "image");
  var text = _.partial(ns, "text");
  var tspan = _.partial(ns, "tspan");

  exports.circle = circle;
  exports.clipPath = clipPath;
  exports.defs = defs;
  exports.ellipse = ellipse;
  exports.g = g;
  exports.image = image;
  exports.line = line;
  exports.metadata = metadata;
  exports.ns = ns;
  exports.path = path;
  exports.polygon = polygon;
  exports.polyline = polyline;
  exports.rect = rect;
  exports.svg = svg;
  exports.symbol = symbol;
  exports.text = text;
  exports.tspan = tspan;
  exports.use = use;

  Object.defineProperty(exports, '__esModule', { value: true });

});
