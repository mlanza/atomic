export * from "./object/construct";
import Object from "./object/construct";
export default Object;
import behave from "./object/behave";
behave(Object);
import {invoke} from "../protocols/ifn";
import {reduce} from "../protocols/ireduce";
import {lookup} from "../protocols/ilookup";
import {reducing} from "../types/reduced";
import {apply} from "../types/function";
import {overload, constantly} from "../core";

export function selectKeys(self, keys){
  return reduce(keys, function(memo, key){
    memo[key] = lookup(self, key);
    return memo;
  }, {});
}

function defaults2(self, defaults){
  return Object.assign({}, defaults, self);
}

export const defaults = overload(null, null, defaults2, reducing(defaults2));

export function compile(self){
  return function(...args){
    return apply(invoke, self, args);
  }
}