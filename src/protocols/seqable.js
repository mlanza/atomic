import {protocol} from '../protocol';
export const Seqable = protocol({seq: null});
export const seq = Seqable.seq;
export default Seqable;