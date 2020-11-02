import {each, global, partial, flatten, apply} from 'atomic/core';
import {embed, embeds} from "../../protocols/iembeddable";
import {_ as v} from "param.macro";

export const Element = global.Element;

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