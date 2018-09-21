import {IReduce, ICollection} from 'cloe/core';

export default DocumentFragment;

export function fragment(...contents){
  return IReduce.reduce(contents, ICollection.conj, document.createDocumentFragment());
}

DocumentFragment.create = fragment;

export function isDocumentFragment(self){
  return self && self instanceof DocumentFragment;
}