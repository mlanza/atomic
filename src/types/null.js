import {identity, constantly, noop, isNull} from '../core';
import {extend} from '../protocol';
import Emptyable from '../protocols/emptyable';
import Seqable from '../protocols/seqable';
import Seq from '../protocols/seq';
import Next from '../protocols/next';
import Reduce from '../protocols/reduce';
import Deref from '../protocols/deref';
import Collection from '../protocols/collection';
import Associative from '../protocols/associative';
import Lookup from '../protocols/lookup';
import List from '../types/list';
import {EMPTY} from '../types/empty.js';

function reduce(){
  return arguments[2];
}

function assoc(self, key, value){
  var obj = {};
  obj[key] = value;
  return obj;
}

function conj(self, value){
  return new List(value, constantly(EMPTY));
}

extend(Deref, null, {
  deref: constantly(null)
});

extend(Collection, null, {
  conj: conj
});

extend(Lookup, null, {
  lookup: constantly(null)
});

extend(Associative, null, {
  assoc: assoc,
  hasKey: constantly(false)
});

extend(Emptyable, null, {
  seq: identity
});

extend(Seqable, null, {
  seq: identity
});

extend(Reduce, null, {
  reduce: reduce
});

extend(Seq, null, {
  first: constantly(null),
  rest:  constantly(EMPTY)
});

extend(Next, null, {
  next: constantly(null)
});

export default null;