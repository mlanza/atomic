import {identity, always, noop} from './core';
import Clone from './protocols/clone';
import Hash from './protocols/hash';
import Seq from './protocols/seq';
import {extend} from './protocol';
import {EMPTY} from './empty.js';

export const get = always(null);

export function set(self, key, value){
  var obj = {};
  obj[key] = value;
  return obj;
}

export const has = always(false);

export function isNil(value){
  return null == value;
}

extend(Seq, {
  seq: always(EMPTY)
}, null);

extend(Hash, {
  get: get,
  set: set,
  has: has
}, null);

extend(Clone, {
  clone: identity
}, null);