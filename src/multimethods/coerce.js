import {multimethod} from "../types/multimethod/construct";
import {isArray} from "../types/array/construct";
import {isObject} from "../types/object/construct";
import {signature} from "../predicates";
import {IEvented, IArray, canBecomeArray, IObject, canBecomeObject} from "../protocols";

export const coerce = multimethod();

IEvented.on(coerce, signature(isArray, canBecomeArray), function(self, other){
  return IArray.toArray(other);
});

IEvented.on(coerce, signature(isObject, canBecomeObject), function(self, other){
  return IObject.toObject(other);
});

export function become(self, other){
  return coerce(other, self);
}