import {each} from "atomic/core";
import {DocumentFragment, document} from "dom";
import {embed} from "../../protocols/iembeddable/concrete.js";

export function fragment(...contents){
  const frag = document.createDocumentFragment();
  each(embed(?, frag), contents);
  return frag;
}

DocumentFragment.create = fragment;

export function isDocumentFragment(self){
  return self && self instanceof DocumentFragment;
}