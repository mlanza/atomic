import {is} from "../../protocols/imapentry/concrete.js";
import {overload} from "../../core.js";

export function isMap(self){
  return is(self, Map);
}

function map1(obj){
  return new Map(obj);
}

function map0(){
  return new Map();
}

export const nativeMap = overload(map0, map1); //cannot reuse `map`
