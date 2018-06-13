import {multimethod} from "../types/multimethod/construct";
import {isElement} from "../types/element/construct";
import {isString} from "../types/string/construct";
import {isFunction} from "../types/function/construct";
import {signature, or} from "../api/predicates";
import {IEvented} from "../protocols";

export const matches = multimethod();

function isNode(self){
  return self instanceof Node;
}

IEvented.on(matches, signature(isElement, isString), function(el, selector){
  return el.matches(selector) ? el : null;
});

IEvented.on(matches, signature(isNode, isFunction), function(el, pred){
  return pred(el) ? el : null;
});