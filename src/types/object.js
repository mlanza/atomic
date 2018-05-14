export * from "./object/construct";
import Object from "./object/construct";
export default Object;
import behave from "./object/behave";
behave(Object);
import {reduce} from "../protocols/ireduce";
import {lookup} from "../protocols/ilookup";
import {reducing} from "../types/reduced";
import {curry} from "../types/function";
import {overload} from "../core";

export function selectKeys(self, keys){
  return reduce(function(memo, key){
    memo[key] = lookup(self, key);
    return memo;
  }, {}, keys);
}

function defaults2(self, defaults){
  return Object.assign({}, defaults, self);
}

export const defaults = overload(null, curry(defaults2, 2), defaults2, reducing(defaults2));