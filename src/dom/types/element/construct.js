import * as _ from "atomic/core";
import {Element, document} from "dom";
import {embed, embeds} from "../../protocols/iembeddable.js";
import {isHTMLDocument} from "../html-document/construct.js";

export const element = _.assume(isHTMLDocument, document, _.curry(function element(document, name, ...contents){
  const el = document.createElement(name);
  _.apply(embeds, el, _.flatten(contents));
  return el;
}, 2));

export const elementns = _.assume(isHTMLDocument, document, _.curry(function elementns(document, ns, name, ...contents){
  const el = document.createElementNS(ns, name);
  _.apply(embeds, el, _.flatten(contents));
  return el;
}, 3));

export function isElement(self){
  return self instanceof Element;
}
