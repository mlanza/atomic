import {flip} from '../core.js';
import {protocol} from '../protocol.js';
export const Reduce = protocol({reduce: null});
export const reduce = flip(Reduce.reduce, 3);
export default Reduce;