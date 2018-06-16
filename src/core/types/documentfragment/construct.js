import {IReduce} from '../../protocols';

export default DocumentFragment;

function frag(children){
  return IReduce.reduce(children, function(memo, child){
    memo.appendChild(child);
    return memo;
  }, document.createDocumentFragment());
}

DocumentFragment.from = frag;

export function isDocumentFragment(self){
  return self && self instanceof DocumentFragment;
}