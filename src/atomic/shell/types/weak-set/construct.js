import * as _ from "atomic/core";

export const isWeakSet = x => _.is(x, WeakSet);

function weakSet1(arr){
  return new WeakSet(arr);
}

function weakSet0(){
  return new WeakSet();
}

export const weakSet = _.overload(weakSet0, weakSet1);
