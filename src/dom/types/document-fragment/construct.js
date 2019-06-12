import {each} from 'atomic/core';
import {embed} from "../../protocols/iembeddable/concrete";
import {_ as v} from "param.macro";

export default DocumentFragment;

export function fragment(...contents){
  const frag = document.createDocumentFragment();
  each(embed(v, frag), contents);
  return frag;
}

DocumentFragment.create = fragment;

export function isDocumentFragment(self){
  return self && self instanceof DocumentFragment;
}