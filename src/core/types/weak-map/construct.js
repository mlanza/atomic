export default WeakMap;

export function isWeakMap(self){
  return self && self.constructor === WeakMap;
}