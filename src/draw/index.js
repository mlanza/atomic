import {factory} from "atomic/core";
import {elementns, embeds} from "atomic/dom";

const ns = elementns(document, "http://www.w3.org/2000/svg");
const tag = factory(ns);

export const svg = tag("svg");
export const g = tag("g");
export const symbol = tag("symbol");
export function use(link, ...contents){
  const el = ns("use");
  el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', link);
  embeds(el, ...contents);
  return el;
}
export const defs = tag("defs");
export const clipPath = tag("clipPath");
export const metadata = tag("metadata");
export const path = tag("path");
export const line = tag("line");
export const circle = tag("circle");
export const rect = tag("rect");
export const ellipse = tag("ellipse");
export const polygon = tag("polygon");
export const polyline = tag("polyline");
export const image = tag("image");
export const text = tag("text");
export const tspan = tag("tspan");
