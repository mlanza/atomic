import {overload} from "../core";
import {IHierarchy, ISeq} from "../protocols";

function sel12(selector, context){
  return IHierarchy.sel1(context, selector);
}

function sel11(selector){
  return IHierarchy.sel1(document, selector);
}

function sel10(){
  return ISeq.first(IHierarchy.descendants(document));
}

export const sel1 = overload(sel10, sel11, sel12);
