import {multimethod} from "../types/multimethod/construct";
import {isFunction} from "../types/function/construct";
import {isElement} from "../types/element/construct";
import {signature} from "../predicates";
import {IEvented, IHierarchy} from "../protocols";

export const before = multimethod();
export const after  = multimethod();

IEvented.on(before.instance, signature(isElement, isElement), function(self, other){
  const parent = IHierarchy.parent(self);
  parent.insertBefore(other, self);
  return self;
});

IEvented.on(after.instance, signature(isElement, isElement), function(self, other){
  const relative = IHierarchy.nextSibling(self), parent = IHierarchy.parent(self);
  relative ? parent.insertBefore(other, relative) : parent.prepend(other);
  return self;
});

IEvented.on(before.instance, signature(isElement, isFunction), function(self, other){
  return before(self, other());
});

IEvented.on(after.instance, signature(isElement, isFunction), function(self, other){
  return after(self, other());
});