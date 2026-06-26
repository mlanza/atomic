import * as _ from "atomic/core";

export const isWeakMap = x => _.is(x, WeakMap);

function weakMap1(obj){
  return new WeakMap(obj);
}

function weakMap0(){
  return new WeakMap();
}

export const weakMap = _.overload(weakMap0, weakMap1);
