import {extend} from '../protocol.js';
import protocol from '../protocol.js';
import {chain, subj} from '../core/function.js';
import * as index    from '../core/index.js';
import * as object   from '../core/object.js';
import * as array    from '../core/array.js';
import * as string   from '../core/string.js';
import * as cons     from '../core/cons.js';
import Cons from '../core/cons.js';

const Seq = chain(
  protocol({
    each: index.each,
    reduce: index.reduce,
    first: null,
    rest: null
  }),
  extend(String, {
    each: string.each,
    reduce: string.reduce,
    first: array.first,
    rest: array.rest
  }), 
  extend(Cons, {
    each: cons.each,
    reduce: cons.reduce,
    first: cons.first,
    rest: cons.rest
  }), 
  extend(Array, {
    each: array.each,
    reduce: array.reduce,
    first: array.first,
    rest: array.rest
  }), 
  extend(Object, {
    each: object.each,
    reduce: object.reduce,
    first: null,
    rest: null
  }));

export default Seq;
export const each   = subj(Seq.each, 2); //TODO don't export as curried at this time -- do above as other top-level modules do.
export const reduce = subj(Seq.reduce, 3);
