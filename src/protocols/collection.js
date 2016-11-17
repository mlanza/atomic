import {constantly} from '../core';
import {protocol} from '../protocol';
import List from '../types/list';
function conj(self, value){
  return new List(value, constantly(self));
}
export const Collection = protocol({conj: conj, cons: conj});
export default Collection;