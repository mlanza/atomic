import {multimethod} from "../types/multimethod/construct";
import {isElement} from "../types/element/construct";
import {isString} from "../types/string/construct";
import {isFunction} from "../types/function/construct";
import {signature, or} from "../predicates";
import * as p from "../protocols";

export const matches = multimethod();

p.on(matches.instance, signature(isElement, isString), function(el, selector){
  return el.matches(selector);
});

p.on(matches.instance, signature(isElement, isFunction), function(el, pred){
  return pred(el);
});