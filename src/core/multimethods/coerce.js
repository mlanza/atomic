import {multimethod} from "../types/multimethod/construct";
import {satisfies} from "../types/protocol/concrete";
import {isArray} from "../types/array/construct";
import {isObject} from "../types/object/construct";
import {signature} from "../predicates";
import {method} from "../types/method/construct";
import {append} from "../protocols/iappendable/concrete";
import {IArray, IObject} from "../protocols";

export const coerce = multimethod();
append(coerce, method(signature(isArray, satisfies(IArray)), IArray.toArray));
append(coerce, method(signature(isObject, satisfies(IObject)), IObject.toObject));

export function become(self, other){
  return coerce(other, self);
}