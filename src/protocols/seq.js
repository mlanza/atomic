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
    first: function(value){ //TODO fix 
      return value;  
    },
    rest: function(value) { //TODO fix
      return value;
    }
  }),
  extend(String, {
    first: array.first,
    rest: array.rest
  }), 
  extend(Cons, {
    first: cons.first,
    rest: cons.rest
  }), 
  extend(Array, {
    first: array.first,
    rest: array.rest
  }), 
  extend(Object, {
    first: object.first,
    rest: object.rest
  }));

export default Seq;
export const rest   = Seq.rest;
export const first  = Seq.first;
