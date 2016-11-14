import {protocol} from '../protocol.js';
import {EMPTY} from '../empty.js';
export const Seq = protocol({
  seq: function(value){
    if (value == null) return EMPTY;
  }
});
export const seq = Seq.seq;
export default Seq;