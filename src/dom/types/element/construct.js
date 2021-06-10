import {each, partial, flatten, apply} from "atomic/core";
import {Element} from "dom";
import {embed, embeds} from "../../protocols/iembeddable.js";

export function element(name, ...contents){
  const el = document.createElement(name);
  apply(embeds, el, flatten(contents));
  return el;
}

export function elementns(ns, name, ...contents){
  const el = document.createElementNS(ns, name);
  apply(embeds, el, flatten(contents));
  return el;
}

export function isElement(self){
  return self instanceof Element;
}