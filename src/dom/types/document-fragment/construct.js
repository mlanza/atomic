import {conj, reduce} from 'cloe/core';

export default DocumentFragment;

export function fragment(...contents){
  return reduce(conj, document.createDocumentFragment(), contents);
}

DocumentFragment.create = fragment;

export function isDocumentFragment(self){
  return self && self instanceof DocumentFragment;
}