import {overload} from "../core";
import {IHierarchy} from "../protocols";

function sel2(selector, context){
  return IHierarchy.sel(context, selector);
}

function sel1(selector){
  return IHierarchy.sel(document, selector);
}

function sel0(){
  return IHierarchy.descendants(document);
}

export const sel = overload(sel0, sel1, sel2);
