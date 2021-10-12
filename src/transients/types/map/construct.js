import * as _ from "atomic/core";
import Map from "map";

export function isMap(self){
  return _.is(self, Map);
}

function map1(obj){
  return new Map(obj);
}

function map0(){
  return new Map();
}

export const map = _.overload(map0, map1);
