import {factory} from "atomic/core";
import {elementns, embeds, tags} from "atomic/dom";
import {document} from "dom";

export const ns = elementns(document, "http://www.w3.org/2000/svg");
export const svgTags = ["svg", "g", "symbol", "defs", "clipPath", "metadata", "path", "line", "circle", "rect", "ellipse", "polygon", "polyline", "image", "text", "tspan"];
export const {svg, g, symbol, defs, clipPath, metadata, path, line, circle, rect, ellipse, polygon, polyline, image, text, tspan} = tags(ns, svgTags);
export function use(link, ...contents){
  const el = ns("use");
  el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', link);
  embeds(el, ...contents);
  return el;
}
