import {overload} from "../../core";
import WeakMap from 'weak-map';
export default WeakMap;

export function isWeakMap(self){
  return self && self.constructor === WeakMap;
}

function weakMap1(obj){
  return new WeakMap(obj);
}

function weakMap0(){
  return new WeakMap();
}

export const weakMap = overload(weakMap0, weakMap1);