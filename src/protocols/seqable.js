import {protocol, satisfies} from '../protocol.js';
export const Seqable = protocol({seq: null});
export const seq = Seqable.seq;
export default Seqable;