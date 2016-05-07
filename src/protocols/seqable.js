import {extend} from '../protocol.js';
import protocol from '../protocol.js';
import {chain} from '../core/function.js';
import {identity} from '../core/core.js';
import Cons from '../core/cons.js';
import Seq  from '../protocols/seq.js';
import {seq as _seq} from '../protocols/seq.js';
import * as object   from '../core/object.js';
import * as array    from '../core/array.js';
import * as string   from '../core/string.js';

const Seqable = chain(
  protocol({
    seq: _seq
  }),
  extend(String, {
    seq: array.seq
  }), 
  extend(Cons, {
    seq: identity
  }), 
  extend(Array, {
    seq: array.seq
  }), 
  extend(Object, {
    seq: object.seq
  }));

export default Seqable;
export const seq   = Seqable.seq;
