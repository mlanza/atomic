import {identity, constantly} from '../core';
import {extend} from '../protocol';
import Emptyable from '../protocols/emptyable';
import Seqable from '../protocols/seqable';
import Seq from '../protocols/seq';
import Next from '../protocols/next';
import Reduce from '../protocols/reduce';
import Deref from '../protocols/deref';
import Collection from '../protocols/collection';
import Prepend from '../protocols/prepend';
import Associative from '../protocols/associative';
import Lookup from '../protocols/lookup';
import List from '../types/list';
import {EMPTY} from '../types/empty';

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

export default extend(null, Deref, {
  deref: constantly(null)
}, Collection, {
  conj: prepend
}, Prepend, {
  prepend: prepend
}, Lookup, {
  get: constantly(null)
}, Associative, {
  assoc: assoc,
  hasKey: constantly(false)
}, Emptyable, {
  seq: identity
}, Seqable, {
  seq: identity
}, Reduce, {
  reduce: reduce
}, Seq, {
  first: constantly(null),
  rest:  constantly(EMPTY)
}, Next, {
  next: constantly(null)
});