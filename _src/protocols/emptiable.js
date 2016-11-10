import {extend} from '../protocol.js';
import protocol from '../protocol.js';
import {chain} from '../core/function.js';
import * as index    from '../core/index.js';
import * as object   from '../core/object.js';
import * as array    from '../core/array.js';
import * as string   from '../core/string.js';
import * as _empty   from '../core/empty.js';
import Empty         from '../core/empty.js';
import * as cons     from '../core/cons.js';
import Cons          from '../core/cons.js';

const Emptiable = chain(
  protocol({
    empty: index.empty,
    isEmpty: index.isEmpty
  }),
  extend(Empty, _empty),
  extend(Cons, cons), 
  extend(String, string), 
  extend(Array, array), 
  extend(Object, object));

export default Emptiable;
export const empty   = Emptiable.empty;
export const isEmpty = Emptiable.isEmpty;
