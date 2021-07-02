import {each, partial, flatten, curry, pre, apply, signatureHead, isString} from "atomic/core";
import {Element} from "dom";
import {embed, embeds} from "../../protocols/iembeddable.js";
import {isHTMLDocument} from "../html-document/construct.js";

export const element = curry(pre(function element(document, name, ...contents){
  const el = document.createElement(name);
  apply(embeds, el, flatten(contents));
  return el;
}, signatureHead(isHTMLDocument, isString)), 2);

export const elementns = curry(pre(function elementns(document, ns, name, ...contents){
  const el = document.createElementNS(ns, name);
  apply(embeds, el, flatten(contents));
  return el;
}, signatureHead(isHTMLDocument, isString, isString)), 3);

export function isElement(self){
  return self instanceof Element;
}
