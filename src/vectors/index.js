import {partial} from "atomic/core";
import {elementns, embeds} from "atomic/dom";

export const ns = partial(elementns, "http://www.w3.org/2000/svg");
export const svg = partial(ns, "svg");
export const g = partial(ns, "g");
export const symbol = partial(ns, "symbol");
export function use(link, ...contents){
  const el = ns("use");
  el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', link);
  embeds(el, ...contents);
  return el;
}
export const defs = partial(ns, "defs");
export const clipPath = partial(ns, "clipPath");
export const metadata = partial(ns, "metadata");
export const path = partial(ns, "path");
export const line = partial(ns, "line");
export const circle = partial(ns, "circle");
export const rect = partial(ns, "rect");
export const ellipse = partial(ns, "ellipse");
export const polygon = partial(ns, "polygon");
export const polyline = partial(ns, "polyline");
export const image = partial(ns, "image");
export const text = partial(ns, "text");
export const tspan = partial(ns, "tspan");