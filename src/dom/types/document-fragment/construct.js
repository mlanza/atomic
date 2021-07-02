import {each, pre} from "atomic/core";
import {DocumentFragment, document} from "dom";
import {embed} from "../../protocols/iembeddable/concrete.js";
import {isHTMLDocument} from "../html-document/construct.js";

export const fragment = pre(function fragment(document, ...contents){
  const frag = document.createDocumentFragment();
  each(embed(?, frag), contents);
  return frag;
}, isHTMLDocument);

DocumentFragment.create = fragment;

export function isDocumentFragment(self){
  return self && self instanceof DocumentFragment;
}
