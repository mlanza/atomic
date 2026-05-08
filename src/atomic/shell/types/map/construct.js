import * as _ from "atomic/core";

export const isMap = _.is(?, Map);

function map1(entries = []){
  return new Map(_.toArray(entries));
}

function map0(){
  return new Map();
}

export const nativeMap = _.overload(map0, map1);
