import {overload} from "../../core";
import IHierarchy from "./instance";
import {first} from "../iseq/concrete";
import {count} from "../icounted/concrete";
import {deref} from "../ideref/concrete";
import {path} from "../ipath/concrete";
import {lens} from "../../types/lens/construct";
import {cons} from "../../types/list/construct";
import {emptyList} from "../../types/empty-list/construct";
import {map, mapcat, remove} from "../../types/lazy-seq/concrete";
import {concat} from "../../types/concatenated/construct";
import {comp, juxt} from "../../types/function/concrete";
import {_ as v} from "param.macro";

export function downward(f){
  return function down(self){
    const xs = f(self),
          ys = mapcat(down, xs);
    return concat(xs, ys);
  }
}

export function upward(f){
  return function up(self){
    const other = f(self);
    return other ? cons(other, up(other)) : emptyList();
  }
}

export const root = IHierarchy.root;
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
  return first(descendants(document));
}

export const sel1 = overload(sel10, sel11, sel12);

export function leaves(self){
  return remove(comp(count, children), descendants(self));
}

export const asLeaves = comp(map(juxt(path, deref), v), leaves, lens);