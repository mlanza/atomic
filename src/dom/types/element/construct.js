import {each, partial, curry, handle, flatten, apply} from "atomic/core";
import {Element} from "dom";
import {embed, embeds} from "../../protocols/iembeddable.js";
import {passDocumentDefault} from "../html-document/construct.js";

export const element = passDocumentDefault(curry(function element(document, name, ...contents){
  const el = document.createElement(name);
  apply(embeds, el, flatten(contents));
  return el;
}, 2));

export const elementns = passDocumentDefault(curry(function elementns(document, ns, name, ...contents){
  const el = document.createElementNS(ns, name);
  apply(embeds, el, flatten(contents));
  return el;
}, 3));

export function isElement(self){
  return self instanceof Element;
}
