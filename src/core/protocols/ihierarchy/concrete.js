import {overload} from "../../core";
import IHierarchy from "./instance";
import ISeq from "../iseq";

export const parent = IHierarchy.parent;
export const parents = IHierarchy.parents;
export const closest = IHierarchy.closest;
export const ancestors = IHierarchy.parents;
export const children = IHierarchy.children;
export const descendants = IHierarchy.descendants;
export const nextSibling = IHierarchy.nextSibling;
export const prevSibling = IHierarchy.prevSibling;
export const nextSiblings = IHierarchy.nextSiblings;
export const prevSiblings = IHierarchy.prevSiblings;
export const siblings = IHierarchy.siblings;

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
