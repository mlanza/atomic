import * as _ from "atomic/core";

export const isWeakSet = _.is(?, WeakSet);

function weakSet1(arr){
  return new WeakSet(arr);
}

function weakSet0(){
  return new WeakSet();
}

export const weakSet = _.overload(weakSet0, weakSet1);
