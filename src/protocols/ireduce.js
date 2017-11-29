import {protocol} from '../protocol';
export const IReduce = protocol({reduce: null});
export const reduce = IReduce.reduce;
export default IReduce;