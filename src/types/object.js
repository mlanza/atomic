export * from "./object/construct";
import Object from "./object/construct";
export default Object;
import behave from "./object/behave";
behave(Object);
import {reduce} from "../protocols/ireduce";
import {lookup} from "../protocols/ilookup";

export function selectKeys(self, keys){
  return reduce(function(memo, key){
    memo[key] = lookup(self, key);
    return memo;
  }, {}, keys);
}
