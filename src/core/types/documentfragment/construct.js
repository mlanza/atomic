import {IReduce, ICollection} from '../../protocols';

export default DocumentFragment;

export function fragment(...contents){
  return IReduce.reduce(contents, ICollection.conj, document.createDocumentFragment());
}

DocumentFragment.from = fragment;

export function isDocumentFragment(self){
  return self && self instanceof DocumentFragment;
}