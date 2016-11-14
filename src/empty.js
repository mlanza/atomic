import {identity, always, noop} from './core';
import Reduced from './reduced';
import {extend} from './protocol';
import Seq from './protocols/seq';
import Coll from './protocols/coll';
import Clone from './protocols/clone';

export function Empty(){
}

export const EMPTY = new Empty();

export function append(self, value){
  return new Cons(value, always(self));
}

function init(){
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
  reduce: init,
  map: identity,
  filter: identity,
  find: identity
}, Empty);

extend(Seq, {
  seq: identity
}, Empty);

extend(Clone, {
  clone: identity
}, Empty);

export default Empty;