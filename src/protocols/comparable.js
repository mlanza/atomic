import {curry} from '../core';
import {protocol} from '../protocol';
export function _compare(x, y){
  if (x > y) return +1;
  if (x < y) return -1;
  return 0;
}
export function desc(compare){
  return function(){
    return compare.apply(this, arguments) * -1;
  }
}
export const Comparable = protocol({
  compare: _compare
});
export const compare = Comparable.compare;
export default Comparable;