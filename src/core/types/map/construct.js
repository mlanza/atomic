import * as _ from "atomic/core";

export function isMap(self){
  return _.is(self, Map);
}

function map1(obj){
  return new Map(obj);
}

function map0(){
  return new Map();
}

export const createMap = _.overload(map0, map1); //cannot reuse `map`
