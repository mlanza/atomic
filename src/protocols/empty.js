import {extend} from '../protocol.js';
import protocol from '../protocol.js';
import {chain} from '../core/function.js';
import * as index    from '../core/index.js';
import * as object   from '../core/object.js';
import * as array    from '../core/array.js';
import * as string   from '../core/string.js';
import * as cons     from '../core/cons.js';
import Cons          from '../core/cons.js';

const Empty = chain(
  protocol({
    empty: index.empty,
    isEmpty: index.isEmpty
  }),
  extend(Cons, {
    empty: cons.empty,
    isEmpty: cons.isEmpty
  }), 
  extend(String, {
    empty: string.empty,
    isEmpty: string.isEmpty
  }), 
  extend(Array, {
    empty: array.empty,
    isEmpty: array.isEmpty
  }), 
  extend(Object, {
    empty: object.empty,
    isEmpty: object.isEmpty
  }));

export default Empty;
export const empty   = Empty.empty;
export const isEmpty = Empty.isEmpty;
