import {extend} from '../protocol.js';
import protocol from '../protocol.js';
import {chain} from '../core/function.js';
import * as object   from '../core/object.js';
import * as index    from '../core/index.js';
import * as array    from '../core/array.js';
import * as string   from '../core/string.js';
import * as cons     from '../core/cons.js';
import Cons          from '../core/cons.js';

const Each = chain(
  protocol({
    each: index.each
  }),
  extend(Cons, {
    each: cons.each
  }), 
  extend(String, {
    each: string.each
  }), 
  extend(Array, {
    each: array.each
  }), 
  extend(Object, {
    each: object.each
  }));

export default Each;
export const each  = Each.each;
