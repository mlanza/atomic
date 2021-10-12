import * as _ from "atomic/core";
import WeakMap from "weak-map";

export function isWeakMap(self){
  return _.is(self, WeakMap);
}

function weakMap1(obj){
  return new WeakMap(obj);
}

function weakMap0(){
  return new WeakMap();
}

export const weakMap = _.overload(weakMap0, weakMap1);
