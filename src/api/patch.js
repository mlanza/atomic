import {mergeWith} from "./mergeWith";
import {isFunction} from "../types/function/construct";

export default function patch(...maps){
  return mergeWith(function(prior, value){
    return isFunction(value) ? value(prior) : value;
  }, ...maps);
}

export {patch};