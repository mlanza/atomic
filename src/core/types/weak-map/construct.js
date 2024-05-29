import {is} from "../../protocols/imapentry/concrete.js";
import {overload} from "../../core.js";

export function isWeakMap(self){
  return is(self, WeakMap);
}

function weakMap1(obj){
  return new WeakMap(obj);
}

function weakMap0(){
  return new WeakMap();
}

export const weakMap = overload(weakMap0, weakMap1);
