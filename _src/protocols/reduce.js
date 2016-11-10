import {extend} from '../protocol.js';
import protocol from '../protocol.js';
import {chain, subj} from '../core/function.js';
import * as object   from '../core/object.js';
import * as index    from '../core/index.js';
import * as array    from '../core/array.js';
import * as string   from '../core/string.js';
import * as cons     from '../core/cons.js';
import Cons          from '../core/cons.js';
import Empty from '../core/empty.js';
import * as empty from '../core/empty.js';

const Reduce = chain(
  protocol({
    reduce: index.reduce
  }),
  extend(Empty, empty),
  extend(Cons, cons),
  extend(String, string), 
  extend(Array, array), 
  extend(Object, object));

export default Reduce;
export const reduce  = Reduce.reduce;
