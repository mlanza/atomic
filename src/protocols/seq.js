import {extend} from '../protocol.js';
import protocol from '../protocol.js';
import {chain, subj} from '../core/function.js';
import Cons from '../core/cons.js';
import * as cons     from '../core/cons.js';
import * as index    from '../core/index.js';
import * as object   from '../core/object.js';
import * as array    from '../core/array.js';
import * as string   from '../core/string.js';

const Seq = chain(
  protocol({
    each: index.each,
    reduce: index.reduce,
    first: function(value){
      return value;  
    },
    rest: function(value) {
      return value;
    }
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
    first: object.first,
    rest: object.rest
  }));

export default Seq;
export const each   = Seq.each;
export const reduce = Seq.reduce;
export const rest   = Seq.rest;
export const first  = Seq.first;
