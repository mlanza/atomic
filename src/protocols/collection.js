import {always, flip} from '../core';
import {protocol} from '../protocol';
import {conj as _conj} from '../types/list';
export const Collection = protocol({conj: _conj, cons: _conj});
export const conj = flip(Collection.conj, 2);
export const cons = flip(Collection.cons, 2);
export default Collection;