import {multimethod} from "../types/multimethod/construct";
import {satisfies} from "../types/protocol/concrete";
import {isArray} from "../types/array/construct";
import {isObject} from "../types/object/construct";
import {signature} from "../predicates";
import {IEvented, IArray, IObject} from "../protocols";

export const coerce = multimethod();

IEvented.on(coerce, signature(isArray, satisfies(IArray)), function(self, other){
  return IArray.toArray(other);
});

IEvented.on(coerce, signature(isObject, satisfies(IObject)), function(self, other){
  return IObject.toObject(other);
});

export function become(self, other){
  return coerce(other, self);
}