import * as _ from "atomic/core";
import {Element, document} from "dom";
import {embed} from "../../protocols/iembeddable.js";
import {isHTMLDocument} from "../html-document/construct.js";

export const element = _.assume(isHTMLDocument, document, _.curry(function element(document, name, ...contents){
  return _.doto(document.createElement(name),
    embed(?, contents));
}, 2));

export const elementns = _.assume(isHTMLDocument, document, _.curry(function elementns(document, ns, name, ...contents){
  return _.doto(document.createElementNS(ns, name),
    embed(?, contents));
}, 3));

export function isElement(self){
  return _.ako(self, Element);
}
