import {protocol, satisfies} from '../protocol';
import {indexedSeq} from '../types/indexed-seq';
export const Seqable = protocol({
  seq: function(obj){
    if (obj && obj.callee && obj.length) return indexedSeq(obj); //arguments object
    throw new "seq not implemented";
  }
});
export const seq = Seqable.seq;
export default Seqable;