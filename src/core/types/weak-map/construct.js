import WeakMap from 'weak-map';
export default WeakMap;

export function isWeakMap(self){
  return self && self.constructor === WeakMap;
}

export function weakMap(obj){
  return new WeakMap(obj);
}