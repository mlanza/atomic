import {extend} from '../protocol.js';
import protocol from '../protocol.js';
import {chain, multimethod} from '../core/function.js';
import {identity} from '../core/core.js';
import Empty from '../core/empty.js';
import * as empty from '../core/empty.js';
import Cons from '../core/cons.js';
import * as cons     from '../core/cons.js';
import * as index    from '../core/index.js';
import * as object   from '../core/object.js';
import * as array    from '../core/array.js';
import * as string   from '../core/string.js';

const Seq = chain(
  protocol({
    first: multimethod(function(obj){
      return obj.hasOwnProperty("length") ? index.first : object.first;
    }),
    rest: multimethod(function(obj){
      return obj.hasOwnProperty("length") ? index.rest : object.rest;
    })
  }),
  extend(String, array), 
  extend(Empty, empty), 
  extend(Cons, cons), 
  extend(Array, array));

export default Seq;
export const rest   = Seq.rest;
export const first  = Seq.first;
