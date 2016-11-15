import {identity, always, noop} from '../core';
import {extend} from '../protocol';
import Reduced from '../types/reduced';
import List from '../types/list';
import Seq from '../protocols/seq';
import Coll from '../protocols/coll';

export function Empty(){
}

export const EMPTY = new Empty();

export function append(self, value){
  return new List(value, always(self));
}

function reduce(){
  return arguments[2];
}

extend(Coll, {
  empty: identity,
  isEmpty: always(true),
  toArray: always([]),
  toObject: always({}),
  first: always(null),
  rest: identity,
  initial: identity,
  append: append,
  each: noop,
  reduce: reduce,
  map: identity,
  filter: identity,
  find: identity
}, Empty);

extend(Seq, {
  seq: identity
}, Empty);

export default Empty;