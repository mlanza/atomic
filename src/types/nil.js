import {identity, constantly, NIL, FALSE} from '../core';
import {extend} from '../protocol';
import Emptyable from '../protocols/emptyable';
import Seqable from '../protocols/seqable';
import Seq from '../protocols/seq';
import Next from '../protocols/next';
import Reduce from '../protocols/reduce';
import Collection from '../protocols/collection';
import Prepend from '../protocols/prepend';
import Associative from '../protocols/associative';
import Lookup from '../protocols/lookup';
import List from '../types/list';
import {EMPTY} from '../types/empty';
export {NIL} from '../core';

function reduce(){
  return arguments[2];
}

function assoc(self, key, value){
  var obj = {};
  obj[key] = value;
  return obj;
}

function prepend(self, value){
  return new List(value);
}

export default extend(null, Collection, {
  conj: prepend
}, Prepend, {
  prepend: prepend
}, Lookup, {
  get: NIL
}, Associative, {
  assoc: assoc,
  hasKey: FALSE
}, Emptyable, {
  seq: identity
}, Seqable, {
  seq: identity
}, Reduce, {
  reduce: reduce
}, Seq, {
  first: NIL,
  rest:  constantly(EMPTY)
}, Next, {
  next: NIL
});