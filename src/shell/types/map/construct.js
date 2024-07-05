import * as _ from "atomic/core";

export const isMap = _.is(?, Map);

function map1(obj){
  return new Map(obj);
}

function map0(){
  return new Map();
}

export const nativeMap = _.overload(map0, map1);
