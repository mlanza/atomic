import {overload, comp} from "../../core.js";
import {IHierarchy} from "./instance.js";
import {first} from "../iseq.js";
import {count} from "../icounted/concrete.js";
import {deref} from "../ideref/concrete.js";
import {path} from "../ipath/concrete.js";
import {cons} from "../../types/list/construct.js";
import {emptyList} from "../../types/empty-list/construct.js";
import {map, mapcat, remove, concat} from "../../types/lazy-seq/concrete.js";
import {juxt} from "../../types/function/concrete.js";

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

export function leaves(self){
  return remove(comp(count, children), descendants(self));
}
