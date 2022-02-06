import * as _ from './core.js';
import * as dom from './dom.js';

const taglist = ["svg", "g", "symbol", "defs", "clipPath", "metadata", "path", "line", "circle", "rect", "ellipse", "polygon", "polyline", "image", "text", "tspan"];

function tags2(document, list) {
  const ns = dom.elementns(document, "http://www.w3.org/2000/svg");
  const tags = dom.tags(ns, list);

  function use(link, ...contents) {
    const el = ns("use", contents);
    el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', link);
    return el;
  }

  tags["use"] = use;
  return tags;
}

function tags1(document) {
  return tags2(document, taglist);
}

const tags = _.overload(null, tags1, tags2);
const {
  svg,
  g,
  symbol,
  defs,
  clipPath,
  metadata,
  path,
  line,
  circle,
  rect,
  ellipse,
  polygon,
  polyline,
  image,
  text,
  tspan,
  use
} = tags(document);

export { circle, clipPath, defs, ellipse, g, image, line, metadata, path, polygon, polyline, rect, svg, symbol, taglist, tags, text, tspan, use };
