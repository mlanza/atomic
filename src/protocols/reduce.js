import {flip} from '../core';
import {protocol} from '../protocol';
export const Reduce = protocol({reduce: null});
export const reduce = flip(Reduce.reduce, 3);
export default Reduce;