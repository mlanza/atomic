import {extend} from '../protocol.js';
import protocol from '../protocol.js';
import {chain, subj} from '../core/function.js';
import * as object   from '../core/object.js';
import * as index    from '../core/index.js';
import * as array    from '../core/array.js';
import * as string   from '../core/string.js';
import * as cons     from '../core/cons.js';
import Cons          from '../core/cons.js';

const Reduce = chain(
  protocol({
    reduce: index.reduce
  }),
  extend(Cons, {
    reduce: cons.reduce
  }),
  extend(String, {
    reduce: string.reduce
  }), 
  extend(Array, {
    reduce: array.reduce
  }), 
  extend(Object, {
    reduce: object.reduce
  }));

export default Reduce;
export const reduce  = Reduce.reduce;
